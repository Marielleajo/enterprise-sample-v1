import FileUploadIcon from "@mui/icons-material/FileUpload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {Box, Button, CircularProgress, FormControl, Grid, MenuItem, Select, Typography,} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import noExchangeRate from "../../../Assets/no-exchange-rate-logo.png";
import {EXPORT_ALL_EXCHANGE_RATE, GET_ALL_EXCHANGE_RATE,} from "../../../APIs/CurrencyManagement";
import {get_YYYY_MM_DD_HH_MM_SS, handleMessageError,} from "../../Utils/Functions";
import {GET_DEFAULT_CURRENCIES} from "../../../APIs/ExchangeRate";
import DynamicFilters from "../../../Components/DynamicFilters/DynamicFilters";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import {GET_ALL_CURRENCIES} from "../../../APIs/Currencies";

const AutomaticRates = ({token}) => {
    const {showSnackbar} = useSnackbar();
    const menus = useSelector((state) => state.menus);
    const [clearFiltersFlag, setClearFiltersFlag] = useState(false);
    const [fromFilter, setFromFilter] = useState(false);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    const [state, setState] = useState({
        tableData: [],
        showNoData: true,
        exportLoading: false,
        isAllSelected: true,
        isOpen: false,
        defaultCurrencyFilter: "",
        currencyFilter: "",
        defaultCurrencyOptions: [],
        currencyOptions: [],
    });
    const {t} = useTranslation();
    const {
        tableData,
        showNoData,
        showTableData,
        loading,
        defaultCurrencyOptions,
        isOpen,
        defaultCurrencyFilter,
        currencyFilter,
        currencyOptions,
    } = state;

    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);
    const [totalRows, SetTotalRows] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });

    const toggleFilterModal = () => {
        setState((prevState) => ({...prevState, isOpen: !state.isOpen}));
    };
    const selectRef = useRef(null);

    const sidebarRef = useRef(null);
    const handleClickOutside = (event) => {
        toggleFilterModal();
        if (isOpen && sidebarRef && !sidebarRef.current.contains(event.target)) {
            if (selectRef.current) {
                const selectClassName = selectRef.current.className;
                if (selectClassName.includes("MuiInputBase-root")) {
                    setTimeout(() => {
                        const allElements = document.querySelectorAll("*");
                        let portalContainer;

                        allElements.forEach((element) => {
                            if (
                                element.classList.contains("MuiPaper-root") &&
                                element.classList.contains("MuiPopover-paper") &&
                                element.classList.contains("MuiMenu-paper") &&
                                element.style.opacity === "1" && // Ensure it's the visible one
                                element.style.display !== "none"
                            ) {
                                portalContainer = element;
                            }
                        });

                        if (portalContainer) {
                            portalContainer.style.display = "none";
                        }
                    }, 0);
                }
            }
        }
    };
    const handleSearch = () => {
        setFromFilter(true);
        getAllExchangeRates();
        toggleFilterModal();
    };

    const handleClearFilters = () => {
        setState((prevState) => ({
            ...prevState,
            currencyFilter: "",
            defaultCurrencyFilter: "",
        }));
        setClearFiltersFlag(true);
        toggleFilterModal();
    };
    useEffect(() => {
        if (clearFiltersFlag) {
            getAllExchangeRates();
            setClearFiltersFlag(false);
        }
    }, [clearFiltersFlag]);
    const getAllExchangeRates = async () => {
        setIsLoading(true);
        setState((prevState) => ({
            ...prevState,
            loading: true,
            showAdd: false,
            showEdit: false,
        }));
        let pageIndex = paginationModel?.page + 1;
        let pageSize = paginationModel?.pageSize;
        let GetAutomatic = true;
        let SourceGuid = defaultCurrencyFilter ? defaultCurrencyFilter : "";
        let DestinationGuid = currencyFilter ? currencyFilter : "";
        try {
            let response = await GET_ALL_EXCHANGE_RATE({
                GetAutomatic,
                pageIndex,
                pageSize,
                SourceGuid,
                DestinationGuid,
            });

            if (response?.data?.success) {
                const items = response.data?.data?.items;
                const tableData = items.map((item) => {
                    const allDate = get_YYYY_MM_DD_HH_MM_SS(
                        new Date(item?.lastUpdatedDate * 1000),
                        "-"
                    );
                    const [date, time] = allDate?.split(" ") || [];
                    return {
                        ...item,
                        currencyPair: `${item?.currencyCode} / ${item?.systemCurrencyCode}`,
                        status: "Active",
                        date: date,
                        time: time?.slice(0, 5),
                    };
                });
                setState((prevState) => ({
                    ...prevState,
                    tableData: tableData,
                    showAdd: false,
                    showEdit: false,
                    showTableData: items.length === 0 ? false : true,
                    showNoData: items.length === 0 ? true : false,
                    loading: false,
                }));
                SetTotalRows(response?.data?.data?.totalRows);
            }
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
            setState((prevState) => ({
                ...prevState,
                loading: false,
            }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllExchangeRates();
    }, [paginationModel]);

    const toggleSelectAll = () => {
        setState((prevState) => ({
            ...prevState,
            isAllSelected: false,
        }));
        const indexes = tableData.map((_, index) => String(index));
        setRowSelectionModel(indexes);
    };
    const toggleUnSelectAll = () => {
        setRowSelectionModel([""]);
        setState((prevState) => ({
            ...prevState,
            isAllSelected: true,
        }));
    };
    const getDefaultCurrency = async () => {
        try {
            let response = await GET_DEFAULT_CURRENCIES();
            const label = response?.data?.data?.currency?.name;
            const value = response?.data?.data?.currency?.recordGuid;
            const data = [{label, value}];
            setState((prevState) => ({
                ...prevState,
                defaultCurrencyOptions: data,
            }));
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
        }
    };
    const getCurrencies = async () => {
        let isCodeValue = false;
        const currencyOptions = await GET_ALL_CURRENCIES();
        setState((prevState) => ({
            ...prevState,
            currencyOptions,
        }));
    };

    useEffect(() => {
        getDefaultCurrency();
        getCurrencies();
    }, []);
    const toggleExportData = async () => {
        setState((prevState) => ({
            ...prevState,
            exportLoading: true,
        }));
        try {
            const records =
                rowSelectionModel && rowSelectionModel != ""
                    ? rowSelectionModel.map((index) => tableData[index]?.recordGuid)
                    : [];
            let GetAutomatic = true;
            const response = await EXPORT_ALL_EXCHANGE_RATE({
                records,
                GetAutomatic,
            });

            if (response?.data) {
                const contentType =
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                const headers = response.headers;
                headers["Content-Type"] = contentType;
                const blob = new Blob([response.data], {type: contentType});
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "Exchange.csv";
                document.body.appendChild(link);
                link.click();
                setState((prevState) => ({
                    ...prevState,
                    loading: false,
                    exportLoading: false,
                }));
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                showSnackbar("Export Successful");
            }
        } catch (error) {
            showSnackbar(handleMessageError({error}), "error");
        } finally {
            setState((prevState) => ({
                ...prevState,
                loading: false,
                exportLoading: false,
            }));
        }
    };

    return (
        <Box sx={{width: "100%"}}>
            {isLoading ? (
                <div
                    className="d-flex justify-content-center align-items-center align-self-center"
                    style={{minHeight: "70vh"}}
                >
                    <CircularProgress/>
                </div>
            ) : (
                <>
                    <DynamicFilters
                        isOpen={isOpen}
                        toggle={toggleFilterModal}
                        handleSearch={handleSearch}
                        handleClearFilters={handleClearFilters}
                        handleClickOutside={handleClickOutside}
                        sidebarRef={sidebarRef}
                    >
                        <>
                            <Grid container className="filter-section-title" spacing={2}>
                                <Grid item xs={12}>
                                    <p>Base Currency</p>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <Select
                                            sx={{backgroundColor: "#ffff"}}
                                            labelId="demo-simple-select-qr"
                                            id="demo-simple-select-qr"
                                            value={defaultCurrencyFilter}
                                            ref={selectRef}
                                            onChange={(e) => {
                                                setState((prevState) => ({
                                                    ...prevState,
                                                    defaultCurrencyFilter: e.target.value,
                                                }));
                                            }}
                                        >
                                            {defaultCurrencyOptions?.length > 0 &&
                                                defaultCurrencyOptions.map((item) => (
                                                    <MenuItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container className="filter-section-title" spacing={2}>
                                <Grid item xs={12}>
                                    <p>Quote Currency</p>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <Select
                                            sx={{backgroundColor: "#ffff"}}
                                            labelId="demo-simple-select-qr"
                                            id="demo-simple-select-qr"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: "15vh",
                                                    },
                                                },
                                            }}
                                            value={currencyFilter}
                                            onChange={(e) => {
                                                setState((prevState) => ({
                                                    ...prevState,
                                                    currencyFilter: e.target.value,
                                                }));
                                            }}
                                        >
                                            {currencyOptions?.length > 0 &&
                                                currencyOptions.map((item) => (
                                                    <MenuItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </>
                    </DynamicFilters>
                    {fromFilter === false && showNoData === true && (
                        <>
                            <div
                                className="d-flex justify-content-center align-items-center align-self-center"
                                style={{minHeight: "70vh"}}
                            >
                                <Grid
                                    container
                                    spacing={{xs: 5, md: 5}}
                                    sx={{margin: "0 auto"}}
                                    textAlign={"center"}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        justifyContent="center"
                                        alignItems="center"
                                        alignSelf="center"
                                    >
                                        <img src={noExchangeRate} alt="No exchange rate Logo"/>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <h5 className="no-data-available">No exchange history</h5>
                                        <Typography variant="body3" className="no-data-desc">
                                            No Automatic Exchange Rates Has Been Added
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </div>
                        </>
                    )}{" "}
                    {showTableData && (
                        <>
                            <Grid
                                item
                                xs={12}
                                display={"flex"}
                                justifyContent={"end"}
                                paddingRight={3}
                            >
                                {state.isAllSelected ? (
                                    <Button
                                        variant="outlined"
                                        className="mr-2"
                                        onClick={() => toggleSelectAll()}
                                    >
                                        Select all
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        className="mr-2"
                                        onClick={() => toggleUnSelectAll()}
                                    >
                                        UnSelect all
                                    </Button>
                                )}
                                <Button
                                    className="mr-2"
                                    variant="outlined"
                                    endIcon={<KeyboardArrowDownIcon fontSize="small"/>}
                                    onClick={() => toggleFilterModal()}
                                >
                                    &nbsp;Filter By
                                </Button>
                                {state.exportCurrency && (
                                    <Button
                                        className="mr-2"
                                        id="export-btn"
                                        variant="outlined"
                                        onClick={() => toggleExportData()}
                                        disabled={state.exportLoading}
                                    >
                                        {state.exportLoading ? (
                                            <CircularProgress size={24} color="inherit"/>
                                        ) : (
                                            <>
                                                <FileUploadIcon fontSize="small"/>
                                                &nbsp; Export
                                            </>
                                        )}
                                    </Button>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <div className="p-3 card-body fixed-height">
                                    <MuiTable
                                        columns={[
                                            {
                                                headerName: t("Pair"),
                                                field: "currencyPair",
                                                width: 200,
                                            },
                                            {
                                                headerName: t("Exchange Rate"),
                                                field: "currentRate",
                                                width: 200,
                                            },
                                            {
                                                headerName: t("date"),
                                                field: "date",
                                                width: 200,
                                            },
                                            {
                                                headerName: t("Time"),
                                                field: "time",
                                                width: 200,
                                            },
                                        ]}
                                        data={tableData}
                                        setPaginationModel={setPaginationModel}
                                        paginationModel={paginationModel}
                                        loading={loading}
                                        totalRows={totalRows}
                                        rowSelectionModel={rowSelectionModel}
                                        setRowSelectionModel={setRowSelectionModel}
                                        paginationMode="server"
                                    />
                                </div>
                            </Grid>
                        </>
                    )}
                    {fromFilter === true && showNoData && (
                        <>
                            <Grid
                                item
                                xs={12}
                                display={"flex"}
                                justifyContent={"end"}
                                paddingRight={3}
                            >
                                <Button
                                    className="mr-2"
                                    variant="outlined"
                                    endIcon={<KeyboardArrowDownIcon fontSize="small"/>}
                                    onClick={() => toggleFilterModal()}
                                >
                                    &nbsp;Filter By
                                </Button>
                            </Grid>

                            <div
                                className="d-flex justify-content-center align-items-center align-self-center"
                                style={{minHeight: "70vh"}}
                            >
                                <Grid
                                    container
                                    alignItems="center" // vertically center the items
                                    spacing={{xs: 5, md: 5}}
                                    sx={{margin: "0 auto"}}
                                    textAlign={"center"}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        justifyContent="center"
                                        alignItems="center"
                                        alignSelf="center"
                                    >
                                        <img src={noExchangeRate} alt="No exchange rate Logo"/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <h5 className="no-data-available">No exchange history</h5>
                                    </Grid>
                                </Grid>
                            </div>
                        </>
                    )}
                </>
            )}
        </Box>
    );
};

const mapStateToProps = (state) => ({
    token: state.authentication ? state.authentication.token : "",
});

export default AutomaticRates;
