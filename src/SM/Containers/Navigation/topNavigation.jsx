import {AccountCircle, ExpandMore, KeyboardDoubleArrowRight} from "@mui/icons-material";
import {CircularProgress, Divider, Tooltip} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import persistStore from "redux-persist/es/persistStore";
import {GET_USER_MENU_API, SIGN_OUT} from "../../../APIs/Common";
import montymobileimage from "../../../Assets/saas/MontyMobile/logo.svg";
import MuiBreadcrumbs from "../../../Components/Breadcrumbs/Breadcrumbs";
import {SignIn, SignOut,} from "../../../Redux/New/Redux/Reducers/Authentication";
import {SetMenus} from "../../../Redux/New/Redux/Reducers/Menus";
import {setMedia,} from "../../../Redux/New/Redux/Reducers/System";
import {SetUserMenus} from "../../../Redux/New/Redux/Reducers/UserMenu";
import {store} from "../../../Redux/New/Redux/Redux";
import eventEmitter from "../../Utils/EventEmitter";
import {SideNav} from "../../../Redux/New/Redux/Reducers/SideNavData";
import {useSnackbar} from "../../../Contexts/SnackbarContext";

export default function TopNavigation({
                                          drawerWidth,
                                          handleDrawerOpen,
                                          open,
                                          mobileResponsive,
                                          setOpen
                                      }) {
    const {authentication} = useSelector((state) => state);
    const location = useLocation(); // Get the current location object
    const pages = useSelector((state) => state?.menus);
    const [selectedRow, setSelectedRow] = useState(null);
    const activePages = useSelector(
        (state) => state?.sideNav?.allSelectedTabs ?? []
    );
    const [loading, setLaoding] = useState(false);
    if (!authentication?.token) {
        window.location.href = "/";
    } else if (authentication?.role?.length == 0) {
        localStorage?.clear();
        window.location.href = "/";
    }

    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [sidePages, setsidePages] = useState([]);
    const {showSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const isHome = window.location.pathname !== "/home" ? false : true;
    const {currency} = useSelector((state) => state.system);
    useEffect(() => {
        setTimeout(() => {
            if (sidePages?.length > 0) {
                let Menus = [...sidePages]?.sort(
                    (a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0)
                );

                let result = [];

                let parentItem = sidePages?.filter(
                    (item) => item?.parentGuid === null
                )[0];

                let parentGuid = parentItem?.recordGuid;

                if (parentGuid) {
                    result.push(parentGuid);
                }

                let childItem = [...Menus]?.find(
                    (item) => item?.parentGuid === parentGuid
                );

                let childGuid = childItem?.recordGuid;

                if (childGuid) {
                    result.push(childGuid);
                }

                let subChildItem = [...Menus]?.find(
                    (item) => item?.parentGuid === childGuid
                );
                let subChildGuid = subChildItem?.recordGuid;

                if (subChildGuid) {
                    result.push(subChildGuid);
                }
                let redirectUri =
                    subChildItem?.uri || childItem?.uri || parentItem?.uri || "home";
                dispatch(
                    SideNav({
                        selectedTab: `/${redirectUri}`,
                        allSelectedTabs: result,
                    })
                );

                const obj = result.reduce((acc, guid) => {
                    acc[guid] = true;
                    return acc;
                }, {});

                localStorage.setItem("openMenus", JSON.stringify(obj));

                // window.location.href = `/${redirectUri}`;
                navigate(`/${redirectUri}`);
                dispatch(SetUserMenus(sidePages));
            }
            setLaoding(false);
        }, 1000);
    }, [sidePages]);

    useEffect(() => {
        const filteredPages = pages?.filter(
            (item) =>
                activePages.includes(item?.recordGuid) && item?.parentGuid == null
        );
        setSelectedRow(filteredPages[0]?.recordGuid);
    }, [activePages]);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    async function clearAllCaches() {
        // Clear IndexedDB
        if (window.indexedDB && indexedDB.databases) {
            const databases = await indexedDB.databases();
            for (const db of databases) {
                await indexedDB.deleteDatabase(db.name);
            }
            console.log("IndexedDB cleared.");
        }

        // Clear Service Worker Cache
        if ("caches" in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
            );
            console.log("Service Worker caches cleared.");
        }
    }

    const handleSignOut = async () => {
        window.location.href = "/";
        try {
            // Clear Redux and browser storage
            const persistor = persistStore(store);

            // Purge Redux Persist state
            await persistor.purge();
            localStorage.clear();
            sessionStorage.clear();

            // Clear all caches
            await clearAllCaches().catch((error) => {
                console.error("Error clearing caches:", error);
            });

            // Invalidate session cookies
            document.cookie.split(";").forEach((cookie) => {
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie =
                    name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            });

            // Make the sign-out request
            const response = await SIGN_OUT({
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            });

            // Check the response status
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
                dispatch(SetUserMenus([]));
                // dispatch(setServices([]));
                dispatch(setMedia({}));
                localStorage?.removeItem("SAASTOGGLE");
            } else {
                // Handle the case when sign-out was not successful
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
                dispatch(SetUserMenus([]));
                dispatch(SignOut());
                // dispatch(setServices([]));
                dispatch(setMedia({}));
                localStorage?.removeItem("SAASTOGGLE");
            }
        } catch (e) {
            const persistor = persistStore(store);

            // Purge Redux Persist state
            await persistor.purge();
            localStorage.clear();
            sessionStorage.clear();

            // Clear all caches
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
            dispatch(SetUserMenus([]));
            dispatch(SignOut());
            // dispatch(setServices([]));
            dispatch(setMedia({}));
            localStorage?.removeItem("SAASTOGGLE");
        }
    };

    const handleRedirection = async (action) => {
        setLaoding(true);
        try {
            const response = await GET_USER_MENU_API({
                menuRecordGuid: action?.recordGuid,
            });

            if (response?.success) {
                // dispatch(SetUserMenus(sidePages));
                setsidePages(response?.data?.userMenu);
                setSelectedRow(action?.recordGuid);
            } else {
                showSnackbar("Something Went Wrong", "error");
            }
        } catch (e) {
            showSnackbar(
                e?.response?.data?.message ||
                e?.response?.data?.Message ||
                e?.response?.data?.errors?.Name[0] ||
                e?.response?.data?.result?.message ||
                "Something Went Wrong",
                "error"
            );
            setLaoding(false);
        }
    };

    const quickActions = [
        {
            title: "Home",
            uri: "home",
        },
        ...(pages
            ?.filter((menu) => !menu?.parentGuid)
            ?.sort((a, b) => a?.displayOrder - b?.displayOrder)
            ?.map((page) => ({
                title: page?.menuDetail[0]?.name,
                uri: page?.uri,
                recordGuid: page?.recordGuid,
            })) || []),
    ];

    const Breadcrumbs = () => {
        const pages = useSelector((state) => state?.menus);

        const [breadcrumbs, setBreadcrumbs] = useState(() => {
            const storedBreadcrumbs = localStorage.getItem("Breadcrumbs");
            return storedBreadcrumbs ? JSON.parse(storedBreadcrumbs) : [];
        });

        useEffect(() => {
            const handleBreadcrumbsUpdate = (newBreadcrumbs) => {
                setBreadcrumbs(newBreadcrumbs);
            };

            eventEmitter.subscribe("breadcrumbsUpdate", handleBreadcrumbsUpdate);

            return () => {
                eventEmitter.unsubscribe("breadcrumbsUpdate", handleBreadcrumbsUpdate);
            };
        }, []);

        const breadcrumbItems = [
            {name: "Home", uri: "home"},
            ...breadcrumbs.map((name) => {
                const matchingPage = pages.find(
                    (page) => page?.menuDetail?.[0]?.name === name
                );
                return {
                    name,
                    uri: matchingPage?.uri || null,
                };
            }),
        ];

        return (
            <MuiBreadcrumbs
                breadcrumbsOptions={breadcrumbItems
                    ?.filter(Boolean)
                    ?.map((item, index) => (
                        <Typography
                            key={index}
                            variant="body2"
                            style={{
                                cursor:
                                    !item?.uri || item?.uri === "home" ? "default" : "pointer",
                                border: item?.uri === "home" ? "1px solid #bcbcbc" : "",
                                padding: item?.uri === "home" ? "2px 0px 0px 8px" : "",
                                borderRadius: item?.uri === "home" ? "5px" : "",
                                fontWeight: index === breadcrumbItems.length - 1 ? 700 : 500,
                                color:
                                    index === breadcrumbItems.length - 1
                                        ? "var(--primary-color)"
                                        : "#66666b",
                            }}
                            onClick={() => {
                                if (item?.uri && item?.uri !== "home") {
                                    navigate(`/${item?.uri}`);
                                } else return null;
                            }}
                        >
                            {item?.name === "Home" ? (
                                <Tooltip
                                    placement="bottom"
                                    sx={{
                                        "& .MuiTooltip-tooltip": {
                                            backgroundColor: "white",
                                            color: "black",
                                            padding: "8px",
                                        },
                                    }}
                                    slotProps={{
                                        tooltip: {
                                            sx: {
                                                color: "#514E6A",
                                                backgroundColor: "white",
                                            },
                                        },
                                        arrow: {
                                            sx: {
                                                "&::before": {
                                                    color: "#002d57",
                                                },
                                            },
                                        },
                                    }}
                                    title={
                                        <Box
                                            sx={{
                                                backgroundColor: "white",
                                                borderRadius: "8px",
                                                padding: "8px",
                                                minWidth: "150px",
                                                color: "white",
                                                maxHeight: "200px",
                                                overflowY: "auto",
                                                overflowX: "hidden",
                                            }}
                                        >
                                            {quickActions?.map((item) => (
                                                <Typography
                                                    key={item}
                                                    onClick={() => {
                                                        if (item?.uri && item?.uri === "home") {
                                                            navigate(`/${item?.uri}`);
                                                        } else handleRedirection(item);
                                                    }}
                                                    sx={{
                                                        fontSize: "14px",
                                                        padding: "8px 12px",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",

                                                        color:
                                                            selectedRow === item?.recordGuid
                                                                ? "var(--primary-color)"
                                                                : "black",
                                                        fontWeight:
                                                            selectedRow === item?.recordGuid
                                                                ? "bold"
                                                                : "normal",

                                                        // backgroundColor:
                                                        //   selectedRow === item?.recordGuid
                                                        //     ? "#e0e8ff"
                                                        //     : "transparent",

                                                        "&:hover": {
                                                            backgroundColor: "#f5f5f5",
                                                        },
                                                    }}
                                                >
                                                    {item?.title}
                                                </Typography>
                                            ))}
                                        </Box>
                                    }
                                >
                                    Home
                                    <ExpandMore sx={{fontSize: "1.3rem"}}/>
                                </Tooltip>
                            ) : (
                                item?.name
                            )}
                        </Typography>
                    ))}
            />
        );
    };

    return (
        <>
            <MuiAppBar
                style={{
                    background: "white",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                    zIndex: mobileResponsive ? 2 : 1,
                }}
                position="fixed"
                open={open}
            >
                <Toolbar
                    className="top_toolbar"
                    sx={{display: "flex", justifyContent: isHome ? "space-between" : "start"}}
                >
                    {!isHome && (
                        <Box
                            onClick={() => {
                                setOpen((prev) => !prev);
                                localStorage.setItem("MenuOpen", !open);
                            }}
                            ml={2}
                        >
                            <KeyboardDoubleArrowRight
                                sx={{
                                    fontSize: "30px",
                                    color: "var(--primary-color)",
                                    "&:hover": {
                                        cursor: "pointer",
                                        backgroundColor: "var(--primary-color)",
                                        color: "white",
                                        borderRadius: "50px",
                                    },
                                }}
                            />
                        </Box>)
                    }
                    {window.location.pathname === "/home" && (
                        <a href="/" style={{marginLeft: "10px"}}>
                            <img alt="" src={montymobileimage} width={85}/>
                        </a>
                    )}
                    {window.location.pathname !== "/home" && (
                        <Box
                            sx={{
                                marginLeft: open ? "210px" : "75px",
                            }}
                        >
                            <Breadcrumbs/>
                        </Box>
                    )}

                    <Box display={"flex"} alignItems={"center"}>
                        <IconButton
                            id="account-icon"
                            aria-label="account"
                            onClick={handleProfileMenuOpen}
                        >
                            {window.location.pathname === "/home" ? (
                                <>
                                    <Typography
                                        style={{
                                            fontSize: "16px",
                                            borderRight:
                                                window.location.pathname === "/home" &&
                                                "1px solid black",
                                            paddingRight: "15px",
                                            marginRight: "15px",
                                            color: "black",
                                            marginTop: "2px",
                                        }}
                                    >
                                        {authentication?.username}
                                    </Typography>
                                    <AccountCircle/>
                                </>
                            ) : null
                                // <Typography
                                //   style={{
                                //     fontSize: "14px",
                                //     borderRight:
                                //       window.location.pathname === "/home" && "1px solid black",
                                //     paddingRight: "15px",
                                //     marginRight: "15px",
                                //     color: "black",
                                //     marginTop: "2px",
                                //   }}
                                // >
                                //   Currency : {currency[0]?.code}
                                // </Typography>
                            }
                        </IconButton>

                        {window.location.pathname === "/home" && (
                            <Menu
                                sx={{mt: "45px"}}
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: "visible",
                                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                        mt: 1.5,
                                        "& .MuiAvatar-root": {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        "&:before": {
                                            content: '""',
                                            display: "block",
                                            position: "absolute",
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: "background.paper",
                                            transform: "translateY(-50%) rotate(45deg)",
                                            zIndex: 0,
                                        },
                                    },
                                }}
                            >
                                <Divider/>

                                <MenuItem
                                    id="logout-menuitem"
                                    key={"log out"}
                                    onClick={handleSignOut}
                                >
                                    <Typography textAlign="center">Log out</Typography>
                                </MenuItem>
                            </Menu>
                        )}
                    </Box>
                </Toolbar>
            </MuiAppBar>
            {loading && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",

                        zIndex: 9999,
                    }}
                >
                    <CircularProgress/>
                </Box>
            )}
        </>
    );
}
