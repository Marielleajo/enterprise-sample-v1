import PersonIcon from "@mui/icons-material/Person";
import {Button, Card, FormControl, Grid, Typography,} from "@mui/material";
import React, {useState} from "react";
import {withTranslation} from "react-i18next";
import {GET_ALL_RESELLER_API} from "../../../APIs/Resellers";
import {AsyncPaginate} from "react-select-async-paginate";
import {handleMessageError} from "../../Utils/Functions";
import {useSnackbar} from "../../../Contexts/SnackbarContext";

const OpeningModal = ({
                          selectedReseller,
                          setSelectedReseller,
                          loading,
                          isApproved = false,
                          resellerOptions,
                      }) => {
    const [tempReseller, setTempReseller] = useState(null);
    const [tempResellerOptions, setTempResellerOptions] = useState(null);

    const {showSnackbar} = useSnackbar();

    const loadResellerOptions = async (search, loadedOptions, {page}) => {
        try {
            let response = await GET_ALL_RESELLER_API({
                pageNumber: page,
                pageSize: 10,
                search,
                type: "RESELLER",
                ...(isApproved && {StatusTag: "APPROVED"})
            });

            const options = response?.data?.data?.clients?.map((item) => ({
                value: item?.recordGuid,
                label: `${item.firstName} - ${item.name}`,
            }));

            setTempResellerOptions(options);

            if (response.status !== 200) {
                throw new Error("Failed to fetch data");
            }

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
            showSnackbar(handleMessageError({e}), "error");
            return {options: [], hasMore: false}; // Return empty options and mark as no more data
        }
    };

    return (
        <Grid
            container
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{height: "90vh"}}
        >
            <Card
                className="kpi-card p-4"
                sx={{overflow: "inherit", width: "600px", borderRadius: "20px"}}
            >
                <Grid
                    item
                    xs={12}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <Typography>
                        <PersonIcon
                            style={{
                                margin: "3px 0px 0px 5px",
                                color: import.meta.env.VITE_SECONDARY_COLOR,
                                fontSize: "70px",
                            }}
                        />
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={12}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <Typography
                        style={{
                            fontSize: "22px",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        Please choose a reseller
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={12}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    sx={{
                        width: "100%",
                    }}
                >
                    <FormControl fullWidth>
                        <AsyncPaginate
                            id="async-menu-style"
                            value={selectedReseller}
                            loadOptions={loadResellerOptions}
                            additional={{
                                page: 1,
                            }}
                            onChange={(value) => setTempReseller(value)}
                            placeholder="Reseller"
                            classNamePrefix="react-select"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} mt={3}>
                    <Button
                        variant="contained"
                        className="mui-btn primary filled"
                        onClick={() => setSelectedReseller(tempReseller)}
                        disabled={!tempReseller || loading}
                    >
                        <Typography sx={{fontSize: "14px", marginRight: "3px"}}>
                            Choose
                        </Typography>
                    </Button>
                </Grid>
            </Card>
        </Grid>
    );
};

export default withTranslation("translation")(OpeningModal);
