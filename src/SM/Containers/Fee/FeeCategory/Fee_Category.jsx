import {Add, DeleteOutlineOutlined, Edit, FilterAlt,} from "@mui/icons-material";
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
    TextField,
    Tooltip,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {withTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import Swal from "sweetalert2";
import AdvancedSearch from "../../../../Components/AdvancedSearch/AdvancedSearch";
import MuiTable from "../../../../Components/MuiTable/MuiTable";
import {DELETE_FEE_CATEGORY, FEE_CATEGORY_TOOGLE_STATUS, GET_ALL_FEE_CATEGORIES} from "../../../../APIs/EWallet";
import GetActions from "../../../Utils/GetActions";
import {useHandleApiError} from "../../../Utils/Functions";
import LanguageTabs from "../../../../Components/Language/LanguageTabs";
import Manage_Fee_Category from "./Manage_Fee_Category";
import StatusSwitch from "../../../../Components/StatusSwitch.jsx";
import {useSnackbar} from "../../../../Contexts/SnackbarContext.jsx";

const Fee_Category = ({t, actions}) => {
    const [isLoading, setLoading] = useState(false);
    const [firstLoading, setFirstLoading] = useState(true);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });

    const HandleApiError = useHandleApiError();
    const location = useLocation();
    const {showSnackbar} = useSnackbar();

    const [totalRows, SetTotalRows] = useState(0);
    const [Feecategorys, setFeecategorys] = useState([]);
    const [selectedcategory, setSelectedcategory] = useState("");
    const [ShowFilter, SetShowFilter] = useState(false);
    const [name, setName] = useState("");
    const [nameBackup, setNameBackup] = useState("");
    const [IsActive, setIsActive] = useState("");
    const [IsActiveBackup, setIsActiveBackup] = useState("");
    const [showManagecategory, setShowManagecategory] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState({
        name: "English",
        code: "en",
    });
    const [languageChangeLoading, setLanguageChangeLoading] = useState(false);

    const handleSearch = async () => {
        setNameBackup(name);
        setIsActiveBackup(IsActive);
        setPaginationModel({
            page: 0,
            pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
    };

    const handleClearFilters = async () => {
        setName("");
        setNameBackup("");
        setIsActive("");
        setIsActiveBackup("");
        setPaginationModel({
            page: 0,
            pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
    };

    const handleEditButton = (data) => {
        setSelectedcategory(data);
        setIsEditMode(true);
        setShowManagecategory(true);
    };

    const handleAddButton = () => {
        setSelectedcategory(null);
        setIsEditMode(false);
        setShowManagecategory(true);
    };

    const refreshcategorys = () => {
        setShowManagecategory(false);
        getAllFeecategory();
        setSelectedLanguage({
            name: "English",
            code: "en",
        });
    };

    useEffect(() => {
        getAllFeecategory();
    }, [paginationModel]);

    useEffect(() => {
        setIsEditMode(false);
        setShowManagecategory(false);
    }, [paginationModel, location.key]);


    const getAllFeecategory = async () => {
        setLoading(true);
        try {
            let FeecategoryResponse = await GET_ALL_FEE_CATEGORIES({
                pageSize: paginationModel?.pageSize,
                pageNumber: paginationModel?.page + 1,
                Name: nameBackup,
                IsActive:
                    IsActiveBackup === 1 ? true : IsActiveBackup === 0 ? false : "",
            });
            if (FeecategoryResponse?.data?.success) {
                const data = FeecategoryResponse?.data?.data?.data?.map((item) => {
                    const englishDetails = item
                        ?.details?.find(
                            (detail) => detail.languageCode === "en"
                        );

                    return {
                        ...item,
                        name: englishDetails?.name || " - ",
                        description: englishDetails?.description || " - ",
                        languageCode: englishDetails?.languageCode || " - ",
                        recordGuid: item?.recordGuid || " - ",
                        status: item?.isActive ? "Active" : "Inactive",
                    };
                });

                setFeecategorys(data || []);
                SetTotalRows(FeecategoryResponse?.data?.data?.totalRows);
                setLoading(false);
            }
        } catch (e) {
            HandleApiError(
                e?.response?.data?.message ||
                e?.response?.data?.Message ||
                e?.response?.data?.errors?.Name[0] ||
                e?.response?.data?.result?.message ||
                "Something Went Wrong"
            );
        } finally {
            setLoading(false);
            setFirstLoading(false);
        }
    };

    const handleStatus = async (data, status) => {
        const result = await Swal.fire({
            title: "Confirm Status Update",
            text: `Are you sure you want to update the Status of  ${data.name} category?`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#dd3333",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "No, cancel",
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                let updateResponse = await FEE_CATEGORY_TOOGLE_STATUS(data?.recordGuid);
                if (updateResponse?.data?.success) {
                    showSnackbar(updateResponse?.data?.message, "success");
                    getAllFeecategory();
                }
            } catch (e) {
                showSnackbar(
                    e?.response?.data?.message ||
                    e?.response?.data?.Message ||
                    e?.response?.data?.errors?.Name[0] ||
                    e?.response?.data?.result?.message ||
                    "Something Went Wrong", "error");
            } finally {
                setLoading(false);
            }
        }
    };

    const DeleteFeecategory = async (value) => {
        const result = await Swal.fire({
            title: "Confirm Deletion",
            text: "Are you sure you want to delete this Feecategory?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dd3333",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel",
        });
        if (result.isConfirmed) {
            try {
                setLoading(true);

                const deleteResponses = await DELETE_FEE_CATEGORY(
                    value?.recordGuid
                );

                if (deleteResponses?.data?.success) {
                    showSnackbar(deleteResponses?.data?.message, "success");
                    getAllFeecategory();
                } else {
                    showSnackbar(deleteResponses?.data?.message, "error");
                }
            } catch (e) {
                showSnackbar(
                    e?.response?.data?.message ||
                    e?.response?.data?.Message ||
                    e?.response?.data?.errors?.Name[0] ||
                    e?.response?.data?.result?.message ||
                    "Something Went Wrong", "error");
            } finally {
                setLoading(false);
            }
        }
    };

    let {language} = useSelector((state) => state?.system);

    const handleLanguageChange = (newLang) => {
        setSelectedLanguage(newLang);
    };
    const handleClose = () => {
        setShowManagecategory(false);
        setSelectedLanguage({
            name: "English",
            code: "en",
        });
    };


    return (
        <Box className="page_container">
            <Box className="section_container scroll" mt={2}>
                <Grid
                    className={`sub_section_container ${firstLoading ? "hide" : ""}`}
                    alignFee={"flex-start"}
                    paddingRight={2.5}
                >
                    {!showManagecategory && (
                        <>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                display={"flex"}
                                justifyContent={"end"}
                                alignItems={"center"}
                            >
                                {!ShowFilter && (
                                    <Button
                                        className="mui-btn primary  outlined"
                                        onClick={() => SetShowFilter(true)}
                                        startIcon={<FilterAlt/>}
                                    >
                                        Filter by
                                    </Button>
                                )}
                                {actions.includes("Add") && (
                                    <Button
                                        className="mui-btn primary filled"
                                        id="send-service-provider-id"
                                        startIcon={<Add/>}
                                        onClick={handleAddButton}
                                    >
                                        Add Fee category
                                    </Button>
                                )}
                            </Grid>

                            {ShowFilter && (
                                <AdvancedSearch
                                    body={
                                        <Box sx={{width: "100%"}} mt={1}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextField
                                                        fullWidth
                                                        label="Name"
                                                        onChange={(e) => setName(e.target.value)}
                                                        variant="standard"
                                                        value={name}
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
                                    loading={isLoading}
                                />
                            )}

                            <Grid item xs={12} marginTop={1}>
                                <MuiTable
                                    rowId={"recordGuid"}
                                    columns={[
                                        {field: "name", headerName: "Category Name", flex: 1},
                                        {
                                            field: "description",
                                            headerName: "Description",
                                            flex: 1,
                                        },
                                        {
                                            field: "isActive",
                                            headerName: "Status",
                                            flex: 1,
                                            renderCell: (params) => (
                                                <StatusSwitch
                                                    isActive={params?.row?.isActive}
                                                    onChange={() =>
                                                        handleStatus(params.row, !params.row?.isActive)
                                                    }
                                                />
                                            ),
                                        },
                                        ...(actions.includes("Edit") || actions.includes("Delete")
                                            ? [
                                                {
                                                    field: "actions",
                                                    headerName: "Actions",
                                                    flex: 1,
                                                    renderCell: (params) => {
                                                        return (
                                                            <Box display="flex" alignItems="center">
                                                                {actions.includes("Edit") && (
                                                                    <Tooltip title="Edit category">
                                                                        <IconButton
                                                                            onClick={() =>
                                                                                handleEditButton(params?.row)
                                                                            }
                                                                            size="small"
                                                                            id="setNewLimit"
                                                                        >
                                                                            <Edit className="editIcon"/>
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                                {actions.includes("Delete") && (
                                                                    <Tooltip title="Delete category">
                                                                        <IconButton
                                                                            onClick={() =>

                                                                                DeleteFeecategory(params?.row)
                                                                            }
                                                                            size="small"
                                                                            id="downPayment"
                                                                        >
                                                                            <DeleteOutlineOutlined
                                                                                className="deleteIcon"/>
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
                                    data={Feecategorys}
                                    loading={isLoading}
                                    setPaginationModel={setPaginationModel}
                                    paginationModel={paginationModel}
                                    totalRows={totalRows}
                                />
                            </Grid>
                        </>
                    )}
                    {showManagecategory && (
                        <>
                            <Grid item xs={12} marginLeft={2} sx={{zIndex: -54}}>
                                <LanguageTabs
                                    languages={language}
                                    onLanguageChange={handleLanguageChange}
                                    selectedLanguage={selectedLanguage}
                                    setLanguageChangeLoading={setLanguageChangeLoading}
                                />
                            </Grid>
                            <Manage_Fee_Category
                                open={showManagecategory}
                                handleClose={handleClose}
                                isEdit={isEditMode}
                                categoryData={selectedcategory}
                                onSave={refreshcategorys}
                                selectedLanguage={selectedLanguage}
                                isLoading={isLoading}
                                languageChangeLoading={languageChangeLoading}
                            />
                        </>
                    )}
                </Grid>
                {firstLoading && (
                    <Box className="Loader">
                        <CircularProgress/>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default withTranslation("translation")(
    GetActions(Fee_Category)
);
