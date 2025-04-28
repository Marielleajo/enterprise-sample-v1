import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Collapse,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import React, {useEffect, useState} from "react";
import {
    ACTIVATE_BUNDLE,
    DEACTIVATE_BUNDLE,
    DELETE_BUNDLE,
    GET_ALL_COUNTRIES_API,
    GET_ALLVALIDITY_PERIODS,
    GET_BUNDLE_TYPES,
    GET_BUNDLES_BY_CATEGORY,
    GET_BUNDLES_BY_COUNTRY,
    GET_BUNDLES_BY_ZONE,
    GET_ZONES,
    PUBLISH_BUNDLE,
    TOGGLE_IS_STOCKABLE,
    UNPUBLISH_BUNDLE,
} from "../../../APIs/BundleListing";

import {Add, Close, DeleteOutline, Edit, FilterAlt, Public,} from "@mui/icons-material";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import MuiTable from "../../../Components/MuiTable/MuiTable";

import {useSnackbar} from "../../../Contexts/SnackbarContext";

import StatusSwitch from "../../../Components/StatusSwitch.jsx";
import {FROMTimestmpToDATE, handleMessageError, TOTimestmpToDATE, truncateValue} from "../../Utils/Functions.jsx";
import BundleForm from "./BundleForm.jsx";
import DeleteModal from "./modals/DeleteModal.jsx";
import ConfirmToggleStatusModal from "./modals/ConfirmToggleStatusModal.jsx";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch.jsx";
import TabsComponent from "../../../Components/Tabs/Tabs.jsx";
import ConfirmTogglePublishModal from "../AssignReseller/Modals/ConfirmTogglePublishModal.jsx";
import UpdateStockModal from "./modals/UpdateStockModal.jsx";
import ReusableToogleStatusCell from "../../../Components/ReusableToogleStatusCell.jsx";

const prepareBundle = (bundle) => {
    return {
        ...bundle,
        pricingType: {
            label: bundle?.pricingType?.name ?? bundle?.pricingType?.tag,
            value: bundle?.pricingType?.tag,
        },
        // currency: {
        //     label: bundle?.currency?.name,
        //     value: bundle?.currency?.tag,
        // },
        bundleType: {
            label: bundle?.bundleType?.name,
            value: bundle?.bundleType?.tag,
        },
        bundleCategory: {
            label: bundle?.bundleCategory?.name || bundle?.bundleCategory?.tag,
            value: bundle?.bundleCategory?.tag,
        },
        supportedCountries: bundle?.supportedCountries?.map((country) => ({
            label: country.name,
            value: country.recordGuid,
        })),
        validity:
            bundle?.validityPeriodCycle != null
                ? {
                    label:
                        bundle?.validityPeriodCycle?.details?.[0]?.name ||
                        bundle?.validityPeriodCycle?.recordGuid,
                    value: bundle?.validityPeriodCycle?.recordGuid,
                }
                : null,
    };
};

