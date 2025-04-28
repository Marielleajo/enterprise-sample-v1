import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { connect, useSelector } from "react-redux";
import { ADD_SMS_API } from "../../../../APIs/SMSAPIS";
import MuiModal from "../../../../../Components/MuiModal/MuiModal";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import {
  HandleApiError,
  handleMessageError,
} from "../../../../Utils/Functions";
import { validationSchema } from "./NewSMSAPIValidation";
import { ADD_BULK_API, GET_API_LIST } from "../../../../APIs/NewSMSAPIS";

const AddRequestAPI = (props) => {
  const [state, setState] = useState({
    scopesOptions: [],
  });
  const [selectedAll, setSelectedAll] = useState(false);
  const [toggleShowToken, setToggleShowToken] = useState({
    token: "",
    toggle: false,
  });

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    getAPIList({});
    document
      .querySelectorAll("input")
      .forEach((input) => (input.autocomplete = "off"));
  }, []);

  let { token } = useSelector((state) => state?.authentication);

  const { t, isTablet, isMobile } = props;

  const formik = useFormik({
    initialValues: {
      tokenName: "",
      expiryDate: "",
      selectedScopes: [],
    },
    validationSchema: validationSchema[0],
    onSubmit: () => {
      createAPI();
    },
  });

  const { typeTag } = useSelector((state) => state?.authentication);

  const endPage = () => {
    const { setToggleAddIntegration, getAPIs } = props;
    setToggleAddIntegration(false);
    getAPIs({});
  };

  const getAPIList = async ({ search = null }) => {
    const { setLoading } = props;
    setLoading(true);
    try {
      let response = await GET_API_LIST({
        search,
        clientGuid:
          typeTag == "RESELLER"
            ? props?.clientOption
              ? props?.clientOption
              : null
            : null,
        ServiceTag: null,
        IsActive: null,
        isAdmin: typeTag == "RESELLER" ? true : false,
      });
      const data =
        response?.data?.data?.apiList?.map((data) => ({
          name: data?.tag
            ?.replace(/_/g, " ")
            ?.toLowerCase()
            ?.split(" ")
            ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
            ?.join(" "),
          recordGuid: data?.recordGuid,
          url: data?.url,
        })) || [];
      setState((prevState) => ({
        ...prevState,
        scopesOptions: data,
      }));
      setLoading(false);
    } catch (e) {
      HandleApiError(e);
      setLoading(false);
    }
  };

  const createAPI = async () => {
    const { tokenName, expiryDate, selectedScopes } = formik.values;
    const { t, setLoading, getAPIs } = props;
    setLoading(true);
    let postData = {};
    if (typeTag == "RESELLER") {
      postData = {
        TokenName: tokenName,
        ExpiryDate: expiryDate,
        ApiListGuid: selectedScopes,
        clientGuid: props?.clientOption ? props?.clientOption : null,
      };
    } else {
      postData = {
        TokenName: tokenName,
        ExpiryDate: expiryDate,
        ApiListGuid: selectedScopes,
      };
    }
    try {
      let response = await ADD_BULK_API({
        isAdmin: typeTag == "RESELLER" ? true : false,
        data: postData,
      });
      showSnackbar(t(response?.data?.message || "Successfully Added API"));
      setToggleShowToken({
        token: response?.data?.data?.key,
        toggle: true,
      });
      getAPIs({});
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  const downloadToken = () => {
    const content = toggleShowToken?.token;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Access Token.txt";
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    endPage();
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { loading } = props;

  return (
    <Grid container spacing={2} id="addRequestAPI">
      <Grid item xs={12}>
        <form onSubmit={formik?.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h5 className="pb-3">API Information</h5>
              <FormControl className="pb-3" fullWidth variant="standard">
                <TextField
                  variant="standard"
                  label={t("Token Name*")}
                  onChange={formik.handleChange}
                  value={formik.values.tokenName}
                  name="tokenName"
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["tokenName"] &&
                    Boolean(formik.errors["tokenName"])
                  }
                  helperText={
                    formik.touched["tokenName"] && formik.errors["tokenName"]
                  }
                  maxLength={50}
                />
              </FormControl>
              <FormControl fullWidth variant="standard">
                <TextField
                  variant="standard"
                  label="Expiration Date*"
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  inputProps={{
                    min: tomorrow?.toISOString().split("T")[0],
                  }}
                  name="expiryDate"
                  value={formik?.values?.expiryDate}
                  onChange={formik.handleChange}
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["expiryDate"] &&
                    Boolean(formik.errors["expiryDate"])
                  }
                  helperText={
                    formik.touched["expiryDate"] && formik.errors["expiryDate"]
                  }
                />
              </FormControl>
              <Box mt={2}>
                <Typography variant="p" fontWeight={"bolder"}>
                  Select scopes
                </Typography>
                <div
                  style={
                    state?.scopesOptions?.length > 0
                      ? { height: "30vh", overflowY: "auto" }
                      : {}
                  }
                >
                  <FormGroup>
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          sx={{ "& .MuiSvgIcon-root": { fontSize: 22 } }}
                          checked={selectedAll}
                          onChange={(event) => {
                            const { checked } = event.target;
                            let updatedSelectedScopes;

                            if (checked) {
                              // Add the item to the selectedScopes array
                              updatedSelectedScopes = state?.scopesOptions?.map(
                                (item) => item?.recordGuid
                              );
                              setSelectedAll(true);
                            } else {
                              // Remove the item from the selectedScopes array
                              updatedSelectedScopes = [];
                              setSelectedAll(false);
                            }

                            // Update formik values
                            formik.setValues({
                              ...formik.values,
                              selectedScopes: updatedSelectedScopes,
                            });
                          }}
                        />
                      }
                      label={"Select All"}
                    /> */}
                    {loading ? (
                      <div className="d-flex justify-content-center align-items-center">
                        <CircularProgress />
                      </div>
                    ) : state?.scopesOptions?.length > 0 ? (
                      state?.scopesOptions?.map((item) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 22 } }}
                              checked={formik?.values?.selectedScopes?.some(
                                (record) => record == item?.recordGuid
                              )}
                              onChange={(event) => {
                                const { checked } = event.target;
                                let updatedSelectedScopes;

                                if (checked) {
                                  // Add the item to the selectedScopes array
                                  updatedSelectedScopes = [
                                    ...formik.values.selectedScopes,
                                    item.recordGuid,
                                  ];
                                } else {
                                  // Remove the item from the selectedScopes array
                                  updatedSelectedScopes =
                                    formik.values.selectedScopes.filter(
                                      (record) => record !== item.recordGuid
                                    );
                                }

                                // if (
                                //   updatedSelectedScopes?.length ==
                                //   state?.scopesOptions?.length
                                // ) {
                                //   setSelectedAll(true);
                                // } else {
                                //   setSelectedAll(false);
                                // }

                                // Update formik values
                                formik.setValues({
                                  ...formik.values,
                                  selectedScopes: updatedSelectedScopes,
                                });
                              }}
                            />
                          }
                          label={item?.name + " - " + item?.url}
                        />
                      ))
                    ) : (
                      <div className="d-flex justify-content-center align-items-center">
                        <span>No Api's Available</span>
                      </div>
                    )}
                  </FormGroup>
                </div>
                {formik?.touched?.selectedScopes &&
                  formik?.errors?.selectedScopes && (
                    <div className="error" style={{ color: "#f00" }}>
                      {formik?.errors?.selectedScopes}
                    </div>
                  )}
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <Button
                variant="contained"
                className="mui-btn secondary filled"
                type="submit"
              >
                Create Personal Access token
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>

      <MuiModal
        open={toggleShowToken?.toggle}
        width={500}
        handleClose={() => {
          setToggleShowToken({
            token: "",
            toggle: false,
          });
          endPage();
        }}
        title={"Access Token"}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <p style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
              {toggleShowToken?.token}
            </p>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={() => downloadToken()}
              variant="contained"
              className="mui-btn secondary filled"
            >
              {"Download Token"}
            </Button>
          </Grid>
        </Grid>
      </MuiModal>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  token: state.authentication ? state.authentication.token : "",
});

export default connect(
  mapStateToProps,
  null
)(withTranslation("translations")(AddRequestAPI));
