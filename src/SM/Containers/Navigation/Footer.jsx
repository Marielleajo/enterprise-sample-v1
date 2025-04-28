import {Box, IconButton, ListItemText, Tooltip} from "@mui/material";
import {SetMenus} from "../../../Redux/New/Redux/Reducers/Menus";

import {SignIn, SignOut,} from "../../../Redux/New/Redux/Reducers/Authentication";
import persistStore from "redux-persist/es/persistStore";
import {store} from "../../../Redux/New/Redux/Redux";
import {SIGN_OUT} from "../../../APIs/Common";
import {useDispatch, useSelector} from "react-redux";
import {ResetSystem} from "../../../Redux/New/Redux/Reducers/System";
import {PowerSettingsNew} from "@mui/icons-material";

const Footer = ({open, isMobile = false}) => {
    const dispatch = useDispatch();
    const {role} = useSelector((state) => state.authentication);

    async function clearAllCaches() {
        // Clear IndexedDB
        if (window.indexedDB && indexedDB.databases) {
            const databases = await indexedDB.databases();
            for (const db of databases) {
                await indexedDB.deleteDatabase(db.name);
            }
        }

        // Clear Service Worker Cache
        if ("caches" in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
            );
        }
    }

    const handleSignOut = async () => {
        window.location.href = "/";

        try {
            const persistor = persistStore(store);

            await persistor.purge();
            localStorage.clear();
            sessionStorage.clear();

            await clearAllCaches().catch((error) => {
                console.error("Error clearing caches:", error);
            });

            document.cookie.split(";").forEach((cookie) => {
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie =
                    name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            });

            const response = await SIGN_OUT({
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            });
            if (response?.status === 200 || response?.data?.success) {
                dispatch(
                    SignIn({
                        token: null,
                        refreshToken: null,
                        role: null,
                        clientId: null,
                        BillingAccount: null,
                    })
                );
                dispatch(SetMenus([]));
                dispatch(SignOut());

                localStorage?.removeItem("SAASTOGGLE");
            } else {
                dispatch(
                    SignIn({
                        token: null,
                        refreshToken: null,
                        role: null,
                        clientId: null,
                        BillingAccount: null,
                    })
                );
                dispatch(SetMenus([]));

                dispatch(SignOut());

                localStorage?.removeItem("SAASTOGGLE");
            }
        } catch (e) {
            const persistor = persistStore(store);

            await persistor.purge();
            localStorage.clear();
            sessionStorage.clear();

            await clearAllCaches().catch((error) => {
                console.error("Error clearing caches:", error);
            });
            console.log(e);
            dispatch(
                SignIn({
                    token: null,
                    refreshToken: null,
                    role: null,
                    clientId: null,
                    BillingAccount: null,
                })
            );
            dispatch(SetMenus([]));

            dispatch(SignOut());

            localStorage?.removeItem("SAASTOGGLE");
        }
    };

    const handleClearCache = () => {
        localStorage.clear();

        sessionStorage.clear();

        dispatch(SetMenus([]));
        dispatch(SignOut());
        dispatch(ResetSystem());
    };
    return (
        <Box
            sx={{
                width: "100%",
                padding: "5px 0px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "",
                color: "#ffff",
                border: "2px solid var(--primary-color)",
            }}
        >
            <Tooltip
                arrow
                // open={open ? openFooter : undefined}
                // disableFocusListener={open}
                // disableHoverListener={open}
                placement={isMobile ? "top" : "right-start"}
                sx={{
                    padding: "0px",
                }}
                slotProps={{
                    tooltip: {
                        sx: {
                            color: "#514E6A",
                            backgroundImage: `linear-gradient(
                200deg,
                 var(--primary-color),
                var(--primary-color),
                var(--primary-color),
                var(--primary-color)
              );`,
                            minWidth: "20vw",
                        },
                    },
                    arrow: {
                        sx: {
                            "&::before": {
                                color: "var(--primary-color)",
                            },
                        },
                    },
                }}
                title={
                    null
                    //         <Box
                    //             sx={{
                    //                 display: "flex",
                    //                 alignItems: "center",
                    //                 justifyContent: "start",
                    //                 flexDirection: "column",
                    //                 width: "100%",
                    //                 padding: "10px",
                    //                 margin: "0px",
                    //             }}
                    //         >
                    //             <Box
                    //                 sx={{
                    //                     display: "flex",
                    //                     alignItems: "center",
                    //                     justifyContent: "start",
                    //                     width: "100%",
                    //                     marginY: "5px",
                    //                 }}
                    //             >
                    //                 <Box>
                    //                     <i
                    //                         className="fa fa-user-circle"
                    //                         style={{fontSize: "35px", color: "white"}}
                    //                     />
                    //                 </Box>
                    //                 <Box sx={{color: "white", marginLeft: "10px"}}>
                    //                     <Typography>{role[0]}</Typography>
                    //                     {/* <Typography sx={{ fontWeight: "300" }}>{role[0]}</Typography> */}
                    //                 </Box>
                    //             </Box>
                    //
                    //             <Divider
                    //                 sx={{
                    //                     bgcolor: "white",
                    //                     height: 2,
                    //                     zIndex: "1000",
                    //                     width: "100%",
                    //                 }}
                    //             />
                    //
                    //             <ListItemText
                    //                 onClick={handleClearCache}
                    //                 sx={{
                    //                     width: "100%",
                    //
                    //                     color: "white",
                    //                     paddingY: "5px",
                    //                     "&:hover": {
                    //                         cursor: "pointer",
                    //                         color: "var(--primary-color) !important",
                    //                         backgroundColor: "white",
                    //                     },
                    //                 }}
                    //                 primary="Clear Cache"
                    //                 primaryTypographyProps={{
                    //                     fontSize: "16px",
                    //
                    //                     marginLeft: "10px",
                    //                     "&:hover": {
                    //                         color: "var(--primary-color) !important",
                    //                         backgroundColor: "white",
                    //                     },
                    //                 }}
                    //             />
                    //
                    //             <Divider
                    //                 sx={{
                    //                     bgcolor: "white",
                    //                     height: 2,
                    //
                    //                     zIndex: "1000",
                    //                     width: "100%",
                    //                 }}
                    //             />
                    //
                    //             <ListItemText
                    //                 onClick={handleSignOut}
                    //                 sx={{
                    //                     width: "100%",
                    //
                    //                     color: "white",
                    //                     paddingY: "5px",
                    //                     "&:hover": {
                    //                         cursor: "pointer",
                    //                         color: "var(--primary-color) !important",
                    //                         backgroundColor: "white",
                    //                     },
                    //                 }}
                    //                 primary="Logout"
                    //                 primaryTypographyProps={{
                    //                     fontSize: "16px",
                    //
                    //                     marginLeft: "10px",
                    //                     "&:hover": {
                    //                         color: "var(--primary-color) !important",
                    //                         backgroundColor: "white",
                    //                     },
                    //                 }}
                    //             />
                    //
                    //             {/* <Divider
                    //   sx={{
                    //     bgcolor: "white",
                    //     height: 2,
                    //     marginY: 1,
                    //     zIndex: "1000",
                    //     width: "100%",
                    //   }}
                    // />
                    // <Box
                    //   sx={{
                    //     width: "100%",
                    //     display: "flex",
                    //     alignItems: "center",
                    //     justifyContent: "center",
                    //     color: "white",
                    //     "&:hover": {
                    //       cursor: "pointer",
                    //       color: "var(--primary-color) !important",
                    //       backgroundColor: "white",
                    //     },
                    //   }}
                    //   onClick={() =>
                    //     history?.push({
                    //       pathname: "/my-profile",
                    //       state: { setPassword: true },
                    //     })
                    //   }
                    // >
                    //   <ListItemText
                    //     primary="Change Password"
                    //     primaryTypographyProps={{
                    //       fontSize: "16px",
                    //
                    //       marginLeft: "10px",
                    //       "&:hover": {
                    //         color: "var(--primary-color) !important",
                    //         backgroundColor: "white",
                    //       },
                    //     }}
                    //   />
                    // </Box> */}
                    //         </Box>
                }
            >
                <Box
                    sx={{
                        display: "flex",
                        paddingX: "16px",
                        alignItems: "center",
                        justifyContent: open ? "space-between" : "center",
                        width: "100%",
                    }}
                >
                    {open ? (
                        <>
                            <IconButton
                                onClick={() => handleSignOut()}
                                sx={{fontSize: "20px"}}
                            >
                                <PowerSettingsNew
                                    sx={{color: "var(--primary-color)"}}
                                    size="small"
                                />
                            </IconButton>
                            <ListItemText
                                primary={role[0]}
                                primaryTypographyProps={{
                                    fontSize: "16px",
                                    color: "var(--primary-color)",
                                }}
                            />
                        </>
                    ) : (
                        <IconButton
                            onClick={() => handleSignOut()}
                            sx={{fontSize: "20px"}}
                        >
                            <PowerSettingsNew sx={{color: "var(--primary-color)"}}/>
                        </IconButton>
                    )}
                </Box>
            </Tooltip>
        </Box>
    );
};

export default Footer;
