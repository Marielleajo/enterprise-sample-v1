import React, { useEffect, useState } from "react";
import { Add, Edit, Delete } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Grid,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import {
  GET_ALL_REASON_TYPES,
  ADD_REASON_TYPE,
  UPDATE_REASON_TYPE,
  DELETE_REASON_TYPE,
} from "../../../APIs/ReasonsTypes";
import ManageReasonsTypes from "./ManageReasonsTypes";
import { withTranslation } from "react-i18next";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import GetActions from "../../Utils/GetActions";

function ReasonTypes({ t }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [manageAddReasonType, setManageAddReasonType] = useState(false);
  const [manageEditReasonType, setManageEditReasonType] = useState(false);
  const [selectedReasonType, setSelectedReasonType] = useState(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchReasonTypes();
  }, [paginationModel]);

  const fetchReasonTypes = async () => {
    setLoading(true);
    try {
      const response = await GET_ALL_REASON_TYPES({
        pageSize: paginationModel.pageSize,
        pageNumber: paginationModel.page + 1,
      });
      setData(response.data.data.items);
      setTotalRows(response.data.data.totalRows);
    } catch (error) {
      showSnackbar("Failed to fetch reason types", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (reasonType) => {
    setLoading(true);
    try {
      const response = await ADD_REASON_TYPE(reasonType);
      if (response.data.success) {
        showSnackbar("Reason type added successfully!", "success");
        fetchReasonTypes();
        setManageAddReasonType(false);
      } else {
        setManageAddReasonType(true);
        showSnackbar("Failed to add reason type", "error");
      }
    } catch (error) {
      showSnackbar("Failed to add reason type", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (recordGuid, reasonType) => {
    setLoading(true);
    try {
      const response = await UPDATE_REASON_TYPE(recordGuid, reasonType);
      if (response.success) {
        showSnackbar("Reason type updated successfully!", "success");
        fetchReasonTypes();
        setManageAddReasonType(false);
      } else {
        setManageAddReasonType(true);
        showSnackbar("Failed to update reason type", "error");
      }
      setManageEditReasonType(false);
    } catch (error) {
      showSnackbar("Failed to update reason type", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordGuid) => {
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      setLoading(true);
      try {
        await DELETE_REASON_TYPE(recordGuid);
        showSnackbar("Reason type deleted successfully", "success");
        fetchReasonTypes();
      } catch (error) {
        showSnackbar("Failed to delete reason type", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box className="page_container">
      <Grid item xs={12} className="sub_section_container">
        <Grid
          className="pt-4"
          container
          display={"flex"}
          justifyContent={"start"}
          alignItems={"center"}
        >
          <Grid item xs={12} md={4}>
            <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
              <Typography className="BreadcrumbsPage">Reason Type</Typography>
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
              onClick={() => setManageAddReasonType(true)}
              startIcon={<Add />}
            >
              {t("Add Reason Type")}
            </Button>
          </Grid>

          <Grid item xs={12} marginTop={2}>
            <Card className="kpi-card">
              <MuiTable
                rowId="recordGuid"
                columns={[
                  {
                    field: "reasonTypeDetails[0].name",
                    headerName: t("Name"),
                    flex: 1,
                    minWidth: 200,
                    renderCell: (params) =>
                      params.row.reasonTypeDetails[0].name || "",
                  },
                  {
                    field: "reasonTypeDetails[0].description",
                    headerName: t("Description"),
                    flex: 1,
                    minWidth: 200,
                    renderCell: (params) =>
                      params.row.reasonTypeDetails[0].description || "",
                  },
                  {
                    field: "actions",
                    headerName: t("Actions"),
                    flex: 1,
                    renderCell: (params) => (
                      <>
                        <Tooltip title={t("Edit ReasonType")}>
                          <IconButton
                            onClick={() => {
                              setSelectedReasonType(params.row);
                              setManageEditReasonType(true);
                            }}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t("Delete ReasonType")}>
                          <IconButton
                            onClick={() => handleDelete(params.row.recordGuid)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </>
                    ),
                  },
                ]}
                data={data}
                loading={loading}
                setPaginationModel={setPaginationModel}
                paginationModel={paginationModel}
                totalRows={totalRows}
              />
            </Card>
          </Grid>
        </Grid>

        {manageAddReasonType && (
          <MuiModal
            title={t("Add Reason Type")}
            open={manageAddReasonType}
            width="500px"
            handleClose={() => setManageAddReasonType(false)}
          >
            <ManageReasonsTypes
              type="add"
              loading={loading}
              setLoading={setLoading}
              setManageAddReasonType={setManageAddReasonType}
              getAllReasonTypes={fetchReasonTypes}
              onADD={handleAdd}
            />
          </MuiModal>
        )}

        {manageEditReasonType && (
          <MuiModal
            title={t("Edit Reason Type")}
            open={manageEditReasonType}
            width="500px"
            handleClose={() => setManageEditReasonType(false)}
          >
            <ManageReasonsTypes
              type="edit"
              loading={loading}
              setLoading={setLoading}
              setManageEditReasonType={setManageEditReasonType}
              getAllReasonTypes={fetchReasonTypes}
              selectedReasonType={selectedReasonType}
              onEdit={(data) =>
                handleUpdate(selectedReasonType.recordGuid, data)
              }
            />
          </MuiModal>
        )}
      </Grid>
    </Box>
  );
}

export default withTranslation("translations")(GetActions(ReasonTypes));
