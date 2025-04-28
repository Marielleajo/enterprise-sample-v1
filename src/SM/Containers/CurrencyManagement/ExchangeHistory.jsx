import { Grid, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import {
  formatDate,
  formatDateCell,
  get_DD_MM_YYYY,
  handleMessageError,
} from "../../Utils/Functions";
import { GET_ALL_HISTORY } from "../../../APIs/CurrencyManagement";

export default function ExchangeHistory({ selectedRow, type }) {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  console.log("selectedRow ======> ", selectedRow);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const getAllExhangeHistory = async () => {
    setLoading(true);
    try {
      let requestParams = {
        CurrencyGuid: selectedRow.currencyRecordGuid,
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
      };

      let resp = await GET_ALL_HISTORY(requestParams);
      if (resp?.data?.success) {
        SetData(resp?.data?.data?.items);
        SetTotalRows(resp?.data?.data?.totalRows);
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllExhangeHistory();
  }, [paginationModel]);
  return (
    <Grid item xs={12} sx={{ width: "100%", padding: 2 }}>
      <MuiTable
        // rowId="recordGuid"
        columns={[
          {
            field: "currentRateDescription",
            headerName: "Current Rate Description",
            flex: 1,
          },
          {
            field: "currentRateInverse",
            headerName: "Current Rate Inverse",
            width: 230,
            renderCell: (params) => {
              const value = Number(params?.row?.currentRateInverse);

              const truncated = isNaN(value)
                ? "-"
                : (Math.floor(value * 100) / 100).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  });

              return (
                <Tooltip title={value} placement="top">
                  {truncated}
                </Tooltip>
              );
            },
          },
          {
            field: "currentRate",
            headerName: "Current Rate",
            flex: 1,
            renderCell: (params) => {
              const value = Number(params?.row?.currentRate);

              const truncated = isNaN(value)
                ? "-"
                : (Math.floor(value * 100) / 100).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  });

              return (
                <Tooltip title={value} placement="top">
                  {truncated}
                </Tooltip>
              );
            },
          },
          {
            field: "currencyCode",
            headerName: "Currency Code",
            flex: 1,
            // width: 150,
          },

          {
            field: "lastUpdatedDate",
            headerName: "Date",
            flex: 1,
            renderCell: (params) => (
              <Tooltip title={formatDate(params.value) || ""}>
                <span>{formatDate(params.value)}</span>
              </Tooltip>
            ),
          },
        ]}
        data={Data}
        loading={loading}
        setPaginationModel={setPaginationModel}
        paginationModel={paginationModel}
        totalRows={totalRows}
      />
    </Grid>
  );
}
