import {Add, Download, Downloading, Edit, FilterAlt} from "@mui/icons-material";
import {Box, Button, CircularProgress, Grid, IconButton, TextField, Tooltip,} from "@mui/material";
import React, {useEffect, useState} from "react";
import {withTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {handleMessageError, useHandleApiError,} from "../../Utils/Functions.jsx";
import {useSnackbar} from "../../../Contexts/SnackbarContext.jsx";
import {
    EXPORT_DATA_SEED_LIST,
    GET_ALL_DATA_SEED_LIST,
    UPDATE_CRITERIA_STATUS,
} from "../../../APIs/RejectionReason.jsx";
import MuiTable from "../../../Components/MuiTable/MuiTable.jsx";
import StatusSwitch from "../../../Components/StatusSwitch.jsx";
import LanguageTabs from "../../../Components/Language/LanguageTabs.jsx";
import ManageRejectionReason from "./ManageRejectionReason.jsx";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch.jsx";
import GetActions from "../../Utils/GetActions.jsx";

const RejectionReason = ({t, actions}) => {
    let {token, username} = useSelector((state) => state?.authentication);
    const {showSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [Data, SetData] = useState([]);
    const [isExportLoading, setExportLoading] = useState(false);

    const [isLoading2, setLoading2] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [ShowFilter, SetShowFilter] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const HandleApiError = useHandleApiError();
    const [totalRows, SetTotalRows] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchQueryBackup, setSearchQueryBackup] = useState("");

    const [selectedRow, setSelectedRow] = useState("");
    const [showManageReason, setShowManageReason] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState({
        name: "English",
        code: "en",
    });
    const [languageChangeLoading, setLanguageChangeLoading] = useState(false);

    const location = useLocation();

    const getAllDataSeedList = async () => {
        setLoading2(true);
        try {
            let dataSeedListResponse = await GET_ALL_DATA_SEED_LIST({
                pageSize: paginationModel?.pageSize,
                pageNumber: parseInt(paginationModel?.page) + 1,
                categoryTags: "SIGNUP_REJECTION_REASON",
                search: searchQueryBackup ?? null,
            });
            const data = dataSeedListResponse?.data?.data?.criteria?.map((item) => ({
                ...item,
            }));
            SetData(data);
            SetTotalRows(dataSeedListResponse?.data?.data?.totalRows);
        } catch (e) {
            HandleApiError(e);
        } finally {
            setLoading2(false);
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setSearchQueryBackup(searchQuery);
        setPaginationModel({
            page: 0,
            pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
    };

    const handleClearFilters = async () => {
        setSearchQuery("");
        setSearchQueryBackup("");
        setPaginationModel({
            page: 0,
            pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
    };


    useEffect(() => {
        getAllDataSeedList();
    }, [paginationModel]);

    const handleAddbtn = () => {
        setSelectedRow(null);
        setIsEditMode(false);
        setShowManageReason(true);
    };
    const handleEditRow = (data) => {
        setSelectedRow(data);
        setIsEditMode(true);
        setShowManageReason(true);
    };

    const handleStatus = async (recordGuid) => {
        const result = await Swal.fire({
            title: "Confirm Status Update",
            text: "Are you sure you want to update this status?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#dd3333",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "No, cancel",
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                let updateResponse = await UPDATE_CRITERIA_STATUS({
                    token,
                    data: {
                        RecordGuid: recordGuid,
                    },
                });
                if (updateResponse?.data?.success) {
                    showSnackbar(updateResponse?.data?.message, "success");
                    getAllDataSeedList();
                }
            } catch (e) {
                Swal.fire({
                    title: "Error Updating Status",
                    text: handleMessageError({e}),
                    icon: "error",
                });
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
        setShowManageReason(false);
        setSelectedLanguage({
            name: "English",
            code: "en",
        });
    };


    const refreshCategories = () => {
        setShowManageReason(false);
        getAllDataSeedList();
        setSelectedLanguage({
            name: "English",
            code: "en",
        });
    };


    const handleExportButton = async () => {
        setExportLoading(true);
        const data = {
            categoryTags: "SIGNUP_REJECTION_REASON",
            SearchKeyword: searchQueryBackup ?? null,
        };
        try {
            let response = await EXPORT_DATA_SEED_LIST(data);
            if (response?.data) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "List.csv");
                document.body.appendChild(link);
                link.click();
                link.remove();
                showSnackbar("Export Successful", "success");
            }
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
        } finally {
            setExportLoading(false);
        }
    };


    return (
        <Box id="Reseller" className="page_container">
            <Box className="section_container scroll" mt={2}>
                <Grid
                    container
                    className="sub_section_container "
                    alignContent={"flex-start"}
                    paddingRight={2.5}
                >
                    {Loading ? (
                        <Box className="Loader">
                            <CircularProgress/>
                        </Box>
                    ) : !showManageReason ? (
                        <>
                            <Grid item xs={12}>
                                {actions.includes("Add") && (

                                    <Button
                                        className="mui-btn primary filled"
                                        startIcon={<Add/>}
                                        onClick={handleAddbtn}
                                    >
                                        Add Rejection Reason
                                    </Button>
                                )}
                                {!ShowFilter && (
                                    <Button
                                        className="mui-btn primary outlined"
                                        onClick={() =>
                                            SetShowFilter(true)
                                        }
                                        startIcon={<FilterAlt/>}
                                    >
                                        Filter by
                                    </Button>
                                )}
                                {actions.includes("Export") && (
                                    <Button
                                        className="mui-btn primary outlined"
                                        startIcon={
                                            isExportLoading ? <Downloading/> : <Download/>
                                        }
                                        onClick={() =>
                                            handleExportButton()
                                        }
                                        disabled={isExportLoading}
                                        style={{
                                            cursor: isExportLoading
                                                ? "not-allowed !important"
                                                : "pointer",
                                            opacity: isExportLoading ? 0.7 : 1,
                                        }}
                                    >
                                        Export
                                    </Button>
                                )}
                            </Grid>

                            {ShowFilter && (
                                <AdvancedSearch
                                    body={
                                        <Box sx={{width: "100%"}} mt={1}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        label="Name"
                                                        variant="standard"
                                                        fullWidth
                                                        name="name"
                                                        onChange={(e) =>
                                                            setSearchQuery(e?.target?.value)
                                                        }
                                                        value={searchQuery}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    }
                                    handleFilterSearch={handleSearch}
                                    handleFilterReset={handleClearFilters}
                                    setShowAdvanceSearch={SetShowFilter}
                                    hasMoreFilter={false}
                                    loading={isLoading2}
                                />
                            )}

                            <Grid item xs={12} marginTop={2}>
                                <MuiTable
                                    rowId={"recordGuid"}
                                    columns={[
                                        {field: "name", headerName: "Name", flex: 1},
                                        {
                                            field: "description",
                                            headerName: "Description",
                                            flex: 1,
                                        },
                                        ...(actions.includes("ToggleStatus")
                                            ? [
                                                {
                                                    field: "isActive",
                                                    headerName: "Status",
                                                    flex: 1,
                                                    renderCell: (params) => (
                                                        <StatusSwitch
                                                            isActive={params.row.isActive}
                                                            onChange={() =>
                                                                handleStatus(
                                                                    params.row.recordGuid,
                                                                )
                                                            }
                                                        />
                                                    ),
                                                },
                                            ]
                                            : []),
                                        ...(actions.includes("Edit")
                                            ? [
                                                {
                                                    field: "actions",
                                                    headerName: "Actions",
                                                    flex: 1,
                                                    renderCell: (params) => (
                                                        <Box display="flex" alignItems="center">
                                                            {params?.row?.isEditable && (
                                                                <Tooltip title="Edit" placement="top">
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            handleEditRow(params?.row)
                                                                        }}
                                                                        size="small"
                                                                        id="edit"
                                                                    >
                                                                        <Edit className="editIcon"/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </Box>
                                                    ),
                                                },
                                            ]
                                            : []),

                                    ]}
                                    data={Data}
                                    loading={isLoading2}
                                    setPaginationModel={setPaginationModel}
                                    paginationModel={paginationModel}
                                    totalRows={totalRows}
                                />
                            </Grid>
                        </>
                    ) : (
                        <>
                            <Grid item xs={12} marginLeft={2} sx={{zIndex: 1}}>
                                <LanguageTabs
                                    languages={language}
                                    onLanguageChange={handleLanguageChange}
                                    selectedLanguage={selectedLanguage}
                                    setLanguageChangeLoading={setLanguageChangeLoading}
                                />
                            </Grid>
                            <ManageRejectionReason
                                handleClose={handleClose}
                                isEdit={isEditMode}
                                selectedRow={selectedRow}
                                onSave={refreshCategories}
                                selectedLanguage={selectedLanguage}
                                isLoading={isLoading2}
                                languageChangeLoading={languageChangeLoading}
                            />
                        </>
                    )}
                </Grid>


            </Box>
        </Box>
    );
};

export default withTranslation("translation")(GetActions(RejectionReason));
