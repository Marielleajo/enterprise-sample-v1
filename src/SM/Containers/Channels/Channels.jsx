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
import { DELETE_CHANNEL, GET_ALL_CHANNELS } from "../../../APIs/Channels";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import ManageChannels from "./ManageChannels";
import GetActions from "../../Utils/GetActions";

function Channels({ t }) {
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [manageChannelOpen, setManageChannelOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const { showSnackbar } = useSnackbar();

  const fetchChannels = async () => {
    setLoading(true);
    try {
      setChannels([]);
      const response = await GET_ALL_CHANNELS({
        pageSize: paginationModel.pageSize,
        pageNumber: paginationModel.page + 1,
      });
      const items = response?.data?.data?.channels;
      setChannels(items);
      setTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (error) {
      showSnackbar(handleMessageError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChannel = async (channelGuid) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await DELETE_CHANNEL(channelGuid);
        showSnackbar("Channel deleted successfully", "success");
        fetchChannels();
      } catch (error) {
        showSnackbar("Failed to delete channel", "error");
      }
    }
  };

  const openManageChannel = (channel = null) => {
    setSelectedChannel(channel);
    setManageChannelOpen(true);
  };

  useEffect(() => {
    fetchChannels();
  }, [paginationModel]);

  return (
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
                <Typography className="BreadcrumbsPage">Channels</Typography>
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
                onClick={() => openManageChannel()}
                startIcon={<Add />}
              >
                Add Channel
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
                    field: "languageCode",
                    headerName: "Language",
                    flex: 1,
                    minWidth: 120,
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
                        <Tooltip title="Edit Channel">
                          <IconButton
                            onClick={() => openManageChannel(params?.row)}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Channel">
                          <IconButton
                            onClick={() =>
                              handleDeleteChannel(params?.row?.recordGuid)
                            }
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ),
                  },
                ]}
                data={channels}
                loading={loading}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                totalRows={totalRows}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {manageChannelOpen && (
        <MuiModal
          title={selectedChannel ? "Edit Channel" : "Add Channel"}
          open={manageChannelOpen}
          width="500px"
          handleClose={() => setManageChannelOpen(false)}
        >
          <ManageChannels
            type={selectedChannel ? "edit" : "add"}
            selectedChannel={selectedChannel}
            setLoading={setLoading}
            fetchChannels={fetchChannels}
            handleClose={() => setManageChannelOpen(false)}
          />
        </MuiModal>
      )}
    </Box>
  );
}

export default withTranslation("translations")(GetActions(Channels));
