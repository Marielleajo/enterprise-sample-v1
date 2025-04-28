import {createTheme} from "@mui/material";

export const createCustomTheme = ({
                                      PRIMARY_COLOR = import.meta.env.VITE_PRIMARY_COLOR ?? "#c41035",
                                      SECONDARY_COLOR = import.meta.env.VITE_SECONDARY_COLOR ?? "#4203ee",
                                      GREY_COLOR = import.meta.env.VITE_GREY_COLOR ?? "#d1d1d1",
                                      BLACK_COLOR = import.meta.env.VITE_BLACK_COLOR ?? "#000",
                                      TEXT_WHITE = import.meta.env.VITE_TEXT_WHITE ?? "#ffffff",
                                      Commons = {
                                          Button: {
                                              Border: "1px",
                                          },
                                      },
                                  }) => {
    return createTheme({
        palette: {
            primary: {
                main: PRIMARY_COLOR, // Your primary color
            },
            secondary: {
                main: SECONDARY_COLOR, // Your secondary color
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        "&.Mui-disabled:not(.MuiStatus)": {
                            backgroundColor: `${PRIMARY_COLOR} !important`,
                            cursor: "not-allowed !important",
                            border: `${Commons?.Button?.Border} solid #d1d1d1 !important`,
                            opacity: 0.5,
                        },
                        borderRadius: "50px !important",
                        "&.mui-btn": {
                            cursor: "pointer",
                            textTransform: "capitalize !important",
                            "&.primary": {
                                "&.filled": {
                                    backgroundColor: `${PRIMARY_COLOR}`,
                                    color: `${TEXT_WHITE}`,
                                    border: `${Commons?.Button?.Border} solid var(--primary-color) !important`,
                                    "&:hover, &.active": {
                                        // backgroundColor: `${TEXT_WHITE} !important`,
                                        // color: `${PRIMARY_COLOR} !important`,
                                        border: `${Commons?.Button?.Border} solid ${PRIMARY_COLOR}  !important`,
                                        // padding: `calc(6px - ${Commons?.Button?.Border}) calc(16px - ${Commons?.Button?.Border}) !important`,
                                    },
                                },
                                "&.outlined": {
                                    backgroundColor: `${TEXT_WHITE} !important`,
                                    color: `${PRIMARY_COLOR} !important`,
                                    border: `${Commons?.Button?.Border} solid ${PRIMARY_COLOR} !important`,
                                    // padding: `calc(6px - ${Commons?.Button?.Border}) calc(16px - ${Commons?.Button?.Border}) !important`,
                                    "&:hover, &.active": {
                                        // backgroundColor: `${PRIMARY_COLOR} !important`,
                                        // color: `${TEXT_WHITE} !important`,
                                        // padding: "6px 16px",
                                        border: `${Commons?.Button?.Border} solid var(--primary-color)  !important`,
                                    },
                                },
                            },
                            "&.secondary": {
                                "&.filled": {
                                    backgroundColor: `${SECONDARY_COLOR} !important`,
                                    color: `${TEXT_WHITE} !important`,
                                    "&:hover, &.active": {
                                        backgroundColor: `${TEXT_WHITE} !important`,
                                        color: `${SECONDARY_COLOR} !important`,
                                        border: `${Commons?.Button?.Border} solid ${SECONDARY_COLOR}  !important`,
                                        padding: `calc(6px - ${Commons?.Button?.Border}) calc(16px - ${Commons?.Button?.Border}) !important`,
                                        "&.shaded": {
                                            backgroundColor: `${SECONDARY_COLOR} !important`,
                                            border: "none !important",
                                            padding: `calc(5px + ${Commons?.Button?.Border}) calc(16px + ${Commons?.Button?.Border}) !important`,
                                            color: `${TEXT_WHITE} !important`,
                                        },
                                    },
                                },
                                "&.outlined": {
                                    backgroundColor: `${TEXT_WHITE} !important`,
                                    color: `${SECONDARY_COLOR} !important`,
                                    border: `${Commons?.Button?.Border} solid ${SECONDARY_COLOR} !important`,
                                    padding: `calc(6px - ${Commons?.Button?.Border}) calc(16px - ${Commons?.Button?.Border}) !important`,
                                    "&:hover, &.active": {
                                        backgroundColor: `${SECONDARY_COLOR} !important`,
                                        color: `${TEXT_WHITE} !important`,
                                        padding: "6px 16px",
                                    },
                                },
                            },
                            "&.grey": {
                                backgroundColor: `${GREY_COLOR} !important`,
                                color: `${BLACK_COLOR} !important`,
                            },
                            border: "none !important",
                            padding: "6px 16px",
                            "&.Mui-disabled": {
                                cursor: "not-allowed", // Change the cursor for disabled buttons
                            },
                        },
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        "&.mui-btn": {
                            width: "30px !important",
                            height: "30px !important",
                            "&.small": {
                                width: "25px !important",
                                height: "25px !important",
                            },
                            borderRadius: "50px !important",
                            cursor: "pointer",
                            textTransform: "capitalize !important",
                            "& svg": {
                                margin: "0 !important",
                            },
                            "&.primary": {
                                "&.filled": {
                                    backgroundColor: `${PRIMARY_COLOR} !important`,
                                    color: `${TEXT_WHITE} !important`,
                                    "&:hover, &.active": {
                                        backgroundColor: `${TEXT_WHITE} !important`,
                                        color: `${PRIMARY_COLOR} !important`,
                                        border: `${Commons?.Button?.Border} solid ${PRIMARY_COLOR}  !important`,
                                        padding: `calc(3px - ${Commons?.Button?.Border}) calc(13px - ${Commons?.Button?.Border}) !important`,
                                    },
                                },
                                "&.outlined": {
                                    backgroundColor: `${TEXT_WHITE} !important`,
                                    color: `${PRIMARY_COLOR} !important`,
                                    border: `${Commons?.Button?.Border} solid ${PRIMARY_COLOR} !important`,
                                    padding: `calc(6px - ${Commons?.Button?.Border}) calc(16px - ${Commons?.Button?.Border}) !important`,
                                    "&:hover, &.active": {
                                        backgroundColor: `${PRIMARY_COLOR} !important`,
                                        color: `${TEXT_WHITE} !important`,
                                        padding: "6px 16px",
                                    },
                                },
                            },
                            "&.secondary": {
                                "&.filled": {
                                    backgroundColor: `${SECONDARY_COLOR} !important`,
                                    color: `${TEXT_WHITE} !important`,
                                    "&:hover, &.active": {
                                        backgroundColor: `${TEXT_WHITE} !important`,
                                        color: `${SECONDARY_COLOR} !important`,
                                        border: `${Commons?.Button?.Border} solid ${SECONDARY_COLOR}  !important`,
                                        padding: `calc(3px - ${Commons?.Button?.Border}) calc(13px - ${Commons?.Button?.Border}) !important`,
                                    },
                                },
                                "&.outlined": {
                                    backgroundColor: `${TEXT_WHITE} !important`,
                                    color: `${SECONDARY_COLOR} !important`,
                                    border: `${Commons?.Button?.Border} solid ${SECONDARY_COLOR} !important`,
                                    padding: `calc(6px - ${Commons?.Button?.Border}) calc(16px - ${Commons?.Button?.Border}) !important`,
                                    "&:hover, &.active": {
                                        backgroundColor: `${SECONDARY_COLOR} !important`,
                                        color: `${TEXT_WHITE} !important`,
                                        padding: "6px 16px",
                                    },
                                },
                            },
                            "&.grey": {
                                backgroundColor: `${GREY_COLOR} !important`,
                                color: `${BLACK_COLOR} !important`,
                            },
                            border: "none !important",
                            padding: "6px 16px",
                        },
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        ".white": {
                            display: "none",
                        },
                    },
                },
                defaultProps: {
                    inputProps: {
                        onKeyDown: (e) => {
                            const input = e.target;
                            if (input?.type === "number" && ["e", "E"].includes(e.key)) {
                                e.preventDefault();
                            }
                        },
                    },
                    onInput: (e) => {
                        const input = e.target;
                        if (["text", "email", "password"].includes(input?.type)) {
                            const cursorPos = input.selectionStart;
                            const sanitized = input.value
                                .replace(/<script.*?>.*?<\/script>/gi, "")
                                .replace(/<\/?[^>]*>/g, "");
                            if (sanitized !== input.value) {
                                input.value = sanitized;
                                input.setSelectionRange(cursorPos, cursorPos);
                            }
                        }
                    },
                },
            },
            MuiButtonBase: {
                styleOverrides: {
                    root: {},
                },
            },
        },
    });
};
