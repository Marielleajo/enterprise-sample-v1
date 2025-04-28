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
import ManageType from "./ManageType";
import {
  DELETE_CampaignType,
  GET_ALL_CampaignType,
} from "../../../../APIs/Campaign.jsx";
import AdvancedSearch from "../../../../Components/AdvancedSearch/AdvancedSearch.jsx";

function CampaignType({ t }) {
  const [loading, setLoading] = useState(false);
  const [campaignTypes, setCampaignTypes] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [manageEditCampaignType, setManageEditCampaignType] = useState(false);
  const [selectedCampaignType, setSelectedCampaignType] = useState(null);
  const [manageAddCampaignType, setManageAddCampaignType] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [search, setSearch] = useState("");
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Separate search input state

  useEffect(() => {
    getAllCampaignTypes();
  }, [paginationModel]);

  const getAllCampaignTypes = async () => {
    setLoading(true);
    try {
      const response = await GET_ALL_CampaignType({
        pageSize: paginationModel.pageSize,
        pageNumber: paginationModel.page + 1,
        search: search ?? null,
      });

      const items = response?.data?.data?.campaignTypes;
      const data = items?.map((item) => ({
        id: item?.recordGuid,
        name: item?.campaignTypeDetails[0]?.name,
        description: item?.campaignTypeDetails[0]?.description,
      }));

      setCampaignTypes(data);
      setTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (error) {
      showSnackbar(handleMessageError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaignType = async (campaignType) => {
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const deleteResponse = await DELETE_CampaignType(campaignType?.id);
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
        getAllCampaignTypes();
      } catch (error) {
        Swal.fire({
          title:
            error?.response?.data?.message ||
            error?.response?.data?.errors?.Name?.[0] ||
            error?.response?.data?.result?.message ||
            "Error Deleting Campaign Type",
          text: handleMessageError(error),
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddManageCampaignType = () => {
    setManageAddCampaignType(true);
  };

  const handleEditManageCampaignType = (campaignType) => {
    setSelectedCampaignType(campaignType);
    setManageEditCampaignType(true);
  };

  const handleFilterReset = () => {
    setSearch("");
    setSearchQuery("");
    setPaginationModel({ pageSize: 10, page: 0 });
  };

  const handleSearchClick = () => {
    setSearch(searchQuery); // Update the actual search state for the API
    setPaginationModel({ ...paginationModel, page: 0 }); // Reset pagination if needed
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
                  onClick={handleAddManageCampaignType}
                  startIcon={<Add />}
                >
                  Add Campaign Type
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
                          <Tooltip title="Edit Campaign Type">
                            <IconButton
                              onClick={() =>
                                handleEditManageCampaignType(params?.row)
                              }
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Campaign Type">
                            <IconButton
                              onClick={() => deleteCampaignType(params?.row)}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ),
                    },
                  ]}
                  data={campaignTypes}
                  loading={loading}
                  paginationModel={paginationModel}
                  setPaginationModel={setPaginationModel}
                  totalRows={totalRows}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {manageAddCampaignType && (
          <MuiModal
            title="Add Campaign Type"
            open={manageAddCampaignType}
            width="500px"
            handleClose={() => setManageAddCampaignType(false)}
          >
            <ManageType
              type="add"
              loading={loading}
              setLoading={setLoading}
              setManageAddCampaignType={setManageAddCampaignType}
              getAllCampaignTypes={getAllCampaignTypes}
            />
          </MuiModal>
        )}

        {manageEditCampaignType && (
          <MuiModal
            title="Edit Campaign Type"
            open={manageEditCampaignType}
            width="500px"
            handleClose={() => setManageEditCampaignType(false)}
          >
            <ManageType
              type="edit"
              loading={loading}
              setLoading={setLoading}
              setManageEditCampaignType={setManageEditCampaignType}
              getAllCampaignTypes={getAllCampaignTypes}
              selectedCampaignType={selectedCampaignType}
              setSelectedCampaignType={setSelectedCampaignType}
            />
          </MuiModal>
        )}
      </Box>
    </>
  );
}

export default withTranslation("translations")(CampaignType);
