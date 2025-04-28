import { MenuItem } from "@mui/material";
import React from "react";

const JiraIssueCollector = (props) => {
  const loadJiraScript = () => {
    props.handleMenuClose();
    const url =
      "https://montyholding.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/tod1zk/b/4/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-US&collectorId=526b53d9";

    if (url) {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.onload = () => {
        // Script loaded successfully
        window.ATL_JQ_PAGE_PROPS = {
          triggerFunction: function (showCollectorDialog) {
            showCollectorDialog();
          },
          // ==== Add the code below to set the field values ====
          // fieldValues: {
          //   summary: localStorage.getItem("summaryError")
          //     ? localStorage.getItem("summaryError")
          //     : "",
          //   description: localStorage.getItem("descriptionError")
          //     ? localStorage.getItem("descriptionError")
          //     : "",
          //   priority: "3",
          // }, for later 
          fieldValues: {
            summary: "",
            description: "",
            priority: "3",
          },
        };
      };

      script.onerror = () => {
        console.error("Error loading the Jira Issue Collector script.");
      };

      document.head.appendChild(script);
    } else {
      console.error("Error: No Jira Issue Collector URL provided.");
    }
  };

  return (
    <MenuItem
      key={"addTicket"}
      id="JiraIssueCollectorBtn"
      onClick={loadJiraScript}
    >
      Add Ticket
    </MenuItem>
  );
};

export default JiraIssueCollector;
