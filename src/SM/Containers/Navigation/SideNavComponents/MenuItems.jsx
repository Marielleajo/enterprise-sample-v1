import {Box, Collapse, ListItemButton, ListItemText} from "@mui/material";
import React from "react";
import {Link} from "react-router-dom";
import {truncateText} from "../../../Utils/Functions";
import {ExpandLess, ExpandMore} from "@mui/icons-material";

const MenuItems = ({
                       item,
                       level,
                       hasChildren,
                       toggleMenu,
                       isClickable,
                       IsActive,
                       getStyles,
                       open,
                       openMenus,
                       renderMenu,
                   }) => {
    return (
        <div key={item.recordGuid} style={{marginLeft: level * 20}}>
            <ListItemButton
                onClick={() => {
                    if (hasChildren) toggleMenu(item.recordGuid);
                }}
                to={isClickable ? `/${item.uri}` : undefined}
                component={isClickable ? Link : "div"}
                sx={{
                    color: IsActive(item) ? "var(--primary-color)" : "#6C7A89",
                    backgroundColor: IsActive(item) ? "" : "",
                    "&:hover": {
                        color: IsActive(item) ? "var(--primary-color)" : "#6C7A89",
                        backgroundColor: IsActive(item) ? "" : "",
                    },
                    ...getStyles(level),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: open ? "flex-start" : "center",
                    borderRadius: "none",
                    padding: "9px",
                    borderLeft:
                        IsActive(item) && level !== 1
                            ? "5px solid var(--primary-color) !important"
                            : "5px solid transparent",
                    marginBottom: "9px",
                }}
            >
                <i
                    className={`fa ${item.iconUri} menu-icon`}
                    style={{
                        fontSize: open ? "16px" : "20px",
                        marginRight: open ? "10px" : "0px",
                    }}
                />

                {open && (
                    <ListItemText
                        className="px-3"
                        primary={truncateText(item.menuDetail[0]?.name, 20)}
                        primaryTypographyProps={{fontSize: getStyles(level).fontSize}}
                        sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    />
                )}

                {open &&
                    hasChildren &&
                    (openMenus[item.recordGuid] ? <ExpandLess/> : <ExpandMore/>)}
            </ListItemButton>

            {hasChildren && (
                <Collapse in={openMenus[item.recordGuid]} timeout="auto" unmountOnExit>
                    <Box sx={{pl: 2}}>{renderMenu(item.children, level + 1)}</Box>
                </Collapse>
            )}
        </div>
    );
};

export default MenuItems;
