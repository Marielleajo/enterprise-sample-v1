import { Box, Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GET_ALL_COUNTRIES_API_NO_TOKEN } from "../../../APIs/Criteria";
import ResetPassword from "../../../Authentication/ResetPassword";
import TabsComponent from "../../../Components/Tabs/Tabs";
import ProfileInfo from "./ProfileInfo";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import GetActions from "../../Utils/GetActions";

const Profile = () => {
  const [SelectedSection, SetSelectedSection] = useState(0);
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [countryOptions, setCountryOptions] = useState("");

  let { socialMediaProvider } = useSelector((state) => state?.system);

  const resetFields = (tab) => {
    if (tab == 1) {
      setPassword("");
      setConfirmPassword("");
    } else {
    }
  };

  useEffect(() => {
    const { setPassword } = location.state || {};
    if (setPassword) {
      SetSelectedSection(1);
    }
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const countriesResponse = await GET_ALL_COUNTRIES_API_NO_TOKEN();
      setCountryOptions(
        countriesResponse?.data?.data?.countries.map((item) => {
          return { name: item?.name, recordGuid: item?.recordGuid };
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box className="page_container">
      <Box className="section_container scroll">
        <Grid
          container
          alignContent={"flex-start"}
          className="sub_section_container pt-4"
          rowSpacing={3}
        >
          <Grid item xs={12}>
            <Typography variant="h5">
              {" "}
              Manage {SelectedSection == 0 ? "Profile" : "Password"}{" "}
            </Typography>
          </Grid>
          {!socialMediaProvider && (
            <Grid item xs={12}>
              <TabsComponent
                option={SelectedSection}
                options={[
                  { value: 0, text: "Profile" },
                  { value: 1, text: "Password" },
                ]}
                onClick={(data) => {
                  SetSelectedSection(data);
                  resetFields(data);
                }}
              />
            </Grid>
          )}
          {SelectedSection == 0 && <ProfileInfo />}
          {SelectedSection == 1 && (
            <Grid item xs={12}>
              <Grid container paddingX={1} spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    To change your password, please enter your username to
                    continue.
                  </Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Card className="kpi-card p-4">
                    <ResetPassword />
                  </Card>
                </Grid>
                <Grid item xs={6} md={6} />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default GetActions(Profile);
