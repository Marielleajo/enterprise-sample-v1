import {Button, Grid, TextField, Typography} from "@mui/material";
import {useFormik} from "formik";
import React from "react";
import {withTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import * as Yup from "yup";
import {ADD_CRITERIA_DATA, UPDATE_CRITERIA_DATA} from "../../../APIs/RejectionReason.jsx";
import {useSnackbar} from "../../../Contexts/SnackbarContext.jsx";

const ManageRejectionReason = ({
                                   handleClose,
                                   isEdit,
                                   selectedRow,
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
            })
        ),
    });

    const formik = useFormik({
        initialValues: {
            details: language.map((lang) => ({
                languageCode: lang.code,
                name:
                    selectedRow?.details?.find(
                        (detail) => detail.languageCode === lang.code
                    )?.name || "",
                description:
                    selectedRow?.details?.find(
                        (detail) => detail.languageCode === lang.code
                    )?.description || "",
            })),
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    details: values?.details?.filter(
                        (item) =>
                            item.name
                    ),
                    name: values?.details?.find(
                        (item) =>
                            item?.languageCode === "en"
                    )?.name,
                    description: values?.details?.find(
                        (item) =>
                            item?.languageCode === "en"
                    )?.description,
                    isEditable: true,
                    CriteriaCategoryTag: "SIGNUP_REJECTION_REASON",
                    CriteriaTypeTag: "CLIENT",
                    isActive: true,

                };
                const response = isEdit
                    ? await UPDATE_CRITERIA_DATA({
                        ...payload,
                        criteriaGuid: selectedRow?.recordGuid,
                    })
                    : await ADD_CRITERIA_DATA(payload);
                if (response?.success) {
                    showSnackbar(
                        isEdit
                            ? "Rejection Reason Updated Successfully!"
                            : "Rejection Reason Added Successfully!",
                        "success"
                    );
                    onSave();
                    handleClose();
                }
            } catch (e) {
                showSnackbar(
                    e?.response?.data?.message ||
                    e?.response?.data?.errors?.Name[0] ||
                    e?.response?.data?.result?.message ||
                    "Something Went Wrong",
                    "error"
                );
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
                                                <TextField
                                                    variant="standard"
                                                    fullWidth
                                                    name={`details[${language.findIndex(
                                                        (lang) => lang.code === selectedLanguage?.code
                                                    )}].name`}
                                                    label={`Name in ${selectedLanguage?.name} `}
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
                                                            language.findIndex((lang) => lang?.code === "en")
                                                            ]?.name
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField
                                                    variant="standard"
                                                    fullWidth
                                                    name={`details[${language.findIndex(
                                                        (lang) => lang.code === selectedLanguage?.code
                                                    )}].description`}
                                                    label={`Description in ${selectedLanguage?.name}`}
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
                                                            language.findIndex((lang) => lang?.code === "en")
                                                            ]?.description
                                                    }
                                                />
                                            </Grid>
                                        </>
                                    )}
                                    <Grid
                                        container
                                        justifyBundle="flex-end"
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

export default withTranslation("translation")(ManageRejectionReason);
