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
import { GET_CURRENCIES } from "../../../APIs/Criteria";
import {
  DELETE_DISCOUNT,
  GET_ALL_DISCOUNT_CATEGORIES,
  GET_ALL_DISCOUNT_TYPES,
  GET_ALL_DISCOUNTS,
} from "../../../APIs/EWallet";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import ManageDiscount from "./manage/ManageDiscount";
import GetActions from "../../Utils/GetActions";

const Discount = () => {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.authentication);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [discountTypes, setDiscountTypes] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [discountCategories, setDiscountCategories] = useState([]);
  const { showSnackbar } = useSnackbar();
  const getAllDiscounts = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_DISCOUNTS({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
      });
      const data =
        response?.data?.data?.discounts?.length > 0
          ? response?.data?.data?.discounts?.map((item) => ({
              ...item,
              currencyName: item.currency.name,
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

  const getDiscountCategories = async () => {
    setLoading(true);
    try {
      let categoriesResponse = await GET_ALL_DISCOUNT_CATEGORIES({
        token,
        search: "",
        pageSize: null,
        pageNumber: null,
      });
      setDiscountCategories(categoriesResponse?.data?.data);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");

      setLoading(false);
    }
  };

  const getDiscountTypes = async () => {
    setLoading(true);
    try {
      let typesResponse = await GET_ALL_DISCOUNT_TYPES({
        token,
        search: "",
        pageSize: null,
        pageNumber: null,
      });
      setDiscountTypes(typesResponse?.data?.data?.data);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      setLoading(false);
    }
  };

  const getCurrencies = async () => {
    setLoading(true);
    try {
      let currencyResponse = await GET_CURRENCIES({
        token,
        search: "",
        pageSize: null,
        pageNumber: null,
      });
      setCurrencies(currencyResponse?.data?.data?.currencies);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllDiscounts();
  }, [paginationModel]);

  useEffect(() => {
    getDiscountTypes();
    getDiscountCategories();
    getCurrencies();
  }, []);

  const [manageAdd, setManageAdd] = useState(false);
  const [manageEdit, setManageEdit] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState("");

  const handleEditManage = (value) => {
    setSelectedDiscount(value);
    setManageEdit(true);
  };

  const DeleteDiscount = async (value) => {
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const deleteResponse = await DELETE_DISCOUNT(value?.recordGuid);
        if (deleteResponse?.data?.success) {
          Swal.fire({
            title: "Discount Deleted Successfully",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error Deleting Discount",
            text: "Unknown Error",
            icon: "error",
          });
        }
        getAllDiscounts();
      } catch (error) {
        Swal.fire({
          title: "Error Deleting Discount",
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
                  <Typography className="BreadcrumbsPage">Discounts</Typography>
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
                  Add Discount
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
                      field: "amount",
                      headerName: "Amount",
                      flex: 1,
                    },
                    {
                      field: "currencyName",
                      headerName: "Currency",
                      flex: 1,
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      flex: 1,
                      renderCell: (params) => (
                        <>
                          <Tooltip title="Edit Discount">
                            <IconButton
                              onClick={() => handleEditManage(params?.row)}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Discount">
                            <IconButton
                              onClick={() => DeleteDiscount(params?.row)}
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
          title="Add Discount"
          open={manageAdd}
          width="500px"
          handleClose={() => setManageAdd(false)}
        >
          <ManageDiscount
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAdd={setManageAdd}
            categories={discountCategories}
            types={discountTypes}
            currencies={currencies}
            getAllDiscounts={getAllDiscounts}
          />
        </MuiModal>
      )}

      {manageEdit && (
        <MuiModal
          title="Edit Discount"
          open={manageEdit}
          width="500px"
          handleClose={() => setManageEdit(false)}
        >
          <ManageDiscount
            type="edit"
            oading={loading}
            setLoading={setLoading}
            setManageAdd={setManageAdd}
            categories={discountCategories}
            types={discountTypes}
            currencies={currencies}
            getAllDiscounts={getAllDiscounts}
            setManageEdit={setManageEdit}
            selectedDiscount={selectedDiscount}
          />
        </MuiModal>
      )}
    </Box>
  );
};

export default GetActions(Discount);
