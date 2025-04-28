import {
  Box,
  Card,
  CircularProgress,
  Grid,
  Typography
} from "@mui/material";
import axios from "axios";
import queryString from "query-string";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import montymobileLogo from "./MontyMobileLogo.svg";
import "./Terms.scss";
import { CONFIGNOTOKEN, GET_ALL_TERMS } from "../../../APIs";


class Terms extends Component {
  state = {
    editorHtml: "",
    recordGuid: "",
    language: "en", // Default to English
    loading: false
  };

  componentDidMount() {
    this.determineLanguage();
    //  this.fetchTermsData();
  }

  determineLanguage() {
    const values = queryString.parse(this.props.location.search);
    const language = values.lang === "ar" ? "ar" : "en";
    this.setState({ language }, () => { this.fetchTermsData(); });

  }

  fetchTermsData() {
    this.setState({
      loading: true, // Ensure we are not in editing mode
    });
    CONFIGNOTOKEN.headers["LanguageCode"] = this.state.language;
    axios
      .get(GET_ALL_TERMS, CONFIGNOTOKEN)
      .then((response) => {
        // Check if the data has items and the items array is not empty
        if (response.data.success && response.data.data.items.length > 0) {
          const description = response.data.data.items[0].contentDetails[0].description;
          this.setState({
            editorHtml: description,
            recordGuid: response.data.data.items[0].recordGuid,
            loading: false
          });
        } else {
          // The items array is empty, so reset the editorHtml and recordGuid
          this.setState({
            editorHtml: "",
            recordGuid: null,
            isEditing: false, // Ensure we are not in editing mode
            loading: false
          });
        }
      })
      .catch((error) => {
        toast.error(`Error fetching data: ${error}`);
        this.setState({
          loading: false
        })
      });
  }


  render() {
    const { language, editorHtml } = this.state;
    const title =
      language === "en" ? "Terms and Conditions" : "الأحكام والشروط";
    const directionClass =
      language === "ar" ? "arabic-direction" : "english-direction";

    return (
      <div>
        {this.state.loading ? <div className="d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
              <CircularProgress />
            </div>
            :<Box
          className={directionClass}
          paddingX={7}
          paddingY={10}
          rowGap={4}
          id="Register"
        >
            <Grid container className="register-container2">
            <Grid item xs={12} className="text-right">
              <Grid container justifyContent={"space-between"}>
                <Grid item xs={12}>
                  <img width={100} src={this?.props?.logo ? this?.props?.logo : montymobileLogo} />
                </Grid>
              </Grid>
            </Grid>


            <Grid item xs={12}>
              <Box className="title_container2">
                <Typography
                  className="title text-center"
                  variant="h4"
                  marginY={3}
                  color={"white"}
                >

                </Typography>
                <Card elevation={7} className="card">
                  <Grid container spacing={2} padding={4}>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        dangerouslySetInnerHTML={{ __html: editorHtml }}
                      ></Typography>
                    </Grid>
                    <ToastContainer />
                  </Grid>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Box>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.authentication ? state.authentication.token : "",
  loginToken: state.authentication ? state.authentication.loginToken : [],
});

export default withRouter(
  connect(mapStateToProps)(withTranslation("translations")(Terms))
);
