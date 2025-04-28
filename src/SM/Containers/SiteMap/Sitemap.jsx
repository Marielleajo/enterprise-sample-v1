import React, {useEffect, useState} from "react";
import {
    Box,
    Breadcrumbs,
    CircularProgress,
    Collapse,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {Clear, ExpandLess, ExpandMore} from "@mui/icons-material";
import {makeStyles} from "@mui/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PieChartIcon from "@mui/icons-material/PieChart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FilterListIcon from "@mui/icons-material/FilterList";
import HistoryIcon from "@mui/icons-material/History";
import MoneyIcon from "@mui/icons-material/Money";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyIcon from "@mui/icons-material/VpnKey";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";

import {useSelector} from "react-redux";
import GetActions from "../../Utils/GetActions";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100vw",
        height: "97vh",
        padding: "1.5vh 0px",
        borderRadius: "8px",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    searchContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        "& .MuiOutlinedInput-input": {
            fontSize: "2vh",
            height: "3vh",
        },
    },
    nested: {
        paddingLeft: "4.8vh",
        position: "relative",
        "& .MuiListItem-root": {
            paddingLeft: "3vh",
        },
    },
    line: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        borderLeft: "2px solid #ccc",
        marginLeft: "-10px",
    },
    lineParent: {
        position: "relative",
        "&::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: 0,
            width: "2vh",
            borderTop: "2px solid #ccc",
        },
    },
    listItem: {
        marginLeft: "1.5vh",
        "&:hover": {
            backgroundColor: "#e0e0e0",
            transition: "background-color 0.3s",
        },
        "&.Mui-selected": {
            backgroundColor: "#d0d0d0",
            "&:hover": {
                backgroundColor: "#c0c0c0",
            },
        },
    },
    iconContainer: {
        display: "flex",
        justifyContent: "start",
        marginBottom: "1vh",
    },
    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        padding: "20px 0",
    },
    list: {
        width: "100%",
    },
    smallText: {
        "& .MuiTypography-root": {
            fontSize: "2.5vh",
        },
    },
    smallIcon: {
        "& svg": {
            fontSize: "3.5vh",
        },
    },
}));

const iconMap = {
    "fa-users": <PeopleIcon/>,
    "fa-user-plus": <PersonAddIcon/>,
    "fa-pie-chart": <PieChartIcon/>,
    "fa-user-circle": <AccountCircleIcon/>,
    "fa-filter": <FilterListIcon/>,
    "fa-history": <HistoryIcon/>,
    "fa-money": <MoneyIcon/>,
    "fa-cogs": <SettingsIcon/>,
    "fa-key": <KeyIcon/>,
    "fa-search": <SearchIcon/>,
};

