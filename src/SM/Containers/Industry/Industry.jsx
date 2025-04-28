import { Add, Delete, Edit } from "@mui/icons-material";
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
import { withTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { DELETE_INDUSTRY, GET_ALL_INDUSTRIES } from "../../../APIs/Industry";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import ManageIndustry from "./ManageIndustry";
import GetActions from "../../Utils/GetActions";

function Industry({ t }) {
  const [loading, setLoading] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [manageEditIndustry, setManageEditIndustry] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [manageAddIndustry, setManageAddIndustry] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    getAllIndustries();
  }, [paginationModel]);

  const getAllIndustries = async () => {
    setLoading(true);
    try {
      const response = await GET_ALL_INDUSTRIES({
        pageSize: paginationModel.pageSize,
        pageNumber: paginationModel.page + 1,
      });
      const items = response?.data?.data?.industries;
      const data = items?.map((item) => ({
        ...item,
        id: item?.recordGuid,
        name: item?.details[0]?.name || "",
        description: item?.details[0]?.description || "",
        languageCode: item?.details[0]?.languageCode || "",
      }));

      setIndustries(data);
      setTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (error) {
      showSnackbar(handleMessageError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  const DeleteIndustry = async (industry) => {
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const deleteResponse = await DELETE_INDUSTRY(industry?.id);
        if (deleteResponse?.data?.success) {
          Swal.fire({
            title: "Industry Deleted Successfully",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error Deleting Industry",
            text: "Unknown Error",
            icon: "error",
          });
        }
        getAllIndustries();
      } catch (error) {
        Swal.fire({
          title: "Error Deleting Industry",
          text: handleMessageError(error),
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddManageIndustry = () => {
    setManageAddIndustry(true);
  };

  const handleEditManageIndustry = (industry) => {
    setSelectedIndustry(industry);
    setManageEditIndustry(true);
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
              {/* <Grid item xs={12} md={4}>
                <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                  <Typography className="BreadcrumbsPage">Industry</Typography>
                </Breadcrumbs>
              </Grid> */}
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
                  onClick={handleAddManageIndustry}
                  startIcon={<Add />}
                >
                  Add Industry
                </Button>
              </Grid>

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
                      minWidth: 200,
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
                          <Tooltip title="Edit Industry">
                            <IconButton
                              onClick={() =>
                                handleEditManageIndustry(params?.row)
                              }
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Industry">
                            <IconButton
                              onClick={() => DeleteIndustry(params?.row)}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ),
                    },
                  ]}
                  data={industries}
                  loading={loading}
                  paginationModel={paginationModel}
                  setPaginationModel={setPaginationModel}
                  totalRows={totalRows}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {manageAddIndustry && (
          <MuiModal
            title="Add Industry"
            open={manageAddIndustry}
            width="500px"
            handleClose={() => setManageAddIndustry(false)}
          >
            <ManageIndustry
              type="add"
              loading={loading}
              setLoading={setLoading}
              setManageAddIndustry={setManageAddIndustry}
              setManageEditIndustry={setManageEditIndustry}
              getAllIndustries={getAllIndustries}
            />
          </MuiModal>
        )}

        {manageEditIndustry && (
          <MuiModal
            title="Edit Industry"
            open={manageEditIndustry}
            width="500px"
            handleClose={() => setManageEditIndustry(false)}
          >
            <ManageIndustry
              type="edit"
              loading={loading}
              setLoading={setLoading}
              setManageAddIndustry={setManageAddIndustry}
              setManageEditIndustry={setManageEditIndustry}
              getAllIndustries={getAllIndustries}
              selectedIndustry={selectedIndustry}
              setSelectedIndustry={setSelectedIndustry}
            />
          </MuiModal>
        )}
      </Box>
    </>
  );
}

export default withTranslation("translations")(GetActions(Industry));
