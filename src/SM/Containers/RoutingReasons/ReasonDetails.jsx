import { Add, Delete, Edit } from "@mui/icons-material";
import { Box, Button, Card, Grid, IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { DELETE_ROUTING_REASON, GET_ALL_REASONS } from "../../../APIs/Reasons";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import ManageReason from "./ManageReason";

function ReasonDetails({ ReasonTag }) {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [manageAddReason, setManageAddReason] = useState(false);
  const [manageEditReason, setManageEditReason] = useState(false);
  const [selectedReason, setSelectedReason] = useState([]);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);

  const handleAddMangeReason = () => {
    setManageAddReason(true);
  };

  const handleEditMangeReason = (data) => {
    setSelectedReason(data);
    setManageEditReason(true);
  };

  const DeleteReason = async (value) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        setLoading(true);

        // Execute all delete promises in parallel
        const deleteResponses = await DELETE_ROUTING_REASON({
          RecordGuid: value?.recordGuid,
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "Reason Deleted Successfully",
            icon: "success",
          });
        } else {
          // Handle failure, e.g., display an error message for each failed deletion
          Swal.fire({
            title: "Error Updating Status",
            text: "Unknown Error",
            icon: "error",
          });
        }

        // Refresh your data or perform any necessary actions
        getAllReasons(ReasonTag);
      } catch (e) {
        Swal.fire({
          title: "Error Updating Status",
          text: handleMessageError({ e }),
          icon: "error",
        });
      } finally {
        // Set loading back to false when the operation is complete
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getAllReasons(ReasonTag);
  }, [paginationModel]);

  const getAllReasons = async (type) => {
    setLoading(true);
    try {
      let response = await GET_ALL_REASONS({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        type,
      });
      const data =
        response?.data?.data?.criteria?.length > 0
          ? response?.data?.data?.criteria?.map((item) => ({
              ...item,
              name: item.details?.[0]?.name || "",
              description: item.details?.[0]?.description || "",
            }))
          : [];
      SetData(data);
      SetTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
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
            <Grid item xs={12} md={4}>
              {/* <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                                <Typography className="BreadcrumbsPage">
                                Reasons
                                </Typography>
                            </Breadcrumbs> */}
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
                id="send-service-country-id"
                onClick={() => handleAddMangeReason()}
                startIcon={<Add />}
              >
                Add Reason
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
                      minWidth: 100,
                    },
                    {
                      field: "description",
                      headerName: "Description",
                      flex: 1,
                      minWidth: 100,
                      renderCell: (params) => {
                        const row = params.row;
                        return `${row.description}`;
                      },
                      sortComparator: (v1, v2, cellParams1, cellParams2) => {
                        return v1?.toString().localeCompare(v2?.toString());
                      },
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      flex: 1,
                      renderCell: (params) => {
                        return (
                          <>
                            <Tooltip title="Edit Reason">
                              <IconButton
                                onClick={() =>
                                  handleEditMangeReason(params?.row)
                                }
                                size="small"
                                id="editReason"
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Reason">
                              <IconButton
                                onClick={() => DeleteReason(params?.row)}
                                size="small"
                                id="deleteReason"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </>
                        );
                      },
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

      {manageAddReason && (
        <MuiModal
          title="Add Reason"
          open={manageAddReason}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageAddReason(false)}
        >
          <ManageReason
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAddReason={setManageAddReason}
            getAllReasons={getAllReasons}
            ReasonTag={ReasonTag}
          />
        </MuiModal>
      )}

      {manageEditReason && (
        <MuiModal
          title="Edit Reason"
          open={manageEditReason}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageEditReason(false)}
        >
          <ManageReason
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageAddReason={setManageEditReason}
            getAllReasons={getAllReasons}
            selectedReason={selectedReason}
            setSelectedReason={setSelectedReason}
            ReasonTag={ReasonTag}
          />
        </MuiModal>
      )}
    </Box>
  );
}

export default withTranslation("translation")(ReasonDetails);
