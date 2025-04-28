import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  DELETE_ACCOUNT_TEMPLATE,
  GET_ALL_ACCOUNT_TEMPLATE,
  GET_ALL_ACCOUNT_TYPE,
} from "../../../APIs/Account";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";

import { Add, Delete, Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
import { GET_CLIENT_CATEGORIES } from "../../../APIs/Clients";
import {
  GET_ALL_DISCOUNTS,
  GET_ALL_FEES,
  GET_ALL_LIMITS,
} from "../../../APIs/EWallet";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import TruncateText from "../../../Components/Utils/TruncateText";
import ManageAccountTemplate from "./ManageAccountTemplate";
import GetActions from "../../Utils/GetActions";

const AccountTemplate = () => {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.authentication);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [selectedAccountTemplate, setSelectedAccountTemplate] = useState(null);
  const [addAccountTemplate, setAddAccountTemplate] = useState(false);
  const [editAccountTemplate, setEditAccountTemplate] = useState(false);

  const [viewDetails, setViewDetails] = useState({
    title: "",
    data: null,
    open: false,
  });

  const [totalRows, setTotalRows] = useState(0);
  const [fees, setFees] = useState([]);
  const [limits, setLimits] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [accountCategories, setAccountCategories] = useState([]);
  const { showSnackbar } = useSnackbar();

  const getAllAccountTemplate = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_ACCOUNT_TEMPLATE({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
      });
      const data =
        response?.data?.data?.accounts.length > 0 > 0
          ? response?.data?.data?.accounts?.map((item) => ({
              ...item,
              services: item.clientAccountServices.map((s) => s.service.tag),
            }))
          : [];
      setData(data);
      setTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const getAllLimits = async () => {
    try {
      let response = await GET_ALL_LIMITS({
        token,
        pageSize: null,
        pageNumber: null,
      });
      let data = response?.data?.data?.limits;
      setLimits(data ?? []);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    }
  };

  const getAccountCategories = async () => {
    try {
      let response = await GET_CLIENT_CATEGORIES({
        token,
        pageSize: null,
        pageNumber: null,
      });

      let data = response?.data?.data.clientCategory;
      setAccountCategories(data ?? []);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    }
  };

  const getAccountTypes = async () => {
    try {
      let response = await GET_ALL_ACCOUNT_TYPE({
        token,
        pageSize: null,
        pageNumber: null,
      });
      let data = response?.data?.data?.types;
      setAccountTypes(data ?? []);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    }
  };

  const getAllDiscounts = async () => {
    try {
      let response = await GET_ALL_DISCOUNTS({
        token,
        pageSize: null,
        pageNumber: null,
      });
      let data = response?.data?.data?.discounts;
      setDiscounts(data ?? []);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    }
  };

  const getAllFees = async () => {
    try {
      let response = await GET_ALL_FEES({
        token,
        pageSize: null,
        pageNumber: null,
      });
      let data = response?.data?.data?.fees;
      setFees(data ?? []);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    }
  };

  const handleAddAccountTemplate = () => {
    setAddAccountTemplate(true);
  };

  const handleEditAccounTemplate = (value) => {
    setSelectedAccountTemplate(value);
    setEditAccountTemplate(true);
  };

  const DeleteAccountTemplate = async (value) => {
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const deleteResponse = await DELETE_ACCOUNT_TEMPLATE(value?.recordGuid);
        if (deleteResponse?.data?.success) {
          Swal.fire({
            title: "Account Template Deleted Successfully",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error Deleting Account Template",
            text: "Unknown Error",
            icon: "error",
          });
        }
        getAllAccountTemplate();
      } catch (error) {
        Swal.fire({
          title: "Error Deleting Account Template",
          text: handleMessageError(error),
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getAllDiscounts();
    getAllFees();
    getAllLimits();
    getAccountTypes();
    getAccountCategories();
  }, []);
  useEffect(() => {
    getAllAccountTemplate();
  }, [paginationModel]);

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
                <Typography className="BreadcrumbsPage">
                  Account Template
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid
              item
              xs={6}
              md={8}
              display={"flex"}
              justifyContent={"end"}
              alignItems={"center"}
            >
              <Button
                className="mui-btn primary filled"
                id="send-service-provider-id"
                onClick={() => handleAddAccountTemplate()}
                startIcon={<Add />}
              >
                Add Template
              </Button>
            </Grid>
            <Grid item xs={12} marginTop={2}>
              <Card className="kpi-card">
                <MuiTable
                  rowId="recordGuid"
                  columns={[
                    {
                      field: "accountNumber",
                      headerName: "Acc Number",
                      flex: 1,
                    },
                    {
                      field: "services",
                      headerName: "Services",
                      flex: 1,
                      renderCell: (params) => (
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setViewDetails({
                              title: "Services",
                              data: params?.value,
                              open: true,
                            })
                          }
                        >
                          {TruncateText(params?.value?.join(","), 10)}
                        </span>
                      ),
                    },
                    {
                      field: "discounts",
                      headerName: "Discounts",
                      flex: 1,
                      renderCell: (params) => (
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setViewDetails({
                              title: "Discounts",
                              data: params?.value?.map(
                                (discount) =>
                                  `Name: ${discount.name}, Amount : ${discount.amount}`
                              ),
                              open: true,
                            })
                          }
                        >
                          {TruncateText(
                            params?.value
                              ?.map((discount) => discount.name)
                              .join(","),
                            10
                          )}
                        </span>
                      ),
                    },
                    {
                      field: "fees",
                      headerName: "Fees",
                      flex: 2,
                      renderCell: (params) => (
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setViewDetails({
                              title: "Fees",
                              data: params?.value?.map(
                                (fee) =>
                                  `Name: ${fee.name}, Minimum Value : ${fee.minValue}, Maximum Value : ${fee.maxValue}`
                              ),
                              open: true,
                            })
                          }
                        >
                          {TruncateText(
                            params?.value?.map((fee) => fee.name).join(",")
                          )}
                        </span>
                      ),
                    },
                    {
                      field: "limits",
                      headerName: "Limits",
                      flex: 2,
                      renderCell: (params) => (
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setViewDetails({
                              title: "Limits",
                              data: params?.value?.map(
                                (limit) =>
                                  `Name: ${limit.name}, Amount : ${limit.limitAmount}`
                              ),
                              open: true,
                            })
                          }
                        >
                          {TruncateText(
                            params?.value?.map((limit) => limit.name).join(",")
                          )}
                        </span>
                      ),
                    },
                    {
                      field: "description",
                      headerName: "Description",
                      flex: 1,
                      renderCell: (params) => (
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setViewDetails({
                              title: "Description",
                              data: [params?.value],
                              open: true,
                            })
                          }
                        >
                          {TruncateText(params?.value, 10)}
                        </span>
                      ),
                    },
                    // {
                    //   field: "lastRecharge",
                    //   headerName: "Last Recharge",
                    //   flex: 1,
                    // },
                    // {
                    //   field: "currentBalance",
                    //   headerName: "Current Balance",
                    //   flex: 1,
                    // },
                    // {
                    //   field: "previousBalance",
                    //   headerName: "Previous Balance",
                    //   flex: 1,
                    // },
                    // {
                    //   field: "lockedBalance",
                    //   headerName: "Locked Balance",
                    //   flex: 1,
                    // },
                    {
                      field: "actions",
                      headerName: "Actions",
                      flex: 1,
                      renderCell: (params) => (
                        <>
                          <Tooltip title="Edit Account Template">
                            <IconButton
                              onClick={() =>
                                handleEditAccounTemplate(params?.row)
                              }
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Account Template">
                            <IconButton
                              onClick={() => DeleteAccountTemplate(params?.row)}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </>
                      ),
                    },
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
      {viewDetails.open && (
        <MuiModal
          title={viewDetails.title}
          open={viewDetails.open}
          width="500px"
          id="edit-contact-form"
          handleClose={() =>
            setViewDetails({ title: "", data: null, open: false })
          }
        >
          {viewDetails.data?.map((data) => (
            <ul>
              <li>{data}</li>
            </ul>
          ))}
        </MuiModal>
      )}
      {editAccountTemplate && (
        <MuiModal
          title="Edit Account Template"
          open={editAccountTemplate}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setEditAccountTemplate(false)}
        >
          <ManageAccountTemplate
            type={"edit"}
            loading={loading}
            accountTypeChoices={accountTypes}
            accountCategoryChoices={accountCategories}
            fees={fees}
            discounts={discounts}
            limits={limits}
            setLoading={setLoading}
            selectedAccountTemplate={selectedAccountTemplate}
            setEditAccountTemplate={setEditAccountTemplate}
            setAddAccountTemplate={setAddAccountTemplate}
            getAllAccountTemplate={getAllAccountTemplate}
          />
        </MuiModal>
      )}
      {addAccountTemplate && (
        <MuiModal
          title="Add Account Template"
          open={addAccountTemplate}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setAddAccountTemplate(false)}
        >
          <ManageAccountTemplate
            type={"add"}
            loading={loading}
            accountTypeChoices={accountTypes}
            accountCategoryChoices={accountCategories}
            fees={fees}
            discounts={discounts}
            limits={limits}
            setLoading={setLoading}
            setAddAccountTemplate={setAddAccountTemplate}
            getAllAccountTemplate={getAllAccountTemplate}
          />
        </MuiModal>
      )}
    </Box>
  );
};

export default GetActions(AccountTemplate);
