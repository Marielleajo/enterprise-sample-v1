import {Box, Grid, IconButton, Tooltip} from "@mui/material";
import React, {useEffect, useState} from "react";
import MuiTable from "../../../../Components/MuiTable/MuiTable";
import {useSnackbar} from "../../../../Contexts/SnackbarContext";
import {get_DD_MM_YYYY, handleMessageError} from "../../../Utils/Functions";
import {GET_ACCOUNT_ACTIVITY_CLIENT, GET_ACCOUNT_ACTIVITY_PROVIDER,} from "../../../../APIs/Postpaid";
import {useSelector} from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function AccountActivity({
                                            selectedRow,
                                            type,
                                            setManageAccountActivity,
                                        }) {
    const [loading, setLoading] = useState(false);
    const [Data, SetData] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [totalRows, SetTotalRows] = useState(0);
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const {showSnackbar} = useSnackbar();
    const {token} = useSelector((state) => state.authentication);
    const getAllPostpaid = async () => {
        setLoading(true);
        try {
            let requestParams = {
                token,
                search: "",
                pageSize: paginationModel?.pageSize,
                pageNumber: parseInt(paginationModel?.page) + 1,
            };

            let response;
            if (type === "provider") {
                requestParams.ProviderAccountGuid = selectedRow?.recordGuid;
                response = await GET_ACCOUNT_ACTIVITY_PROVIDER(requestParams);
            } else {
                requestParams.ClientAccountGuid = selectedRow?.recordGuid;
                response = await GET_ACCOUNT_ACTIVITY_CLIENT(requestParams);
            }

            const accountHistoryKey =
                type === "provider" ? "providerAccountHistory" : "clientAccountHistory";
            const data =
                response?.data?.data?.[accountHistoryKey]?.length > 0
                    ? response?.data?.data?.[accountHistoryKey].map((item) => ({
                        ...item,
                    }))
                    : [];

            SetData(data);
            SetTotalRows(response?.data?.data?.totalRows ?? 0);
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllPostpaid();
    }, [paginationModel]);
    return (
        <Box mr={2}>
            <Grid
                item
                xs={12}
                marginTop={2}
                display={"flex"}
                justifyContent={"start"}
            >
                <IconButton
                    onClick={() => setManageAccountActivity()}
                    sx={{
                        fontSize: "20px",
                    }}
                >
                    <ArrowBackIcon/>
                </IconButton>
            </Grid>
            <MuiTable
                // rowId="recordGuid"
                columns={[
                    {
                        field: "accountNumber",
                        headerName: "Account Number",
                        flex: 1,
                    },

                    {
                        field: "description",
                        headerName: "Description",
                        width: 230,
                        renderCell: (params) => (
                            <Tooltip title={params.value || ""}>
                                <span>{params.value}</span>
                            </Tooltip>
                        ),
                    },
                    {
                        field: "lastRecharge",
                        headerName: "Last Recharge",
                        flex: 1,
                    },
                    {
                        field: "currentBalance",
                        headerName: "Current Balance",
                        flex: 1,
                    },
                    {
                        field: "previousBalance",
                        headerName: "Previous Balance",
                        flex: 1,
                    },
                    {
                        field: "lockedBalance",
                        headerName: "Locked Balance",
                        flex: 1,
                    },
                    {
                        field: "lastUpdatedDate",
                        headerName: "Date",
                        renderCell: (params) => (
                            <Tooltip title={get_DD_MM_YYYY(params.value) || ""}>
                                <span>{get_DD_MM_YYYY(params.value)}</span>
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
        </Box>
    );
}
