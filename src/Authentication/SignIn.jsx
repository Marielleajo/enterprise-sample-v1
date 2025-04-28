import {AccountCircle, LockOpen, Visibility, VisibilityOff,} from "@mui/icons-material";
import {
    Box,
    Button,
    css,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {GET_ALL_LANGUAGES, REQUEST_OTP, SIGN_IN_URL, VERIFY_EMAIL,} from "../APIs/Common";
import Logo from "../Assets/saas/MontyMobile/logo.svg";
import CounterComponent from "../Components/Counter";
import {SignIn} from "../Redux/New/Redux/Reducers/Authentication";
import {SetMenus} from "../Redux/New/Redux/Reducers/Menus";
import {SideNav} from "../Redux/New/Redux/Reducers/SideNavData";
import {BulkSetSystem, setLanguage} from "../Redux/New/Redux/Reducers/System";
import {
    getAllChannelGuid,
    getAllServices,
    getCurrenciesData,
    handleMessageError,
    hexToRgba,
} from "../SM/Utils/Functions";
import ChangePassword from "./ChangePassword";
import OTPInput from "./OTP";
import ResetPassword from "./ResetPassword";
import "./SignIn.scss";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const currentYear = new Date().getFullYear();

const SignInPage = () => {
    const theme = useTheme();
    const isSmallerThanSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const isSmallerThanMeduim = useMediaQuery(theme.breakpoints.down("md"));
    const isSmallerThanlarge = useMediaQuery(theme.breakpoints.down("lg"));
    const [showPassword, setShowPassword] = React.useState(false);
    const [Path, SetPath] = useState("signin");
    const [Loading, SetLoading] = useState(false);
    const [Error, SetError] = useState(null);
    const navigate = useNavigate();

    const Name = import.meta.env.VITE_PORTAL_NAME;

    const dispatch = useDispatch();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [FormData, SetFormData] = useState({
        username: null,
        password: null,
    });

    const handleSignIn = async ({
                                    username = FormData?.username,
                                    password = FormData?.password,
                                }) => {
        SetLoading(true);
        try {
            let signinResult = await SIGN_IN_URL({
                username,
                password,
            });
            if (signinResult?.data?.success) {
                let {accessToken, refreshToken, roles, username} =
                    signinResult?.data?.data;
                if (roles.length > 0) {
                    dispatch(SetMenus(signinResult?.data?.data?.userMenu));

                    Promise.all([
                        await getCurrenciesData(accessToken),
                        await getAllServices(accessToken),
                        await getAllChannelGuid(accessToken),
                        await getAllLanguages(),
                    ])
                        .then((data) => {
                            dispatch(BulkSetSystem(data));
                            dispatch(
                                SignIn({
                                    token: accessToken,
                                    refreshToken,
                                    role: roles,
                                    username: username,
                                })
                            );

                            dispatch(
                                SideNav({
                                    selectedTab: `/home`,
                                    allSelectedTabs: [],
                                })
                            );
                            navigate(`/home`);
                            SetLoading(false);
                        })
                        .catch((e) => {
                            SetError(handleMessageError({e, type: "validation"}), "error");
                        });
                } else {
                    SetError("User doesn't have role");
                    SetLoading(false);
                }


            }
        } catch (e) {
            if (e?.response?.data?.data?.requiredActions?.length > 0) {
                if (e?.response?.data?.data?.requiredActions[0] === "VERIFY_EMAIL") {
                    try {
                        let request = await REQUEST_OTP({username: FormData?.username});
                        if (!request?.data?.success) {
                            SetLoading(false);
                        }
                    } catch (otpError) {
                        console.error("REQUEST_OTP failed:", otpError);
                        SetLoading(false); // Ensure loading is stopped even if REQUEST_OTP fails
                    }
                }

                SetPath(e?.response?.data?.data?.requiredActions[0]);
            }

            window?.dataLayer?.push({
                event: "api_error", // Custom event name
                path: window.location.pathname,
                value: handleMessageError({e, type: "validation"}),
            });

            SetError(
                e?.response?.data?.message ||
                e?.response?.data?.errors?.Name?.[0] ||
                e?.response?.data?.result?.message ||
                "Something Went Wrong"
            );

            SetLoading(false); // Ensure loading is stopped in all cases
        }
    };

    const getAllLanguages = async (accessToken) => {
        try {
            let response = await GET_ALL_LANGUAGES();

            const data = response?.data?.data?.languages;
            dispatch(setLanguage(data));
        } catch (e) {
            console.error(e);
        }
    };

    const handleEnterPress = async (e) => {
        if (e.key === "Enter") {
            // Perform your action here
            await handleSignIn({});
            // You can call a function or perform any other action here
        }
    };

    const handleVerify = async (data) => {
        try {
            let response = await VERIFY_EMAIL({
                formData: {username: FormData.username, Pin: data},
            });
            if (response?.data?.success) {
                await handleSignIn({...FormData});
            }
        } catch (e) {
            SetError(
                e?.response?.data?.message ||
                e?.response?.data?.errors?.Name[0] ||
                e?.response?.data?.result?.message ||
                "Something Went Wrong"
            );
        }
    };

    const [ResendOtpToggle, SetResendOtpToggle] = useState(false);
    const [ResetCount, SetResetCount] = useState(2);
    const counterRef = useRef(null);

    const ResendOtp = async () => {
        if (ResendOtpToggle) {
            try {
                let otpResponse = await REQUEST_OTP({
                    username: FormData?.username,
                });
                // SetMessageType("success");
                // SetMessage("Otp requested again");
                SetResendOtpToggle(false);
                if (ResetCount > 1) {
                    if (counterRef.current) {
                        counterRef.current.reset();
                    }
                } else {
                    window.location.reload();
                }
                SetResetCount((prev) => prev - 1);
            } catch (e) {
                SetError(handleMessageError({e, type: "validation"}), "error");
            }
        }
    };

    useEffect(() => {
        if (ResetCount == 0) {
            SetResendOtpToggle(false);
        }
    }, [ResetCount]);

    return (
        <Box id="SignInNew">
            <Grid
                container
                height={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Box className="logo">
                    <img src={Logo} alt=""/>
                </Box>

                <Grid item xs={12} sm={3} md={3}/>
                <RedBox/>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                        className="container"
                        sx={{
                            height: "60vh",
                            width: isSmallerThanSmall
                                ? "75vw"
                                : isSmallerThanMeduim
                                    ? "60vw"
                                    : isSmallerThanlarge
                                        ? "50vw"
                                        : "35vw",
                            marginTop: "9vh",
                        }}
                    >
                        <Box>
                            <Typography
                                className="title"
                                textAlign={"center"}
                                color={"black"}
                            >
                                Log in to Monty Mobile Portal
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                className="subtitle"
                                textAlign={"center"}
                                color={"black"}
                            >
                                {Name}
                            </Typography>
                        </Box>
                        <Box className="d-flex flex-column">
                            {Error && (
                                <Box className="Error w-100 text-center p-0 m-0">
                                    <Typography
                                        className="forget-passwword"
                                        variant="subtitle1"
                                        color="red"
                                    >
                                        {Error}
                                    </Typography>
                                </Box>
                            )}
                            {Path == "signin" && (
                                <>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sx={{paddingTop: "0px !important"}}>
                                            <TextField
                                                fullWidth
                                                onChange={(e) =>
                                                    SetFormData((prev) => ({
                                                        ...prev,
                                                        username: e?.target?.value,
                                                    }))
                                                }
                                                inputProps={{
                                                    autoComplete: "off", // Ensure autofill is disabled
                                                }}
                                                label="Username"
                                                className="input-username"
                                                id="username"
                                                name="username"
                                                type="text"
                                                InputProps={{
                                                    sx: {
                                                        fontSize: "1.9vh",
                                                        "&:-webkit-autofill": {
                                                            backgroundColor: "transparent !important",
                                                            boxShadow:
                                                                "0 0 0px 1000px white inset !important",
                                                            WebkitTextFillColor: "#000 !important",
                                                        },
                                                    },
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AccountCircle/>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="filled"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sx={{paddingTop: "0px !important"}}>
                                            <TextField
                                                fullWidth
                                                onChange={(e) =>
                                                    SetFormData((prev) => {
                                                        return {...prev, password: e?.target?.value};
                                                    })
                                                }
                                                label="Password"
                                                id="password"
                                                className="input-password"
                                                onKeyDown={handleEnterPress}
                                                type={showPassword ? "text" : "password"}
                                                inputProps={{
                                                    "aria-autocomplete": "none",
                                                }}
                                                InputProps={{
                                                    style: {
                                                        fontSize: "1.9vh",
                                                    },
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockOpen/>
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                            >
                                                                {showPassword ? (
                                                                    <VisibilityOff/>
                                                                ) : (
                                                                    <Visibility/>
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="filled"
                                            />
                                        </Grid>
                                        <Grid item xs={12}/>
                                        {/* <Grid
                      item
                      xs={12}
                      display={"flex"}
                      justifyContent={"start"}
                    >
                      <Typography
                        color={"black"}
                        sx={{ cursor: "pointer" }}
                        onClick={() => SetPath("reset")}
                        variant="subtitle1"
                      >
                        Forget Password
                      </Typography>
                    </Grid> */}
                                    </Grid>

                                    <Grid container>
                                        <Grid item xs={12}>
                                            <StyledButton
                                                disabled={Loading}
                                                fullWidth
                                                id="signIn"
                                                onClick={handleSignIn}
                                                isSmallerThanSmall={isSmallerThanSmall}
                                            >
                                                {Loading ? "Loading..." : "Sign in"}
                                            </StyledButton>
                                        </Grid>
                                    </Grid>
                                </>
                            )}
                            {Path == "reset" && (
                                <Grid container>
                                    <Grid item xs={12}>
                                        <ResetPassword
                                            isSmallerThanSmall={isSmallerThanSmall}
                                            isSmallerThanMeduim={isSmallerThanMeduim}
                                            isSmallerThanlarge={isSmallerThanlarge}
                                            Done={async (data) => {
                                                if (data) {
                                                    SetPath("signin");
                                                    await handleSignIn({...data});
                                                } else {
                                                    SetPath("signin");
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                            {Path == "VERIFY_EMAIL" && (
                                <Grid container>
                                    <Grid item xs={12}>
                                        <OTPInput
                                            isSmallerThanSmall={isSmallerThanSmall}
                                            isSmallerThanMeduim={isSmallerThanMeduim}
                                            isSmallerThanlarge={isSmallerThanlarge}
                                            length={6}
                                            onComplete={handleVerify}
                                            color="black"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container columnSpacing={1}>
                                            <Grid item>
                                                <Typography
                                                    variant="subtitle"
                                                    sx={
                                                        ResendOtpToggle && {
                                                            textDecoration: "underline",
                                                            cursor: "pointer",
                                                            "&:hover": {color: "red"},
                                                        }
                                                    }
                                                    onClick={ResendOtp}
                                                >
                                                    Resend Otp
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle" onClick={ResendOtp}>
                                                    {" "}
                                                    after{" "}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CounterComponent
                                                    ref={counterRef}
                                                    initialTime={30}
                                                    onTimeUp={() => SetResendOtpToggle(true)}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )}
                            {Path == "UPDATE_PASSWORD" && (
                                <Grid container>
                                    <Grid item xs={12}>
                                        <ChangePassword
                                            isSmallerThanSmall={isSmallerThanSmall}
                                            isSmallerThanMeduim={isSmallerThanMeduim}
                                            isSmallerThanlarge={isSmallerThanlarge}
                                            FormData={FormData}
                                            Done={async (data) => {
                                                // SetPath("signin");
                                                await handleSignIn({...data});
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        </Box>
                        <Grid container className="footer mt-4">
                            <Grid item xs={12} display={"flex"} justifyContent={"center"}>
                                <Typography
                                    className="copyrights"
                                    variant="caption"
                                    textAlign={"center"}
                                    color={`${"black"}`}
                                >
                                    © {currentYear} Ltd
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={3} md={3}/>
            </Grid>
        </Box>
    );
};

const StyledButton = styled(Button)`
    background-color: ${import.meta.env.VITE_PRIMARY_COLOR} !important;
    color: ${import.meta.env.VITE_TEXT_WHITE} !important;
    height: 5.5vh !important;
    font-size: 2vh !important;
    font-weight: 400 !important;
    width: 100% !important;

    &:hover {
        background-color: ${import.meta.env.VITE_PRIMARY_COLOR} !important;
    }

    &:disabled {
        cursor: not-allowed !important;
        opacity: 0.5 !important;
    }
`;

const RedBox = styled.div`
    background-color: ${hexToRgba(
            import.meta.env.VITE_PRIMARY_COLOR,
            0.6
    )} !important;
    height: 45vh !important;
    width: 65vw !important;
    position: absolute !important;
    margin-top: 8vh !important;
    border-radius: 6px !important;
    display: block !important;
    z-index: 1 !important;

    ${({isSmallerThanMeduim}) =>
            isSmallerThanMeduim &&
            css`
                display: none !important;
            `}
`;

export default SignInPage;
