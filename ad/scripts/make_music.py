#!/usr/bin/env python3
"""
Generate an ambient electronic backing track for the News Widgets ads.

Style: minimal, Apple-keynote-y. Soft pad layered on a sub-bass + a sparse
melody that lifts into a brighter section near the end. Twenty-five seconds
long, fades in over 1s and out over the last 2s, mixed for use as background
music under voice/UI sounds (peaks ~ -12 dB).

Usage: python3 make_music.py out.wav [duration_seconds]
"""
import math
import struct
import sys
import wave

import numpy as np

SAMPLE_RATE = 44100


def adsr(n, attack=0.02, decay=0.08, sustain=0.7, release=0.15):
    """Attack-decay-sustain-release envelope, length n samples, values in [0,1]."""
    a = max(1, int(n * attack))
    d = max(1, int(n * decay))
    r = max(1, int(n * release))
    s = max(1, n - a - d - r)
    env = np.concatenate([
        np.linspace(0, 1, a),
        np.linspace(1, sustain, d),
        np.full(s, sustain),
        np.linspace(sustain, 0, r),
    ])
    return env[:n]


def midi_to_hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def soft_saw(t, hz):
    """Mellow detuned saw — three slightly detuned saws summed and softened."""
    out = np.zeros_like(t)
    for cents in (-7, 0, 7):
        f = hz * 2 ** (cents / 1200)
        out += 2 * (t * f - np.floor(t * f + 0.5))
    return np.tanh(out * 0.45)


def sine(t, hz):
    return np.sin(2 * np.pi * hz * t)


def triangle(t, hz):
    return 2 * np.abs(2 * (t * hz - np.floor(t * hz + 0.5))) - 1


def add_note(buf, start_s, dur_s, midi, wave_fn, gain=0.2,
             attack=0.02, decay=0.1, sustain=0.7, release=0.2):
    """Add a single note to the stereo buffer."""
    start = int(start_s * SAMPLE_RATE)
    n = int(dur_s * SAMPLE_RATE)
    if start + n > buf.shape[0]:
        n = buf.shape[0] - start
    if n <= 0:
        return
    t = np.arange(n) / SAMPLE_RATE
    hz = midi_to_hz(midi)
    sig = wave_fn(t, hz) * adsr(n, attack, decay, sustain, release) * gain
    buf[start:start + n] += sig


def make_track(out_wav, duration=25.0):
    n_samples = int(duration * SAMPLE_RATE)
    buf = np.zeros(n_samples, dtype=np.float32)

    # Chord progression (8 bars at ~76 BPM = 3.16s/bar; pick 6.4s per chord for a slow lift)
    # Cmaj7 → Amin7 → Fmaj7 → G  (classic 1-6-4-5 in C, jazzed)
    bar_s = duration / 4.0  # 4 chords across the clip
    chords_midi = [
        # Cmaj7 — C E G B
        [60, 64, 67, 71],
        # Amin7 — A C E G
        [57, 60, 64, 67],
        # Fmaj7 — F A C E
        [53, 57, 60, 64],
        # G7 — G B D F
        [55, 59, 62, 65],
    ]

    # 1) Pad — long held chord notes, very soft, soft saw + sine layer
    for i, chord in enumerate(chords_midi):
        start = i * bar_s
        for note in chord:
            add_note(buf, start, bar_s, note, soft_saw,
                     gain=0.045, attack=0.25, decay=0.1, sustain=0.85, release=0.20)
            add_note(buf, start, bar_s, note + 12, sine,
                     gain=0.018, attack=0.30, decay=0.10, sustain=0.85, release=0.25)

    # 2) Sub-bass — root of each chord, one octave below
    for i, chord in enumerate(chords_midi):
        root = chord[0] - 12
        add_note(buf, i * bar_s, bar_s, root, sine,
                 gain=0.30, attack=0.05, decay=0.15, sustain=0.80, release=0.25)

    # 3) Sparse melody — pentatonic plucks that pick up energy at the back half
    melody_pattern = [
        # (offset_in_bar, midi, dur, gain_scale)
        (0.0,  72, 0.5, 0.6),   # C5
        (0.75, 76, 0.4, 0.5),   # E5
        (1.5,  79, 0.6, 0.7),   # G5
        (2.25, 74, 0.4, 0.5),   # D5
    ]
    for i in range(len(chords_midi)):
        chord_start = i * bar_s
        intensity = 0.6 + 0.4 * (i / max(1, len(chords_midi) - 1))  # ramps up
        for offset, midi, dur, g in melody_pattern:
            add_note(buf, chord_start + offset, dur, midi, triangle,
                     gain=0.08 * g * intensity,
                     attack=0.005, decay=0.1, sustain=0.4, release=0.30)

    # 4) Soft tick at every bar for momentum
    for i in range(int(duration * 2)):  # half-bar ticks
        t_start = i * (bar_s / 2)
        if t_start >= duration: break
        n = int(0.06 * SAMPLE_RATE)
        if int(t_start * SAMPLE_RATE) + n > buf.shape[0]: break
        # White noise burst with very fast decay = "tick"
        rng = np.random.default_rng(42 + i)
        tick = rng.standard_normal(n) * np.exp(-np.linspace(0, 18, n)) * 0.04
        # High-pass-ish: subtract its smoothed self
        smoothed = np.convolve(tick, np.ones(20)/20, mode='same')
        tick = tick - smoothed
        idx = int(t_start * SAMPLE_RATE)
        buf[idx:idx + n] += tick

    # Master fade in/out
    fade_in = int(1.0 * SAMPLE_RATE)
    fade_out = int(2.0 * SAMPLE_RATE)
    buf[:fade_in] *= np.linspace(0, 1, fade_in)
    buf[-fade_out:] *= np.linspace(1, 0, fade_out)

    # Soft compressor / clipper to keep peaks under control
    buf = np.tanh(buf * 1.4) * 0.85

    # Stereo: tiny haas delay + slight pan on melody for width
    delay_samps = int(0.012 * SAMPLE_RATE)  # 12ms
    left = buf.copy()
    right = np.concatenate([np.zeros(delay_samps), buf[:-delay_samps]])
    stereo = np.stack([left, right], axis=1)

    # Normalise to -3 dBFS so the final mix has headroom for any voice/SFX
    peak = np.max(np.abs(stereo))
    if peak > 0:
        stereo = stereo * (10 ** (-3 / 20)) / peak

    # Write 16-bit PCM WAV
    pcm = (stereo * 32767).astype(np.int16)
    with wave.open(out_wav, 'w') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SAMPLE_RATE)
        w.writeframes(pcm.tobytes())


if __name__ == '__main__':
    out_path = sys.argv[1] if len(sys.argv) > 1 else 'music.wav'
    dur = float(sys.argv[2]) if len(sys.argv) > 2 else 25.0
    make_track(out_path, dur)
    print(f"wrote {out_path}  ({dur}s)")
