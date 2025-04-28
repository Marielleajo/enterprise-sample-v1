import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Swal from "sweetalert2";
import {
  ADD_SERVICE_CATEGORY,
  ADD_SERVICE_TYPE,
  DELETE_SERVICE_CATEGORY,
  DELETE_SERVICE_TYPE,
  EDIT_SERVICE_CATEGORY,
  EDIT_SERVICE_TYPE,
  GET_ALL_CATEGORIES,
  GET_ALL_TYPES,
  UPDATE_CATEGORY_STATUS,
  UPDATE_TYPE_STATUS,
} from "../../../APIs/Services";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import Notification from "../../../Components/Notification/Notification";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError, removeNullKeys } from "../../Utils/Functions";
import { addServiceCategoryValidation } from "./addServiceCategoryValidation";
import { addServiceTypeValidation } from "./addServiceTypeValidation";
import GetActions from "../../Utils/GetActions";

function ServiceType({ t }) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [manageAddType, setManageAddType] = useState(false);
  const [manageEditType, setManageEditType] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);

  useEffect(() => {
    getAllTypes();
  }, [paginationModel]);

  const getAllTypes = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_TYPES({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
      });
      const data =
        response?.data?.data?.items?.length > 0
          ? response?.data?.data?.items?.map((item) => ({
              ...item,
              name: item?.serviceTypeDetails[0]?.name,
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

  const handleStatus = async (data, status) => {
    const result = await Swal.fire({
      title: "Confirm Status Update",

      text: "Are you sure you want to update this category status?",

      icon: "warning",

      showCancelButton: true,

      cancelButtonColor: "#dd3333",

      confirmButtonText: "Yes, update it!",

      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        let updateResponse = await UPDATE_TYPE_STATUS({
          token,
          formData: {
            recordGuid: data?.recordGuid,
            isactive: status,
            details: [data?.serviceTypeDetails[0]],
            AllowMultipleSubscription: data?.allowMultipleSubscription,
          },
        });
        if (updateResponse?.data?.success) {
          Notification?.success("Category updated successfully");
          getAllTypes({});
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

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      active: false,
    },
    validationSchema: addServiceTypeValidation,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let addData = {
          details: [
            {
              languageCode: "en",
              name: values?.name,
              description: values?.description,
            },
          ],
          isActive: values?.active,
        };
        let editData = {
          recordGuid: selectedType?.recordGuid,
          details: [
            {
              languageCode: "en",
              name: values?.name,
              description: values?.description,
            },
          ],
          isActive: values?.active,
        };
        let response = {};
        if (manageAddType) {
          response = await ADD_SERVICE_TYPE({
            formData: removeNullKeys(addData),
          });

          if (response?.data?.success) {
            showSnackbar("Service Type Added Successfully!");
            setManageAddType(false);
            getAllTypes();
          }
        } else {
          response = await EDIT_SERVICE_TYPE({
            formData: removeNullKeys(editData),
          });

          if (response?.data?.success) {
            showSnackbar("Service Type Updated Successfully!");
            setManageEditType(false);
            getAllTypes();
          }
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleEditButton = (data) => {
    formik?.setFieldValue("name", data?.name);
    formik?.setFieldValue("description", data?.name);
    formik?.setFieldValue("active", data?.isActive);
    formik?.setFieldValue("allowMultiple", data?.allowMultipleSubscription);
    setManageEditType(true);
  };

  const DeleteServiceType = async (value) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        setLoading(true);

        // Execute all delete promises in parallel
        const deleteResponses = await DELETE_SERVICE_TYPE({
          formData: { recordGuid: value?.recordGuid },
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "Service Type Deleted Successfully",
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
        getAllTypes();
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

  return (
    <Box className="page_container">
      <Grid container columnSpacing={3} className="section_container scroll">
        <Grid item xs={12} className="sub_section_container">
          <Grid
            container
            className="pt-4"
            paddingRight={2.5}
            display={"flex"}
            justifyContent={"start"}
            alignItems={"center"}
          >
            <Grid item xs={12} md={4}>
              <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                <Typography className="BreadcrumbsPage">Type</Typography>
              </Breadcrumbs>
            </Grid>

            <Grid item xs={12} marginTop={2}>
              <Card className="kpi-card">
                <MuiTable
                  rowId="recordGuid"
                  columns={[
                    {
                      field: "tag",
                      headerName: "Tag",
                      flex: 1,
                    },
                    {
                      field: "name",
                      headerName: "Name",
                      flex: 1,
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
                                  checked={params?.row?.isActive}
                                  onChange={() => {
                                    handleStatus(
                                      params.row,
                                      !params.row?.isActive
                                    );
                                  }}
                                />
                              }
                            />
                          </Box>
                        );
                      },
                    },
                    // {
                    //   field: "actions",
                    //   headerName: "Actions",
                    //   flex: 1,
                    //   renderCell: (params) => {
                    //     return (
                    //       <>
                    //         <Tooltip title="Edit Cost">
                    //           <IconButton
                    //             onClick={() => {
                    //               handleEditButton(params?.row);
                    //               setSelectedType(params?.row);
                    //             }}
                    //             size="small"
                    //             id="editCost"
                    //           >
                    //             <Edit />
                    //           </IconButton>
                    //         </Tooltip>
                    //         <Tooltip title="Delete Cost">
                    //           <IconButton
                    //             onClick={() => DeleteServiceType(params?.row)}
                    //             size="small"
                    //             id="deleteCost"
                    //           >
                    //             <Delete />
                    //           </IconButton>
                    //         </Tooltip>
                    //       </>
                    //     );
                    //   },
                    // },
                  ]}
                  data={Data}
                  loading={loading}
                  setPaginationModel={setPaginationModel}
                  paginationModel={paginationModel}
                  totalRows={totalRows}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {manageAddType && (
        <MuiModal
          title="Add Service Type"
          open={manageAddType}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageAddType(false)}
        >
          <form onSubmit={formik?.handleSubmit}>
            <Grid container>
              <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                  <TextField
                    key={"name"}
                    fullWidth
                    id={"name"}
                    name={"name"}
                    label={"Name*"}
                    variant="standard"
                    type={"text"}
                    value={formik.values["name"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["name"] && Boolean(formik.errors["name"])
                    }
                    helperText={formik.touched["name"] && formik.errors["name"]}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} mt={2}>
                <FormControl variant="standard" fullWidth>
                  <TextField
                    key={"description"}
                    fullWidth
                    id={"description"}
                    name={"description"}
                    label={"Description*"}
                    variant="standard"
                    type={"text"}
                    multiline
                    rows={4}
                    value={formik.values["description"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["description"] &&
                      Boolean(formik.errors["description"])
                    }
                    helperText={
                      formik.touched["description"] &&
                      formik.errors["description"]
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    width: "100%",
                    marginBottom: "8px",
                    marginTop: "15px",
                  }}
                >
                  <span
                    style={{
                      color: "#B3B3B3",
                      fontSize: "15px",
                      marginRight: "20px",
                    }}
                  >
                    Active
                  </span>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik?.values?.active}
                        onChange={() =>
                          formik?.setFieldValue(
                            "active",
                            !formik?.values?.active
                          )
                        }
                      />
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={() => setManageAddType(false)}
                  className="mui-btn secondary filled"
                >
                  Cancel
                </Button>
                <Button
                  className="mui-btn primary filled"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Save"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </MuiModal>
      )}

      {manageEditType && (
        <MuiModal
          title="Update Service Type"
          open={manageEditType}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageEditType(false)}
        >
          <form onSubmit={formik?.handleSubmit}>
            <Grid container>
              <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                  <TextField
                    key={"name"}
                    fullWidth
                    id={"name"}
                    name={"name"}
                    label={"Name*"}
                    variant="standard"
                    type={"text"}
                    value={formik.values["name"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["name"] && Boolean(formik.errors["name"])
                    }
                    helperText={formik.touched["name"] && formik.errors["name"]}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} mt={2}>
                <FormControl variant="standard" fullWidth>
                  <TextField
                    key={"description"}
                    fullWidth
                    id={"description"}
                    name={"description"}
                    label={"Description*"}
                    variant="standard"
                    type={"text"}
                    multiline
                    rows={4}
                    value={formik.values["description"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["description"] &&
                      Boolean(formik.errors["description"])
                    }
                    helperText={
                      formik.touched["description"] &&
                      formik.errors["description"]
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    width: "100%",
                    marginBottom: "8px",
                    marginTop: "15px",
                  }}
                >
                  <span
                    style={{
                      color: "#B3B3B3",
                      fontSize: "15px",
                      marginRight: "20px",
                    }}
                  >
                    Active
                  </span>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik?.values?.active}
                        onChange={() =>
                          formik?.setFieldValue(
                            "active",
                            !formik?.values?.active
                          )
                        }
                      />
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={() => setManageEditType(false)}
                  className="mui-btn secondary filled"
                >
                  Cancel
                </Button>
                <Button
                  className="mui-btn primary filled"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Save"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </MuiModal>
      )}
    </Box>
  );
}

export default withTranslation("translations")(GetActions(ServiceType));
