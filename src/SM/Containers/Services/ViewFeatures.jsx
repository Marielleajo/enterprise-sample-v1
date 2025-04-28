import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import SettingsIcon from "@mui/icons-material/Settings";
import { Breadcrumbs, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import TreeView, { flattenTree } from "react-accessible-treeview";
import { GET_ALL_FEATURES } from "../../../APIs/Services";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";

export default function ViewFeatures({
  setViewFeatures,
  setManageViewFeatures,
  selectedService,
}) {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState([]);
  const { showSnackbar } = useSnackbar();

  const getAllFeatures = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_FEATURES({
        ServiceGuid: selectedService?.recordGuid,
      });
      const data = response?.data?.data?.items;
      if (data?.length > 0) {
        const items = data;

        // Map to store parent-child relationships
        const parentChildMap = {};

        // Iterate through items to populate the map
        items?.forEach((item) => {
          const { parent, featureDetails } = item;
          const itemName =
            featureDetails?.length > 0 ? featureDetails[0]?.name : null;

          if (parent) {
            const parentTag = parent?.tag;
            if (!parentChildMap[parentTag]) {
              parentChildMap[parentTag] = [];
            }
            if (itemName) {
              parentChildMap[parentTag]?.push({ name: itemName });
            }
          } else {
            const parentTag = item?.tag;
            parentChildMap[parentTag] = parentChildMap[parentTag] || [];
          }
        });

        const result = Object.keys(parentChildMap)?.map((parentTag) => ({
          name: parentTag,
          children: parentChildMap[parentTag] || [],
        }));

        const folder = {
          name: "", // Root folder name, can be adjusted as needed
          children: result,
        };

        const flattened = flattenTree(folder);

        setFeatures(flattened);
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllFeatures();
  }, []);

  return (
    <Grid
      container
      className="pt-4"
      paddingRight={2.5}
      display={"flex"}
      justifyContent={"start"}
      alignItems={"center"}
    >
      <Grid item xs={12} md={4}>
        <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
          <Typography
            style={{
              cursor: "pointer",
            }}
            className="BreadcrumbsPage"
            onClick={() => {
              setManageViewFeatures(false);
              setViewFeatures(false);
            }}
          >
            Services
          </Typography>
          <Typography className="breadcrumbactiveBtn">View Features</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid
        item
        xs={6}
        md={8}
        display={"flex"}
        justifyContent={"end"}
        alignItems={"center"}
      >
        <Button
          className="mui-btn primary filled"
          id="send-service-provider-id"
          onClick={() => setManageViewFeatures(true)}
          startIcon={<SettingsIcon />}
        >
          Manage Features
        </Button>
      </Grid>
      <Grid
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "25px",
          marginTop: "40px",
          height: "auto",
        }}
        item
        lg={12}
        xs={12}
      >
        {!loading && features?.length > 0 && (
          <TreeView
            data={features}
            multiSelect
            className="basic"
            aria-label="basic example tree"
            nodeRenderer={({
              element,
              isBranch,
              isExpanded,
              getNodeProps,
              level,
              handleSelect,
            }) => (
              <div
                {...getNodeProps()}
                style={{ paddingLeft: 30 * (level - 1), cursor: "pointer" }}
              >
                {isBranch ? (
                  !isExpanded ? (
                    <ArrowDropDownIcon />
                  ) : (
                    <ArrowDropUpIcon />
                  )
                ) : (
                  ""
                )}
                {element.name}
              </div>
            )}
          />
        )}

        {loading && <>Loading ...</>}
        {features && features?.length === 0 && !loading && (
          <>No Features Found</>
        )}
      </Grid>
    </Grid>
  );
}
