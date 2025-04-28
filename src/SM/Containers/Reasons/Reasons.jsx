import { Add, Delete, Edit } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  ADD_REASON,
  DELETE_REASON,
  GET_ALL_REASON,
  UPDATE_REASON,
} from "../../../APIs/ReasonsApi";
import { GET_ALL_REASON_TYPES } from "../../../APIs/ReasonsTypes";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import ManageReason from "./ManageReason";
import GetActions from "../../Utils/GetActions";

function Reasons({ t }) {
  const [data, setData] = useState([]);
  const [reasonTypes, setReasonTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [manageAddReason, setManageAddReason] = useState(false);
  const [manageEditReason, setManageEditReason] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const { showSnackbar } = useSnackbar();

  const handleFilterReset = () => {
    setType("");
    setDescription("");
    setPaginationModel({ pageSize: 10, page: 0 });
  };

  const handleFilterSearch = () => {
    setPaginationModel({
      pageSize: 10,
      page: 0,
    });
  };

  useEffect(() => {
    fetchReasons();
  }, [paginationModel]);

  const loadReasonTypesOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_ALL_REASON_TYPES({
        pageIndex: page,
        pageSize: 10,
      });

      if (!response.status == "200") {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 10 + response?.data?.data?.items?.length <
        response?.data?.data?.totalRows;

      setReasonTypes(response?.data?.data?.items);
      return {
        options: response?.data?.data?.items?.map((item) => ({
          value: item?.recordGuid,
          label: item?.reasonTypeDetails[0]?.name,
        })),
        hasMore,
        additional: {
          page: page + 1,
        },
      };
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      return { options: [], hasMore: false }; // Return empty options and mark as no more data
    }
  };

  const fetchReasons = async () => {
    setLoading(true);
    try {
      const response = await GET_ALL_REASON({
        pageSize: paginationModel.pageSize,
        pageNumber: paginationModel.page + 1,
        Description: description || null,
        ReasonTypeTag: type?.label || null,
      });
      setData(response?.data?.data?.items || []);
      setTotalRows(response?.data?.data?.totalRows);
    } catch (error) {
      showSnackbar("Failed to fetch reasons", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (reason) => {
    setLoading(true);
    try {
      const response = await ADD_REASON(reason);
      if (response?.data?.success) {
        showSnackbar("Reason added successfully!", "success");
        fetchReasons();
        setManageAddReason(false);
      } else {
        setManageAddReason(true);
        showSnackbar("Failed to add reason", "error");
      }
    } catch (error) {
      showSnackbar("Failed to add reason", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (recordGuid, reason) => {
    setLoading(true);
    try {
      const response = await UPDATE_REASON({
        ...reason,
        RecordGuid: recordGuid,
      });
      if (response?.data?.success) {
        showSnackbar("Reason updated successfully!", "success");
        fetchReasons();
        setManageEditReason(false);
      } else {
        setManageEditReason(true);
        showSnackbar("Failed to update reason", "error");
      }
    } catch (error) {
      showSnackbar("Failed to update reason", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordGuid) => {
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await DELETE_REASON(recordGuid);
        if (response?.data?.success) {
          showSnackbar("Reason deleted successfully", "success");
          fetchReasons();
        }
      } catch (error) {
        showSnackbar("Failed to delete reason", "error");
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
              <Typography className="BreadcrumbsPage">Reasons</Typography>
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
              onClick={() => setManageAddReason(true)}
              startIcon={<Add />}
            >
              {t("Add Reason")}
            </Button>
            <Button
              className="mui-btn secondary filled"
              id="send-service-provider-id"
              onClick={() => setShowAdvanceSearch(!showAdvanceSearch)}
            >
              <FilterAltIcon fontSize="small" />
            </Button>
          </Grid>
        </Grid>
        {showAdvanceSearch && (
          <Grid item xs={12}>
            <AdvancedSearch
              showAdvanceSearch={showAdvanceSearch}
              handleFilterReset={handleFilterReset}
              handleFilterSearch={handleFilterSearch}
              setShowAdvanceSearch={setShowAdvanceSearch}
              body={
                <>
                  <Grid item xs={6} marginTop={1}>
                    <FormControl fullWidth variant="standard">
                      {type != "" && type != undefined ? (
                        <InputLabel sx={{ fontSize: "12px", top: "-30px" }}>
                          Reason Type
                        </InputLabel>
                      ) : (
                        <InputLabel sx={{ marginTop: "10px" }} />
                      )}
                      <AsyncPaginate
                        id="async-menu-style"
                        value={type}
                        loadOptions={loadReasonTypesOptions}
                        onChange={(value) => setType(value)}
                        additional={{
                          page: 1,
                        }}
                        placeholder={"Reason Type"}
                        classNamePrefix="react-select"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl variant="standard" fullWidth>
                      <TextField
                        key={"description"}
                        fullWidth
                        id={"description"}
                        name={"description"}
                        label={"Description"}
                        variant="standard"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e?.target?.value)}
                      />
                    </FormControl>
                  </Grid>
                </>
              }
            />
          </Grid>
        )}
        <Grid item xs={12} marginTop={2}>
          <Card className="kpi-card">
            <MuiTable
              rowId="recordGuid"
              columns={[
                {
                  field: "reasonTypeTag",
                  headerName: t("Reason Type"),
                  flex: 1,
                  minWidth: 200,
                  renderCell: (params) => params.row.reasonTypeTag || "",
                },
                {
                  field: "reasonDetails",
                  headerName: t("Description"),
                  flex: 1,
                  minWidth: 200,
                  renderCell: (params) =>
                    params.row.reasonDetails[0]?.description || "",
                },
                {
                  field: "actions",
                  headerName: t("Actions"),
                  flex: 1,
                  renderCell: (params) => (
                    <>
                      <Tooltip title={t("Edit Reason")}>
                        <IconButton
                          onClick={() => {
                            setSelectedReason(params.row);
                            setManageEditReason(true);
                          }}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("Delete Reason")}>
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

      {manageAddReason && (
        <MuiModal
          title={t("Add Reason")}
          open={manageAddReason}
          width="500px"
          handleClose={() => setManageAddReason(false)}
        >
          <ManageReason
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAddReason={setManageAddReason}
            loadReasonTypesOptions={loadReasonTypesOptions}
            onADD={handleAdd}
            reasonTypes={reasonTypes}
          />
        </MuiModal>
      )}

      {manageEditReason && (
        <MuiModal
          title={t("Edit Reason")}
          open={manageEditReason}
          width="500px"
          handleClose={() => setManageEditReason(false)}
        >
          <ManageReason
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageEditReason={setManageEditReason}
            loadReasonTypesOptions={loadReasonTypesOptions}
            selectedReason={selectedReason}
            onEdit={(data) => handleUpdate(selectedReason?.recordGuid, data)}
            reasonTypes={reasonTypes}
          />
        </MuiModal>
      )}
    </Box>
  );
}

export default withTranslation("translations")(GetActions(Reasons));
