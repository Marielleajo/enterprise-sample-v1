import {Box, CircularProgress, Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";

import {useSnackbar} from "../../../Contexts/SnackbarContext";

import {GET_BUNDLE_CATEGORIES, GET_ZONES} from "../../../APIs/BundleListing";
import BundleListing from "./BundleListing";
import {handleMessageError} from "../../Utils/Functions.jsx";
import GetActions from "../../Utils/GetActions.jsx";

function BundleListPage({actions}) {
    const [firstLoading, setFirstLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [tabs, setTabs] = useState([]);
    const [selectedTab, setSelectedTab] = useState(null);
    const [globalRegionId, setGlobalRegionId] = useState(null);
    const {showSnackbar} = useSnackbar();

    const [formState, setFormState] = useState({open: false, bundle: null});

    const getBundleCategories = async () => {
        try {
            const response = await GET_BUNDLE_CATEGORIES({});
            if (response.data.success) {
                const formattedTabs = response.data.data.items
                    .map((item) => ({
                        text:
                            item.tag.charAt(0).toUpperCase() +
                            item.tag.slice(1).toLowerCase(),
                        value: item.tag,
                        data: item,
                    }))
                    .sort((a, b) => a.text.localeCompare(b.text));

                setTabs(formattedTabs);
                setSelectedTab(formattedTabs[0]?.value || null);
            }
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
        }
    };

    const getGlobalRegionId = async () => {
        try {
            const response = await GET_ZONES({});
            if (response.data?.success) {
                const globalId =
                    response.data?.data?.zones?.find((zone) => zone.tag === "GLOBAL")
                        ?.recordGuid || null;
                setGlobalRegionId(globalId);
            }
        } catch (e) {
            showSnackbar(handleMessageError({e}), "error");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    getBundleCategories(),
                    globalRegionId == null ? getGlobalRegionId() : Promise.resolve(),
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
                setFirstLoading(false);
            }
        };
        fetchData();
    }, []);


    return (
        <Box className="page_container">
            <Box className="section_container scroll" mt={2}>
                <Grid item xs={12} className={` ${firstLoading ? "hide" : ""}`}>
                    {loading ? (
                        <Box className="Loader">
                            <CircularProgress/>
                        </Box>
                    ) : (
                        <Box className="pt-2">
                            {selectedTab ? (
                                <BundleListing
                                    category={tabs.find((tab) => tab.value === selectedTab)}
                                    globalRegionId={globalRegionId}
                                    setFormState={setFormState}
                                    formState={formState}
                                    selectedTab={selectedTab}
                                    setSelectedTab={setSelectedTab}
                                    tabs={tabs}
                                    actions={actions}
                                />
                            ) : (
                                <Typography>No Selected Category</Typography>
                            )}
                        </Box>
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
}

export default GetActions(BundleListPage);
