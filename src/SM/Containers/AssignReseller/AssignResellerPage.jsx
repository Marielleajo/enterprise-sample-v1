import {Edit} from "@mui/icons-material";
import {Box, Button, Collapse, FormHelperText, Grid, IconButton, Tooltip,} from "@mui/material";
import React, {useState} from "react";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import {
    formatDateCell,
    FROMDATEConvertToTimesStmp,
    FROMTimestmpToDATE,
    handleMessageError,
    TODATEConvertToTimesStmp,
    TOTimestmpToDATE,
    truncateValue,
} from "../../Utils/Functions";
import AddCardIcon from "@mui/icons-material/AddCard";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import {GET_ALL_PROVIDER_API,} from "../../../APIs/Postpaid";
import TabsComponent from "../../../Components/Tabs/Tabs";
import {
    ADD_BULK_COST,
    EDIT_BUNDLE_COST,
    GET_ALL_ASSIGNED_BUNDLES,
    GET_ALL_UNASSIGNED_BUNDLES,
    GET_BUNDLE_CATEGORIES,
    PUBLISH_BUNDLE,
    REMOVE_BULK_COST,
    SET_BUNDLE_COST,
    UNPUBLISH_BUNDLE,
} from "../../../APIs/BundleListing";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import ManageSetCost from "./Modals/ManageSetCost";
import ManageBulkCost from "./Modals/ManageBulkCost";
import ConfirmTogglePublishModal from "./Modals/ConfirmTogglePublishModal.jsx";
import {GET_ALL_RESELLER_API} from "../../../APIs/Resellers.jsx";
import GetActions from "../../Utils/GetActions.jsx";
import ReusableToogleStatusCell from "../../../Components/ReusableToogleStatusCell.jsx";

