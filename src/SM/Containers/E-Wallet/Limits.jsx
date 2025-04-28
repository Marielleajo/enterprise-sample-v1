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
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";

import { Add, Delete, Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
import { GET_ALL_ACCOUNT_TYPE } from "../../../APIs/Account";
import {
  DELETE_LIMIT,
  GET_ALL_FREQUENCIES,
  GET_ALL_LIMIT_CATEGORIES,
  GET_ALL_LIMIT_TYPES,
  GET_ALL_LIMITS,
} from "../../../APIs/EWallet";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import ManageLimits from "./manage/ManageLimits";
import { GET_CURRENCIES } from "../../../APIs/Criteria";
import GetActions from "../../Utils/GetActions";

const Limits = () => {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.authentication);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [limitTypes, setLimitTypes] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [limitCategories, setLimitCategories] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const { showSnackbar } = useSnackbar();
  const getAllLimits = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_LIMITS({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
      });
      const data =
        response?.data?.data?.limits?.length > 0
          ? response?.data?.data?.limits
          : [];
      setData(data);
      setTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const getCurrencies = async () => {
    setLoading(true);
    try {
      let currencyResponse = await GET_CURRENCIES(token);
      setCurrencies(currencyResponse?.data?.data?.currencies || []);
    } catch (e) {
      Notification.error(e);
      setLoading(false);
    }
  };

  const getLimitCategories = async () => {
    setLoading(true);
    try {
      let categoriesResponse = await GET_ALL_LIMIT_CATEGORIES({
        token,
        search: "",
        pageSize: null,
        pageNumber: null,
      });
      setLimitCategories(categoriesResponse?.data?.data);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");

      setLoading(false);
    }
  };

  const getLimitTypes = async () => {
    setLoading(true);
    try {
      let typesResponse = await GET_ALL_LIMIT_TYPES({
        token,
        search: "",
        pageSize: null,
        pageNumber: null,
      });
      setLimitTypes(typesResponse?.data?.data);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      setLoading(false);
    }
  };
  const getAccountTypes = async () => {
    setLoading(true);
    try {
      let typesResponse = await GET_ALL_ACCOUNT_TYPE({
        token,
        search: "",
        pageSize: null,
        pageNumber: null,
      });
      setAccountTypes(typesResponse?.data?.data?.types);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      setLoading(false);
    }
  };

  const getFrequencies = async () => {
    setLoading(true);
    try {
      let frequinciesResponse = await GET_ALL_FREQUENCIES({
        token,
        search: "",
        pageSize: null,
        pageNumber: null,
      });
      setFrequencies(frequinciesResponse?.data?.data?.frequencies);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllLimits();
  }, [paginationModel]);

  useEffect(() => {
    getLimitTypes();
    getLimitCategories();
    getAccountTypes();
    getFrequencies();
    getCurrencies();
  }, []);

  const [manageAdd, setManageAdd] = useState(false);
  const [manageEdit, setManageEdit] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState("");

  const handleEditManage = (value) => {
    setSelectedLimit(value);
    setManageEdit(true);
  };

  const DeleteLimit = async (value) => {
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const deleteResponse = await DELETE_LIMIT(value?.recordGuid);
        if (deleteResponse?.data?.success) {
          Swal.fire({
            title: "Limit Deleted Successfully",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error Deleting Limit",
            text: "Unknown Error",
            icon: "error",
          });
        }
        getAllLimits();
      } catch (error) {
        Swal.fire({
          title: "Error Deleting Limit",
          text: handleMessageError(error),
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
          <Grid
            container
            className="pt-4"
            paddingRight={2.5}
            display={"flex"}
            justifyContent={"start"}
            alignItems={"center"}
          >
            <Grid
              container
              className="pt-4"
              paddingRight={2.5}
              display="flex"
              justifyContent="start"
              alignItems="center"
            >
              <Grid item xs={12} md={4}>
                <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                  <Typography className="BreadcrumbsPage">Limits</Typography>
                </Breadcrumbs>
              </Grid>
              <Grid
                item
                xs={6}
                md={8}
                display="flex"
                justifyContent="end"
                alignItems="center"
              >
                <Button
                  className="mui-btn primary filled"
                  onClick={() => setManageAdd(true)}
                  startIcon={<Add />}
                  disabled={loading}
                >
                  Add Limit
                </Button>
              </Grid>
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
                      field: "limitAmount",
                      headerName: "Amount",
                      flex: 1,
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      flex: 1,
                      renderCell: (params) => (
                        <>
                          <Tooltip title="Edit Limit">
                            <IconButton
                              onClick={() => handleEditManage(params?.row)}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Limit">
                            <IconButton
                              onClick={() => DeleteLimit(params?.row)}
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

      {manageAdd && (
        <MuiModal
          title="Add Limit"
          open={manageAdd}
          width="500px"
          handleClose={() => setManageAdd(false)}
        >
          <ManageLimits
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAdd={setManageAdd}
            categories={limitCategories}
            types={limitTypes}
            currencies={currencies}
            accountTypes={accountTypes}
            frequencies={frequencies}
            getAllLimits={getAllLimits}
          />
        </MuiModal>
      )}

      {manageEdit && (
        <MuiModal
          title="Edit Limit"
          open={manageEdit}
          width="500px"
          handleClose={() => setManageEdit(false)}
        >
          <ManageLimits
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageAdd={setManageAdd}
            categories={limitCategories}
            types={limitTypes}
            accountTypes={accountTypes}
            frequencies={frequencies}
            currencies={currencies}
            setManageEdit={setManageEdit}
            selectedLimit={selectedLimit}
            getAllLimits={getAllLimits}
          />
        </MuiModal>
      )}
    </Box>
  );
};

export default GetActions(Limits);
