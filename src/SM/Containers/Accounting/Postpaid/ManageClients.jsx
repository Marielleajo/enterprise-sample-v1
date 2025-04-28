import {Button, FormControl, FormControlLabel, Grid, Switch, TextField, useTheme,} from "@mui/material";
import {useFormik} from "formik";
import React, {useEffect, useState} from "react";
import * as Yup from "yup";
import {GET_ALL_CLIENT_API, GET_ALL_RESELLER_API, POST_CLIENTS,} from "../../../../APIs/Postpaid";
import {useSnackbar} from "../../../../Contexts/SnackbarContext";
import {handleMessageError} from "../../../Utils/Functions";
import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";

const addValidation = Yup.object().shape({
    // client: Yup.object().required("Client is required"),
    reseller: Yup.object().required("Reseller is required"),
    balanceLimit: Yup.string()
        .required("Balance Limit is required")
        .typeError("Balance Limit must be a number"),
});

export default function ManagePostpaid({
                                           setmanageAddPostpaid,
                                           getAllPostpaid,
                                           client,
                                           reseller,
                                           valueThreshold,
                                       }) {
    const [resellerId, setResellerId] = useState("");
    const [clientOptions, setClientOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const {showSnackbar} = useSnackbar();
    const theme = useTheme();
    const [unlimetedBalance, setUnlimetedBalance] = useState(false);
    const [randomValue, setRandomValue] = useState("");
    const formik = useFormik({
        initialValues: {
            reseller: reseller || "",
            client: client || "",
            threshold: "",
            balanceLimit: "",
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
                if (response?.data?.success) {
                    getAllPostpaid();
                    setmanageAddPostpaid(false);
                    showSnackbar(response?.data?.message);
                } else {
                    showSnackbar(response?.data?.message);
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
            });
            const options = response?.data?.data?.clients?.map((item) => ({
                value: item?.recordGuid,
                label: item?.name,
            }));

            setClientOptions(options);
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

    const handleResellerChange = async (value) => {
        const selectedReseller = value.value;
        // formik.setFieldValue("reseller", selectedReseller);
        if (selectedReseller) {
            setResellerId(selectedReseller);
            await getAllClient(selectedReseller);
        } else {
            setClientOptions([]);
        }
        formik.setFieldValue("client", "");
    };

    const handleNumberChange = (e) => {
        let value = e.target.value;

        // If the value is empty or just a negative sign, allow it
        if (value === "" || value === "-") {
            formik.setFieldValue("balanceLimit", value);
            return;
        }

        // Ensure the value starts with a negative sign and follows the number pattern
        if (/^-?\d*\.?\d*$/.test(value)) {
            if (!value.startsWith("-")) {
                value = `-${value}`;
            }
            formik.setFieldValue("balanceLimit", value);
        }
    };

    // useEffect(() => {
    //   getAllReseller();
    // }, []);

    useEffect(() => {
        if (reseller) {
            formik.setFieldValue("reseller", reseller);
            getAllClient(reseller);
        }
    }, [reseller]);

    useEffect(() => {
        if (unlimetedBalance) {
            formik.setValues({
                ...formik.values,
                balanceLimit: -1,
                threshold: -0.85,
            });
        } else {
            formik.setValues({
                ...formik.values,
                balanceLimit: "",
                threshold: "",
            });
        }
    }, [unlimetedBalance]);

    useEffect(() => {
        if (
            formik.values.balanceLimit &&
            !isNaN(formik.values.balanceLimit) &&
            !unlimetedBalance
        ) {
            const thresholdValue = (
                parseFloat(formik.values.balanceLimit) *
                (valueThreshold / 100)
            ).toFixed(2);
            formik.setFieldValue("threshold", thresholdValue);
        } else {
            formik.setFieldValue("threshold", "");
        }
    }, [formik.values.balanceLimit, valueThreshold, unlimetedBalance]);

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{marginTop: "10px"}}>
                    {/* {formik?.values?.reseller != "" &&
          formik?.values?.reseller != undefined ? (
            <InputLabel
              error={
                formik?.touched["reseller"] &&
                Boolean(formik?.errors["reseller"])
              }
              helperText={
                formik?.touched["reseller"] && formik?.errors["reseller"]
              }
              sx={{ fontSize: "12px", marginBottom: "-5px" }}
            >
              Reseller
            </InputLabel>
          ) : (
            <InputLabel sx={{ marginTop: "10px" }} />
          )}
          <AsyncPaginate
            id="async-menu-style"
            value={formik?.values?.reseller}
            loadOptions={loadOptions}
            additional={{
              page: 1,
            }}
            onChange={(value) => {
              formik.setFieldValue("reseller", value);
              handleResellerChange(value);
              setRandomValue(Math.random());
            }}
            placeholder="Reseller"
            classNamePrefix="react-select"
          />

          {formik.touched.reseller && formik.errors.reseller && (
            <FormHelperText style={{ color: theme?.palette?.error?.main }}>
              {formik.errors.reseller}
            </FormHelperText>
          )} */}
                    <CustomAsyncPaginate
                        // key={randomValue}
                        apiFunction={GET_ALL_RESELLER_API} // Pass the function directly
                        value={formik?.values?.reseller}
                        onChange={(value) => {
                            formik.setFieldValue("reseller", value);
                            formik.setFieldValue("client", ""); // Reset client when reseller changes
                            setClientOptions([]); // Clear client options when reseller changes
                            setRandomValue(Math.random());
                        }}
                        placeholder="Reseller"
                        pageSize={10}
                        dataPath="data.data.clients" // Adjust path based on API response structure
                        totalRowsPath="data.data.totalRows"
                        method="GET"
                        id={`async-menu-style`}
                        // isDisabled={!formik.values.reseller}
                        isNested={false}
                        params={{TypeTag: "RESELLER", StatusTag: "APPROVED"}}
                        customLabel={(item) => `${item.firstName} - ${item.name}`}
                    />
                </Grid>
                <Grid item xs={12}>
                    {/* {formik?.values?.client != "" &&
          formik?.values?.client != undefined ? (
            <InputLabel
              error={
                formik?.touched["client"] && Boolean(formik?.errors["client"])
              }
              helperText={formik?.touched["client"] && formik?.errors["client"]}
              sx={{ fontSize: "12px", marginBottom: "-5px" }}
            >
              Client
            </InputLabel>
          ) : (
            <InputLabel sx={{ marginTop: "10px" }} />
          )}
          <AsyncPaginate
            key={randomValue}
            id="async-menu-style"
            value={formik.values.client}
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
            isDisabled={!formik.values.reseller}
            onChange={(value) => {
              formik.setFieldValue("client", value);
              // handleResellerChange(value);
            }}
            placeholder="Client"
            classNamePrefix="react-select"
          />

          {formik.touched.client && formik.errors.client && (
            <FormHelperText style={{ color: theme?.palette?.error?.main }}>
              {formik.errors.client}
            </FormHelperText>
          )} */}
                    <CustomAsyncPaginate
                        key={randomValue}
                        apiFunction={GET_ALL_CLIENT_API} // Pass the function directly
                        value={formik?.values?.client}
                        onChange={(value) => {
                            formik.setFieldValue("client", value);
                        }}
                        placeholder="Client"
                        pageSize={10}
                        dataPath="data.data.clients" // Adjust path based on API response structure
                        totalRowsPath="data.data.totalRows"
                        method="GET"
                        id={`async-menu-style`}
                        isDisabled={!formik.values.reseller}
                        isNested={false}
                        params={{
                            TypeTag: "RESELLER",
                            ParentId: formik?.values?.reseller.value,
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl variant="standard" fullWidth>
                        <TextField
                            key={"balanceLimit"}
                            fullWidth
                            id={"balanceLimit"}
                            name={"balanceLimit"}
                            label={"Balance Limit"}
                            variant="standard"
                            type="text"
                            value={formik.values.balanceLimit}
                            onChange={handleNumberChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.balanceLimit &&
                                Boolean(formik.errors.balanceLimit)
                            }
                            helperText={
                                formik.touched.balanceLimit && formik.errors.balanceLimit
                            }
                            disabled={unlimetedBalance}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl variant="standard" fullWidth>
                        <TextField
                            key={"threshold"}
                            fullWidth
                            id={"threshold"}
                            name={"threshold"}
                            label={`Threshold ${valueThreshold}%`}
                            variant="standard"
                            type="text"
                            value={formik.values.threshold}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.threshold && Boolean(formik.errors.threshold)
                            }
                            helperText={formik.touched.threshold && formik.errors.threshold}
                            disabled
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={unlimetedBalance}
                                onChange={() => {
                                    setUnlimetedBalance(!unlimetedBalance);
                                }}
                            />
                        }
                        label="Unlimited balance"
                    />
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
