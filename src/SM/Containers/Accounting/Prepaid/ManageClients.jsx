import {Button, FormHelperText, Grid, InputLabel, useTheme,} from "@mui/material";
import {useFormik} from "formik";
import React, {useEffect, useState} from "react";

import {AsyncPaginate} from "react-select-async-paginate";
import {GET_ALL_CLIENT_API, POST_CLIENTS,} from "../../../../APIs/Prepaid";
import {useSnackbar} from "../../../../Contexts/SnackbarContext";
import {handleMessageError} from "../../../Utils/Functions";
import * as Yup from "yup";
import {GET_ALL_RESELLER_API} from "../../../../APIs/Resellers.jsx";

const addValidation = Yup.object().shape({
    // client: Yup.object().required("Client is required"),
    reseller: Yup.object().required("Reseller is required"),
});

export default function ManagePrepaid({
                                          setmanageAddPrepaid,
                                          getAllPrepaid,
                                          client,
                                          reseller,
                                      }) {
    const [loading, setLoading] = useState(false);
    const {showSnackbar} = useSnackbar();

    const [randomValue, setRandomValue] = useState("");
    const theme = useTheme();

    const formik = useFormik({
        initialValues: {
            reseller: reseller || "",
            client: client || "",
        },
        validationSchema: addValidation,
        onSubmit: async (values) => {
            const payload = {
                ClientGuid:
                    values.client == "" ? values.reseller.value : values.client.value,
                BalanceLimit: values.balanceLimit,
            };
            setLoading(true);
            try {
                let response = await POST_CLIENTS({postData: payload});

                if (response?.status === 200) {
                    getAllPrepaid();
                    showSnackbar(response?.data?.message);
                    setmanageAddPrepaid(false);
                } else {
                    showSnackbar(response?.message);
                }
            } catch (e) {
                showSnackbar(handleMessageError({e, type: "validation"}), "error");
            } finally {
                setLoading(false);
            }
        },
    });

    const getAllClient = async (
        ParentId,
        search = "",
        loadedOptions = [],
        {page = 1, recordGuid} = {}
    ) => {
        setLoading(true);
        try {
            let response = await GET_ALL_CLIENT_API({
                ParentId: ParentId.value,
                pageNumber: page,
                search: search,
                pageSize: 10,
                TypeTag: "RESELLER",
            });
            const options = response?.data?.data?.clients?.map((item) => ({
                value: item?.recordGuid,
                label: item?.name,
            }));

            // setClientOptions(options);
            const hasMore =
                (page - 1) * 10 + response?.data?.data?.clients?.length <
                response?.data?.data?.totalRows;

            return {
                options: options,
                hasMore,
                additional: {
                    page: page + 1,
                },
            };
        } catch (e) {
            showSnackbar(handleMessageError({e, type: "validation"}), "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (reseller) {
            formik.setFieldValue("reseller", reseller);
            getAllClient(reseller);
        }
    }, [reseller]);

    const loadResellerOptions = async (search, loadedOptions, {page}) => {
        try {
            let response = await GET_ALL_RESELLER_API({
                pageNumber: page,
                pageSize: 10,
                search,
                type: "RESELLER",
                StatusTag: "APPROVED"
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
                    label: `${item.firstName} - ${item.name}`,
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
    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {formik?.values?.reseller != "" &&
                    formik?.values?.reseller != undefined ? (
                        <InputLabel
                            error={
                                formik?.touched["reseller"] &&
                                Boolean(formik?.errors["reseller"])
                            }
                            helperText={
                                formik?.touched["reseller"] && formik?.errors["reseller"]
                            }
                            sx={{fontSize: "12px", marginBottom: "-5px"}}
                        >
                            Reseller
                        </InputLabel>
                    ) : (
                        <InputLabel sx={{marginTop: "10px"}}/>
                    )}
                    <AsyncPaginate
                        key={randomValue}
                        id="async-menu-style"
                        value={formik?.values?.reseller}
                        loadOptions={loadResellerOptions}
                        additional={{
                            page: 1,
                        }}
                        onChange={(value) => {
                            formik.setFieldValue("reseller", value);
                            formik.setFieldValue("client", ""); // Reset client when reseller changes

                            setRandomValue(Math.random());
                        }}
                        placeholder="Reseller"
                        classNamePrefix="react-select"
                    />

                    {formik.touched.reseller && formik.errors.reseller && (
                        <FormHelperText style={{color: theme?.palette?.error?.main}}>
                            {formik.errors.reseller}
                        </FormHelperText>
                    )}
                </Grid>
                <Grid item xs={12}>
                    {formik?.values?.client != "" &&
                    formik?.values?.client != undefined ? (
                        <InputLabel
                            // error={
                            //   formik?.touched["client"] && Boolean(formik?.errors["client"])
                            // }
                            // helperText={formik?.touched["client"] && formik?.errors["client"]}
                            // sx={{ fontSize: "12px", marginBottom: "-5px" }}
                        >
                            Client
                        </InputLabel>
                    ) : (
                        <InputLabel sx={{marginTop: "10px"}}/>
                    )}
                    <AsyncPaginate
                        key={randomValue}
                        id="async-menu-style"
                        value={formik?.values?.client}
                        debounceTimeout={3000}
                        loadOptions={(search, loadedOptions, additional) =>
                            getAllClient(
                                formik?.values?.reseller,
                                search,
                                loadedOptions,
                                additional
                            )
                        }
                        additional={{
                            page: 1,
                        }}
                        onChange={(value) => {
                            formik?.setFieldValue("client", value);
                        }}
                        isDisabled={!formik.values.reseller}
                        placeholder="Client"
                        classNamePrefix="react-select"
                    />

                    {formik.touched.client && formik.errors.client && (
                        <FormHelperText style={{color: theme?.palette?.error?.main}}>
                            {formik.errors.client}
                        </FormHelperText>
                    )}
                </Grid>
                <Grid
                    item
                    xs={12}
                    display={"flex"}
                    justifyContent={"end"}
                    alignItems={"center"}
                >
                    <Button
                        type="submit"
                        className="mui-btn primary filled"
                        id="send-service-provider-id"
                        disabled={loading}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
