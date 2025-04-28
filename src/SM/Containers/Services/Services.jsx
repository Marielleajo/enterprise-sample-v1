import { Add } from "@mui/icons-material";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import * as Yup from "yup";
import {
  DELETE_SERVICE,
  GET_ALL_SERVICES,
  UPDATE_SERVICE_PRICE,
  UPDATE_SERVICE_STATUS,
} from "../../../APIs/Services";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import Notification from "../../../Components/Notification/Notification";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import swalGeneralFunction from "../../../Components/swalGeneralFunction";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import GetActions from "../../Utils/GetActions";
import AddServiceFeatures from "./AddServiceFeatures";
import EditService from "./EditService";
import ViewFeatures from "./ViewFeatures";

function Services({ t }) {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [selectedService, setSelectedService] = useState([]);
  const [changePrice, setChangePrice] = useState(false);
  const [priceModal, setPriceModal] = useState(false);
  const [manageViewFeatures, setManageViewFeatures] = useState(false);
  const [viewFeatures, setViewFeatures] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);

  useEffect(() => {
    getAllServices();
  }, [paginationModel]);

  const DeleteService = async (value) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        setLoading(true);

        // Execute all delete promises in parallel
        const deleteResponses = await DELETE_SERVICE({
          formData: { recordGuid: value?.recordGuid },
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "Service Deleted Successfully",
            icon: "success",
          });
        } else {
          // Handle failure, e.g., display an error message for each failed deletion
          Swal.fire({
            title: "Error Updating Status",
            text: "Unknown Error",
            icon: "error",
          });
        }

        // Refresh your data or perform any necessary actions
        getAllServices();
      } catch (e) {
        Swal.fire({
          title: "Error Updating Status",
          text: handleMessageError({ e }),
          icon: "error",
        });
      } finally {
        // Set loading back to false when the operation is complete
        setLoading(false);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      price: "",
      cost: "",
    },
    validationSchema: Yup.object().shape({
      price: Yup.string().required("Price is required"),
      cost: Yup.string().required("Cost is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let data = {
          recordGuid: selectedService?.recordGuid,
          price: values?.price,
          cost: values?.cost,
        };
        // Show a confirmation dialog using SweetAlert
        const result = await swalGeneralFunction(
          "Change Price",
          "Are you sure you want to update the price"
        );
        if (result.isConfirmed) {
          try {
            // Set loading to true while the deletion is in progress
            setLoading(true);

            // Execute all delete promises in parallel
            const deleteResponses = await UPDATE_SERVICE_PRICE({
              postData: {
                price: values?.price,
                cost: values?.cost,
                recordGuid: selectedService?.recordGuid,
              },
            });

            if (deleteResponses?.data?.success) {
              Swal.fire({
                title: "Service Price Updated Successfully",
                icon: "success",
              });
            } else {
              // Handle failure, e.g., display an error message for each failed deletion
              Swal.fire({
                title: "Error Updating Status",
                text: "Unknown Error",
                icon: "error",
              });
            }

            // Refresh your data or perform any necessary actions
            getAllServices();
            setChangePrice(false);
          } catch (e) {
            Swal.fire({
              title: "Error Updating Status",
              text: handleMessageError({ e }),
              icon: "error",
            });
          } finally {
            // Set loading back to false when the operation is complete
            setLoading(false);
          }
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        setLoading(false);
      }
    },
  });

  const getAllServices = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_SERVICES({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
      });
      const data =
        response?.data?.data?.items?.length > 0
          ? response?.data?.data?.items?.map((item) => ({
              ...item,
              name: item?.serviceDetails[0]?.name,
              serviceCategory:
                item?.serviceCategory?.serviceCategoryDetails[0]?.name,
              servicePricingType: item?.servicePricingType?.tag,
            }))
          : [];
      SetData(data);
      SetTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (recordGuid, status) => {
    const result = await Swal.fire({
      title: "Confirm Status Update",

      text: "Are you sure you want to update this service status?",

      icon: "warning",

      showCancelButton: true,

      cancelButtonColor: "#dd3333",

      confirmButtonText: "Yes, update it!",

      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        let updateResponse = await UPDATE_SERVICE_STATUS({
          token,

          formData: {
            RecordGuid: recordGuid,
            statusTag:
              status === null
                ? "ACTIVE"
                : status === "ACTIVE"
                ? "IN-ACTIVE"
                : "ACTIVE",
          },
        });
        if (updateResponse?.data?.success) {
          Notification?.success("Service updated successfully");
          getAllServices({});
        }
      } catch (e) {
        Swal.fire({
          title: "Error Updating Status",
          text: handleMessageError({ e }),
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box className="page_container">
      <Grid container columnSpacing={3} className="section_container scroll">
        <Grid item xs={12} className="sub_section_container">
          {!manageViewFeatures && !showEditService && !viewFeatures ? (
            <Grid
              container
              className="pt-4"
              paddingRight={2.5}
              display={"flex"}
              justifyContent={"start"}
              alignItems={"center"}
            >
              <Grid item xs={12} marginTop={2}>
                <MuiTable
                  rowId="recordGuid"
                  columns={[
                    {
                      field: "name",
                      headerName: "Name",
                      flex: 1,
                    },
                    {
                      field: "serviceCategory",
                      headerName: "Service Category",
                      flex: 1,
                    },
                    {
                      field: "servicePricingType",
                      headerName: "Price Type",
                      flex: 1,
                      renderCell: (params) => {
                        return params?.row?.servicePricingType;
                      },
                    },
                    {
                      field: "price",
                      headerName: "Sell",
                      flex: 1,
                      renderCell: (params) => {
                        if (params?.row?.price != null) {
                          return `${params?.row?.price} ${params?.row?.currencyCode}`;
                        } else {
                          return ``;
                        }
                      },
                    },
                    {
                      field: "cost",
                      headerName: "Cost",
                      flex: 1,
                      renderCell: (params) => {
                        if (params?.row?.price != null) {
                          return `${params?.row?.cost} ${params?.row?.currencyCode}`;
                        } else {
                          return ``;
                        }
                      },
                    },
                    {
                      field: "status",
                      headerName: "Status",
                      flex: 1,
                      renderCell: (params) => {
                        return (
                          <Box direction="row" spacing={2}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={
                                    params.row?.status?.tag === "ACTIVE"
                                      ? true
                                      : false
                                  }
                                  onChange={() => {
                                    handleStatus(
                                      params.row.recordGuid,
                                      params.row?.status?.tag
                                    );
                                  }}
                                />
                              }
                            />
                          </Box>
                        );
                      },
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      flex: 1,
                      renderCell: (params) => {
                        return (
                          <>
                            {/* <Tooltip title="Edit Service">
                                <IconButton
                                  onClick={() => {
                                    setSelectedService(params?.row);
                                    setShowEditService(true);
                                  }}
                                  size="small"
                                  id="editService"
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="View Features">
                                <IconButton
                                  onClick={() => {
                                    setSelectedService(params?.row);
                                    setViewFeatures(true);
                                  }}
                                  size="small"
                                  id="viewFeatures"
                                >
                                  <RemoveRedEye />
                                </IconButton>
                              </Tooltip> */}
                            {params?.row?.servicePricingType === "TRAFFIC" && (
                              <>
                                <a
                                  href={`/rates/${params?.row?.serviceDetails[0]?.name?.toLowerCase()}`}
                                >
                                  <Tooltip title="Rates" placement="top">
                                    <SyncAltIcon style={{ display: "flex" }} />
                                  </Tooltip>
                                </a>
                              </>
                            )}
                            {params?.row?.servicePricingType ===
                              "SINGLE_PRICE" && (
                              <Tooltip title="Update Price and Cost">
                                <IconButton
                                  onClick={() => {
                                    setSelectedService(params?.row);
                                    formik?.setFieldValue(
                                      "price",
                                      params?.row?.price
                                    );
                                    formik?.setFieldValue(
                                      "cost",
                                      params?.row?.cost
                                    );
                                    setChangePrice(true);
                                  }}
                                  size="small"
                                  id="setPrice"
                                >
                                  <Add />
                                </IconButton>
                              </Tooltip>
                            )}

                            {/* <Tooltip title="Delete Service">
                                <IconButton
                                  onClick={() => DeleteService(params?.row)}
                                  size="small"
                                  id="deleteService"
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip> */}
                          </>
                        );
                      },
                    },
                  ]}
                  data={Data}
                  loading={loading}
                  setPaginationModel={setPaginationModel}
                  paginationModel={paginationModel}
                  totalRows={totalRows}
                />
              </Grid>
            </Grid>
          ) : showEditService && !manageViewFeatures && !viewFeatures ? (
            selectedService != "" && (
              <EditService
                getAllServices={getAllServices}
                selectedService={selectedService}
                setShowEditService={setShowEditService}
              />
            )
          ) : !manageViewFeatures && viewFeatures ? (
            <ViewFeatures
              selectedService={selectedService}
              setViewFeatures={setViewFeatures}
              setManageViewFeatures={setManageViewFeatures}
            />
          ) : (
            selectedService != "" && (
              <AddServiceFeatures
                type={"edit"}
                selectedService={selectedService}
                setViewFeatures={setViewFeatures}
                setManageViewFeatures={setManageViewFeatures}
              />
            )
          )}
        </Grid>
      </Grid>

      {changePrice && (
        <MuiModal
          title="Change Price"
          open={changePrice}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setChangePrice(false)}
        >
          <Grid item xs={12}>
            <FormControl variant="standard" fullWidth>
              <TextField
                key={"cost"}
                fullWidth
                id={"cost"}
                name={"cost"}
                label={"Cost*"}
                variant="standard"
                type={"text"}
                value={formik.values["cost"]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched["cost"] && Boolean(formik.errors["cost"])}
                helperText={formik.touched["cost"] && formik.errors["cost"]}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="standard" fullWidth>
              <TextField
                key={"price"}
                fullWidth
                id={"price"}
                name={"price"}
                label={"Price*"}
                variant="standard"
                type={"text"}
                value={formik.values["price"]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched["price"] && Boolean(formik.errors["price"])
                }
                helperText={formik.touched["price"] && formik.errors["price"]}
              />
            </FormControl>
          </Grid>
          <Grid container justifyContent="end" className="my-3">
            <Button
              className="mui-btn secondary outlined"
              onClick={() => setChangePrice(false)}
            >
              {t("Cancel")}
            </Button>
            <Button
              className="mui-btn primary filled"
              disabled={loading}
              onClick={formik?.handleSubmit}
            >
              {loading ? t("Loading...") : t("Save")}
            </Button>
          </Grid>
        </MuiModal>
      )}
    </Box>
  );
}

export default withTranslation("translations")(GetActions(Services));
