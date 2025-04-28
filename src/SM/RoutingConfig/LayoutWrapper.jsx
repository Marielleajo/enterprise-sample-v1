import {Box, CssBaseline} from "@mui/material";
import React, {memo, useEffect} from "react";
import MuiDrawerHeader from "../../Components/MuiDrawerHeader";
import MobileMuiSideNavigation from "../Containers/Navigation/mobileSideNav";
import MuiSideNavigation from "../Containers/Navigation/sideNavigation";
import TopNavigation from "../Containers/Navigation/topNavigation";
import eventEmitter from "../Utils/EventEmitter";

const LayoutWrapper = memo(
    ({children, open, setOpen, drawerWidth, mobileResponsive, menus}) => {
        useEffect(() => {
            const pathSegments = window.location.pathname.split("/").filter(Boolean);
            const newBreadcrumbs = pathSegments.map((segment) =>
                segment
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())
            );

            localStorage.setItem("Breadcrumbs", JSON.stringify(newBreadcrumbs));
            eventEmitter.emit("breadcrumbsUpdate", newBreadcrumbs);
        }, [window.location.pathname]);

        return (
            <Box sx={{display: "flex"}}>
                <CssBaseline/>
                <TopNavigation
                    open={open}
                    setOpen={setOpen}
                    drawerWidth={drawerWidth}
                    handleDrawerOpen={() => {
                        setOpen((prev) => !prev);
                        localStorage.setItem("MenuOpen", !open);
                    }}
                    mobileResponsive={mobileResponsive}
                />

                {window.location.pathname !== "/home" &&
                    (menus?.length > 0 && mobileResponsive ? (
                        <MobileMuiSideNavigation
                            open={open}
                            drawerWidth={drawerWidth}
                            setOpen={setOpen}
                        />
                    ) : (
                        <MuiSideNavigation
                            open={open}
                            drawerWidth={drawerWidth}
                            setOpen={setOpen}
                        />
                    ))}
                <Box
                    component="main"
                    sx={{flexGrow: 1, height: "100vh", overflow: "hidden"}}
                >
                    <MuiDrawerHeader/>
                    {children}
                </Box>
            </Box>
        );
    }
);

LayoutWrapper.displayName = "LayoutWrapper";

export default LayoutWrapper;
