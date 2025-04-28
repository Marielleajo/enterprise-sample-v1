import {
  Grid,
  IconButton,
  FormControlLabel,
  Switch,
  Box,
  Typography,
} from "@mui/material";
import React from "react";

import MuiTable from "../../../Components/MuiTable/MuiTable";

const ClientAccounts = ({ data }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Grid item xs={12} marginTop={2}>
        <MuiTable
          rowId="recordGuid"
          columns={[
            {
              field: "accountNumber",
              headerName: "Account ID",
              width: 200,
              renderCell: (params) => {
                return params?.row?.accountNumber;
              },
            },
            {
              field: "accountTypeTag",
              headerName: "Account Type",
              width: 150,
              renderCell: (params) => {
                return params?.row?.accountTypeTag;
              },
            },
            {
              field: "accountStatusTag",
              headerName: "Status",
              width: 150,
              renderCell: (params) => {
                return (
                  <Typography
                    style={{
                      color:
                        params?.row?.accountStatusTag === "ACTIVE"
                          ? "green"
                          : "red",
                    }}
                  >
                    {params?.row?.accountStatusTag === "ACTIVE"
                      ? "Active"
                      : "Inactive"}
                  </Typography>
                );
              },
            },
            {
              field: "currentBalance",
              headerName: "Balance",
              width: 150,
              renderCell: (params) => {
                return params?.row?.currentBalance?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "EUR", // Assuming EUR as currency, change if needed
                });
              },
            },
            {
              field: "createdDate",
              headerName: "Date Created",
              width: 200,
              renderCell: (params) => {
                return new Date(params?.row?.createdDate).toDateString();
              },
            },
            {
              field: "lastUpdatedDate",
              headerName: "Last Activity Date",
              width: 200,
              renderCell: (params) => {
                return params?.row?.lastUpdatedDate
                  ? new Date(params?.row?.lastUpdatedDate).toDateString()
                  : "N/A";
              },
            },
          ]}
          data={data}
          loading={false} // Adjust according to loading state if required
          //   setPaginationModel={() => {}} // Define pagination if needed
          //   paginationModel={{}} // Adjust pagination model if needed
          //   totalRows={data?.length || 0}
        />
      </Grid>
    </Box>
  );
};

export default ClientAccounts;
