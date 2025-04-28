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
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  DELETE_PROFIT_LOSS,
  DELETE_PROFIT_LOSS_CLIENT,
  GET_ALL_PROFIT_LOSS,
  GET_ALL_PROFIT_LOSS_CLIENT,
} from "../../../APIs/ProfitLoss";
import HandleServiceTag from "../../../Components/HanldeServiceTag";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import GetActions from "../../Utils/GetActions";
import Manage from "./Manage";
import { useLocation } from "react-router-dom";

function ProfitLoss({ t }) {
  const location = useLocation();
  const [service, setService] = useState("");
  const [serviceTag, setServiceTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [manageAdd, setManageAdd] = useState(false);
  const [manageEdit, setManageEdit] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const { services } = useSelector((state) => state.system);

  const serviceGuid = services?.find((x) => x?.tag === serviceTag)?.recordGuid;
  const channelGuid = services?.find((x) => x?.tag === serviceTag)?.channelGuid;

  useEffect(() => {
    if (location?.pathname?.split("/")[2] == undefined) {
      window.location.href = `/cost/${service}`;
    }
    setService(location?.pathname?.split("/")[2]);
    setServiceTag(HandleServiceTag(location?.pathname?.split("/")[2]));
  }, [location]);

  const handleAddMange = (data) => {
    setManageAdd(true);
    setSelectedRow(data);
  };

  const handleEditMange = (data) => {
    setSelectedRow(data);
    setManageEdit(true);
  };

  const getAllProfitLoss = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_PROFIT_LOSS({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        ServiceGuid: serviceGuid ? serviceGuid : null,
      });

      const data =
        response?.data?.data?.operationTypeProfityMarginList?.length > 0
          ? response?.data?.data?.operationTypeProfityMarginList?.map(
              (item) => ({
                ...item,
                percentageRate: item?.percentageRate,
                operationTypeTag: item?.operationTypeTag,
                realProfitPercentage: item?.realProfitPercentage,
              })
            )
          : [];
      setData(data);
      setTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const getAllProfitLossClient = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_PROFIT_LOSS_CLIENT({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        ServiceGuid: serviceGuid ? serviceGuid : null,
        ChannelGuid: channelGuid ? channelGuid : null,
      });

      const data =
        response?.data?.data?.profitMargins?.length > 0
          ? response?.data?.data?.profitMargins?.map((item) => ({
              ...item,
              percentageRate: item?.percentageRate,
              operationTypeTag: item?.operationTypeTag,
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

  const DeleteProfitLoss = async (value) => {
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const deleteResponses = await DELETE_PROFIT_LOSS({
          formData: value?.recordGuid,
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "Deleted Successfully",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error Deleting",
            text: "Unknown Error",
            icon: "error",
          });
        }
        getAllProfitLoss();
        setRowSelectionModel([]);
      } catch (e) {
        Swal.fire({
          title: "Error Updating Status",
          text: handleMessageError({ e }),
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const DeleteProfitLossClient = async (value) => {
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const deleteResponses = await DELETE_PROFIT_LOSS_CLIENT({
          formData: value?.recordGuid,
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "Deleted Successfully",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error Deleting",
            text: "Unknown Error",
            icon: "error",
          });
        }
        getAllProfitLossClient();
        setRowSelectionModel([]);
      } catch (e) {
        Swal.fire({
          title: "Error Updating Status",
          text: handleMessageError({ e }),
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (serviceGuid && channelGuid) {
      if (serviceTag === "WHATSAPP") {
        getAllProfitLoss();
      } else {
        getAllProfitLossClient();
      }
    }
  }, [serviceGuid, channelGuid, paginationModel, serviceTag]);

  return (
    <Box className="page_container">
      <Grid container columnSpacing={3} className="section_container scroll">
        <Grid item xs={12} className="sub_section_container">
          <Grid
            container
            className="pt-4"
            paddingRight={2.5}
            display={"flex"}
            justifyContent={"end"}
            alignItems={"center"}
          >
            {/* <Grid item xs={12} md={4}>
              <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                <Typography className="BreadcrumbsPage">
                  Profit & Loss
                </Typography>
                <Typography className="breadcrumbactiveBtn">
                  {service?.length < 4
                    ? service?.toUpperCase()
                    : service
                        ?.split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                </Typography>
              </Breadcrumbs>
            </Grid> */}
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
                onClick={() => handleAddMange(selectedRow)}
                startIcon={<Add />}
              >
                Add
              </Button>
            </Grid>
            <Grid item xs={12} marginTop={2}>
              {serviceTag == "WHATSAPP" && (
                <MuiTable
                  rowId="recordGuid"
                  columns={[
                    {
                      field: "percentageRate",
                      headerName: "Percentage Rate %",
                      flex: 1,
                    },
                    {
                      field: "realProfitPercentage",
                      headerName: "Real Profit Percentage %",
                      flex: 1,
                    },
                    {
                      field: "operationTypeTag",
                      headerName: "Operation Type Tag",
                      flex: 1,
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      flex: 1,
                      renderCell: (params) => {
                        return (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "left",
                              width: "100%",
                            }}
                          >
                            <Tooltip title="Edit Profit & Loss">
                              <IconButton
                                onClick={() => handleEditMange(params?.row)}
                                size="small"
                                id="editCost"
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Profit Loss">
                              <IconButton
                                onClick={() => {
                                  DeleteProfitLoss(params?.row);
                                }}
                                size="small"
                                id="deleteProfitLoss"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
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
              )}
              {serviceTag != "WHATSAPP" && (
                <MuiTable
                  rowId="recordGuid"
                  columns={[
                    {
                      field: "percentageRate",
                      headerName: "Percentage Rate %",
                      flex: 1,
                    },
                    {
                      field: "clientCategoryName",
                      headerName: "Client Category",
                      flex: 1,
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      flex: 1,
                      renderCell: (params) => {
                        return (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "left",
                              width: "100%",
                            }}
                          >
                            <Tooltip title="Edit Profit & Loss">
                              <IconButton
                                onClick={() => handleEditMange(params?.row)}
                                size="small"
                                id="editCost"
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Profit Loss">
                              <IconButton
                                onClick={() => {
                                  DeleteProfitLossClient(params?.row);
                                }}
                                size="small"
                                id="deleteProfitLoss"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
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
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {manageAdd && (
        <MuiModal
          title="Add"
          open={manageAdd}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageAdd(false)}
        >
          <Manage
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAdd={setManageAdd}
            serviceGuid={serviceGuid}
            channelGuid={channelGuid}
            getAllProfitLoss={
              serviceTag === "WHATSAPP"
                ? getAllProfitLoss
                : getAllProfitLossClient
            }
            serviceTag={serviceTag}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
          />
        </MuiModal>
      )}

      {manageEdit && (
        <MuiModal
          title="Edit"
          open={manageEdit}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageEdit(false)}
        >
          <Manage
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageAdd={setManageEdit}
            serviceGuid={serviceGuid}
            channelGuid={channelGuid}
            getAllProfitLoss={
              serviceTag === "WHATSAPP"
                ? getAllProfitLoss
                : getAllProfitLossClient
            }
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            serviceTag={serviceTag}
          />
        </MuiModal>
      )}
    </Box>
  );
}

export default withTranslation("translations")(GetActions(ProfitLoss));
