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
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSelector } from "react-redux";
import {
  ADD_ACCOUNT_TYPE,
  DELETE_ACCOUNT_TYPE,
  EXPORT_ALL_ACCOUNT_TYPE,
  GET_ALL_ACCOUNT_TYPE,
} from "../../../APIs/Account";
import { handleMessageError } from "../../Utils/Functions";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import ManageAccountType from "./ManageAccountType";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import { Add, Delete, Download, Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import GetActions from "../../Utils/GetActions";

const AccountType = () => {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.authentication);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const { showSnackbar } = useSnackbar();

  const getAllAccountType = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_ACCOUNT_TYPE({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
      });
      const data =
        response?.data?.data?.types?.length > 0
          ? response?.data?.data?.types?.map((item) => ({
              ...item,
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

  useEffect(() => {
    getAllAccountType();
  }, [paginationModel]);

  const [manageAdd, setManageAdd] = useState(false);
  const [manageEdit, setManageEdit] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState("");

  const handleEditManage = (value) => {
    setSelectedAccountType(value);
    setManageEdit(true);
  };

  const DeleteAccountType = async (value) => {
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const deleteResponse = await DELETE_ACCOUNT_TYPE(value?.recordGuid);
        if (deleteResponse?.data?.success) {
          Swal.fire({
            title: "Account Type Deleted Successfully",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error Deleting Account Type",
            text: "Unknown Error",
            icon: "error",
          });
        }
        getAllAccountType();
      } catch (error) {
        Swal.fire({
          title: "Error Deleting Account Type",
          text: handleMessageError(error),
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const exportAllAccountType = async () => {
    setLoading(true);
    try {
      let response = await EXPORT_ALL_ACCOUNT_TYPE({
        token,
      });

      if (response?.status === 200) {
        const reader = new FileReader();

        reader.onload = () => {
          const responseText = reader?.result;

          // Check if responseText indicates an empty data
          if (
            !responseText ||
            responseText?.trim() === "" ||
            responseText?.includes("Empty Data")
          ) {
            showSnackbar("Empty Data", "error");
            return;
          }

          const contentType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          const headers = response?.headers;
          headers["Content-Type"] = contentType;

          // Create a Blob object from the response data
          const blob = new Blob([response?.data], {
            type: contentType,
          });

          // Create a URL for the Blob object
          const url = window.URL.createObjectURL(blob);

          // Create a link element to trigger the download
          const link = document.createElement("a");
          link.href = url;
          link.download = "Account Types.xlsx";

          // Append link to the document body
          document.body.appendChild(link);

          // Trigger the download
          link.click();

          // Cleanup
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          showSnackbar("Export Successful");
        };

        reader.onerror = () => {
          showSnackbar("Failed to read the export data", "error");
        };

        // Read the Blob as text
        reader.readAsText(response.data);
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
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
                    Account Type
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
                >
                  Add Account Type
                </Button>
                <Button
                  className="mui-btn secondary filled"
                  onClick={() => exportAllAccountType()}
                  startIcon={<Download />}
                >
                  Export Account Type
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
                      field: "description",
                      headerName: "Description",
                      flex: 1,
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      flex: 1,
                      renderCell: (params) => (
                        <>
                          <Tooltip title="Edit Account Type">
                            <IconButton
                              onClick={() => handleEditManage(params?.row)}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Account Type">
                            <IconButton
                              onClick={() => DeleteAccountType(params?.row)}
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
          title="Add Account Type"
          open={manageAdd}
          width="500px"
          handleClose={() => setManageAdd(false)}
        >
          <ManageAccountType
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAdd={setManageAdd}
            getAllAccountType={getAllAccountType}
          />
        </MuiModal>
      )}

      {manageEdit && (
        <MuiModal
          title="Edit Account Type"
          open={manageEdit}
          width="500px"
          handleClose={() => setManageEdit(false)}
        >
          <ManageAccountType
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageEdit={setManageEdit}
            getAllAccountType={getAllAccountType}
            selectedAccountType={selectedAccountType}
            setSelectedAccountType={setSelectedAccountType}
          />
        </MuiModal>
      )}
    </Box>
  );
};

export default GetActions(AccountType);
