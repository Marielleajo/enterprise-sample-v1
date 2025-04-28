import {
  Grid,
  IconButton,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import MuiTable from "../../../Components/MuiTable/MuiTable";
import {
  GET_CLIENT_BUNDLE_MODE,
  GET_CLIENT_ELIGIBLE_BUNDLE,
  GET_SUBSCRIBED_CLIENT,
  SUBSCRIBE_CLIENT_TO_BUNDLE,
} from "../../../APIs/Clients";
import swalGeneralFunction from "../../../Components/swalGeneralFunction";
import { useSnackbar } from "../../../Contexts/SnackbarContext";

const SubscriptionClient = ({
  data,
  isLoading,
  selectedClient,
  SetLoading,
  setClientSubscriptions,
  totalRows,
  paginationModel,
  setPaginationModel,
}) => {
  const [subscribed, setSubscribed] = useState(false);
  const [bundleMode, setBundleMode] = useState("");
  const [maxFreeSubscriptions, setMaxFreeSubscriptions] = useState();
  const [bundleType, setBundleType] = useState("");

  const { showSnackbar } = useSnackbar();
  const checkIfSubscribed = async () => {
    try {
      let response = await GET_SUBSCRIBED_CLIENT({
        ClientGuid: selectedClient.recordGuid,
      });

      if (response?.data?.data?.items.length > 0) {
        setSubscribed(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBundleMode = async () => {
    try {
      let response = await GET_CLIENT_BUNDLE_MODE({
        ClientGuid: selectedClient.recordGuid,
      });

      if (response?.data?.success) {
        setBundleMode(
          response?.data?.data?.activeSubscriptions[0]?.subscriptionType
        );
        setBundleType(response?.data?.data?.activeSubscriptions[0]?.bundleType);
        setMaxFreeSubscriptions(response?.data?.data?.freeBundleCount);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubscribeToBundle = async ({
    bundleType,
    selectedClient,
    bundleRecordGuid,
  }) => {
    let result = await swalGeneralFunction(
      "Are you sure you want to subscribe to this bundle ?"
    );
    if (result.isConfirmed) {
      SetLoading(true);
      try {
        let response = await SUBSCRIBE_CLIENT_TO_BUNDLE({
          bundleType: bundleType,
          selectedClient: selectedClient.recordGuid,
          bundleRecordGuid: bundleRecordGuid,
        });
        if (response?.data.success) {
          if (response?.data?.data?.noFreeBundle && bundleType == "free") {
            showSnackbar(response?.data?.data?.message, "error");
            return;
          }
          showSnackbar(response?.data?.data?.message);
          let updatedBundle = data.map((item) => {
            if (item.recordGuid === bundleRecordGuid) {
              return { ...item, isSubscribed: true };
            }
            return { ...item, isSubscribed: false };
          });
          updatedBundle.sort(
            (a, b) => (b.isSubscribed === true) - (a.isSubscribed === true)
          );
          setClientSubscriptions(updatedBundle);
          setSubscribed(true);
        } else {
          showSnackbar("Something went wrong", "error");
        }
        SetLoading(false);
      } catch (error) {
        SetLoading(false);
        showSnackbar("Something went wrong", "error");
      } finally {
        SetLoading(false);
      }
    }
  };

  useEffect(() => {
    checkIfSubscribed();
    getBundleMode();
  }, [selectedClient]);
  return (
    <Box sx={{ width: "100%" }}>
      <Grid item xs={12} marginTop={2}>
        <MuiTable
          rowId="recordGuid"
          columns={[
            {
              field: "name",
              headerName: "Name",
              width: 200,
              renderCell: (params) => {
                return params?.row?.name;
              },
            },
            {
              field: "description",
              headerName: "Description",
              width: 200,
            },
            {
              field: "isSubscribed",
              headerName: "Subscribed",
              width: 200,
              renderCell: (params) => {
                return (
                  <Typography
                    style={{
                      color:
                        params?.row?.isSubscribed === true ? "green" : "red",
                    }}
                  >
                    {params?.row?.isSubscribed === true
                      ? "Subscribed"
                      : "Not Subscribed"}
                  </Typography>
                );
              },
            },
            {
              field: "bundleType",
              headerName: "Bundle Type",
              width: 200,
              renderCell: (params) => {
                return params?.row?.bundleType;
              },
            },
            {
              field: "services",
              headerName: "Services",
              width: 220,
              renderCell: (params) => {
                const serviceName = params?.row?.services
                  ?.map((item) => item?.serviceDetails[0]?.name)
                  .join(", ");

                return (
                  <Tooltip title={serviceName} arrow>
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                      }}
                    >
                      {serviceName}
                    </div>
                  </Tooltip>
                );
              },
            },

            {
              field: "price",
              headerName: "Price",
              width: 200,
              renderCell: (params) => {
                return params?.row?.price == null ? 0 : params?.row?.price;
              },
            },

            {
              field: "actions",
              headerName: "Actions",
              width: 200,
              renderCell: (params) => {
                return (
                  <Tooltip
                    title="Subscribes"
                    sx={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "left",
                      width: "100%",
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        if (params.row.bundleType == "FREE") {
                          handleSubscribeToBundle({
                            selectedClient: selectedClient,
                            bundleType: "free",
                            bundleRecordGuid: params.row.recordGuid,
                          });
                        } else {
                          handleSubscribeToBundle({
                            selectedClient: selectedClient,
                            bundleType: "paid",
                            bundleRecordGuid: params.row.recordGuid,
                          });
                        }
                      }}
                      disabled={
                        params.row.bundleType == "FREE"
                          ? subscribed &&
                            bundleMode !== "VIEW_ONLY" &&
                            maxFreeSubscriptions > 0
                          : subscribed &&
                            bundleMode !== "VIEW_ONLY" &&
                            bundleType !== "FREE"
                      }
                      size="small"
                      id="editConfig"
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold" }}
                        fontSize={"small"}
                        className="secondary grey"
                      >
                        Subscribe
                      </Typography>
                    </IconButton>
                  </Tooltip>
                );
              },
            },
          ]}
          data={data}
          loading={isLoading}
          setPaginationModel={setPaginationModel}
          paginationModel={paginationModel}
          totalRows={totalRows}
        />
      </Grid>
    </Box>
  );
};

export default SubscriptionClient;