export default function BundleListing({
                                          category,
                                          globalRegionId,
                                          setSelectedTab,
                                          formState,
                                          setFormState,
                                          tabs,
                                          selectedTab,
                                          handleBackIcon,
                                          actions
                                      }) {
    const [deleteContext, setDeleteContext] = useState({
        open: false,
        bundle: null,
    });
    const [statusContext, setStatusContext] = useState({
        open: false,
        bundle: null,
    });
    const [stockContext, setStockContext] = useState({
        open: false,
        bundle: null,
    });
    const [stockable, setStockable] = useState(false);
    const [threshold, setThreshold] = useState("");
    const [maxQuantity, setMaxQuantity] = useState("");

    const [country, setCountry] = useState(null);
    const [region, setRegion] = useState(null);
    const [filterBackup, setFilterBackup] = useState({
        country: null,
        region: null,
    });
    const [showMuiTable, setShowMuiTable] = useState(false);
    const [loading, setLoading] = useState(null);
    const [showOther, setShowOther] = useState(false);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [totalRows, setTotalRows] = useState(0);
    const [data, setData] = useState([]);
    const {showSnackbar} = useSnackbar();
    const [showFilter, setShowFilter] = useState(true);
    const [bundleCode, setBundleCode] = useState("");
    const [bundleName, setBundleName] = useState("");

    const [IsActive, setIsActive] = useState("");
    const [IsStockable, setIsStockable] = useState("");
    const [StartPrice, setStartPrice] = useState("");
    const [EndPrice, setEndPrice] = useState("");
    const [BundleTypeTag, setBundleTypeTag] = useState(null);
    const [selectedReseller, SetSelectedReseller] = useState(null);
    const [validityPeriod, setValidityPeriod] = useState("");
    const [publishContext, setPublishContext] = useState({
        open: false,
        bundle: null,
    });
    const [publishFrom, setPublishFrom] = useState("");
    const [publishTo, setPublishTo] = useState("");


    const initSearchQueries = {
        IsActive: "",
        IsStockable: "",
        StartPrice: "",
        EndPrice: "",
        BundleTypeTag: "",
        ClientGuid: null,
        bundleCode: "",
        bundleName: "",
    };

    const [searchQueries, setSearchQueries] = useState(initSearchQueries);

    const handleFormClose = () => {
        setFormState({open: false, bundle: null});
        getBundles();
    };

    const applyFilter = () => {
        if (category.value == "COUNTRY" && !country) return;
        if (category.value == "REGION" && !region) return;

        setFilterBackup({
            country: country,
            region: region,
        });
        setSearchQueries({
            IsActive,
            bundleCode,
            bundleName,
            IsStockable,
            BundleTypeTag: BundleTypeTag?.data?.tag,
            StartPrice,
            EndPrice,
            ClientGuid: selectedReseller?.value,
        });

        setPaginationModel({
            page: 0,
            pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
    };

    const handleConfirmToggle = async () => {
        const data = {recordGuid: statusContext?.bundle?.recordGuid};
        try {
            setLoading(true);

            let response;
            const isDeactivation = statusContext?.bundle?.isActive;

            if (isDeactivation) {
                response = await DEACTIVATE_BUNDLE({data});
            } else {
                response = await ACTIVATE_BUNDLE({data});
            }

            if (response?.data?.success) {
                getBundles();
                setStatusContext({
                    open: false,
                    bundle: null,
                });
                showSnackbar(
                    `Bundle ${isDeactivation ? `Deactivated` : `Activated`} Successfully`,
                    "success"
                );
            }
        } catch (e) {
            setLoading(false);
            showSnackbar(handleMessageError({e}), "error");
        }
    };

    const getBundles = async () => {
        if (category.value == "COUNTRY" && !country) return;
        if (category.value == "REGION" && !region) return;
        let response;
        setLoading(true);
        try {
            switch (category?.value?.toUpperCase()) {
                case "COUNTRY":
                    if (country) {
                        response = await GET_BUNDLES_BY_COUNTRY({
                            CountryGuids: filterBackup?.country.value,
                            pageSize: paginationModel.pageSize,
                            pageNumber: paginationModel.page + 1,

                            ...searchQueries,
                        });
                    }
                    break;
                case "REGION":
                    if (region) {
                        response = await GET_BUNDLES_BY_ZONE({
                            ZoneGuids: filterBackup?.region.value,
                            pageSize: paginationModel.pageSize,
                            pageNumber: paginationModel.page + 1,

                            ...searchQueries,
                        });
                    }
                    break;
                case "GLOBAL":
                    if (globalRegionId) {
                        response = await GET_BUNDLES_BY_ZONE({
                            ZoneGuids: globalRegionId,
                            pageSize: paginationModel.pageSize,
                            pageNumber: paginationModel.page + 1,

                            ...searchQueries,
                        });
                    }
                    break;
                case "CRUISE":
                    response = await GET_BUNDLES_BY_CATEGORY({
                        CategoryTags: "CRUISE",
                        pageSize: paginationModel.pageSize,
                        pageNumber: paginationModel.page + 1,

                        ...searchQueries,
                    });
                    break;
                default:
                    console.error("Category did not match");
            }

            if (response?.data?.success) {
                setData(
                    response.data.data.items.map((item) => ({
                        ...item,
                        description: item.bundleDetails?.[0]?.description,
                        bundleName: item.bundleDetails?.[0]?.name,
                    }))
                );
                setTotalRows(response.data.data.totalRows);
                setShowMuiTable(true);
            }
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        setIsActive("");
        setIsStockable("");
        setBundleTypeTag(null);
        setEndPrice("");
        setStartPrice("");
        SetSelectedReseller(null);
        setCountry(null);
        setRegion(null);
        setBundleName("");
        setBundleCode("");
        setFilterBackup({
            country: null,
            region: null,
        });
        setSearchQueries(initSearchQueries);
        (category.value == "COUNTRY" || category.value == "REGION") &&
        setShowMuiTable(false);

        setPaginationModel({
            page: 0,
            pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
    };

    const toggleFilterModal = () => {
        setShowFilter(!showFilter);
    };

    const handleOpenDelete = (bundle) => {
        setDeleteContext({
            open: true,
            bundle: bundle,
        });
    };

    const handleConfirmDelete = async () => {
        try {
            setLoading(true);

            let response = await DELETE_BUNDLE({
                recordGuid: deleteContext?.bundle?.recordGuid,
            });

            if (response?.data?.success) {
                getBundles();
                setDeleteContext({
                    open: false,
                    bundle: null,
                });
                showSnackbar("Bundle Deleted Successfully", "success");
            }
        } catch (e) {
            setLoading(false);
            showSnackbar(handleMessageError({e}), "error");
        }
    };

    const GET_VALIDITY_PERIOD = async () => {
        try {
            setLoading(true);

            let response = await GET_ALLVALIDITY_PERIODS();

            if (response?.data?.success) {
                setValidityPeriod(
                    response?.data?.data?.items?.filter(
                        (item) => item.totalHours == 8760
                    )[0]?.recordGuid
                );
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
            showSnackbar(handleMessageError({e}), "error");
        }
    };

    useEffect(() => {
        category.value !== "COUNTRY" && category.value !== "REGION" && getBundles();
    }, [category]);
    useEffect(() => {
        getBundles();
    }, [paginationModel]);
    useEffect(() => {
        GET_VALIDITY_PERIOD();
    }, []);

    const handleTabChange = (newValue) => {
        setSelectedTab(newValue);
        setData([]);
        if (newValue !== "COUNTRY" && newValue !== "REGION") {
            setShowOther(true);
        } else {
            setShowOther(false);
            setShowMuiTable(false);
            setShowFilter(true);
        }
    };

    const handlePublishConfirmToggle = async () => {
        const unpublishdata = {recordGuid: publishContext?.bundle?.recordGuid};
        const publishdata = {
            recordGuid: publishContext?.bundle?.recordGuid,
        };
        try {
            setLoading(true);
            let response;
            const isDeactivation = publishContext?.bundle?.isPublished;

            if (isDeactivation) {
                response = await UNPUBLISH_BUNDLE({data: unpublishdata});
            } else {
                response = await PUBLISH_BUNDLE({data: publishdata});
            }

            if (response?.data?.success) {
                getBundles();
                setPublishContext({
                    open: false,
                    bundle: null,
                });
                showSnackbar(response?.data?.message, "success");
            } else {
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
            showSnackbar(
                e?.response?.data?.message ||
                e?.response?.data?.Message ||
                e?.response?.data?.errors?.Name[0] ||
                e?.response?.data?.result?.message ||
                "Something Went Wrong", "error");
        }
    };


    const handleConfirmStockUpdate = async () => {
        const payload = {
            recordGuid: stockContext?.bundle?.recordGuid,
            ...(!stockable && {Threshold: Number(threshold)}),
            ...(!stockable && {MaxQuantity: Number(maxQuantity)}),
        };

        try {
            setLoading(true);
            const response = await TOGGLE_IS_STOCKABLE({data: payload});
            if (response?.data?.success) {
                showSnackbar("Stock updated successfully", "success");
                setStockContext({open: false, bundle: null});
                getBundles();
            } else {
                setLoading(false);
            }
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
            setLoading(false);
        }
    };

    return (
        <Box mr={2}>
            {formState.open ? (
                <BundleForm
                    bundle={formState?.bundle}
                    close={handleFormClose}
                    category={category}
                    validityPeriod={validityPeriod}
                />
            ) : (
                <Box sx={{height: "auto"}}>
                    <Grid
                        fullWidth
                        xs={12}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <TabsComponent
                            options={tabs}
                            option={selectedTab}
                            onClick={handleTabChange}
                            disabled={loading}
                        />
                        <Box>
                            {actions.includes("Add") && (
                                <Button
                                    className="mui-btn primary filled"
                                    onClick={() => setFormState({open: true, bundle: null})}
                                    startIcon={<Add/>}
                                    sx={{
                                        whiteSpace: "nowrap",
                                        ml: 1,
                                    }}
                                >
                                    Create Bundle
                                </Button>
                            )}
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
                        </Box>
                    </Grid>

                    <Box mb={2}>
                        <Collapse in={showFilter} timeout={750}>
                            <AdvancedSearch
                                body={
                                    <Box sx={{width: "100%"}} mt={1}>
                                        <Grid container spacing={2}>
                                            {category.value == "COUNTRY" && (
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <CustomAsyncPaginate
                                                        value={country}
                                                        onChange={(value) => {
                                                            setCountry(value);
                                                        }}
                                                        placeholder="Select Country *"
                                                        label="Country*"
                                                        apiFunction={GET_ALL_COUNTRIES_API}
                                                        dataPath={"data.data.countries"}
                                                        optionLabel="name"
                                                        optionValue="recordGuid"
                                                    />
                                                </Grid>
                                            )}
                                            {category.value == "REGION" && (
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <CustomAsyncPaginate
                                                        value={region}
                                                        onChange={(value) => {
                                                            setRegion(value);
                                                        }}
                                                        placeholder="Select Region*"
                                                        label="Region *"
                                                        apiFunction={GET_ZONES}
                                                        dataPath={"data.data.zones"}
                                                        excludedItemRecordGuid="29b0bf21-0861-4222-839c-0da178a6371c"
                                                    />
                                                </Grid>
                                            )}
                                            {/*<Grid item xs={4}>*/}
                                            {/*  <CustomAsyncPaginate*/}
                                            {/*    value={selectedReseller}*/}
                                            {/*    onChange={(value) => {*/}
                                            {/*      SetSelectedReseller(value);*/}
                                            {/*    }}*/}
                                            {/*    placeholder="select Reseller"*/}
                                            {/*    label="Reseller"*/}
                                            {/*    apiFunction={GET_ALL_RESELLER_API}*/}
                                            {/*    dataPath={"data.data.clients"}*/}
                                            {/*    params={{ type: "RESELLER" }}*/}
                                            {/*  />*/}
                                            {/*</Grid>*/}
                                        </Grid>
                                        {showOther && (
                                            <Grid xs={12} container mt={0} spacing={2}>
                                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                                    <FormControl fullWidth variant="standard">
                                                        <TextField
                                                            label="Bundle Code"
                                                            variant="standard"
                                                            value={bundleCode}
                                                            onChange={(e) => {
                                                                setBundleCode(e.target.value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                                    <FormControl fullWidth variant="standard">
                                                        <TextField
                                                            label="Bundle Name"
                                                            variant="standard"
                                                            value={bundleName}
                                                            onChange={(e) => {
                                                                setBundleName(e.target.value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                                    <FormControl fullWidth variant="standard">
                                                        <InputLabel>Is Stockable</InputLabel>
                                                        <Select
                                                            label="Is Stockable"
                                                            value={IsStockable}
                                                            variant="standard"
                                                            onChange={(e) => setIsStockable(e.target.value)}
                                                        >
                                                            <MenuItem value={null}>None</MenuItem>
                                                            <MenuItem value={true}>True</MenuItem>
                                                            <MenuItem value={false}>False</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                                    <FormControl fullWidth variant="standard">
                                                        <InputLabel>Status</InputLabel>
                                                        <Select
                                                            label="Status"
                                                            value={IsActive}
                                                            variant="standard"
                                                            onChange={(e) => setIsActive(e.target.value)}
                                                        >
                                                            <MenuItem value={null}>None</MenuItem>
                                                            <MenuItem value={true}>Active</MenuItem>
                                                            <MenuItem value={false}>Inactive</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                                    <CustomAsyncPaginate
                                                        value={BundleTypeTag}
                                                        onChange={(value) => {
                                                            setBundleTypeTag(value);
                                                        }}
                                                        label="Bundle Type"
                                                        placeholder="Select Bundle Type"
                                                        apiFunction={GET_BUNDLE_TYPES}
                                                        isNested={true}
                                                        labelPath={"bundleTypeDetails"}
                                                        dataPath="data.data.items"
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Box>
                                }
                                handleFilterSearch={applyFilter}
                                handleFilterReset={resetFilters}
                                setShowAdvanceSearch={setShowFilter}
                                hasMoreFilter={
                                    category.value !== "COUNTRY" && category.value !== "REGION"
                                        ? false
                                        : true
                                }
                                setShowOther={setShowOther}
                                showOther={showOther}
                                loading={loading}
                                disabled={!showMuiTable}
                            />
                        </Collapse>
                    </Box>

                    <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        className="mb-4"
                        mt={2}
                    >
                        {/* Buttons Section */}

                        <Grid container spacing={2}>
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                display="flex"
                                justifyContent="flex-end"
                            ></Grid>
                        </Grid>
                    </Grid>

                    {loading ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            mt={10}
                        >
                            <CircularProgress/>
                        </Box>
                    ) : (
                        showMuiTable && (
                            <Grid size={{xs: 12, md: 8}}>
                                <MuiTable
                                    rowId="recordGuid"
                                    columns={[
                                        ...(actions.includes("ToggleStatus")
                                            ? [
                                                {
                                                    field: "isActive",
                                                    headerName: "Status",
                                                    width: 150,
                                                    renderCell: (params) => {
                                                        return (
                                                            <StatusSwitch
                                                                isActive={params.value}
                                                                onChange={() => {
                                                                    setStatusContext({
                                                                        open: true,
                                                                        bundle: params.row,
                                                                    });
                                                                }}
                                                            />
                                                        );
                                                    },
                                                },
                                            ]
                                            : []),
                                        {
                                            field: "bundleName",
                                            headerName: "Bundle Name",
                                            width: 150,
                                            renderCell: (params) => (
                                                <Box mt={1}>
                                                    <Tooltip title={params.value} placement="top">
                                                        <Typography fontWeight="bold">
                                                            {params.value}
                                                        </Typography>
                                                    </Tooltip>
                                                </Box>
                                            ),
                                        },
                                        {
                                            field: "cost",
                                            headerName: "Cost",
                                            width: 120,
                                            renderCell: (params) => {
                                                const value = Number(params?.row?.cost);
                                                return (
                                                    <Tooltip title={value} placement="top" disableInteractive>
                                                        {truncateValue(Number(params?.row?.cost))} {params.row.costCurrency?.currencyCode ?? " - "}
                                                    </Tooltip>
                                                );
                                            },
                                        },
                                        {
                                            field: "price",
                                            headerName: "Price",
                                            width: 100,
                                            renderCell: (params) => {
                                                const value = Number(params?.row?.price);
                                                return (
                                                    <Tooltip title={value} placement="top" disableInteractive>
                                                        {truncateValue(Number(params?.row?.price))} {params.row.currency?.currencyCode ?? " - "}
                                                    </Tooltip>
                                                );
                                            },
                                        },

                                        // {
                                        //     field: "currency",
                                        //     headerName: "Currency",
                                        //     width: 100,
                                        //     renderCell: (params) => {
                                        //         return `${params.row.currency?.name}`;
                                        //     },
                                        // },

                                        ...(actions.includes("ToggleIsStockable")
                                            ? [
                                                {
                                                    field: "isStockable",
                                                    headerName: "Is Stockable",
                                                    width: 150,
                                                    renderCell: (params) => {
                                                        const isStockable =
                                                            params.row.bundleInfo?.isStockable ?? false;

                                                        return (
                                                            <ReusableToogleStatusCell
                                                                value={isStockable}
                                                                onClick={() => {
                                                                    setStockContext({open: true, bundle: params?.row})
                                                                    setStockable(isStockable)
                                                                    setThreshold(params?.row?.threshold)
                                                                    setMaxQuantity(params?.row?.maxQuantity)
                                                                }}
                                                                activeLabel="True"
                                                                inactiveLabel="False"
                                                            />
                                                        )
                                                    }
                                                },
                                            ]
                                            : []),
                                        ...(actions.includes("ToggleIsPublished")
                                            ? [
                                                {
                                                    field: "isPublished",
                                                    headerName: "Is Published",
                                                    width: 150,
                                                    renderCell: (params) => {
                                                        return (
                                                            <ReusableToogleStatusCell
                                                                value={params.value}
                                                                onClick={() => {
                                                                    setPublishFrom(FROMTimestmpToDATE(params?.row?.publishFrom));
                                                                    setPublishTo(TOTimestmpToDATE(params?.row?.publishTo));
                                                                    setPublishContext({
                                                                        open: true,
                                                                        bundle: params.row,
                                                                    });
                                                                }}
                                                                activeLabel="True"
                                                                inactiveLabel="False"
                                                            />
                                                        )
                                                    },
                                                },
                                            ]
                                            : []),

                                        {
                                            field: "validityPeriodCycle",
                                            headerName: "Validity",
                                            width: 100,

                                            renderCell: (params) => {
                                                return `${
                                                    params?.row?.validityPeriodCycle?.totalHours / 24
                                                } Days`;
                                            },
                                        },

                                        ...(selectedTab !== "CRUISE"
                                            ? [
                                                {
                                                    field: "supportedCountries",
                                                    headerName: "Supported Countries",
                                                    width: 200,
                                                    renderCell: (params) => {
                                                        const countryList = params?.value || [];

                                                        return (
                                                            <Tooltip
                                                                title={
                                                                    <Box
                                                                        sx={{
                                                                            p: 0,
                                                                            maxHeight: 250,
                                                                            overflowY: "auto",
                                                                            "&::-webkit-scrollbar": {
                                                                                display: "none",
                                                                            },

                                                                            "-ms-overflow-style": "none", // IE and Edge
                                                                            scrollbarWidth: "none", // Firefox
                                                                        }}
                                                                    >
                                                                        {countryList.length > 0 ? (
                                                                            <Stack spacing={1}>
                                                                                {countryList.map((country) => (
                                                                                    <Stack
                                                                                        key={country.code}
                                                                                        direction="row"
                                                                                        alignItems="center"
                                                                                        spacing={1}
                                                                                        sx={{
                                                                                            p: 0,
                                                                                        }}
                                                                                    >
                                                                                        <img
                                                                                            src={`${
                                                                                                import.meta.env
                                                                                                    .VITE_COUNTRY_URL
                                                                                            }/static/flags/${country?.isoCode3
                                                                                                ?.toLowerCase()
                                                                                                .substring(0, 2)}.svg`}
                                                                                            alt={country.name}
                                                                                            style={{
                                                                                                width: 24,
                                                                                                height: 16,
                                                                                                borderRadius: 4,
                                                                                                objectFit: "cover",
                                                                                            }}
                                                                                        />
                                                                                        <Typography
                                                                                            variant="body2"
                                                                                            sx={{fontWeight: 500}}
                                                                                        >
                                                                                            {country.name}
                                                                                        </Typography>
                                                                                    </Stack>
                                                                                ))}
                                                                            </Stack>
                                                                        ) : (
                                                                            <Typography variant="body2">
                                                                                No countries
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                }
                                                                arrow
                                                                placement="top"
                                                            >
                                                                <Box className="pl-5">
                                                                    <Chip
                                                                        icon={
                                                                            <Public
                                                                                fontSize="small"
                                                                                sx={{color: "#026AA2 !important"}}
                                                                            />
                                                                        }
                                                                        label={`${countryList.length} ${
                                                                            countryList.length === 1
                                                                                ? "Country"
                                                                                : "Countries"
                                                                        }`}
                                                                        sx={{
                                                                            borderRadius: "16px",
                                                                            // borderColor: "#A8BCEE",
                                                                            color: "#026AA2",
                                                                            backgroundColor: "#E9EEFB",
                                                                            cursor: "pointer",

                                                                            transition: "all 0.3s ease",
                                                                            "&:hover": {
                                                                                borderColor: "primary.main",
                                                                            },
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Tooltip>
                                                        );
                                                    },
                                                },
                                            ]
                                            : []),
                                        ...(actions.includes("Delete") || actions?.includes("Edit")
                                            ? [
                                                {
                                                    field: "actions",
                                                    headerName: "Actions",
                                                    width: 150,
                                                    renderCell: (params) => {
                                                        return (
                                                            <Box display="flex" alignItems="center">
                                                                {actions.includes("Delete") && (
                                                                    <Tooltip
                                                                        title={"Edit Bundle"}
                                                                        placement="top"
                                                                    >
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => {
                                                                                setFormState({
                                                                                    open: true,
                                                                                    bundle: prepareBundle(params.row),
                                                                                });
                                                                            }}
                                                                        >
                                                                            <Edit fontSize="small" sx={{mr: 1}}/>
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                                {actions.includes("Delete") && (
                                                                    <Tooltip
                                                                        title={"Delete Bundle"}
                                                                        placement="top"
                                                                    >
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => {
                                                                                handleOpenDelete(params.row);
                                                                            }}
                                                                        >
                                                                            <DeleteOutline
                                                                                fontSize="small"
                                                                                sx={{mr: 1}}
                                                                            />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </Box>
                                                        );
                                                    },
                                                },
                                            ]
                                            : []),
                                    ]}
                                    data={data}
                                    loading={loading}
                                    setPaginationModel={setPaginationModel}
                                    paginationModel={paginationModel}
                                    totalRows={totalRows}
                                />
                            </Grid>
                        )
                    )}

                    <DeleteModal
                        open={deleteContext.open}
                        onClose={() =>
                            setDeleteContext({
                                open: false,
                                bundle: null,
                            })
                        }
                        loading={loading}
                        onConfirm={handleConfirmDelete}
                    />

                    <ConfirmToggleStatusModal
                        open={statusContext.open}
                        bundle={statusContext?.bundle}
                        onClose={() =>
                            setStatusContext({
                                open: false,
                                bundle: null,
                            })
                        }
                        loading={loading}
                        onConfirm={handleConfirmToggle}
                    />
                    <ConfirmTogglePublishModal
                        open={publishContext.open}
                        bundle={publishContext?.bundle}
                        onClose={() => setPublishContext({open: false, bundle: null})}
                        loading={loading}
                        onConfirm={handlePublishConfirmToggle}
                        publishFrom={publishFrom}
                        publishTo={publishTo}
                        setPublishFrom={setPublishFrom}
                        setPublishTo={setPublishTo}
                    />
                    <UpdateStockModal
                        open={stockContext.open}
                        bundle={stockContext.bundle}
                        onClose={() => setStockContext({open: false, bundle: null})}
                        onConfirm={handleConfirmStockUpdate}
                        isStockable={stockable}
                        threshold={threshold}
                        setThreshold={setThreshold}
                        maxQuantity={maxQuantity}
                        setMaxQuantity={setMaxQuantity}
                        loading={loading}
                    />

                </Box>
            )}
        </Box>
    );
}
