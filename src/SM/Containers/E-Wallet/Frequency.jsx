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
import {
  DELETE_FREQUENCY,
  GET_ALL_FREQUENCIES,
  GET_ALL_FREQUENCY_CATEGORIES,
  GET_ALL_FREQUENCY_TYPES,
} from "../../../APIs/EWallet";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import ManageFrequency from "./manage/ManageFrequency";
import GetActions from "../../Utils/GetActions";

const Frequency = () => {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.authentication);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [frequencyTypes, setFrequencyTypes] = useState([]);
  const [frequencyCategories, setFrequencyCategories] = useState([]);
  const { showSnackbar } = useSnackbar();
  const getAllFrequencies = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_FREQUENCIES({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
      });
      const data =
        response?.data?.data?.frequencies?.length > 0
          ? response?.data?.data?.frequencies
          : [];
      setData(data);
      setTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const getFrequencyCategories = async () => {
    setLoading(true);
    try {
      let categoriesResponse = await GET_ALL_FREQUENCY_CATEGORIES({
        token,
        search: "",
        pageSize: null,
        pageNumber: null,
      });
      setFrequencyCategories(categoriesResponse?.data?.data);
      setLoading(false);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");

      setLoading(false);
    }
  };

  const getFrequencyTypes = async () => {
    setLoading(true);
    try {
      let typesResponse = await GET_ALL_FREQUENCY_TYPES({
        token,
        search: "",
        pageSize: null,
        pageNumber: null,
      });
      setFrequencyTypes(typesResponse?.data?.data);
      setLoading(false);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllFrequencies();
  }, [paginationModel]);

  useEffect(() => {
    getFrequencyCategories();
    getFrequencyTypes();
  }, []);

  const [manageAdd, setManageAdd] = useState(false);
  const [manageEdit, setManageEdit] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("");

  const handleEditManage = (value) => {
    setSelectedFrequency(value);
    setManageEdit(true);
  };

  const DeleteFrequency = async (value) => {
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const deleteResponse = await DELETE_FREQUENCY(value?.recordGuid);
        if (deleteResponse?.data?.success) {
          Swal.fire({
            title: "Frequency Deleted Successfully",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error Deleting Frequency",
            text: "Unknown Error",
            icon: "error",
          });
        }
        getAllFrequencies();
      } catch (error) {
        Swal.fire({
          title: "Error Deleting Frequency",
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
                  <Typography className="BreadcrumbsPage">
                    Frequencies
                  </Typography>
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
                  Add Frequency
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
                      field: "interval",
                      headerName: "Interval",
                      flex: 1,
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      flex: 1,
                      renderCell: (params) => (
                        <>
                          <Tooltip title="Edit Frequency">
                            <IconButton
                              onClick={() => handleEditManage(params?.row)}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Frequency">
                            <IconButton
                              onClick={() => DeleteFrequency(params?.row)}
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
          title="Add Frequency"
          open={manageAdd}
          width="500px"
          handleClose={() => setManageAdd(false)}
        >
          <ManageFrequency
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAdd={setManageAdd}
            categories={frequencyCategories}
            types={frequencyTypes}
            getAllFrequencies={getAllFrequencies}
          />
        </MuiModal>
      )}

      {manageEdit && (
        <MuiModal
          title="Edit Frequency"
          open={manageEdit}
          width="500px"
          handleClose={() => setManageEdit(false)}
        >
          <ManageFrequency
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageAdd={setManageAdd}
            categories={frequencyCategories}
            types={frequencyTypes}
            getAllFrequencies={getAllFrequencies}
            setManageEdit={setManageEdit}
            selectedFrequency={selectedFrequency}
          />
        </MuiModal>
      )}
    </Box>
  );
};

export default GetActions(Frequency);
