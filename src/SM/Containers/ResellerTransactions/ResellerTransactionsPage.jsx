import {ArrowBack, Close, FilterAlt} from "@mui/icons-material";
import {Box, Button, Collapse, Grid, IconButton, TextField,} from "@mui/material";
import React, {useEffect, useState} from "react";
import {GET_RECEIPTS} from "../../../APIs/ResellerTransactions";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import {get_YYYY_MM_DD_HH_MM_SS, handleMessageError,} from "../../Utils/Functions";
import GetActions from "../../Utils/GetActions";
import {withTranslation} from "react-i18next";
import OpeningModal from "../Clients/OpeningModal.jsx";

function ResellerTransactionsPage() {
    const {showSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [totalRows, setTotalRows] = useState(0);
    const [data, setData] = useState([]);
    const [reseller, setReseller] = useState(null);

    const [showFilter, setShowFilter] = useState(false);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const filterQueriesInitialValue = {
        dateFrom: "",
        dateTo: "",
        transactionId: "",
    };
    const [filterQueries, setFilterQuries] = useState(filterQueriesInitialValue);

    const applyFilter = () => {
        setFilterQuries({
            dateFrom,
            dateTo,
            transactionId,
        });
        setPaginationModel({
            pageSize: 10,
            page: 0,
        });
    };

    const resetFilters = () => {
        setDateTo(filterQueriesInitialValue.dateTo);
        setDateFrom(filterQueriesInitialValue.dateFrom);
        setTransactionId(filterQueriesInitialValue.transactionId);
        setFilterQuries(filterQueriesInitialValue);
        setPaginationModel({
            pageSize: 10,
            page: 0,
        });
    };

    const getData = async () => {
        try {
            setLoading(true);
            const response = await GET_RECEIPTS({
                ClientRecordGuid: reseller?.value,
                pageSize: paginationModel.pageSize,
                pageNumber: paginationModel.page + 1,
                ...filterQueries,
            });
            if (response?.data?.success) {
                setData(response?.data?.data?.receipts);
                setTotalRows(response.data.data.totalRows);
            }
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
        } finally {
            setLoading(false);
        }
    };

    const toggleFilterModal = () => setShowFilter(!showFilter);

    useEffect(() => {
        if (reseller) {
            getData();
        }
    }, [paginationModel, reseller, filterQueries]);

    if (!reseller) {
        return (
            <Grid
                container
                sx={{
                    height: "80vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Grid item xs={6} sx={{marginTop: "10px"}}>
                    <OpeningModal loading={loading} setSelectedReseller={setReseller} isApproved={true}/>
                </Grid>
            </Grid>
        );
    }

    return (
        <Box>
            <Box m={3} sx={{minHeight: "80vh"}}>
                <Grid container spacing={2}>
                    <Grid
                        container
                        item
                        xs={12}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <IconButton onClick={() => setReseller(null)}>
                            <ArrowBack/>
                        </IconButton>

                        {!showFilter && (
                            <Button
                                className="mui-btn primary outlined"
                                startIcon={
                                    showFilter ? (
                                        <Close fontSize="small"/>
                                    ) : (
                                        <FilterAlt fontSize="small"/>
                                    )
                                }
                                onClick={toggleFilterModal}
                            >
                                Filter
                            </Button>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Collapse in={showFilter} timeout={750}>
                            <AdvancedSearch
                                body={
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Transaction ID"
                                                value={transactionId}
                                                onChange={(e) => setTransactionId(e.target.value)}
                                                variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="From Date"
                                                type="date"
                                                InputLabelProps={{shrink: true}}
                                                value={dateFrom}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                                inputProps={{
                                                    max: new Date().toISOString().split("T")[0],
                                                }}
                                                variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="To Date"
                                                type="date"
                                                InputLabelProps={{shrink: true}}
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                                inputProps={{
                                                    min: dateFrom,
                                                    max: new Date().toISOString().split("T")[0],
                                                }}
                                                disabled={!dateFrom}
                                                variant="standard"
                                            />
                                        </Grid>
                                    </Grid>
                                }
                                handleFilterSearch={applyFilter}
                                handleFilterReset={resetFilters}
                                setShowAdvanceSearch={(value) => setShowFilter(value)}
                                hasMoreFilter={false}
                                loading={loading}
                            />
                        </Collapse>
                    </Grid>

                    <Grid item xs={12}>
                        <MuiTable
                            rowId="recordGuid"
                            columns={[
                                {
                                    field: "recordGuid",
                                    headerName: "ID",
                                    flex: 1,
                                    minWidth: 300,
                                },
                                {
                                    field: "receiptNumber",
                                    headerName: "Receipt Number",
                                    flex: 1,
                                    minWidth: 300,
                                },
                                {
                                    field: "quantity",
                                    headerName: "Quantity",
                                    flex: 1,
                                },
                                {
                                    field: "price",
                                    headerName: "Price",
                                    flex: 1,
                                },
                                {
                                    field: "createdDate",
                                    headerName: "Date",
                                    flex: 1,
                                    minWidth: 300,
                                    renderCell: (params) =>
                                        get_YYYY_MM_DD_HH_MM_SS(params.value, "-"),
                                },
                            ]}
                            data={data}
                            loading={loading}
                            setPaginationModel={setPaginationModel}
                            paginationModel={paginationModel}
                            totalRows={totalRows}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default withTranslation("translation")(GetActions(ResellerTransactionsPage));
