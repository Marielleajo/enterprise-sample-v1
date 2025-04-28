import {Box, Breadcrumbs, Grid, Typography,} from "@mui/material";
import {useEffect, useState} from "react";
import {withTranslation} from "react-i18next";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import {handleMessageError} from "../../Utils/Functions";
import {GET_ALL_PROVIDER_ACCOUNTS} from "../../../APIs/Providers";
import {ArrowBack} from "@mui/icons-material";

const ProviderAccounts = ({t, selectedProvider, setShowProviderAccount}) => {
    const {showSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [totalRows, SetTotalRows] = useState(0);

    // Get Provider Accounts
    const getAllProviderAccounts = async () => {
        setLoading(true);
        try {
            let response = await GET_ALL_PROVIDER_ACCOUNTS({
                ProviderGuid: selectedProvider?.recordGuid,
            });
            const data = response?.data?.data?.providerAccounts ?? [];
            setData(data);
            SetTotalRows(response?.data?.data?.totalRows ?? 0);
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllProviderAccounts();
    }, []);

    return (
        <Grid container id="Reseller" className="page_container">
            <Grid container>
                <Grid item xs={12}>
                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                        <Typography
                            style={{
                                cursor: "pointer",
                            }}
                            className="breadcrumbactiveBtn"
                            onClick={() => setShowProviderAccount(false)}
                        >
                            <ArrowBack fontSize={"small"}/> {selectedProvider?.name}
                        </Typography>
                    </Breadcrumbs>
                </Grid>
            </Grid>
            <Grid container className="">
                <Grid item xs={12} className="sub_section_container">
                    <Grid item xs={12} mt={1}>
                        <MuiTable
                            rowId="recordGuid"
                            columns={[
                                {
                                    field: "accountNumber",
                                    headerName: "Account Name",
                                    minWidth: 180,
                                    flex: 1,
                                },
                                {
                                    field: "accountTypeTag",
                                    headerName: "Account Type",
                                    minWidth: 180,
                                    flex: 1,
                                },
                                {
                                    field: "serviceTag",
                                    headerName: "Service",
                                    minWidth: 180,
                                    flex: 1,
                                },
                                {
                                    headerName: "Status",
                                    field: "status",
                                    minWidth: 100,
                                    renderCell: (params) => {
                                        return (
                                            <Box mt={1}>
                                                <Typography
                                                    style={{
                                                        color:
                                                            params?.row?.accountStatusTag === "ACTIVE"
                                                                ? "green"
                                                                : "red",
                                                    }}
                                                >
                                                    {params?.row?.accountStatusTag === "ACTIVE"
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Typography>
                                            </Box>
                                        );
                                    },
                                },
                                {
                                    headerName: "Created Date",
                                    field: "createdDate",
                                    flex: 1,
                                },
                            ]}
                            data={data}
                            loading={loading}
                            disableColumnMenu={false}
                            setPaginationModel={setPaginationModel}
                            paginationModel={paginationModel}
                            totalRows={totalRows}
                            hideFooterPagination={true}
                        />
                    </Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default withTranslation("translation")(ProviderAccounts);
