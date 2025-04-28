import {
  Button,
  FormControl,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { GET_TOKEN_INFO } from "../../../../../APIs/NewSMSAPIS";
import { useSnackbar } from "../../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../../../Utils/Functions";
import { get_DD_MM_YYYY } from "../../../../util/functions";

const TokenInfo = (props) => {
  const { isMobile, isTablet, t } = props;
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    issued: "",
    expires: "",
    scopes: [],
  });
  const { typeTag } = useSelector((state) => state?.authentication);

  const { showSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      accessToken: "",
    },
    validationSchema: Yup.object().shape({
      accessToken: Yup.string().required("Access Token is Required!"),
    }),
    onSubmit: () => {
      getTokenInfo();
    },
  });

  const getTokenInfo = async () => {
    setLoading(true);
    try {
      let response = await GET_TOKEN_INFO({
        AccessToken: formik.values?.accessToken
          ? formik.values?.accessToken
          : "",
      });
      setState((prevState) => ({
        ...prevState,
        scopes: response?.data?.data?.api
          ?.map((api) => ` ${api?.name}`)
          .join(", "),
        issued: get_DD_MM_YYYY(response?.data?.data?.api[0]?.createdDate, "-"),
        expires: get_DD_MM_YYYY(response?.data?.data?.api[0]?.expiryDate, "-"),
      }));
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid item xs={12} paddingRight={2.5} className="sub_section_container">
      <Grid container alignContent={"flex-start"}>
        <Grid
          item
          xs={12}
          display={isMobile || isTablet ? "flex" : ""}
          justifyContent={isMobile || isTablet ? "center" : ""}
          alignItems={isMobile || isTablet ? "center" : ""}
        >
          <form onSubmit={formik?.handleSubmit}>
            <Grid container alignContent={"flex-start"}>
              <Grid
                item
                xs={11}
                display={isMobile || isTablet ? "flex" : ""}
                justifyContent={isMobile || isTablet ? "center" : ""}
                alignItems={isMobile || isTablet ? "center" : ""}
              >
                <FormControl className="pb-3" fullWidth variant="standard">
                  <TextField
                    variant="standard"
                    label={t("Token Name*")}
                    onChange={formik.handleChange}
                    value={formik.values.accessToken}
                    name="accessToken"
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["accessToken"] &&
                      Boolean(formik.errors["accessToken"])
                    }
                    helperText={
                      formik.touched["accessToken"] &&
                      formik.errors["accessToken"]
                    }
                    maxLength={50}
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                xs={1}
                pl={2}
                display={"flex"}
                justifyContent={"start"}
                alignItems={"center"}
              >
                <Button
                  disabled={loading}
                  variant="contained"
                  className="mui-btn secondary filled"
                  type="submit"
                >
                  Debug
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        {state?.scopes?.length > 0 && (
          <Grid item xs={12}>
            <List
              sx={{
                paddingBottom: "0",
                width: "100%",
                bgcolor: "background.paper",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                "& .MuiListSubheader-root": {
                  // Style for ListSubheader
                  borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                },
                "& .MuiListItem-root:not(:last-child)": {
                  // Style for each ListItem except the last one
                  borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                },
              }}
              subheader={
                <ListSubheader>
                  <Typography
                    variant="p"
                    fontWeight={"bolder"}
                    textAlign={"center"}
                  >
                    Access Token Info
                  </Typography>
                </ListSubheader>
              }
            >
              <ListItem>
                <Grid container>
                  <Grid item xs={2} display={"flex"} alignItems={"center"}>
                    <ListItemText
                      id="switch-list-label-bluetooth"
                      primary={
                        <Typography
                          variant="p"
                          fontWeight={"bolder"}
                          textAlign={"center"}
                        >
                          Issued
                        </Typography>
                      }
                    />
                  </Grid>
                  <Grid item xs={10} display={"flex"} alignItems={"center"}>
                    <Typography variant="p" textAlign={"center"}>
                      {state?.issued}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={2} display={"flex"} alignItems={"center"}>
                    <ListItemText
                      id="switch-list-label-bluetooth"
                      primary={
                        <Typography
                          variant="p"
                          fontWeight={"bolder"}
                          textAlign={"center"}
                        >
                          Expires
                        </Typography>
                      }
                    />
                  </Grid>
                  <Grid item xs={10} display={"flex"} alignItems={"center"}>
                    <Typography variant="p" textAlign={"center"}>
                      {state?.expires}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={2} display={"flex"} alignItems={"center"}>
                    <ListItemText
                      id="switch-list-label-bluetooth"
                      primary={
                        <Typography
                          variant="p"
                          fontWeight={"bolder"}
                          textAlign={"center"}
                        >
                          Scopes
                        </Typography>
                      }
                    />
                  </Grid>
                  <Grid item xs={10} display={"flex"} alignItems={"center"}>
                    <Typography variant="p" textAlign={"center"}>
                      {state?.scopes}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default withTranslation("translation")(TokenInfo);
