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
  DELETE_SERVICE_CATEGORY,
  EDIT_SERVICE_CATEGORY,
  GET_ALL_CATEGORIES,
  UPDATE_CATEGORY_STATUS,
} from "../../../APIs/Services";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import Notification from "../../../Components/Notification/Notification";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError, removeNullKeys } from "../../Utils/Functions";
import { addServiceCategoryValidation } from "./addServiceCategoryValidation";
import GetActions from "../../Utils/GetActions";

function ServiceCategory({ t }) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [manageAddCategory, setManageAddCategory] = useState(false);
  const [manageEditCategory, setManageEditCategory] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);

  useEffect(() => {
    getAllCategories();
  }, [paginationModel]);

  const getAllCategories = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_CATEGORIES({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
      });
      const data =
        response?.data?.data?.items?.length > 0
          ? response?.data?.data?.items?.map((item) => ({
              ...item,
              name: item?.serviceCategoryDetails[0].name,
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
        let updateResponse = await UPDATE_CATEGORY_STATUS({
          token,
          formData: {
            recordGuid: data?.recordGuid,
            isactive: status,
            details: [data?.serviceCategoryDetails[0]],
            AllowMultipleSubscription: data?.allowMultipleSubscription,
          },
        });
        if (updateResponse?.data?.success) {
          Notification?.success("Category updated successfully");
          getAllCategories({});
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

  const handleAllowSubscription = async (data, status) => {
    const result = await Swal.fire({
      title: "Confirm Status Update",

      text: "Are you sure you want to update this category allow subscription?",

      icon: "warning",

      showCancelButton: true,

      cancelButtonColor: "#dd3333",

      confirmButtonText: "Yes, update it!",

      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        let updateResponse = await UPDATE_CATEGORY_STATUS({
          token,
          formData: {
            recordGuid: data?.recordGuid,
            isactive: data?.isActive,
            details: [data?.serviceCategoryDetails[0]],
            AllowMultipleSubscription: status,
          },
        });
        if (updateResponse?.data?.success) {
          Notification?.success("Category updated successfully");
          getAllCategories({});
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
      allowMultiple: false,
    },
    validationSchema: addServiceCategoryValidation,
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
          AllowMultipleSubscription: values?.allowMultiple,
        };
        let editData = {
          recordGuid: selectedCategory?.recordGuid,
          details: [
            {
              languageCode: "en",
              name: values?.name,
              description: values?.description,
            },
          ],
          isActive: values?.active,
          AllowMultipleSubscription: values?.allowMultiple,
        };
        let response = {};
        if (manageAddCategory) {
          response = await ADD_SERVICE_CATEGORY({
            formData: removeNullKeys(addData),
          });

          if (response?.data?.success) {
            showSnackbar("Service Category Added Successfully!");
            setManageAddCategory(false);
            getAllCategories();
          }
        } else {
          response = await EDIT_SERVICE_CATEGORY({
            formData: removeNullKeys(editData),
          });

          if (response?.data?.success) {
            showSnackbar("Service Category Updated Successfully!");
            setManageEditCategory(false);
            getAllCategories();
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
    setManageEditCategory(true);
  };

  const DeleteServiceCategory = async (value) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        setLoading(true);

        // Execute all delete promises in parallel
        const deleteResponses = await DELETE_SERVICE_CATEGORY({
          formData: { recordGuid: value?.recordGuid },
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "Service Category Deleted Successfully",
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
        getAllCategories();
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
                <Typography className="BreadcrumbsPage">Category</Typography>
              </Breadcrumbs>
            </Grid>

            <Grid item xs={12} marginTop={2}>
              <Card className="kpi-card">
                <MuiTable
                  rowId="recordGuid"
                  columns={[
                    {
                      field: "name",
                      headerName: "Name",
                      flex: 1,
                    },
                    {
                      field: "allowMultipleSubscription",
                      headerName: "Allow Multiple Subscription",
                      flex: 1,
                      renderCell: (params) => {
                        return (
                          <Box direction="row" spacing={2}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={
                                    params.row?.allowMultipleSubscription
                                  }
                                  onChange={() => {
                                    handleAllowSubscription(
                                      params.row,
                                      !params.row?.allowMultipleSubscription
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
                    //               setSelectedCategory(params?.row);
                    //             }}
                    //             size="small"
                    //             id="editCost"
                    //           >
                    //             <Edit />
                    //           </IconButton>
                    //         </Tooltip>
                    //         <Tooltip title="Delete Cost">
                    //           <IconButton
                    //             onClick={() =>
                    //               DeleteServiceCategory(params?.row)
                    //             }
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

      {manageAddCategory && (
        <MuiModal
          title="Add Service Category"
          open={manageAddCategory}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageAddCategory(false)}
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
                    Allow Multiple Subscription
                  </span>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik?.values?.allowMultiple}
                        onChange={() =>
                          formik?.setFieldValue(
                            "allowMultiple",
                            !formik?.values?.allowMultiple
                          )
                        }
                      />
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={() => setManageAddCategory(false)}
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

      {manageEditCategory && (
        <MuiModal
          title="Update Service Category"
          open={manageEditCategory}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageEditCategory(false)}
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
                    Allow Multiple Subscription
                  </span>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik?.values?.allowMultiple}
                        onChange={() =>
                          formik?.setFieldValue(
                            "allowMultiple",
                            !formik?.values?.allowMultiple
                          )
                        }
                      />
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={() => setManageEditCategory(false)}
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

export default withTranslation("translations")(GetActions(ServiceCategory));
