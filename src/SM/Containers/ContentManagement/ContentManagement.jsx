import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import {useFormik} from "formik";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import ManageContent from "./ManageContent";
import {Add} from "@mui/icons-material";
import {
    GET_ALL_CATEGORY,
    GET_ALL_CONTENT_TYPE,
    GET_LATEST_CONTENT,
    POST_CONTENT,
    UPDATE_CONTENT,
} from "../../../APIs/CatalogApi";
import {handleMessageError} from "../../Utils/Functions";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import GetActions from "../../Utils/GetActions";
import {GET_ALL_RESELLER_API} from "../../../APIs/Resellers";
import {AsyncPaginate} from "react-select-async-paginate";

function ContentManagement() {
    const [contentOptions, setContentOptions] = useState([]);
    const [contentTypeOption, setContentTypeOption] = useState(null);
    const [manageAdd, setManageAdd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedTag, setSelectedTag] = useState("");
    const [editorContent, setEditorContent] = useState("");
    const [recordGuid, setRecordGuid] = useState("");
    const [hasData, setHasData] = useState("");
    const [isContentModified, setIsContentModified] = useState(false);
    const {showSnackbar} = useSnackbar();

    const formik = useFormik({
        initialValues: {
            content: "",
            reseller: null,
        },
        onSubmit: async (values) => {
            const selectedOption = contentOptions.find(
                (option) => option.value === values.content
            );
            const tag = selectedOption ? selectedOption.label : "";

            if (!hasData && hasData === "") {
                const payload = {
                    ContentTypeGuid: contentTypeOption,
                    contentCategoryGuid: values.content,
                    ClientGuid: values.reseller.value,
                    tag: tag,
                    contentDetails: [
                        {
                            languageCode: "en",
                            name: "",
                            description: editorContent,
                        },
                    ],
                    isActive: true,
                };
                setLoading(true);
                try {
                    let response = await POST_CONTENT({postData: payload});
                    if (response?.data?.success) {
                        showSnackbar(response?.data?.message);
                        setIsContentModified(false);
                    } else {
                        showSnackbar(response?.data?.message);
                    }
                } catch (e) {
                    showSnackbar(handleMessageError({e, type: "validation"}), "error");
                } finally {
                    setLoading(false);
                }
            } else {
                const payload = {
                    recordGuid: recordGuid,
                    contentCategoryGuid: values.content,
                    ClientGuid: values.reseller.value,
                    tag: tag,
                    isActive: true,
                    contentDetails: [
                        {
                            languageCode: "en",
                            name: "name 1",
                            description: editorContent,
                        },
                    ],
                };
                setLoading(true);
                try {
                    let response = await UPDATE_CONTENT({postData: payload});
                    if (response?.data?.success) {
                        showSnackbar(response?.data?.message);
                        setIsContentModified(false);
                    } else {
                        showSnackbar(response?.data?.message);
                    }
                } catch (e) {
                    showSnackbar(handleMessageError({e, type: "validation"}), "error");
                } finally {
                    setLoading(false);
                }
            }
        },
    });

    const handleAddMange = () => {
        setManageAdd(true);
    };

    const getAllCategory = async () => {
        setLoading(true);
        try {
            let response = await GET_ALL_CATEGORY();
            const options = response?.data?.data?.items?.map((item) => ({
                value: item?.recordGuid,
                label: item?.tag,
            }));
            setContentOptions(options);
        } catch (e) {
            showSnackbar(handleMessageError({e, type: "validation"}), "error");
        } finally {
            setLoading(false);
        }
    };

    const getAllContentType = async () => {
        setLoading(true);
        try {
            let response = await GET_ALL_CONTENT_TYPE();
            const option = response?.data?.data?.items?.filter(
                (item) => item?.tag == "HTML"
            )[0]?.recordGuid;
            setContentTypeOption(option);
        } catch (e) {
            showSnackbar(handleMessageError({e, type: "validation"}), "error");
        } finally {
            setLoading(false);
        }
    };

    const getContentByTag = async (tag) => {
        setLoading(true);
        const data = {
            ClientGuid: formik?.values?.reseller?.value,
            Tag: tag,
        };

        try {
            let response = await GET_LATEST_CONTENT({postData: data});
            const items = response?.data?.data?.item || [];
            const contentDetails = items?.contentDetails || [];
            const recordGuid = items?.recordGuid || [];
            const description = contentDetails[0]?.description;

            setEditorContent(description);
            setHasData(description ?? "");
            setIsContentModified(false);
            setRecordGuid(recordGuid);
        } catch (e) {
            showSnackbar(handleMessageError({e, type: "validation"}), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleContentChange = (event) => {
        const selectedValue = event.target.value;
        const selectedOption = contentOptions.find(
            (option) => option.value === selectedValue
        );
        const tag = selectedOption ? selectedOption.label : "";
        setSelectedTag(tag);
        getContentByTag(tag);
        formik.handleChange(event);
    };

    const handleCancel = () => {
        setSelectedTag("");
        formik.setFieldValue("content", "");
        setEditorContent("");
        setIsContentModified(false);
    };

    const handleEditorChange = (content) => {
        setEditorContent(content);
        setIsContentModified(true);
    };

    const loadResellerOptions = async (search, loadedOptions, {page}) => {
        try {
            let response = await GET_ALL_RESELLER_API({
                pageNumber: page,
                pageSize: 10,
                search,
                type: "RESELLER",
            });

            if (response.status !== 200) {
                throw new Error("Failed to fetch data");
            }

            const hasMore =
                (page - 1) * 10 + response?.data?.data?.clients?.length <
                response?.data?.data?.totalRows;

            return {
                options: response?.data?.data?.clients?.map((item) => ({
                    value: item?.recordGuid,
                    label: item?.name,
                })),
                hasMore,
                additional: {
                    page: page + 1,
                },
            };
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
            return {options: [], hasMore: false}; // Return empty options and mark as no more data
        }
    };

    useEffect(() => {
        getAllCategory();
        getAllContentType();
    }, []);

    return (
        <Box className="page_container">
            <Typography variant="h6" my={2}>
                Content Management
            </Typography>
            <Card
                className="kpi-card p-4 my-2"
                sx={{overflow: "inherit", width: "90%"}}
            >
                <Grid container spacing={2}>
                    <Grid item xs={4} mt={1.5}>
                        <FormControl fullWidth variant="standard">
                            <AsyncPaginate
                                id="async-menu-style-reseller"
                                value={formik?.values?.reseller}
                                loadOptions={loadResellerOptions}
                                additional={{
                                    page: 1,
                                }}
                                onChange={(value) => {
                                    formik.setFieldValue("reseller", value);
                                    formik.setFieldValue("content", ""); // Reset client when reseller changes
                                    setSelectedTag(null);
                                    // setRandomValue(Math.random());
                                }}
                                placeholder="Reseller"
                                classNamePrefix="react-select"
                                styles={{
                                    container: (base) => ({
                                        ...base,
                                        width: "100%",
                                        backgroundColor: "transparent !important",
                                    }),
                                    control: (base, state) => ({
                                        ...base,
                                        width: "100%",
                                        backgroundColor: "transparent !important",
                                        zIndex: state.isFocused ? 1 : 0,
                                        border: "none", // Remove the default border
                                        borderBottom: state.isFocused
                                            ? "1px solid #949494"
                                            : "1px solid #949494", // Custom underline color
                                        borderRadius: 0, // No rounded corners
                                        boxShadow: "none", // Remove box-shadow
                                        "&:hover": {
                                            borderBottom: "1px solid #949494", // Underline effect on hover with the custom color
                                        },
                                    }),
                                    placeholder: (base) => ({
                                        ...base,
                                        color: "#6c757d", // Slightly grayish color for placeholder
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: "#495057", // Default text color
                                    }),
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999, // Make sure it's above everything
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        zIndex: 1000, // Higher z-index to bring it above other elements
                                    }),
                                    backgroundColor: "transparent !important",
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={4} lg={3}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel
                                id="content-label"
                                error={
                                    formik.touched["content"] && Boolean(formik.errors["content"])
                                }
                            >
                                Content category
                            </InputLabel>
                            <Select
                                key="content"
                                name="content"
                                label="Content Type"
                                labelId="content-label"
                                value={formik.values.content}
                                onChange={handleContentChange}
                                onBlur={formik.handleBlur}
                                disabled={!formik?.values?.reseller}
                                error={formik.touched.content && Boolean(formik.errors.content)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {contentOptions?.map((item) => (
                                    <MenuItem key={item?.value} value={item?.value}>
                                        {item?.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        sm={4}
                        lg={2}
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "flex-end",
                        }} // Align to the right
                    >
                        <Button
                            className="mui-btn primary filled spacing-tp"
                            id="send-service-provider-id"
                            onClick={() => handleAddMange()}
                            startIcon={<Add/>}
                            fullWidth
                        >
                            Add Category
                        </Button>
                    </Grid>
                </Grid>
            </Card>

            <Grid container spacing={2}></Grid>

            {selectedTag && (
                <Grid container spacing={2} marginTop={2}>
                    <Grid item xs={10}>
                        {loading ? (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    zIndex: 10,
                                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                                }}
                            >
                                <CircularProgress/>
                            </div>
                        ) : (
                            <ReactQuill
                                value={editorContent}
                                onChange={handleEditorChange}
                                style={{height: "400px"}}
                            />
                        )}
                    </Grid>
                </Grid>
            )}
            {selectedTag && (
                <Grid container spacing={2} marginTop={4}>
                    <Grid item xs={10}>
                        <Button
                            className="mui-btn primary outlined"
                            id="send-service-feature-id"
                            disabled={loading}
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="mui-btn primary filled"
                            id="send-service-feature-id"
                            disabled={loading || !isContentModified}
                            onClick={formik.handleSubmit}
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            )}

            {manageAdd && (
                <MuiModal
                    title="Add"
                    open={manageAdd}
                    width="500px"
                    id="edit-contact-form"
                    handleClose={() => setManageAdd(false)}
                >
                    <ManageContent
                        loading={loading}
                        setLoading={setLoading}
                        setManageAdd={setManageAdd}
                        getAllCategory={getAllCategory}
                    />
                </MuiModal>
            )}
        </Box>
    );
}

export default GetActions(ContentManagement);
