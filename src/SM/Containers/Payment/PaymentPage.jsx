import React, { useEffect, useState } from "react";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import {
  GET_ALL_RESELLER_API,
  UPDATE_BALANCE_CLIENT,
} from "../../../APIs/Postpaid";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { GET_ALL_CLIENTS } from "../../../APIs/Prepaid";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GetActions from "../../Utils/GetActions";
import MuiCheckbox from "../../../Components/MuiCheckbox";

const PaymentPage = () => {
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [showOther, setShowOther] = useState(false);
  const [showFilter, setShowFilter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const { showSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [showEdit, setShowEdit] = useState(false);
  const [balanceData, setBalanceData] = useState({
    maxBalanceLimit: 0,
    thresholdType: null,
    thresholdValue: 0,
    // unlimitedBalance: false,
  });

  const resetFilters = () => {
    setSelectedReseller(null);
  };

  // get reseller accounts
  const getAllAccounts = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_CLIENTS({
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        ParentGuid: selectedReseller?.value,
        ParentIncluded: true,
      });

      const data = response?.data?.data?.accounts ?? [];
      setData(data);
      setSelectedAccount(data?.find((item) => item?.isPrimary));
      setBalanceData({
        maxBalanceLimit: Number(data[0]?.balanceLimit),
        thresholdValue: Number(data[0]?.threshold),
        // unlimitedBalance: Number(data[0]?.balanceLimit) === -1,
      });
      setTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setBalanceData({
      maxBalanceLimit: selectedAccount?.balanceLimit,
      thresholdValue: selectedAccount?.threshold,
      // unlimitedBalance: false,
    });
    setShowEdit(false);
  };

  const handleSave = async () => {
    setAddLoading(true);
    try {
      const payload = {
        NewBalanceLimit: Number(balanceData?.maxBalanceLimit),
        ClientAccountGuid: selectedAccount?.recordGuid,
        Threshold: Number(balanceData?.thresholdValue),
      };
      let response = await UPDATE_BALANCE_CLIENT({ postData: payload });
      if (response?.data?.success) {
        showSnackbar(response?.data?.message, "success");
        setBalanceData({
          maxBalanceLimit: balanceData?.maxBalanceLimit,
          thresholdValue: balanceData?.thresholdValue,
          // unlimitedBalance: balanceData?.unlimitedBalance,
        });
        // update the data list
        // Update the data list with new balance values
        setData((prevData) =>
          prevData.map((acc) =>
            acc.recordGuid === selectedAccount.recordGuid
              ? {
                  ...acc,
                  balanceLimit: balanceData?.maxBalanceLimit,
                  threshold: balanceData?.thresholdValue,
                }
              : acc
          )
        );

        setShowEdit(false);
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setAddLoading(false);
    }
  };

  useEffect(() => {
    if (selectedReseller) {
      getAllAccounts();
    }
  }, [selectedReseller]);

  useEffect(() => {
    setBalanceData({
      maxBalanceLimit: selectedAccount?.balanceLimit,
      thresholdValue: selectedAccount?.threshold,
      // unlimitedBalance: selectedAccount?.balanceLimit === -1,
    });
  }, [selectedAccount]);

  return (
    <Box className="page_container" sx={{ p: 0 }}>
      <Box
        className="section_container scroll"
        mt={2}
        gap={2}
        sx={{ px: "1rem !important" }}
      >
        <>
          {" "}
          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <Box sx={{ width: "100%" }} mt={1}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <CustomAsyncPaginate
                      value={selectedReseller}
                      onChange={(value) => {
                        setSelectedReseller(value);
                      }}
                      placeholder="Select Reseller"
                      label="Reseller"
                      apiFunction={GET_ALL_RESELLER_API}
                      dataPath={"data.data.clients"}
                      params={{ TypeTag: "RESELLER", StatusTag: "APPROVED" }}
                      customLabel={(item) => `${item.firstName} - ${item.name}`}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
          {selectedReseller && (
            <>
              {!loading ? (
                <Grid container spacing={3} mt={1}>
                  {selectedAccount ? (
                    <>
                      {/* Select Account Section */}
                      <Grid item xs={12} md={6} sx={{ height: "100%" }}>
                        <Card sx={{ p: 2 }}>
                          <Typography variant="h6" fontWeight="bold" mb={4}>
                            <ApartmentIcon sx={{ pl: 1 }} /> Select Account
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                            }}
                          >
                            {data?.map((item, index) => {
                              return (
                                <Card
                                  key={index}
                                  variant="outlined"
                                  sx={{
                                    p: 2,
                                    borderColor:
                                      selectedAccount?.recordGuid ===
                                      item?.recordGuid
                                        ? "#1976D2"
                                        : "",
                                    borderRadius: 2,
                                    position: "relative",
                                    "&:hover": { boxShadow: 3 },
                                  }}
                                  onClick={() => {
                                    setSelectedAccount(item);
                                    setShowEdit(false);
                                  }}
                                >
                                  <Typography fontWeight="bold">
                                    {item?.accountNumber}
                                  </Typography>
                                  <Typography color="text.secondary">
                                    Balance: {item?.currentBalance}
                                    {" " + item?.currencyCode} -{" "}
                                    {item?.accountTypeTag}
                                  </Typography>

                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: 10,
                                      right: 10,
                                      backgroundColor:
                                        item?.accountStatusTag !== "ACTIVE"
                                          ? "gold"
                                          : "lightgreen",
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography fontSize="0.75rem">
                                      {!item?.accountStatusTag
                                        ? "Not Active"
                                        : item?.accountStatusTag !== "ACTIVE"
                                        ? item?.accountStatusTag
                                        : "Active"}{" "}
                                    </Typography>
                                  </Box>
                                  {item?.isPrimary && (
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        bottom: 10,
                                        right: 10,
                                        backgroundColor: "green",
                                        color: "white",
                                        cursor: "pointer",
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1,
                                      }}
                                    >
                                      <Typography fontSize="0.75rem">
                                        Primary
                                      </Typography>
                                    </Box>
                                  )}
                                </Card>
                              );
                            })}
                          </Box>
                        </Card>
                      </Grid>
                      {selectedAccount?.accountTypeTag?.toLowerCase() ===
                        "postpaid" && (
                        <>
                          {/* Balance Limits Section */}
                          <Grid item xs={12} md={6}>
                            <Card sx={{ p: 2 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  py: 1,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  fontWeight="bold"
                                  mb={2}
                                  px={2}
                                >
                                  Balance Limits
                                </Typography>
                                {!showEdit &&
                                  selectedAccount?.accountTypeTag?.toLowerCase() ===
                                    "postpaid" && (
                                    <Button
                                      variant="contained"
                                      className="mui-btn primary filled"
                                      onClick={() => {
                                        setShowEdit(true);
                                      }}
                                    >
                                      Edit Limit
                                    </Button>
                                  )}
                              </Box>
                              <CardContent>
                                {showEdit ? (
                                  <>
                                    {" "}
                                    <TextField
                                      key="balanceLimit"
                                      fullWidth
                                      id="balanceLimit"
                                      name="balanceLimit"
                                      label="Max Balance Limit"
                                      variant="standard"
                                      type="number"
                                      value={balanceData?.maxBalanceLimit ?? ""}
                                      onChange={({ target }) => {
                                        setBalanceData((prev) => ({
                                          ...prev,
                                          maxBalanceLimit:
                                            target.value === ""
                                              ? ""
                                              : Number(target.value),
                                        }));
                                      }}
                                      onKeyDown={(e) => {
                                        // Prevent typing 'e', 'E', '+', '-', or '.'
                                        if (["e", "E", "+"].includes(e.key)) {
                                          e.preventDefault();
                                        }
                                      }}
                                      // InputProps={{
                                      //   startAdornment: (
                                      //     <Typography>$</Typography>
                                      //   ),
                                      // }}
                                      disabled={!showEdit}
                                      sx={{ mb: 2 }}
                                    />
                                    <TextField
                                      key="thresholdValue"
                                      fullWidth
                                      id="thresholdValue"
                                      name="thresholdValue"
                                      label="Threshold Value"
                                      variant="standard"
                                      type="number"
                                      value={balanceData?.thresholdValue ?? ""}
                                      onChange={({ target }) => {
                                        const value = target.value;
                                        if (value > 100) {
                                          return;
                                        }
                                        setBalanceData((prev) => ({
                                          ...prev,
                                          thresholdValue:
                                            target.value === ""
                                              ? ""
                                              : Number(target.value),
                                        }));
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          ["e", "E", "+", "-"].includes(e.key)
                                        ) {
                                          e.preventDefault();
                                        }
                                      }}
                                      InputProps={{
                                        startAdornment: (
                                          <Typography>%</Typography>
                                        ),
                                      }}
                                      disabled={!showEdit}
                                      sx={{ mb: 2 }}
                                    />
                                    {/* <FormControlLabel
                                      control={
                                        <MuiCheckbox
                                          // id={item?.recordGuid}
                                          onChange={(e) => {
                                            setBalanceData((prev) => ({
                                              ...prev,
                                              maxBalanceLimit: e.target?.checked
                                                ? -1
                                                : balanceData?.maxBalanceLimit,
                                              unlimitedBalance:
                                                e.target?.checked,
                                            }));
                                          }}
                                          checked={
                                            balanceData?.unlimitedBalance
                                          }
                                        />
                                      }
                                      label={"Unlimited Balance"}
                                    /> */}
                                  </>
                                ) : (
                                  <Grid container spacing={2} rowSpacing={3}>
                                    <Grid item xs={12}>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          mt: "-1rem",
                                        }}
                                      >
                                        <Typography>Current Balance</Typography>
                                        <Typography fontWeight={"bold"}>
                                          {selectedAccount?.currentBalance ? (
                                            <>
                                              {selectedAccount.currentBalance}{" "}
                                              {selectedAccount.currencyCode}
                                            </>
                                          ) : (
                                            "--"
                                          )}
                                        </Typography>
                                      </Box>
                                      <Divider
                                        sx={{
                                          height: "2px",
                                          backgroundColor: "#dbdbdb",
                                          mt: 1,
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <Typography>Balance Limit</Typography>
                                        <Typography fontWeight={"bold"}>
                                          {balanceData?.maxBalanceLimit ??
                                            "Not set"}
                                        </Typography>
                                      </Box>
                                      <Divider
                                        sx={{
                                          height: "2px",
                                          backgroundColor: "#dbdbdb",
                                          mt: 1,
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <Typography>Threshold</Typography>
                                        <Typography fontWeight={"bold"}>
                                          {balanceData?.thresholdValue ??
                                            "Not set"}
                                        </Typography>
                                      </Box>
                                      <Divider
                                        sx={{
                                          height: "2px",
                                          backgroundColor: "#dbdbdb",
                                          mt: 1,
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <Typography>
                                          Available Credits
                                        </Typography>
                                        <Typography fontWeight={"bold"}>
                                          {selectedAccount?.availableCredits ??
                                            "Not available"}
                                        </Typography>
                                      </Box>
                                      <Divider
                                        sx={{
                                          height: "2px",
                                          backgroundColor: "#dbdbdb",
                                          mt: 1,
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                )}
                              </CardContent>
                              {showEdit && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 2,
                                    p: 2,
                                  }}
                                >
                                  <Button
                                    className="mui-btn primary outlined"
                                    onClick={handleCancel}
                                    disabled={addLoading}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    className="mui-btn primary filled"
                                    onClick={handleSave}
                                    disabled={addLoading}
                                  >
                                    Save Changes
                                  </Button>
                                </Box>
                              )}
                            </Card>
                          </Grid>
                        </>
                      )}
                    </>
                  ) : (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="h5" color="#ccc" mt={2}>
                          This Reseller Doesn&apos;t Have Any Account
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Box className="Loader">
                  <CircularProgress />
                </Box>
              )}
            </>
          )}
        </>
      </Box>
    </Box>
  );
};

export default GetActions(PaymentPage);
