import { Add, Delete, Edit, FilterAlt } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import Swal from "sweetalert2";

import MuiModal from "../../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import ManageCategory from "./ManageCategory";
import {
  DELETE_CampaignCategory,
  GET_ALL_CampaignCategory,
} from "../../../../APIs/Campaign";
import AdvancedSearch from "../../../../Components/AdvancedSearch/AdvancedSearch";

function CampaignCategory({ t }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [manageEditCategory, setManageEditCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [manageAddCategory, setManageAddCategory] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [search, setSearch] = useState("");
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Separate search input state

  useEffect(() => {
    getAllCategories();
  }, [paginationModel]);

  const getAllCategories = async () => {
    setLoading(true);
    try {
      const response = await GET_ALL_CampaignCategory({
        pageSize: paginationModel.pageSize,
        pageNumber: paginationModel.page + 1,
        search: search,
      });

      const items = response?.data?.data?.campaignCategories;
      const data = items?.map((item) => ({
        id: item?.recordGuid,
        name: item?.campaignCategoryDetails[0]?.name,
        description: item?.campaignCategoryDetails[0]?.description,
      }));

      setCategories(data);
      setTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (error) {
      showSnackbar(handleMessageError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (category) => {
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const deleteResponse = await DELETE_CampaignCategory(category?.id);
        if (deleteResponse?.data?.success) {
          Swal.fire({
            title: deleteResponse?.data?.message,
            icon: "success",
          });
        } else {
          Swal.fire({
            title: deleteResponse?.data?.message,
            text: "Unknown Error",
            icon: "error",
          });
        }
        getAllCategories();
      } catch (error) {
        Swal.fire({
          title:
            error?.response?.data?.message ||
            error?.response?.data?.errors?.Name?.[0] ||
            error?.response?.data?.result?.message ||
            "Error Deleting Category",
          text: handleMessageError(error),
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddManageCategory = () => {
    setManageAddCategory(true);
  };

  const handleEditManageCategory = (category) => {
    setSelectedCategory(category);
    setManageEditCategory(true);
  };

  const handleSearchClick = () => {
    setSearch(searchQuery); // Update the actual search state for the API
    setPaginationModel({ ...paginationModel, page: 0 }); // Reset pagination if needed
  };

  const handleFilterReset = () => {
    setSearch("");
    setSearchQuery("");
    setPaginationModel({ pageSize: 10, page: 0 });
  };

  return (
    <>
      <Box className="page_container">
        <Grid container columnSpacing={3} className="section_container scroll">
          <Grid item xs={12} className="sub_section_container">
            <Grid
              container
              className="pt-4"
              paddingRight={2.5}
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
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
                  onClick={handleAddManageCategory}
                  startIcon={<Add />}
                >
                  Add Category
                </Button>
                <Button
                  className="mui-btn secondary filled"
                  id="send-service-country-id"
                  onClick={() => setShowAdvanceSearch(!showAdvanceSearch)}
                >
                  <FilterAlt fontSize="small" />
                </Button>
              </Grid>

              {showAdvanceSearch && (
                <Grid item xs={12}>
                  <AdvancedSearch
                    showAdvanceSearch={showAdvanceSearch}
                    handleFilterReset={handleFilterReset}
                    handleFilterSearch={handleSearchClick}
                    setShowAdvanceSearch={setShowAdvanceSearch}
                    body={
                      <>
                        <Grid item xs={4}>
                          <FormControl fullWidth variant="standard">
                            <TextField
                              key={"Name"}
                              fullWidth
                              id={"Name"}
                              name={"Name"}
                              label="Search by Name"
                              variant="standard"
                              type="text"
                              value={searchQuery}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={(e) => setSearchQuery(e?.target?.value)}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    }
                  />
                </Grid>
              )}

              <Grid item xs={12} marginTop={2}>
                <MuiTable
                  rowId="id"
                  columns={[
                    {
                      field: "name",
                      headerName: "Name",
                      flex: 1,
                      minWidth: 200,
                    },
                    {
                      field: "description",
                      headerName: "Description",
                      flex: 1,
                      minWidth: 250,
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      flex: 1,
                      renderCell: (params) => (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "left",
                            width: "100%",
                          }}
                        >
                          <Tooltip title="Edit Category">
                            <IconButton
                              onClick={() =>
                                handleEditManageCategory(params?.row)
                              }
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Category">
                            <IconButton
                              onClick={() => deleteCategory(params?.row)}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ),
                    },
                  ]}
                  data={categories}
                  loading={loading}
                  paginationModel={paginationModel}
                  setPaginationModel={setPaginationModel}
                  totalRows={totalRows}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {manageAddCategory && (
          <MuiModal
            title="Add Category"
            open={manageAddCategory}
            width="500px"
            handleClose={() => setManageAddCategory(false)}
          >
            <ManageCategory
              type="add"
              loading={loading}
              setLoading={setLoading}
              setManageAddCategory={setManageAddCategory}
              getAllCategories={getAllCategories}
            />
          </MuiModal>
        )}

        {manageEditCategory && (
          <MuiModal
            title="Edit Category"
            open={manageEditCategory}
            width="500px"
            handleClose={() => setManageEditCategory(false)}
          >
            <ManageCategory
              type="edit"
              loading={loading}
              setLoading={setLoading}
              setManageEditCategory={setManageEditCategory}
              getAllCategories={getAllCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </MuiModal>
        )}
      </Box>
    </>
  );
}

export default withTranslation("translations")(CampaignCategory);
