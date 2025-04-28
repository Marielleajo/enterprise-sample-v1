import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  GET_ACTIVE_CRITERIA,
  GET_ALL_CRITERIA_API,
} from "../../../APIs/Criteria";
import {
  APPROVE_RESELLER,
  GET_ALL_CATEGORTIES,
  GET_ALL_RESELLER_API,
  REJECT_RESELLER,
} from "../../../APIs/Resellers";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import {
  formatDate,
  get_MM_DD_YYYY_HH_MM_SS,
  handleMessageError,
} from "../../Utils/Functions";
import GetActions from "../../Utils/GetActions";
import ApproveModal from "./ApproveModal";
import RejectionModal from "./RejectionModal";
import { Download } from "@mui/icons-material";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";

const ResellerPage = ({ t, statusTag, openFilter, setOpenFilter }) => {
  let { token, username } = useSelector((state) => state?.authentication);
  const { showSnackbar } = useSnackbar();
  const [rejectionStatus, setRejectionStatus] = useState([]);
  const [Data, SetData] = useState([]);
  const [ClientsData, setClientsData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [clientsPaginationModel, setClientsPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [totalClientsRows, setTotalClientsRows] = useState(0);
  const [clientId, setClientId] = React.useState([]);
  const [viewClientsModal, setViewClientsModal] = useState(false);
  const [checkedServices, setCheckedServices] = useState([]);
  const [openRejectionModal, setOpenRejectionModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(false);
  const [categories, setCategories] = useState([]);
  const columns = [
    {
      field: "fullname",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <>
          {params?.row?.firstName} {params?.row?.lastName}
        </>
      ),
    },
    { field: "name", headerName: "Company Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },

    {
      field: "createdDate",
      headerName: "Sign up Date",
      flex: 1,
      renderCell: (params) => <>{formatDate(params?.row?.createdDate)}</>,
    },
  ];

  if (statusTag === "PENDING_VERIFIED") {
    columns.push({
      field: "actions",
      headerName: "Actions",
      flex: 1,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            height: "100%",
            pl: 1,
          }}
        >
          <Tooltip title="Actions">
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={(event) => {
                handleClick(event, params.row);
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="vertical-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              elevation: 0,
              sx: {
                boxShadow: "none",
                border: "1px solid #e0e0e0",
              },
            }}
          >
            {menuActionsOptions.map((option) => (
              <MenuItem
                key={option}
                onClick={() => {
                  handleMenuChange(option);
                }}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ),
    });
  }
  if (statusTag === "REJECTED") {
    columns.push(
      {
        field: "rejectedBy",
        headerName: "Rejected By",
        flex: 1,
        align: "left",
        headerAlign: "left",
        renderCell: (params) => <>{params?.row?.clientInfo?.rejectedBy}</>,
      },
      {
        field: "rejectionReasonMsg",
        headerName: "Rejection Reason",
        flex: 1,
        align: "left",
        headerAlign: "left",
        renderCell: (params) => (
          <>{params?.row?.clientInfo?.rejectionReasonMsg}</>
        ),
      },
      {
        field: "rejectionDate",
        headerName: "Rejection Date",
        flex: 1,
        align: "left",
        headerAlign: "left",
        renderCell: (params) => (
          <>
            {params?.row?.clientInfo?.rejectionDate !== null ? (
              <>
                {new Date(params?.row?.clientInfo?.rejectionDate)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "-")}
              </>
            ) : (
              <>-</>
            )}
          </>
        ),
      }
    );
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const menuActionsOptions = ["Approve", "Reject"];
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };
  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  const getAllResellers = async () => {
    console.log(parseInt(paginationModel?.page) + 1);
    setLoading(true);
    try {
      let resellersResponse = await GET_ALL_RESELLER_API({
        token,

        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        type: "RESELLER",
        StatusTag: statusTag,
        SignupDateFrom: formik?.values?.signUpFrom,
        SignupDateTo: formik?.values?.signUpTo,
        RejectedDateFrom: formik?.values?.rejectedFrom,
        RejectedDateTo: formik?.values?.rejectedTo,
        RejectionReasonGuid: formik?.values?.rejectionReason.value,
      });

      const data = resellersResponse?.data?.data?.clients.map((item) => ({
        ...item,
        lastUpdatedDate: get_MM_DD_YYYY_HH_MM_SS(
          new Date(item?.lastUpdatedDate * 1000),
          "-"
        ),
      }));
      SetData(data);
      SetTotalRows(resellersResponse?.data?.data?.totalRows);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const getAllCategories = async () => {
    setModalLoading(true);
    try {
      let response = await GET_ALL_CATEGORTIES();

      if (response?.data?.success) {
        setCategories(response?.data?.data?.clientCategory);
        setModalLoading(false);
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    getAllResellers();
  }, [paginationModel]);

  const handleSearchClick = () => {
    setPaginationModel({ ...paginationModel, page: 0 });
  };
  const handleFilterReset = () => {
    formik.setFieldValue("rejectionReason", null);
    formik.resetForm();

    setPaginationModel({ pageSize: 10, page: 0 });
  };

  const formik = useFormik({
    initialValues: {
      ClientGuid: "",
      resellerCategoryGuid: "",
      signUpFrom: "",
      signUpTo: "",
      rejectionReason: "",
      rejectedFrom: "",
      rejectedTo: "",
      AccountTypeTag: [],
      BalanceLimit: null,
      Threshold: null,
    },
    validationSchema: Yup.object().shape({
      resellerCategoryGuid: Yup.string().required(
        "Reseller Category is required"
      ),
      AccountTypeTag: Yup.array()
        .min(1, "At least one Account Type is required")
        .required("Account Type is required"),
      BalanceLimit: Yup.number().when("AccountTypeTag", {
        is: (tags) => tags.includes("POSTPAID"),
        then: (schema) => schema.required("Balance Limit is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      Threshold: Yup.number().when("AccountTypeTag", {
        is: (tags) => tags.includes("POSTPAID"),
        then: (schema) => schema.required("Threshold is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    validateOnChange: true,
    onSubmit: async (values) => {
      setModalLoading(true);
      try {
        let data = {
          ClientGuid: clientId,
          AccountTypeTag: values?.AccountTypeTag,
          AccountCategoryGuid: values?.resellerCategoryGuid,
        };
        if (values?.AccountTypeTag?.includes("POSTPAID")) {
          data.BalanceLimit = Math.abs(parseFloat(values?.BalanceLimit));
          data.Threshold = parseFloat(values?.Threshold);
        }

        let response = await APPROVE_RESELLER(data);
        if (response?.data?.success) {
          SetData((prev) =>
            prev.filter((item) => item.recordGuid !== clientId)
          );
          setModalLoading(false);
          setOpenApproveModal(false);
          setClientId("");
          showSnackbar("Reseller Approved");
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e }), "error");
      } finally {
        setModalLoading(false);
      }
    },
  });

  const GET_ALL_STATUS = async () => {
    setModalLoading(true);
    try {
      let res = await GET_ACTIVE_CRITERIA({
        CategoryTags: ["SIGNUP_REJECTION_REASON"],
      });
      if (res?.data?.success) {
        setRejectionStatus(res?.data?.data?.criteria);
        setModalLoading(false);
      }
    } catch (error) {
      setModalLoading(false);
      console.error(error);
    }
  };

  const handleMenuChange = async (option) => {
    handleClose();
    setClientId(selectedRow?.recordGuid);
    if (option === "Reject") {
      GET_ALL_STATUS();
      setOpenRejectionModal(true);
    } else {
      getAllCategories();
      setOpenApproveModal(true);
    }
  };

  const handleRejectReseller = async () => {
    if (!rejectionReason) {
      setError(true);

      return;
    }
    try {
      setLoading(true);
      let data = {
        ClientGuid: clientId,
        RejectionReasonGuid: rejectionReason,
      };
      let res = await REJECT_RESELLER(data);
      if (res?.data?.success) {
        setLoading(false);
        showSnackbar("Reseller Rejected");
        setOpenRejectionModal(false);
        SetData((prev) => prev.filter((item) => item.recordGuid !== clientId));
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      showSnackbar(e?.response?.data?.message, "error");
    }
  };
  return (
    <Box id="Reseller">
      <Box className="section_container scroll">
        <Grid
          container
          className="sub_section_container "
          alignContent={"flex-start"}
        >
          {openFilter && (
            <Grid item xs={12}>
              <AdvancedSearch
                handleFilterReset={handleFilterReset}
                handleFilterSearch={handleSearchClick}
                setShowAdvanceSearch={setOpenFilter}
                body={
                  <>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Signup Date From"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formik.values.signUpFrom}
                        onChange={(e) =>
                          formik.setFieldValue("signUpFrom", e.target.value)
                        }
                        inputProps={{
                          max: new Date().toISOString().split("T")[0],
                        }}
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Signup Date To"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formik.values.signUpTo}
                        onChange={(e) =>
                          formik.setFieldValue("signUpTo", e.target.value)
                        }
                        inputProps={{
                          max: new Date().toISOString().split("T")[0],
                        }}
                        variant="standard"
                      />
                    </Grid>
                    {statusTag == "REJECTED" && (
                      <>
                        {" "}
                        <Grid item xs={12} md={4}>
                          <CustomAsyncPaginate
                            apiFunction={GET_ACTIVE_CRITERIA}
                            value={formik.values.rejectionReason}
                            onChange={(value) => {
                              formik.setFieldValue("rejectionReason", value);
                            }}
                            placeholder="Rejection Reason"
                            pageSize={10}
                            dataPath="data.data.criteria"
                            totalRowsPath="data.data.totalRows"
                            method="GET"
                            id={`async-menu-style`}
                            params={{
                              CategoryTags: ["SIGNUP_REJECTION_REASON"],
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Rejected Date From"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.rejectedFrom}
                            onChange={(e) =>
                              formik.setFieldValue(
                                "rejectedFrom",
                                e.target.value
                              )
                            }
                            inputProps={{
                              max: new Date().toISOString().split("T")[0],
                            }}
                            variant="standard"
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Rejected Date To"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.rejectedTo}
                            onChange={(e) =>
                              formik.setFieldValue("rejectedTo", e.target.value)
                            }
                            inputProps={{
                              max: new Date().toISOString().split("T")[0],
                            }}
                            variant="standard"
                          />
                        </Grid>
                      </>
                    )}
                  </>
                }
              />
            </Grid>
          )}
          <Grid item xs={12} marginTop={2}>
            <MuiTable
              rowId={"recordGuid"}
              columns={columns}
              data={Data}
              loading={isLoading}
              setPaginationModel={setPaginationModel}
              paginationModel={paginationModel}
              totalRows={totalRows}
            />
          </Grid>
        </Grid>

        {viewClientsModal && (
          <MuiModal
            title="Clients"
            open={viewClientsModal}
            width="1000px"
            id="edit-contact-form"
            handleClose={() => setViewClientsModal(false)}
          >
            <Grid container justifyContent="end" className="my-3">
              <Grid item xs={12}>
                <Card className="kpi-card">
                  <MuiTable
                    rowId={"recordGuid"}
                    columns={[
                      { field: "name", headerName: "Name", flex: 1 },
                      {
                        field: "username",
                        headerName: "Username",
                        flex: 1,
                      },
                      {
                        field: "email",
                        headerName: "Email",
                        flex: 1,
                      },
                    ]}
                    data={ClientsData}
                    loading={isLoading}
                    setPaginationModel={setClientsPaginationModel}
                    paginationModel={clientsPaginationModel}
                    totalRows={totalClientsRows}
                  />
                </Card>
              </Grid>
            </Grid>
          </MuiModal>
        )}

        <RejectionModal
          open={openRejectionModal}
          onClose={() => setOpenRejectionModal(false)}
          options={rejectionStatus}
          onChange={(e, newValue) => {
            setRejectionReason(newValue?.recordGuid);
            setError(false);
          }}
          onClick={handleRejectReseller}
          error={error}
          loading={modalLoading}
        />
        <ApproveModal
          open={openApproveModal}
          onClose={() => {
            setOpenApproveModal(false);
            formik?.resetForm();
          }}
          options={categories}
          formik={formik}
          onClick={handleRejectReseller}
          error={error}
          loading={modalLoading}
        />
      </Box>
    </Box>
  );
};

export default withTranslation("translation")(ResellerPage);
