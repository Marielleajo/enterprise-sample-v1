import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SideNav } from "../../../Redux/New/Redux/Reducers/SideNavData";
import { SetUserMenus } from "../../../Redux/New/Redux/Reducers/UserMenu";
import { GET_USER_MENU_API } from "../../../APIs/Common";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";

const RedirectionPage = () => {
  const pages = useSelector((state) => state?.menus);
  const dispatch = useDispatch();
  const [greeting, setGreeting] = useState("Good Morning");
  const [sidePages, setsidePages] = useState([]);
  const [loading, setLaoding] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 24) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Morning");
    }
  }, []);
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
        navigate(`/${redirectUri}`);
        dispatch(SetUserMenus(sidePages));
      }
      setLaoding(false);
    }, 1000);
  }, [sidePages]);

  const quickActions =
    [...pages]
      ?.filter((menu) => !menu?.parentGuid)
      .sort((a, b) => a?.displayOrder - b?.displayOrder)
      ?.map((page) => ({
        title: page?.menuDetail[0]?.name,
        uri: page?.uri,
        recordGuid: page?.recordGuid,
        parentGuid: page?.parentGuid,
        icon: page?.iconUri,
        displayOrder: page?.displayOrder,

        position: page?.position,
        menuAction: page?.menuAction.map((Action) => ({
          recordGuid: Action?.recordGuid,
          hasAccess: Action?.hasAccess,
          name: Action?.menuActionDetail[0]?.name,
        })),
      })) || [];
  const handleRedirection = async (action) => {
    setLaoding(true);
    try {
      const response = await GET_USER_MENU_API({
        menuRecordGuid: action?.recordGuid,
      });

      if (response?.success) {
        // dispatch(SetUserMenus(response?.data?.userMenu));
        setsidePages(response?.data?.userMenu);
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

  return (
    <Box className="page_container">
      <Box className="section_container scroll" mt={3}>
        <Grid
          className="sub_section_container"
          container
          alignContent={"flex-start"}
          paddingRight={2.5}
        >
          <Box
            sx={{
              backgroundImage: `url('https://hcm55.sapsf.eu/verp/vmod_v1/ui/homepage4/resources_3.41.0/img/splashHeader.min.webp')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: 200,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: "white",
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              {greeting}! Welcome to our Enterprise
            </Typography>
          </Box>

          <Box sx={{ padding: 3, m: 2, width: "100%" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              Quick Actions
            </Typography>
            {quickActions?.length > 0 ? (
              <Grid container spacing={3} sx={{ p: 2 }}>
                {quickActions.map((action, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={1.5}
                    onClick={() => handleRedirection(action)}
                    key={index}
                    // to={`/${action?.uri}`}
                    // component={Link}
                    px={2}
                  >
                    <Card
                      sx={{
                        borderRadius: 5,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        cursor: "pointer !important",
                        "&:hover": {
                          transform: !loading && "scale(1.05)",
                          cursor: "pointer !important",
                          boxShadow:
                            !loading && "0 8px 12px rgba(0, 0, 0, 0.2)",
                        },
                      }}
                      className="homeCard"
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          py: "13px",
                          px: "1rem",
                          height: "100%",
                          minHeight: "16vh",
                        }}
                      >
                        <i
                          className={`fa ${action?.icon} menu-icon`}
                          style={{
                            fontSize: "1.8rem",
                            marginBottom: "10px",
                            color: "white",
                          }}
                        />
                        <Typography
                          sx={{
                            textAlign: "center",
                            marginTop: "10px",
                          }}
                          className="title"
                          title={action?.title}
                        >
                          {action?.title}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "20px",
                  alignItems: "center",
                }}
              >
                There is no pages available for this user
              </Box>
            )}
          </Box>
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
              <CircularProgress />
            </Box>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default RedirectionPage;