function Sitemap() {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [open, setOpen] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const theme = useTheme();
    const isSmallerThanSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const isSmallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));

    const pages = useSelector((state) => state?.menus);


    useEffect(() => {
        setData(pages);
        setLoading(false);
    }, []);

    const handleClick = (recordGuid) => {
        setOpen((prevOpen) => ({
            ...prevOpen,
            [recordGuid]: !prevOpen[recordGuid],
        }));
    };

    const handleExpandAll = () => {
        const newOpen = {};
        data.forEach((item) => {
            newOpen[item.recordGuid] = true;
        });
        setOpen(newOpen);
    };

    const handleCollapseAll = () => {
        const newOpen = {};
        data.forEach((item) => {
            newOpen[item.recordGuid] = false;
        });
        setOpen(newOpen);
    };

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (query === "") {
            handleCollapseAll();
        } else {
            const newOpen = {};
            filteredItems(data).forEach((item) => {
                if (item.parentGuid) {
                    newOpen[item.parentGuid] = true;
                }
            });
            setOpen(newOpen);
        }
    };

    const filteredItems = (items) => {
        const parentGuids = new Set();
        const filtered = items.filter((item) => {
            const parentItem = item.parentGuid
                ? items.find((i) => i.recordGuid === item.parentGuid)
                : null;
            if (
                item.menuDetail[0].name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (parentItem &&
                    parentItem.menuDetail[0].name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()))
            ) {
                parentGuids.add(item.parentGuid);
                parentGuids.add(item.recordGuid);
                return true;
            }
            return false;
        });

        const result = items.filter(
            (item) => filtered.includes(item) || parentGuids.has(item.recordGuid)
        );

        return result;
    };

    const handleChildClick = (childUri) => {
        const fullUri = `/${childUri}`;
        navigate(fullUri);
    };

    const renderMenuItems = (items, parentGuid = null, parentUri = null) => {
        return filteredItems(items)
            .filter((item) => item.parentGuid === parentGuid)
            .sort((a, b) => a.displayOrder - b.displayOrder) // Sort items by displayOrder
            .map((item) => {
                const hasChildren = items.some(
                    (child) => child.parentGuid === item.recordGuid
                );
                return (
                    <div
                        key={item.recordGuid}
                        className={parentGuid ? classes.nested : ""}
                    >
                        <div className={classes.lineParent}>
                            <Tooltip title={item.menuDetail[0].description} arrow>
                                <ListItem
                                    button
                                    onClick={() => {
                                        if (hasChildren) {
                                            handleClick(item.recordGuid); // Expand/Collapse parent on click
                                        } else {
                                            handleChildClick(item.uri); // Push parent URI first, then child URI
                                        }
                                    }}
                                    className={`${classes.listItem} ${classes.smallText}`}
                                >
                                    <ListItemIcon className={classes.smallIcon}>
                                        {iconMap[item.iconUri] || <PeopleIcon/>}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.menuDetail[0].name}
                                        className={classes.smallText}
                                    />
                                    {hasChildren ? (
                                        open[item.recordGuid] ? (
                                            <ExpandLess className={classes.smallIcon}/>
                                        ) : (
                                            <ExpandMore className={classes.smallIcon}/>
                                        )
                                    ) : null}
                                </ListItem>
                            </Tooltip>
                            {parentGuid && <div className={classes.line}></div>}
                        </div>
                        {hasChildren && (
                            <Collapse in={open[item.recordGuid]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding className={classes.nested}>
                                    {renderMenuItems(items, item.recordGuid, item.uri)}{" "}
                                    {/* Render child items */}
                                </List>
                            </Collapse>
                        )}
                    </div>
                );
            });
    };

    return (
        <Box className="page_container mt-2">
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
                        <Grid item xs={3}/>

                        <Grid item xs={6}>
                            <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                                <Typography className="BreadcrumbsPage">Sitemap</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={3}/>
                        <Grid item xs={3}/>
                        <Grid item xs={6} className="sub_section_container">
                            <div className={`${classes.searchContainer} pt-2`}>
                                <TextField
                                    label="Search"
                                    variant="outlined"
                                    size="small"
                                    spellCheck
                                    fullWidth
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className={classes.smallText}
                                    InputLabelProps={{
                                        style: {
                                            fontSize: "2.2vh",
                                        },
                                    }}
                                    InputProps={{
                                        endAdornment: searchQuery.length > 0 && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => {
                                                        setSearchQuery("");
                                                        handleCollapseAll();
                                                    }} //add this to the file sended to marielle
                                                    edge="end"
                                                    className={classes.smallIcon}
                                                >
                                                    <Clear/>
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <IconButton
                                    color="primary"
                                    onClick={handleExpandAll}
                                    className={classes.smallIcon}
                                >
                                    <ExpandMore/>
                                </IconButton>
                                <IconButton
                                    color="secondary"
                                    onClick={handleCollapseAll}
                                    className={classes.smallIcon}
                                >
                                    <ExpandLess/>
                                </IconButton>
                            </div>
                            {loading ? (
                                <div className={classes.loadingContainer}>
                                    <CircularProgress/>
                                </div>
                            ) : (
                                <List
                                    className={classes.list}
                                    sx={{
                                        width: isSmallerThanSmall
                                            ? "80vw"
                                            : isSmallerThanMedium
                                                ? "60vw"
                                                : "40vw",
                                    }}
                                >
                                    {renderMenuItems(data, null, null)}
                                </List>
                            )}
                        </Grid>
                        <Grid item xs={3}/>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default GetActions(Sitemap);
