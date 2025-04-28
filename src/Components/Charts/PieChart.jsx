import { Component } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import NoDataToDisplay from "highcharts/modules/no-data-to-display";
NoDataToDisplay(Highcharts);

class PieChart extends Component {
  render() {
    const { t, pieChartData, type, loading } = this.props;
    return (
      <HighchartsReact
        highcharts={Highcharts}
        ref={(ref) => (this.chart = ref)}
        options={{
          chart: {
            type: "pie",
            height: 200,
          },
          colors: [
            "#4023DB",
            "#DB1C57",
            "#FC9810",
            "#91D541",
            "#38CBBF",
            "#FCD841",
            "#FFF263",
            "#6AF9C4",
          ],
          title: "",
          credits: false,
          plotOptions: {
            pie: {
              cursor: "pointer",
              tooltip: {
                pointFormat: `<b>{point.name}</b> {point.value}`,
              },
            },
          },
          series: [
            {
              colorByPoint: true,
              dataLabels: {
                enabled: false,
              },
              data:
                pieChartData?.map((item) => ({
                  name:
                    type == "device"
                      ? item.isMobile
                        ? "Mobile"
                        : "Other"
                      : item?.name || "Null",
                  y: item.count || 0,
                  value: item.count || 0,
                })) || [],
              enableMouseTracking: !loading,
              showInLegend: true,
              // point: {
              //     events: {
              //         click: function() {
              //             !loading && self.toggleKPI(true, this.name, this.value, this.statusId, showKPI);
              //         }
              //     }
              // }
            },
          ],
        }}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.authentication ? state.authentication.token : "",
});

export default connect(
  mapStateToProps,
  null
)(withTranslation("translations")(PieChart));
