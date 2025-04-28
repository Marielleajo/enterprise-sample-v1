import React, { useEffect, useState } from "react";
import { EXPORT_RESELLER, GET_ALL_CRITERIA_API } from "../../../APIs/Criteria";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { Box, Button, CircularProgress } from "@mui/material";
import ResellerPage from "./ResellerPage";
import TabsComponent from "../../../Components/Tabs/Tabs";
import { Download, FilterAlt } from "@mui/icons-material";
import { handleMessageError, hasAction } from "../../Utils/Functions";
import GetActions from "../../Utils/GetActions";

const ResellerMainPage = ({ actions }) => {
  const [status, setStatus] = useState([]);
  const { showSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const GET_ALL_STATUS = async () => {
    setLoading(true);
    try {
      let res = await GET_ALL_CRITERIA_API({
        type: "SIGNUP_STATUS",
      });
      if (res?.data?.success) {
        const criteria = res?.data?.data?.criteria;

        const sortedCriteria = [
          ...criteria.filter((item) => item.tag === "PENDING_VERIFIED"),
          ...criteria.filter((item) => item.tag !== "PENDING_VERIFIED"),
        ];

        setStatus(sortedCriteria);
        setActiveTab(sortedCriteria[0]?.tag);
        setLoading(false);
      }
    } catch (error) {
      showSnackbar(error?.response?.data?.message, "error");
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    GET_ALL_STATUS();
  }, []);

  const handleTabChange = (selectedTag) => {
    setActiveTab(selectedTag);
  };

  console.log("avc ", actions);

  const exportReseller = async () => {
    setLoading(true);
    try {
      let response = await EXPORT_RESELLER({
        statusTag: activeTab,
      });

      if (response?.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${activeTab}_RESELLER_LIST.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        showSnackbar("Export Successful");
      } else {
        showSnackbar("Something went wrong exporting data", "error");
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 3, pl: 2 }}>
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TabsComponent
          options={status.map((item) => ({
            text: item.name,
            value: item.tag,
          }))}
          option={activeTab}
          onClick={handleTabChange}
        />
        <Box mr={1.5}>
          {hasAction(actions, "export") && (
            <Button
              className="mui-btn primary filled"
              startIcon={<Download />}
              // sx={{ ml: "auto", mr: "auto" }}
              onClick={exportReseller}
              disabled={loading}
            >
              Export
            </Button>
          )}
          <Button
            className="mui-btn primary filled"
            startIcon={<FilterAlt />}
            // sx={{ ml: "auto", mr: "auto" }}
            onClick={() => setOpenFilter((prev) => !prev)}
            // disabled={loading}
          >
            Filter
          </Button>
        </Box>
      </Box>
      <Box sx={{ p: 2 }}>
        {status.map(
          (statusItem) =>
            activeTab === statusItem.tag && (
              <ResellerPage
                key={statusItem.tag}
                openFilter={openFilter}
                setOpenFilter={setOpenFilter}
                statusTag={statusItem.tag}
              />
            )
        )}
      </Box>
    </Box>
  );
};

export default GetActions(ResellerMainPage);
