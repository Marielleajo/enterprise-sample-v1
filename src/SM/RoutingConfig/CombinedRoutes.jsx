import {useMediaQuery} from "@mui/material";
import React, {Suspense, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import LoadingComponent from "../../Components/Loading";
import LayoutWrapper from "./LayoutWrapper";
import {PublicRoutes} from "./Public/PublicRoutes";
import {useUpdateActivePages} from "../Utils/UpdateActivePages";
import {EMRoutes} from "./Portal/EMRoutes";
import IsTokenExpired from "../Utils/tokenDecoded.jsx";

const CombinedRoutes = () => {
    const updateActivePages = useUpdateActivePages();
    const navigate = useNavigate();
    const {token} = useSelector((state) => state?.authentication || {});
    const [open, setOpen] = React.useState(true);
    const dispatch = useDispatch();
    const mobileResponsive = useMediaQuery("(max-width:700px)");
    const location = useLocation();
    const menus = useSelector((state) => state.userMenu);
    const {authentication, pagesReducer} = useSelector((state) => state);

    React.useEffect(() => {
        const expiry = IsTokenExpired(token);
        if (token && !expiry) {
            if (window.location.pathname === "/") {
                navigate("/home");
            } else {
                const currentRoute = location.pathname;
                updateActivePages(currentRoute);
            }
        }
    }, [dispatch, location.pathname]);

    useEffect(() => {
        if (
            !authentication?.token &&
            !EMRoutes.some((r) => r.path === location.pathname)
        ) {
            navigate("/", {replace: true});
        }
    }, [authentication, EMRoutes, location.pathname, navigate]);
    //drawer
    const drawerWidth = 240;
    return (
        <Suspense fallback={<LoadingComponent/>}>
            <Routes>
                {PublicRoutes.map(({path, element, key}) => (
                    <Route
                        key={key}
                        path={path}
                        element={React.cloneElement(element, {
                            props: {
                                roleName: authentication?.roleName,
                                permissions: pagesReducer,
                            },
                        })}
                    />
                ))}

                {token &&
                    EMRoutes.map(({path, element, key}) => (
                        <Route
                            key={key}
                            path={path}
                            element={
                                <LayoutWrapper
                                    open={open}
                                    setOpen={setOpen}
                                    drawerWidth={drawerWidth}
                                    mobileResponsive={mobileResponsive}
                                    menus={menus}
                                >
                                    {React.cloneElement(element, {
                                        props: {
                                            roleName: authentication?.roleName,
                                            permissions: pagesReducer,
                                        },
                                    })}
                                </LayoutWrapper>
                            }
                        />
                    ))}
            </Routes>
        </Suspense>
    );
};

export default CombinedRoutes;
