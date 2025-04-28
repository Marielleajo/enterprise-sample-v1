import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Tab,
    Tabs,
    Tooltip,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import MuiTable from "../../../../Components/MuiTable/MuiTable.jsx";
import {useSnackbar} from "../../../../Contexts/SnackbarContext.jsx";
import {handleMessageError, removeNullKeys} from "../../../Utils/Functions.jsx";

import {Add, Delete, Edit} from "@mui/icons-material";
import Swal from "sweetalert2";
import {GET_ALL_COUNTRIES_API, GET_CURRENCIES,} from "../../../../APIs/Criteria.jsx";
import {DELETE_FEE, GET_ALL_FEE_CATEGORIES, GET_ALL_FEE_TYPES, GET_ALL_FEES,} from "../../../../APIs/EWallet.jsx";
import swalDeleteFunction from "../../../../Components/SwalDeleteFunction.jsx";
import GetActions from "../../../Utils/GetActions.jsx";
import ManageFees from "./ManageFees.jsx";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AdvancedSearch from "../../../../Components/AdvancedSearch/AdvancedSearch.jsx";
import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate.jsx";
import {GET_ALL_CRITERIA_API} from "../../../../APIs/BundleListing.jsx";

const Fees = () => {
    const {showSnackbar} = useSnackbar();
    const [Data, setData] = useState([]);
    const [firstLoading, setFirstLoading] = useState(true);
    const [tabs, setTabs] = useState([]);
    const [ShowFilter, SetShowFilter] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const {token} = useSelector((state) => state.authentication);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [totalRows, setTotalRows] = useState(0);
    const [feeCategoryChoices, setFeeCategoryChoices] = useState([]);
    const [currencyChoices, setCurrencyChoices] = useState([]);
    const [countryChoices, setCountryChoices] = useState([]);
    const [showForm, setshowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedFee, setSelectedFee] = useState([]);
    const [FeeCategoryTag, setFeeCategoryTag] = useState(null);
    const [FeeCategoryTagBackup, setFeeCategoryTagBackup] = useState(null);
    const [PricingModelTag, setPricingModelTag] = useState(null);
    const [PricingModelTagBackup, setPricingModelTagBackup] = useState(null);
    const [IsActive, setIsActive] = useState("");
    const [IsActiveBackup, setIsActiveBackup] = useState("");

    const getAllFees = async () => {
        let postData = {
            PageSize: paginationModel?.pageSize,
            PageIndex: parseInt(paginationModel?.page) + 1,
            typeFilter: tabs[selectedTab]?.recordGuid,
            FeeCategoryTag: FeeCategoryTagBackup?.data?.tag ?? null,
            IsActive: IsActiveBackup ?? null,
            PricingModelTag: PricingModelTagBackup?.data?.tag ?? null,
        };
        setLoading(true);
        try {
            let response = await GET_ALL_FEES({
                postData: removeNullKeys(postData),
            });
            const data =
                response?.data?.data?.fees?.length > 0
                    ? response?.data?.data?.fees
                    : [];
            setData(data);
            setTotalRows(response?.data?.data?.totalRows ?? 0);
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
        } finally {
            setLoading(false);
        }
    };

    const getAllCountries = async () => {
        setLoading(true);
        try {
            let countriesResponse = await GET_ALL_COUNTRIES_API({});
            setCountryChoices(countriesResponse?.data?.data?.countries);
            setLoading(false);
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
            setLoading(false);
        }
    };
    const getFeeCategoryChoices = async () => {
        setLoading(true);
        try {
            let categoriesResponse = await GET_ALL_FEE_CATEGORIES({
                pageSize: 100,
                pageNumber: 1,
            });
            setFeeCategoryChoices(categoriesResponse?.data?.data?.data?.map((item) => ({
                label: item?.tag,
                value: item?.recordGuid
            })));
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
            setLoading(false);
        }
    };

    const getCurrencies = async () => {
        setLoading(true);
        try {
            let currencyResponse = await GET_CURRENCIES(token);
            setCurrencyChoices(currencyResponse?.data?.data?.currencies || []);
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
            setLoading(false);
        }
    };

    const getFeeTypesChoices = async () => {
        setLoading(true);
        try {
            let typesResponse = await GET_ALL_FEE_TYPES({
                pageSize: 100,
                pageNumber: 1,
            });


            const data = typesResponse?.data?.data?.data?.map((item) => {
                const englishDetails = item
                    ?.details?.find(
                        (detail) => detail.languageCode === "en"
                    );

                return {
                    ...item,
                    name: englishDetails?.name || " - ",
                    description: englishDetails?.description || " - ",
                };
            });
            setTabs(data);
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrencies();
        getFeeCategoryChoices();
        getAllCountries();
    }, []);

    const handleSearch = async () => {
        setFeeCategoryTagBackup(FeeCategoryTag)
        setPricingModelTagBackup(PricingModelTag)
        setIsActiveBackup(IsActive);
        setPaginationModel({
            page: 0,
            pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
    };

    const handleClearFilters = async () => {
        setFeeCategoryTagBackup(null);
        setPricingModelTagBackup(null);
        setFeeCategoryTag(null);
        setPricingModelTag(null)
        setIsActive("");
        setIsActiveBackup("");
        setPaginationModel({
            page: 0,
            pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    getFeeTypesChoices(),
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
                setFirstLoading(false);
            }
        };
        fetchData();
    }, []);


    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleEditManage = (value) => {
        setSelectedFee(value);
        setshowForm(true);
        setIsEdit(true);
    };

    const DeleteFee = async (value) => {
        const result = await swalDeleteFunction();
        if (result.isConfirmed) {
            try {
                setLoading(true);
                const deleteResponse = await DELETE_FEE(value?.recordGuid);
                if (deleteResponse?.data?.success) {
                    Swal.fire({
                        title: "Fee Deleted Successfully",
                        icon: "success",
                    });
                } else {
                    Swal.fire({
                        title: "Error Deleting Fee",
                        text: "Unknown Error",
                        icon: "error",
                    });
                }
                getAllFees();
            } catch (error) {
                Swal.fire({
                    title: "Error Deleting Fee",
                    text: handleMessageError(error),
                    icon: "error",
                });
            } finally {
                setLoading(false);
            }
        }
    };
    const handleCancel = () => {
        setshowForm(false);
        setIsEdit(false);
        setSelectedFee([]);
    };

    useEffect(() => {
        tabs[selectedTab] && getAllFees();
    }, [paginationModel, tabs[selectedTab]]);

    if (firstLoading) {
        return (
            <Box className="Loader">
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Box className="page_container">
            <Box className="section_container scroll" mt={2}>
                <Grid item xs={12} className={`sub_section_container ${firstLoading ? "hide" : ""}`} paddingRight={2.5}>


                    {!showForm ? (
                        <Grid item xs={12}>
                            <Grid
                                fullWidth
                                xs={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                                pr={2}
                            >
                                <Tabs
                                    value={selectedTab}
                                    onChange={handleTabChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                >
                                    {tabs?.map((tab, index) => (
                                        <Tab
                                            key={index}
                                            label={tab.name}
                                            id="languagebox"
                                            className={
                                                selectedTab === index ? "active-lang-tab" : "lang-tab"
                                            }
                                        />
                                    ))}
                                </Tabs>
                                <Box>
                                    <Button
                                        className="mui-btn primary filled"
                                        onClick={() => {
                                            setshowForm(true);
                                        }}
                                        startIcon={<Add/>}
                                        disabled={loading}
                                    >
                                        Add Fee
                                    </Button>
                                    {!ShowFilter && (
                                        <Button
                                            className="mui-btn primary  outlined"
                                            onClick={() => SetShowFilter(true)}
                                            startIcon={<FilterAltIcon/>}
                                        >
                                            Filter by
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            {ShowFilter && (
                                <AdvancedSearch
                                    body={
                                        <Box sx={{width: "100%"}} mt={1}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <CustomAsyncPaginate
                                                        onChange={(value) => setFeeCategoryTag(value)}
                                                        value={FeeCategoryTag}
                                                        label="Fee Category"
                                                        placeholder="Select Fee Category"
                                                        apiFunction={GET_ALL_FEE_CATEGORIES}
                                                        dataPath={"data.data.data"}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <CustomAsyncPaginate
                                                        onChange={(value) => setPricingModelTag(value)}
                                                        value={PricingModelTag}
                                                        label="Pricing Modal"
                                                        placeholder="Select Pricing Modal"
                                                        apiFunction={({search}) => {
                                                            return GET_ALL_CRITERIA_API({
                                                                postData: {
                                                                    CategoryTags: ["BUNDLE_PRICING_TYPE"],
                                                                    SearchKeyword: search ? search : "",
                                                                },
                                                            });
                                                        }}
                                                        type="POST"
                                                        dataPath={"data.data.criteria"}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6} md={4}>
                                                    <FormControl fullWidth variant="standard">
                                                        <InputLabel id="status-label">Status</InputLabel>
                                                        <Select
                                                            labelId="status-label"
                                                            id="status"
                                                            value={IsActive}
                                                            onChange={(e) => setIsActive(e.target.value)}
                                                        >
                                                            <MenuItem value={""}>None</MenuItem>
                                                            <MenuItem value={1}>Active</MenuItem>
                                                            <MenuItem value={0}>Inactive</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    }
                                    handleFilterSearch={handleSearch}
                                    handleFilterReset={handleClearFilters}
                                    setShowAdvanceSearch={SetShowFilter}
                                    hasMoreFilter={false}
                                    loading={loading}
                                />
                            )}
                            <Box>
                                <MuiTable
                                    rowId="recordGuid"
                                    columns={[
                                        {
                                            field: "name",
                                            headerName: "Fee Name",
                                            flex: 1,
                                        },
                                        {
                                            field: "description",
                                            headerName: "Description",
                                            flex: 1,
                                        },
                                        // {
                                        //     field: "feeType",
                                        //     headerName: "Fee Type",
                                        //     flex: 1,
                                        //     renderCell: (params) => params?.row?.feeType?.tag
                                        // },
                                        {
                                            field: "feeCategory",
                                            headerName: "Fee Category",
                                            flex: 1,
                                            renderCell: (params) => params?.row?.feeCategory?.tag ?? "-"
                                        },
                                        {
                                            field: "amount",
                                            headerName: "Amount",
                                            flex: 1,
                                        },
                                        {
                                            field: "pricingModal",
                                            headerName: "Pricing Model",
                                            flex: 1,
                                        },
                                        {
                                            field: "conditions",
                                            headerName: "Conditions",
                                            flex: 1,
                                        },
                                        // {
                                        //   field: "sourceCountry",
                                        //   headerName: "Source Country",
                                        //   align: "center",
                                        //   flex: 1,
                                        //   renderCell: (params) => (
                                        //     <span style={{ color: `#008B8B` }}>
                                        //       {params?.value?.name}
                                        //     </span>
                                        //   ),
                                        // },
                                        // {
                                        //   field: "sourceCurrency",
                                        //   headerName: "Source Currency",
                                        //   align: "center",
                                        //   flex: 1,
                                        //   renderCell: (params) => (
                                        //     <span style={{ color: `#008B8B` }}>
                                        //       {params?.value?.name}
                                        //     </span>
                                        //   ),
                                        // },
                                        // {
                                        //   field: "destinationCountry",
                                        //   headerName: "Dest. Country",
                                        //   align: "center",
                                        //   flex: 1,
                                        //   renderCell: (params) => (
                                        //     <span style={{ color: `Blue` }}>
                                        //       {params?.value?.name}
                                        //     </span>
                                        //   ),
                                        // },
                                        // {
                                        //   field: "destinationCurrency",
                                        //   headerName: "Dest. Currency",
                                        //   align: "center",
                                        //   flex: 1,
                                        //   renderCell: (params) => (
                                        //     <span style={{ color: `Blue` }}>
                                        //       {params?.value?.name}
                                        //     </span>
                                        //   ),
                                        // },

                                        // {
                                        //   field: "minValue",
                                        //   headerName: "Min Value",
                                        //   align: "center",
                                        //   flex: 1,
                                        //   renderCell: (params) => (
                                        //     <span style={{ color: `red` }}>{params?.value}</span>
                                        //   ),
                                        // },
                                        // {
                                        //   field: "maxValue",
                                        //   headerName: "Max Value",
                                        //   align: "center",
                                        //   flex: 1,
                                        //   renderCell: (params) => (
                                        //     <span style={{ color: `green` }}>{params?.value}</span>
                                        //   ),
                                        // },
                                        // {
                                        //   field: "feePercentage",
                                        //   headerName: "Percentage ",
                                        //   align: "center",
                                        //   flex: 1,
                                        //   renderCell: (params) => (
                                        //     <span style={{ color: `orange` }}>
                                        //       {params?.value} %
                                        //     </span>
                                        //   ),
                                        // },
                                        {
                                            field: "actions",
                                            headerName: "Actions",
                                            flex: 1,
                                            renderCell: (params) => (
                                                <>
                                                    <Tooltip title="Edit Fee">
                                                        <IconButton
                                                            onClick={() => handleEditManage(params?.row)}
                                                            size="small"
                                                        >
                                                            <Edit/>
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Fee">
                                                        <IconButton
                                                            onClick={() => DeleteFee(params?.row)}
                                                            size="small"
                                                        >
                                                            <Delete/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
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
                        </Grid>
                    ) : (
                        <Grid item xs={12} marginTop={2}>
                            <ManageFees
                                isEdit={isEdit}
                                loading={loading}
                                selectedFee={selectedFee}
                                getAllFees={getAllFees}
                                setLoading={setLoading}
                                currencies={currencyChoices}
                                countries={countryChoices}
                                feeCategoryChoices={feeCategoryChoices}
                                tabs={tabs}
                                FeeType={tabs[selectedTab]}
                                handleCancel={handleCancel}
                            />
                        </Grid>
                    )}

                </Grid>
            </Box>
        </Box>
    );
};

export default GetActions(Fees);
