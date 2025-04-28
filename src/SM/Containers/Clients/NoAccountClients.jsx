import {Add} from "@mui/icons-material";
import {Box, Grid, IconButton, Tooltip,} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {GET_ALL_DASHBOARD_CLIENTS_API, GET_CLIENT,} from "../../../APIs/Clients";
import {GET_THRESHOLD} from "../../../APIs/Postpaid";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import {handleMessageError} from "../../Utils/Functions";
import GetActions from "../../Utils/GetActions";
import ManageCreateClientAccount from "./ManageCreateClientAccount";

function NoAccountClients() {
    const {showSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState({});
    const [parent, setParent] = useState(null);
    const {token} = useSelector((state) => state.authentication);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [totalRows, setTotalRows] = useState(0);
    const [Data, setData] = useState([]);
    const [valueThreshold, setValueThreshold] = useState("");

    const getAllConfiguration = async () => {
        setLoading(true);
        try {
            let response = await GET_THRESHOLD({PageSize: "1000"});
            // setGlobalConfiguration(response?.data?.data?.globalConfigurations);
            setValueThreshold(
                response?.data?.data?.globalConfigurations?.find(
                    (x) => x?.key === "BILLING.CLIENT_POSTPAID_THRESHOLD_PERCENTAGE"
                )?.value
            );
        } catch (e) {
            showSnackbar(handleMessageError({e, type: "validation"}), "error");
        } finally {
            setLoading(false);
        }
    };

    const getNoAccountClients = async () => {
        setLoading(true);
        try {
            let response = await GET_ALL_DASHBOARD_CLIENTS_API({
                token,
                search: "",
                pageSize: paginationModel?.pageSize,
                pageNumber: parseInt(paginationModel?.page) + 1,
                HasAccount: false,
                ParentGuid: null,
                CategoryTag: "DEFAULT",
            });
            const data =
                response?.data?.data?.clients?.length > 0
                    ? response?.data?.data?.clients?.map((item) => ({
                        ...item,
                    }))
                    : [];

            setData(data);
            setTotalRows(response?.data?.data?.totalRows ?? 0);
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
        } finally {
            setLoading(false);
        }
    };
    const handelCloseModal = () => {
        setSelectedClient({});
        setParent(null);
        setOpenModal(false);
    };
    const getParent = async (ParentGuid) => {
        setLoading(true);
        try {
            let response = await GET_CLIENT({
                client: ParentGuid,
            });
            const data = response?.data?.data?.client
                ? response?.data?.data?.client
                : null;

            setParent(data);
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getNoAccountClients();
    }, [paginationModel]);
    useEffect(() => {
        if (selectedClient?.parentGuid) {
            getParent(selectedClient?.parentGuid);
        }
    }, [selectedClient]);

    useEffect(() => {
        getAllConfiguration();
    }, []);
    useEffect(() => {
        if (parent != null && selectedClient != null) {
            setOpenModal(true);
        }
    }, [parent && selectedClient]);
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
                        <Grid item xs={12} marginTop={2}>
                            <MuiTable
                                columns={[
                                    {
                                        field: "name",
                                        headerName: "Name",
                                        flex: 1,
                                    },
                                    {
                                        field: "email",
                                        headerName: "Email",
                                        flex: 1,
                                    },
                                    {
                                        field: "actions",
                                        headerName: "Actions",
                                        flex: 1,
                                        renderCell: (params) => (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "left",
                                                    alignItems: "left",
                                                    width: "100%",
                                                }}
                                            >
                                                <Tooltip title="Create Account">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedClient(params.row);
                                                        }}
                                                    >
                                                        <Add/>
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        ),
                                    },
                                ]}
                                data={Data}
                                loading={loading}
                                setPaginationModel={setPaginationModel}
                                paginationModel={paginationModel}
                                totalRows={totalRows}
                            />
                            {openModal && (
                                <MuiModal
                                    title="Create Account"
                                    open={openModal}
                                    width="500px"
                                    id="edit-contact-form"
                                    handleClose={handelCloseModal}
                                >
                                    <ManageCreateClientAccount
                                        handelCloseModal={handelCloseModal}
                                        client={selectedClient}
                                        reseller={parent}
                                        valueThreshold={valueThreshold}
                                        getNoAccountClients={getNoAccountClients}
                                    />
                                </MuiModal>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default GetActions(NoAccountClients);