const AssignReseller = ({actions}) => {
    const [loading, setLoading] = useState(false);
    const [addEditloading, setAddEditLoading] = useState(false);
    const [addEditBulkLoading, setAddEditBulkLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [data, setData] = useState([]);
    const [showFilter, setShowFilter] = useState(true);
    const [provider, setProvider] = useState("");
    const [category, setCategory] = useState("");
    const [reseller, setReseller] = useState("");
    const [providerBackup, setProviderBackup] = useState("");
    const [categoryBackup, setCategoryBackup] = useState("");
    const [resellerBackup, setResellerBackup] = useState("");
    const {showSnackbar} = useSnackbar();
    const [showTable, setShowTable] = useState(false);
    const [errorProvider, setErrorProvider] = useState(false);
    const [errorCategory, setErrorCategory] = useState(false);
    const [errorReseller, setErrorReseller] = useState(false);
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [bundleIds, setBundleIds] = useState([]);
    const [openCost, setOpenCost] = useState(false);
    const [openBulk, setOpenBulk] = useState(false);
    const [costPercentage, setCostPercentage] = useState(null);
    const [selectedBundle, setSelectedBundle] = useState("");
    const [selectedTab, setSelectedTab] = useState("Unassign");
    const [cost, setCost] = useState(null);
    const [rate, setRate] = useState(null);
    const [Currency, setCurrency] = useState(null);
    const tabs = [
        {text: "Unassigned Bundles", value: "Unassign"},
        {text: "Assigned Bundles", value: "Assign"},
    ];
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [publishContext, setPublishContext] = useState({
        open: false,
        bundle: null,
    });
    const [publishFrom, setPublishFrom] = useState("");
    const [publishTo, setPublishTo] = useState("");
    const handleTabChange = (newValue) => {
        setPaginationModel({
            page: 0,
            pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
        setRowSelectionModel([]);
        setSelectedTab(newValue);
    };

    const resetFilters = () => {
        setProvider("");
        setReseller("");
        setCategory("");
        setProviderBackup("");
        setResellerBackup("");
        setCategoryBackup("");
        setShowTable(false);
        setRowSelectionModel([]);
        setErrorCategory(false);
        setErrorReseller(false);
        setErrorProvider(false);
        setPaginationModel({
            page: 0,
            pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
    };
    const applyFilter = () => {
        if (!category) {
            setErrorCategory(true);
        }
        if (!provider) {
            setErrorProvider(true);
        }
        if (!reseller) {
            setErrorReseller(true);
        }
        if (!provider || !category || !reseller) {
            return;
        }
        !selectedTab && setSelectedTab("Unassign");
        setProviderBackup(provider);
        setResellerBackup(reseller);
        setCategoryBackup(category);
        setShowTable(true);
        setPaginationModel({
            page: 0,
            pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
    };
    const getAllAssignedBundle = async () => {
        setLoading(true);
        try {
            let resp = await GET_ALL_ASSIGNED_BUNDLES({
                pageIndex: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
                ProviderGuid: providerBackup.value,
                ClientGuid: resellerBackup.value,
                BundleCategoryTag: categoryBackup?.data?.tag,
            });
            if (resp?.data.success) {
                setData(resp?.data?.data?.items);

                setTotalRows(resp?.data?.data?.totalRows);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };
    const getAllUnAssignedBundle = async () => {
        setLoading(true);
        try {
            let resp = await GET_ALL_UNASSIGNED_BUNDLES({
                pageIndex: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
                ProviderGuid: providerBackup.value,
                ClientGuid: resellerBackup.value,
                BundleCategoryTag: categoryBackup?.data?.tag,
            });

            if (resp?.data.success) {
                setData(resp?.data?.data?.items);

                setTotalRows(resp?.data?.data?.totalRows);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };
    React.useEffect(() => {
        if (showTable) {
            if (selectedTab === "Assign") {
                getAllAssignedBundle();
            } else {
                getAllUnAssignedBundle();
            }
        }
    }, [selectedTab, paginationModel]);

    let columns = [
        {
            field: "name",
            headerName: "Bundle Name",
            width: 150,
            renderCell: (params) => (
                <Box mt={0}>
                    <Tooltip title={params?.row?.bundleDetails[0]?.name} placement="top">
                        <Box fontWeight="bold">{params?.row?.bundleDetails[0]?.name ?? " - "}</Box>
                    </Tooltip>
                </Box>
            ),
        },
        {
            field: "provider",
            headerName: "Provider",
            width: 100,
            renderCell: (params) => <>{params?.row?.provider?.name ?? " - "}</>,
        },

        {
            field: "createdDate",
            headerName: "Created Date",
            width: 180,
            renderCell: (params) => formatDateCell(params.value),
        },
        {
            field: "lastModifiedDate",
            headerName: "Last Modified Date",
            width: 180,
            renderCell: (params) => formatDateCell(params.value),
        },
        {
            field: "isPublished",
            headerName: "Is Published",
            width: 130,
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
            }
        },
        {
            field: "defaultPrice",
            headerName: "Default Price",
            width: 120,
            renderCell: (params) => {
                return <Tooltip title={params.value} placement="top" disableInteractive>
                    {truncateValue(Number(params.value))} {params?.row?.defaultCurrency?.currencyCode ?? " - "}
                </Tooltip>
            },
        },
    ];

    if (selectedTab == "Assign") {
        columns.push(
            {
                field: "cost",
                headerName: "Cost",
                width: 120,
                renderCell: (params) => {
                    return <Tooltip title={params.value} placement="top" disableInteractive>
                        {truncateValue(Number(params.value))} {params.row.costCurrency?.currencyCode ?? " - "}
                    </Tooltip>
                },
            },
            ...(actions.includes("Edit")
                ? [
                    {
                        field: "actions",
                        headerName: "Actions",
                        width: 80,
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
                                    <Tooltip title="Edit">
                                        <IconButton
                                            onClick={() => {
                                                setCost(params?.row?.cost);
                                                setCurrency({
                                                    label: params?.row?.currency?.name,
                                                    value: params?.row?.currency?.recordGuid,
                                                    data: {
                                                        ...params?.row?.currency,
                                                        code: params?.row?.currency?.currencyCode
                                                    }
                                                })

                                                setRate(params?.row?.defaultPrice);
                                                setSelectedBundle(params?.row);
                                                setOpenCost(true);
                                            }}
                                        >
                                            <Edit
                                                sx={{
                                                    fontSize: "18px !important",
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            );
                        },
                    }
                ]
                : []),
        );
    }

    if (selectedTab == "Unassign" && actions?.includes("Add")) {
        columns.push({
            field: "actions",
            headerName: "Actions",
            width: 100,
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
                        <Tooltip title="Set Cost">
                            <IconButton
                                onClick={() => {
                                    setCost(null);
                                    setCurrency(null);
                                    setSelectedBundle(params?.row);
                                    setOpenCost(true);
                                    setRate(params?.row?.defaultPrice);
                                }}
                            >
                                <AddCardIcon
                                    sx={{
                                        fontSize: "18px !important",
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                );
            },
        });
    }

    const handleAddBulkCost = async () => {
        setAddEditBulkLoading(true);
        try {
            let postData = {
                ResellerGuid: reseller.value,
                BundleGuids: rowSelectionModel,
                RatePercentage: costPercentage,
                CurrencyCode: Currency?.data?.code,
            };
            let res = await ADD_BULK_COST({postData});

            if (res?.data?.success) {
                setRowSelectionModel([]);
                setOpenBulk(false);
                if (selectedTab === "Assign") {
                    getAllAssignedBundle();
                } else {
                    getAllUnAssignedBundle();
                }
            }
            setAddEditBulkLoading(false);
        } catch (e) {
            setAddEditBulkLoading(false);
            showSnackbar(handleMessageError({e: e, type: "validation"}), "error");
        }
    };
    const handleRemoveBulkCost = async () => {
        setAddEditBulkLoading(true);
        try {
            let postData = {
                ResellerGuid: reseller.value,
                BundleGuids: rowSelectionModel,
            };
            let res = await REMOVE_BULK_COST({postData});
            if (res?.data?.success) {
                setRowSelectionModel([]);
                setOpenBulk(false);
                if (selectedTab === "Assign") {
                    getAllAssignedBundle();
                } else {
                    getAllUnAssignedBundle();
                }
            }
            setAddEditBulkLoading(false);
        } catch (e) {
            setAddEditBulkLoading(false);
            showSnackbar(
                e?.response?.data?.message ||
                e?.response?.data?.Message ||
                e?.response?.data?.errors?.Name[0] ||
                e?.response?.data?.result?.message ||
                "Something Went Wrong", "error");
        }
    };
    const handleEditCost = async () => {
        setAddEditLoading(true);
        try {
            let postData = {
                ResellerGuid: reseller?.value,
                BundleGuid: selectedBundle?.recordGuid,
                CurrencyCode: Currency?.data?.code,
                Cost: cost,
            };
            let resp = await EDIT_BUNDLE_COST({postData});

            if (resp?.data?.success) {
                showSnackbar("Cost Changed Successfully !!");
                if (selectedTab === "Assign") {
                    getAllAssignedBundle();
                } else {
                    getAllUnAssignedBundle();
                }
                setOpenCost(false);
            }
            setAddEditLoading(false);
        } catch (e) {
            setAddEditLoading(false);
            showSnackbar(
                e?.response?.data?.message ||
                e?.response?.data?.Message ||
                e?.response?.data?.errors?.Name[0] ||
                e?.response?.data?.result?.message ||
                "Something Went Wrong", "error");
        }
    };
    const handleAddCost = async () => {
        setAddEditLoading(true);
        try {
            let postData = {
                ResellerGuid: reseller.value,
                BundleGuid: selectedBundle?.recordGuid,
                CurrencyCode: Currency?.data?.code,
                Cost: cost,
            };
            let resp = await SET_BUNDLE_COST({postData});

            if (resp?.data?.success) {
                showSnackbar("Cost Added Successfully !!");
                if (selectedTab === "Assign") {
                    getAllAssignedBundle();
                } else {
                    getAllUnAssignedBundle();
                }
                setOpenCost(false);
            }
            setAddEditLoading(false);
        } catch (e) {
            setAddEditLoading(false);
            showSnackbar(
                e?.response?.data?.message ||
                e?.response?.data?.Message ||
                e?.response?.data?.errors?.Name[0] ||
                e?.response?.data?.result?.message ||
                "Something Went Wrong", "error");
        }
    };

    const handlePublishConfirmToggle = async () => {
        const unpublishdata = {recordGuid: publishContext?.bundle?.recordGuid};
        const publishdata = {
            recordGuid: publishContext?.bundle?.recordGuid,
            ...(publishFrom && {PublishFrom: FROMDATEConvertToTimesStmp(publishFrom)}),
            ...(publishTo && {PublishTo: TODATEConvertToTimesStmp(publishTo)}),
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
                if (selectedTab === "Assign") {
                    getAllAssignedBundle();
                } else {
                    getAllUnAssignedBundle();
                }
                setPublishContext({
                    open: false,
                    bundle: null,
                });
                showSnackbar(response?.data?.message, "success");
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

    return (
        <Box className="page_container">
            <Box className="section_container scroll" mt={2}>
                <Grid
                    item
                    xs={12}
                    className={`sub_section_container`}
                >
                    <Box mb={2}>
                        <Collapse in={showFilter} timeout={750}>
                            <AdvancedSearch
                                body={
                                    <Box sx={{width: "100%"}} mt={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <CustomAsyncPaginate
                                                    value={provider}
                                                    onChange={(value) => {
                                                        setProvider(value);
                                                        setErrorProvider(false);
                                                    }}
                                                    label="Provider"
                                                    method="POST"
                                                    placeholder="Select Provider"
                                                    apiFunction={GET_ALL_PROVIDER_API}
                                                    labelPath={"bundleTypeDetails"}
                                                    dataPath="data.data.providers"
                                                    params={{typeTag: "GENERAL"}}
                                                />
                                                {errorProvider && (
                                                    <FormHelperText sx={{color: "red"}}>
                                                        Provider is required
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                            <Grid item xs={4}>
                                                <CustomAsyncPaginate
                                                    value={category}
                                                    onChange={(value) => {
                                                        setCategory(value);
                                                        setErrorCategory(false);
                                                    }}
                                                    placeholder="Select Category"
                                                    label="Category"
                                                    apiFunction={GET_BUNDLE_CATEGORIES}
                                                    dataPath={"data.data.items"}
                                                    labelPath={"bundleCategoryDetails"}
                                                    isNested={true}
                                                />
                                                {errorCategory && (
                                                    <FormHelperText sx={{color: "red"}}>
                                                        Category is required
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                            <Grid item xs={4}>
                                                <CustomAsyncPaginate
                                                    value={reseller}
                                                    onChange={(value) => {
                                                        setReseller(value);
                                                        setErrorReseller(false);
                                                    }}
                                                    placeholder="Select Reseller"
                                                    label="Reseller"
                                                    apiFunction={GET_ALL_RESELLER_API}
                                                    dataPath={"data.data.clients"}
                                                    params={{type: "RESELLER", StatusTag: "APPROVED"}}
                                                    customLabel={(item) =>
                                                        `${item.firstName} - ${item.name}`
                                                    }
                                                />
                                                {errorReseller && (
                                                    <FormHelperText sx={{color: "red"}}>
                                                        Reseller is required
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Box>
                                }
                                handleFilterSearch={applyFilter}
                                handleFilterReset={resetFilters}
                                setShowAdvanceSearch={setShowFilter}
                                hasMoreFilter={false}
                                loading={loading}
                                hideButton={false}
                            />
                        </Collapse>
                    </Box>
                    <Grid
                        fullWidth
                        xs={12}
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}
                    >
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
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        className="mb-0"
                        mt={2}
                    >
                        {/* Buttons Section */}
                    </Grid>

                    <Grid size={{xs: 12, md: 8}}>
                        {providerBackup && resellerBackup && categoryBackup && (
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

                                {rowSelectionModel.length > 0 &&
                                    ((selectedTab == "Unassign" && actions?.includes("Add Bulk")) ||
                                        (selectedTab != "Unassign" && actions?.includes("Edit Bulk"))) && (
                                        <Button
                                            className="mui-btn primary filled"
                                            startIcon={<SyncAltIcon/>}
                                            disabled={data?.length == 0}
                                            onClick={() => {
                                                setOpenBulk(true);
                                                setCurrency(null);
                                                setCostPercentage(null)
                                            }}
                                            sx={{
                                                whiteSpace: "nowrap",
                                                ml: 1,
                                            }}
                                        >
                                            {selectedTab == "Unassign" ? "Set Bulk Cost" : "Unset Bulk Cost"}
                                        </Button>
                                    )}
                            </Grid>
                        )}
                        <Box mt={2}></Box>
                        {showTable && (
                            <MuiTable
                                rowId="recordGuid"
                                columns={columns}
                                data={data}
                                loading={loading}
                                setPaginationModel={setPaginationModel}
                                paginationModel={paginationModel}
                                totalRows={totalRows}
                                rowSelectionModel={rowSelectionModel}
                                setRowSelectionModel={setRowSelectionModel}
                            />
                        )}

                        <ManageSetCost
                            onClose={() => setOpenCost(false)}
                            open={openCost}
                            loading={addEditloading}
                            reseller={reseller}
                            bundle={selectedBundle}
                            selectedTab={selectedTab}
                            setCost={setCost}
                            cost={cost}
                            setCurrency={setCurrency}
                            Currency={Currency}
                            rate={rate}
                            onConfirm={selectedTab == "Unassign" ? handleAddCost : handleEditCost}
                        />
                        <ManageBulkCost
                            onClose={() => setOpenBulk(false)}
                            open={openBulk}
                            loading={addEditBulkLoading}
                            selectedTab={selectedTab}
                            setBundleIds={setBundleIds}
                            bundleIds={bundleIds}
                            reseller={reseller}
                            rowSelectionModel={rowSelectionModel}
                            setRowSelectionModel={setRowSelectionModel}
                            setCostPercentage={setCostPercentage}
                            costPercentage={costPercentage}
                            provider={provider}
                            category={category}
                            setCurrency={setCurrency}
                            Currency={Currency}
                            paginationModel={paginationModel}
                            onConfirm={
                                selectedTab == "Unassign" ? handleAddBulkCost : handleRemoveBulkCost
                            }
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
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default GetActions(AssignReseller);
