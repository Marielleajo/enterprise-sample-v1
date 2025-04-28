import {KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight,} from "@mui/icons-material";
import {Box, Drawer, List} from "@mui/material";
import {useCallback, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import montymobileimage from "../../../Assets/saas/MontyMobile/logo.svg";
import MuiDrawerHeader from "../../../Components/MuiDrawerHeader";
import {buildMenuHierarchy, closedMixinMobile, openedMixinMobile} from "./MenuFunctions";
import MenuItems from "./SideNavComponents/MenuItems";
import ToolTipMenu from "./SideNavComponents/ToolTipMenu";
import Footer from "./Footer";

const MobileMuiSideNavigation = ({open, drawerWidth, setOpen}) => {
    const pages = useSelector((state) => state?.userMenu);
    const location = useLocation();

    const activePages = useSelector(
        (state) => state?.sideNav?.allSelectedTabs ?? []
    );

    const menuHierarchy = useMemo(() => buildMenuHierarchy(pages), [pages]);

    const [openMenus, setOpenMenus] = useState(() => {
        const savedMenus = localStorage.getItem("openMenus");
        return savedMenus ? JSON.parse(savedMenus) : {};
    });

    const toggleMenu = useCallback((guid) => {
        setOpenMenus((prev) => {
            const newOpenMenus = {};
            if (!prev[guid]) {
                newOpenMenus[guid] = true;
            }
            localStorage.setItem("openMenus", JSON.stringify(newOpenMenus));
            return newOpenMenus;
        });
    }, []);

    const getStyles = (level) => ({
        fontSize: `${14 - level}px`,
        padding: `${6 - level}px 14px !important`,
        borderRadius: "50px",
    });

    const IsActive = (item) => activePages.includes(item.recordGuid);

    const renderMenu = (items, level = 0) =>
        items.map((item, index) => {
            const hasChildren = item.children.length > 0;
            const isClickable = !hasChildren;

            if (!open && hasChildren) {
                return <ToolTipMenu key={index} item={item} IsActive={IsActive}/>;
            }

            return (
                <MenuItems
                    key={index}
                    item={item}
                    level={level}
                    hasChildren={hasChildren}
                    toggleMenu={toggleMenu}
                    isClickable={isClickable}
                    IsActive={IsActive}
                    getStyles={getStyles}
                    open={open}
                    openMenus={openMenus}
                    renderMenu={renderMenu}
                />
            );
        });

    return (
        <Drawer
            variant="permanent"
            open={open}
            sx={(theme) => ({
                display: !open && "none",
                flexShrink: 0,
                whiteSpace: "nowrap",
                boxSizing: "border-box",
                ...(open ? openedMixinMobile(theme) : closedMixinMobile(theme)),
                "& .MuiDrawer-paper": open ? openedMixinMobile(theme) : closedMixinMobile(theme),
            })}
        >
            <MuiDrawerHeader>
                {open ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        <a href="/home">
                            <img alt="Monty Mobile" src={montymobileimage} width={85}/>
                        </a>
                        <Box
                            onClick={() => {
                                setOpen((prev) => !prev);
                                localStorage.setItem("MenuOpen", !open);
                            }}
                        >
                            <KeyboardDoubleArrowLeft
                                sx={{
                                    fontSize: "25px",
                                    color: "var(--primary-color)",
                                    marginRight: "5px",
                                    "&:hover": {
                                        cursor: "pointer",
                                        backgroundColor: "var(--primary-color)",
                                        color: "white",
                                        borderRadius: "50px",
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                ) : (
                    <Box
                        onClick={() => {
                            setOpen((prev) => !prev);
                            localStorage.setItem("MenuOpen", !open);
                        }}
                    >
                        <KeyboardDoubleArrowRight
                            sx={{
                                fontSize: "25px",
                                color: "var(--primary-color)",
                                "&:hover": {
                                    cursor: "pointer",
                                    backgroundColor: "var(--primary-color)",
                                    color: "white",
                                    borderRadius: "50px",
                                },
                            }}
                        />
                    </Box>
                )}
            </MuiDrawerHeader>
            <Box sx={{flexGrow: 1, overflow: "auto"}}>
                {pages.length > 0 && <List>{renderMenu(menuHierarchy)}</List>}
            </Box>
            <Footer open={open} isMobile={true}/>
        </Drawer>
    );
};

export default MobileMuiSideNavigation;
