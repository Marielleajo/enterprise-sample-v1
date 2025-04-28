import {Button, FormControl, Grid, TextField, Typography,} from "@mui/material";
import {useFormik} from "formik";
import React from "react";
import {withTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import * as Yup from "yup";
import {ADD_FEE_TYPE, EDIT_FEE_TYPE} from "../../../../APIs/EWallet";
import {useSnackbar} from "../../../../Contexts/SnackbarContext";
import {removeNullKeys} from "../../../Utils/Functions";

const Manage_Fee_Type = ({
                             open,
                             handleClose,
                             isEdit,
                             TypeData,
                             onSave,
                             selectedLanguage,
                             isLoading,
                             languageChangeLoading,
                         }) => {
    const {language} = useSelector((state) => state?.system);
    const {showSnackbar} = useSnackbar();

    const validationSchema = Yup.object().shape({
        details: Yup.array().of(
            Yup.object().shape({
                languageCode: Yup.string().required(),
                name: Yup.string().test(
                    "required-en",
                    "Name in English is required",
                    (value, context) =>
                        context?.parent?.languageCode === "en" ? Boolean(value) : true
                ),
                description: Yup.string().test(
                    "required-en-description",
                    "Description in English is required",
                    (value, context) =>
                        context?.parent?.languageCode === "en" ? Boolean(value) : true
                ),
            })
        ),
    });

    const formik = useFormik({
        initialValues: {
            details: language?.map((lang) => ({
                languageCode: lang.code,
                name:
                    TypeData?.details?.find(
                        (detail) => detail.languageCode === lang.code
                    )?.name || "",
                description:
                    TypeData?.details?.find(
                        (detail) => detail.languageCode === lang.code
                    )?.description || "",
            })),
            active: TypeData?.isActive || true,
            // HasMultiple: TypeData?.hasMultiple || false,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    recordGuid: isEdit ? TypeData?.recordGuid : undefined,
                    Details: values?.details?.filter(
                        (item) =>
                            item?.name && item?.description
                    ),
                    isActive: values.active,
                    // HasMultiple: values.HasMultiple,
                };
                const response = isEdit
                    ? await EDIT_FEE_TYPE({formData: removeNullKeys(payload)})
                    : await ADD_FEE_TYPE({formData: removeNullKeys(payload)});

                if (response?.data?.success) {
                    showSnackbar(response?.data?.message, "success");
                    onSave();
                    handleClose();
                }
            } catch (e) {
                showSnackbar(
                    e?.response?.data?.message ||
                    e?.response?.data?.Message ||
                    e?.response?.data?.errors?.Name[0] ||
                    e?.response?.data?.result?.message ||
                    "Something Went Wrong", "error");
            }
        },
    });

    return (
        <>
            <Grid container>
                <Grid
                    item
                    xs={12}
                    style={{
                        backgroundColor: "white",
                        height: "70vh",
                        borderRadius: "5px",
                        zIndex: 1,
                    }}
                >
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} direction="column">
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    spacing={2}
                                    style={{
                                        backgroundColor: "white",
                                        minHeight: "70vh",
                                        height: "70vh",
                                        borderRadius: "5px",
                                        padding: "2vh",
                                    }}
                                >
                                    {languageChangeLoading || isLoading ? (
                                        <Grid
                                            container
                                            display={"flex"}
                                            justifyContent={"center"}
                                            alignItems={"center"}
                                            style={{minHeight: "59vh"}}
                                        >
                                            <Typography>Loading...</Typography>
                                        </Grid>
                                    ) : (
                                        <>
                                            <Grid item xs={4}>
                                                <FormControl variant="standard" fullWidth>
                                                    <TextField
                                                        id={`name-${selectedLanguage?.code}`}
                                                        name={`details[${language.findIndex(
                                                            (lang) => lang.code === selectedLanguage?.code
                                                        )}].name`}
                                                        label={`Name in ${selectedLanguage?.name} `}
                                                        variant="standard"
                                                        value={
                                                            formik.values.details.find(
                                                                (detail) =>
                                                                    detail.languageCode === selectedLanguage?.code
                                                            )?.name || ""
                                                        }
                                                        onChange={(e) =>
                                                            formik.setFieldValue(
                                                                `details[${language.findIndex(
                                                                    (lang) => lang.code === selectedLanguage?.code
                                                                )}].name`,
                                                                e.target.value
                                                            )
                                                        }
                                                        onBlur={formik.handleBlur}
                                                        error={Boolean(
                                                            formik.touched.details &&
                                                            formik.errors.details?.[
                                                                language.findIndex(
                                                                    (lang) => lang?.code === "en"
                                                                )
                                                                ]?.name
                                                        )}
                                                        helperText={
                                                            formik.touched.details &&
                                                            formik.errors.details?.[
                                                                language.findIndex(
                                                                    (lang) => lang?.code === "en"
                                                                )
                                                                ]?.name
                                                        }
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormControl variant="standard" fullWidth>
                                                    <TextField
                                                        id={`description-${selectedLanguage?.code}`}
                                                        name={`details[${language.findIndex(
                                                            (lang) => lang.code === selectedLanguage?.code
                                                        )}].description`}
                                                        label={`Description in ${selectedLanguage?.name}`}
                                                        variant="standard"
                                                        value={
                                                            formik.values.details.find(
                                                                (detail) =>
                                                                    detail.languageCode === selectedLanguage?.code
                                                            )?.description || ""
                                                        }
                                                        onChange={(e) =>
                                                            formik.setFieldValue(
                                                                `details[${language.findIndex(
                                                                    (lang) => lang.code === selectedLanguage?.code
                                                                )}].description`,
                                                                e.target.value
                                                            )
                                                        }
                                                        onBlur={formik.handleBlur}
                                                        error={Boolean(
                                                            formik.touched.details &&
                                                            formik.errors.details?.[
                                                                language.findIndex(
                                                                    (lang) => lang?.code === "en"
                                                                )
                                                                ]?.description
                                                        )}
                                                        helperText={
                                                            formik.touched.details &&
                                                            formik.errors.details?.[
                                                                language.findIndex(
                                                                    (lang) => lang?.code === "en"
                                                                )
                                                                ]?.description
                                                        }
                                                    />
                                                </FormControl>
                                            </Grid>
                                            {/*<Grid item xs={4} mt={3}>*/}
                                            {/*    <FormControlLabel*/}
                                            {/*        control={*/}
                                            {/*            <MuiCheckbox*/}
                                            {/*                checked={formik.values.HasMultiple}*/}
                                            {/*                onChange={() =>*/}
                                            {/*                    formik.setFieldValue(*/}
                                            {/*                        "HasMultiple",*/}
                                            {/*                        !formik.values.HasMultiple*/}
                                            {/*                    )*/}
                                            {/*                }*/}
                                            {/*            />*/}
                                            {/*        }*/}
                                            {/*        label="Enable Multiple Fee Formats"*/}
                                            {/*    />*/}
                                            {/*</Grid>*/}
                                        </>
                                    )}
                                    <Grid
                                        container
                                        justifyContent="flex-end"
                                        alignItems="center"
                                        className="Cancel_Save"
                                    >
                                        <Button
                                            onClick={handleClose}
                                            className="mui-btn primary outlined"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="mui-btn primary filled"
                                            type="submit"
                                            disabled={formik.isSubmitting}
                                            style={{marginRight: "8px"}}
                                        >
                                            {formik.isSubmitting ? "Saving..." : "Save"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </>
    );
};

export default withTranslation("translation")(Manage_Fee_Type);
