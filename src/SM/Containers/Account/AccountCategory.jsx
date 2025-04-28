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
import Swal from "sweetalert2";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import {
  DELETE_ACCOUNT_CATEGORY,
  GET_ALL_ACCOUNT_CATEGORY,
} from "../../../APIs/Account";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import { Add, Delete, Edit } from "@mui/icons-material";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import ManageAccountCategory from "./ManageAccountCategory";
import GetActions from "../../Utils/GetActions";

const AccountCategory = () => {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.authentication);
  const { showSnackbar } = useSnackbar();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);

  const [addAccountCategory, setAddAccountCategory] = useState(false);
  const [editAccountCategory, setEditAccountCategory] = useState(false);
  const [selectedAccountCategory, setSelectedAccountCategory] = useState("");
  const handleAddAccountCategory = (data) => {
    setAddAccountCategory(true);
  };
  const handleEditAccountCategory = (data) => {
    setSelectedAccountCategory(data);
    setEditAccountCategory(true);
  };

  const getAllAccountCategories = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_ACCOUNT_CATEGORY({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
      });
      const data =
        response?.data?.data?.categories?.length > 0
          ? response?.data?.data?.categories?.map((item) => ({
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

  const DeleteAccountCategory = async (value) => {
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const deleteResponse = await DELETE_ACCOUNT_CATEGORY(value?.recordGuid);
        if (deleteResponse?.data?.success) {
          Swal.fire({
            title: "Account Category Deleted Successfully",
            icon: "success",
          });
        } else {
          //mery
          Swal.fire({
            title: "Error Deleting Account Category",
            text: "Unknown Error",
            icon: "error",
          });
        }
        getAllAccountCategories();
      } catch (error) {
        Swal.fire({
          title: "Error Deleting Account Category",
          text: handleMessageError(error),
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getAllAccountCategories();
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
                <Typography className="BreadcrumbsPage">Category</Typography>
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
                onClick={() => handleAddAccountCategory()}
                startIcon={<Add />}
              >
                Add Category
              </Button>
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
                          <Tooltip title="Edit Account Category">
                            <IconButton
                              onClick={() =>
                                handleEditAccountCategory(params?.row)
                              }
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Account Category">
                            <IconButton
                              onClick={() => DeleteAccountCategory(params?.row)}
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
      {addAccountCategory && (
        <MuiModal
          title="Add Account Category"
          open={addAccountCategory}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setAddAccountCategory(false)}
        >
          <ManageAccountCategory
            type="add"
            loading={loading}
            setLoading={setLoading}
            setAddAccountCategory={setAddAccountCategory}
            getAllAccountCategories={getAllAccountCategories}
          />
        </MuiModal>
      )}
      {editAccountCategory && (
        <MuiModal
          title="Edit Account Category"
          open={editAccountCategory}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setEditAccountCategory(false)}
        >
          <ManageAccountCategory
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setEditAccountCategory={setEditAccountCategory}
            selectedAccountCategory={selectedAccountCategory}
            getAllAccountCategories={getAllAccountCategories}
            setSelectedAccountCategory={selectedAccountCategory}
          />
        </MuiModal>
      )}
    </Box>
  );
};

export default AccountCategory;
