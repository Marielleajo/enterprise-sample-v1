import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Button, Grid, Menu, MenuItem, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
// import AutomaticRates from "./AutomaticRates";
import ManualRates from "./ManualRate";
import { GET_DEFAULT_CURRENCIES } from "../../../APIs/CurrencyManagement";
import TabsComponent from "../../../Components/Tabs/Tabs";

const CurrencyManagement = (props) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState("Default Currency");
  const [anchorEl, setAnchorEl] = useState(null);
  const menus = useSelector((state) => state.menus);
  const { showSnackbar } = useSnackbar();
  const [state, setState] = useState({
    tabs: ["Manual Rates"],
    tableData: [],
    selectedTab: 0,
    selectedTypeTag: "",
    defaultCurrencyOptions: "",
  });
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    setAnchorEl(null);
    if (option) {
      setSelectedOption(option);
    }
  };

  const { tabs, selectedTypeTag, defaultCurrencyOptions } = state;
  const handleChange = (e, newValue) => {
    setState((prevState) => ({
      ...prevState,
      selectedTypeTag: newValue,
      selectedTab: newValue,
    }));
  };
  const getDefaultCurrency = async () => {
    try {
      let response = await GET_DEFAULT_CURRENCIES();
      const label = response?.data?.data?.currency?.name;
      const value = response?.data?.data?.currency?.code;
      const data = { label, value };
      setState((prevState) => ({
        ...prevState,
        defaultCurrencyOptions: data,
      }));
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    }
  };
  useEffect(() => {
    getDefaultCurrency();
  }, []);
  useEffect(() => {
    const initializeSelectedFeeTypeTag = () => {
      let selectedTypeTag;
      switch (state.selectedTab) {
        case 1:
          selectedTypeTag = "Automatic Rates";
          break;
        case 0:
          selectedTypeTag = "Manual Rates";
          break;
        default:
          selectedTypeTag = "";
      }
      setState((prevState) => ({
        ...prevState,
        selectedTypeTag,
      }));
    };

    initializeSelectedFeeTypeTag();
  }, [state.selectedTab]);

  return (
    <Box sx={{ width: "100%" }}>
      <>
        <Grid container padding={2}>
          <Grid
            item
            xs={12}
            justifyContent={"end"}
            display={"flex"}
            alignContent={"end"}
            position={"absolute"}
            right={"0"}
            zIndex={"88"}
          >
            <div>
              <Button
                variant="outlined"
                className="mr-4"
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
              >
                {defaultCurrencyOptions.label}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleClose(null)}
                PaperProps={{
                  style: {
                    maxHeight: 200,
                    width: "20ch",
                  },
                }}
              >
                <MenuItem
                  key={defaultCurrencyOptions.value}
                  value={defaultCurrencyOptions.value}
                  onClick={() => handleClose(defaultCurrencyOptions.label)}
                >
                  {defaultCurrencyOptions.label}
                </MenuItem>
              </Menu>
            </div>
          </Grid>
          <Grid item xs={12}>
            <TabsComponent
              options={tabs.map((tab) => ({
                text: tab,
                value: tab, // or use a different value if needed
              }))}
              option={state.selectedTypeTag}
              onClick={(value) => {
                setState((prev) => ({ ...prev, selectedTypeTag: value }));
                console.log(value);
              }}
            />
          </Grid>
        </Grid>
        {selectedTypeTag == "Manual Rates" && (
          <ManualRates defaultOptions={[state?.defaultCurrencyOptions]} />
        )}
        {/* {selectedTypeTag == "Automatic Rates" && <AutomaticRates />} */}
      </>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  token: state.authentication ? state.authentication.token : "",
});

export default CurrencyManagement;
