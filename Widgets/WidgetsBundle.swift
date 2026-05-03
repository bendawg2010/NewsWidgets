import WidgetKit
import SwiftUI

@main
struct NewsWidgetsBundle: WidgetBundle {
    var body: some Widget {
        AINewsWidget()
        GeneralNewsWidget()
        SportsWidget()
        SportsNewsWidget()
        F1Widget()
    }
}
