import { Component } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Card } from "@mui/material";

class ChartRenderer extends Component {
  render() {
    const { t, title, children } = this.props;
    return (
      <Card elevation={3} className="dashboard-card">
        <p className="title text-center fw-bold">{t(title)}</p>
        {children}
      </Card>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  token: authentication?.token || "",
});

export default connect(
  mapStateToProps,
  null
)(withTranslation("translations")(ChartRenderer));
