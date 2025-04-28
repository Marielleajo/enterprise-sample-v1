import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Button, Card, Grid } from "@mui/material";
import React from "react";

export default function AdvancedSearch({
  body,
  handleFilterSearch,
  handleFilterReset,
  setShowAdvanceSearch,
  disabled,
  setShowOther,
  showOther,
  hasMoreFilter = false,
  loading = false,
  hideButton = true,
}) {
  return (
    <Grid item xs={12} sx={{ mt: "0.5rem" }}>
      <Card
        className={"kpi-card p-4"}
        sx={{ overflow: "inherit", position: "relative" }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12} className="title_card">
            Advanced Search
          </Grid>
          {body}
          <Grid
            container
            spacing={0}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              marginTop: "15px",
            }}
          >
            <Grid
              item
              display={"flex"}
              justifyContent={"end"}
              alignItems={"center"}
            >
              {hasMoreFilter && (
                <Button
                  type="submit"
                  className="mui-btn primary outlined m-0"
                  id="send-service-provider-id"
                  onClick={() => setShowOther(!showOther)}
                >
                  More Filters
                  {showOther ? (
                    <ExpandLess sx={{ cursor: "pointer" }} />
                  ) : (
                    <ExpandMore sx={{ cursor: "pointer" }} />
                  )}
                </Button>
              )}
              {hideButton && (
                <Button
                  type="submit"
                  className="mui-btn primary outlined "
                  id="send-service-provider-id"
                  onClick={() => setShowAdvanceSearch(false)}
                  disabled={disabled}
                >
                  Hide
                </Button>
              )}
              <Button
                type="submit"
                className="mui-btn primary outlined"
                id="send-service-provider-id"
                onClick={handleFilterReset}
                disabled={loading}
              >
                Reset All
              </Button>{" "}
              <Button
                type="submit"
                className="mui-btn primary filled"
                id="send-service-provider-id"
                onClick={handleFilterSearch}
                disabled={loading}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
