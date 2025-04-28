import {Add, Download, Edit} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {Box, Button, FormControl, Grid, IconButton, TextField, Tooltip,} from "@mui/material";
import React, {useEffect, useState} from "react";
import {withTranslation} from "react-i18next";
import Swal from "sweetalert2";
import {
    DELETE_PROVIDERSCATEGORIES,
    EXPORT_ALL_PROVIDERSCATEGORIES,
    GET_ALL_PROVIDERSCATEGORIES,
} from "../../../APIs/Providers";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import {handleMessageError} from "../../Utils/Functions";
import ManageProviderCategory from "./ManageProviderCategory";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import GetActions from "../../Utils/GetActions";

function ProviderCategory({t, actions}) {
    const [loading, setLoading] = useState(false);
    const [Data, SetData] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [totalRows, SetTotalRows] = useState(0);
    const [manageAddProviderCategory, setManageAddProviderCategory] =
        useState(false);
    const [manageEditProviderCategory, setManageEditProviderCategory] =
        useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const {showSnackbar} = useSnackbar();
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [name, setName] = useState("");

    const handleFilterReset = () => {
        setName("");
        setPaginationModel({pageSize: 10, page: 0});
    };

    const handleFilterSearch = () => {
        setPaginationModel({
            pageSize: 10,
            page: 0,
        });
    };

    const getAllProviderCategories = async () => {
        setLoading(true);
        try {
            let response = await GET_ALL_PROVIDERSCATEGORIES({
                pageNumber: paginationModel?.page + 1,
                pageSize: paginationModel?.pageSize,
                Name: name || null,
            });
            const data =
                response?.data?.data?.providerCategories?.length > 0
                    ? response?.data?.data?.providerCategories?.map((item) => ({
                        ...item,
                        name: item?.providerCategoryDetails[0]?.name,
                        description: item?.providerCategoryDetails[0]?.description,
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

    const exportAllProviderCategories = async () => {
        setLoading(true);
        try {
            let response = await EXPORT_ALL_PROVIDERSCATEGORIES({Name: name});
            const data = response?.data;
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Provider Categories.csv`); // Set the desired file name
            document.body.appendChild(link);
            link.click();
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleManageEditProviderCategory = (data) => {
        setSelectedCategory(data);
        setManageEditProviderCategory(true);
    };

    const DeleteProviderCategory = async (value) => {
        // Show a confirmation dialog using SweetAlert
        const result = await swalDeleteFunction();
        if (result.isConfirmed) {
            try {
                // Set loading to true while the deletion is in progress
                setLoading(true);

                // Execute all delete promises in parallel
                const deleteResponses = await DELETE_PROVIDERSCATEGORIES({
                    recordGuid: value?.recordGuid,
                });

                if (deleteResponses?.data?.success) {
                    Swal.fire({
                        title: "Provider Category Deleted Successfully",
                        icon: "success",
                    });
                } else {
                    // Handle failure, e.g., display an error message for each failed deletion
                    Swal.fire({
                        title: "Error Updating Status",
                        text: "Unknown Error",
                        icon: "error",
                    });
                }

                // Refresh your data or perform any necessary actions
                getAllProviderCategories();
            } catch (e) {
                Swal.fire({
                    title: "Error Updating Status",
                    text: handleMessageError({e}),
                    icon: "error",
                });
            } finally {
                // Set loading back to false when the operation is complete
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        getAllProviderCategories();
    }, [paginationModel]);

    return (
        <Box className="page_container">
            <Grid container columnSpacing={3} className="section_container scroll">
                <Grid item xs={12} className="sub_section_container">
                    <Grid
                        container
                        className="pt-4"
                        paddingRight={2.5}
                        display={"flex"}
                        justifyContent={"start"}
                        alignItems={"center"}
                    >
                        <Grid
                            item
                            xs={12}
                            md={12}
                            display={"flex"}
                            justifyContent={"end"}
                            alignItems={"center"}
                        >
                            {actions.includes("Export") && (
                                <Button
                                    className="mui-btn grey filled"
                                    id="send-service-provider-id"
                                    onClick={() => exportAllProviderCategories()}
                                    startIcon={<Download/>}
                                >
                                    Export
                                </Button>
                            )}

                            <Button
                                className="mui-btn primary outlined"
                                id="send-service-country-id"
                                onClick={() => setShowAdvanceSearch(!showAdvanceSearch)}
                            >
                                <FilterAltIcon fontSize="small"/>
                            </Button>
                            {actions.includes("Add") && (
                                <Button
                                    className="mui-btn primary filled"
                                    id="send-service-provider-id"
                                    startIcon={<Add/>}
                                    onClick={() => setManageAddProviderCategory(true)}
                                >
                                    Add Provider Category
                                </Button>
                            )}

                        </Grid>
                        {showAdvanceSearch && (
                            <Grid item xs={12}>
                                <AdvancedSearch
                                    showAdvanceSearch={showAdvanceSearch}
                                    handleFilterReset={handleFilterReset}
                                    handleFilterSearch={handleFilterSearch}
                                    setShowAdvanceSearch={setShowAdvanceSearch}
                                    body={
                                        <>
                                            <Grid item xs={4}>
                                                <FormControl fullWidth variant="standard">
                                                    <TextField
                                                        key={"name"}
                                                        fullWidth
                                                        id={"name"}
                                                        name={"Name"}
                                                        label="Search by Name"
                                                        variant="standard"
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e?.target?.value)}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    }
                                />
                            </Grid>
                        )}
                        <Grid item xs={12} marginTop={2}>
                            <MuiTable
                                rowId="recordGuid"
                                columns={[
                                    {
                                        field: "name",
                                        headerName: "Name",
                                        minWidth: 100,
                                        flex: 1,
                                    },
                                    {
                                        field: "description",
                                        headerName: "Description",
                                        flex: 1,
                                        minWidth: 180,
                                    },

                                    ...(actions.includes("Delete") ||
                                    actions.includes("Edit")
                                        ? [
                                            {
                                                field: "actions",
                                                headerName: "Actions",
                                                flex: 1,
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
                                                            {actions.includes("Edit") && (

                                                                <Tooltip title="Edit Provider Category">
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            handleManageEditProviderCategory(params?.row)
                                                                        }
                                                                        size="small"
                                                                        id="editCost"
                                                                    >
                                                                        <Edit/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                            {actions.includes("Delete") && (
                                                                <Tooltip title="Delete Provider Category">
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            DeleteProviderCategory(params?.row)
                                                                        }
                                                                        size="small"
                                                                        id="editCost"
                                                                    >
                                                                        <DeleteIcon/>
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
                                data={Data}
                                loading={loading}
                                setPaginationModel={setPaginationModel}
                                paginationModel={paginationModel}
                                totalRows={totalRows}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {manageAddProviderCategory && (
                <MuiModal
                    title="Add Provider Category"
                    open={manageAddProviderCategory}
                    width="500px"
                    id="edit-contact-form"
                    handleClose={() => setManageAddProviderCategory(false)}
                >
                    <ManageProviderCategory
                        type="add"
                        loading={loading}
                        setLoading={setLoading}
                        setManageAddProviderCategory={setManageAddProviderCategory}
                        getAllProviderCategories={getAllProviderCategories}
                    />
                </MuiModal>
            )}

            {manageEditProviderCategory && (
                <MuiModal
                    title="Edit Provider Category"
                    open={manageEditProviderCategory}
                    width="500px"
                    id="edit-contact-form"
                    handleClose={() => setManageEditProviderCategory(false)}
                >
                    <ManageProviderCategory
                        type="edit"
                        loading={loading}
                        setLoading={setLoading}
                        setManageEditProviderCategory={setManageEditProviderCategory}
                        getAllProviderCategories={getAllProviderCategories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                </MuiModal>
            )}
        </Box>
    );
}

export default withTranslation("translations")(GetActions(ProviderCategory));
