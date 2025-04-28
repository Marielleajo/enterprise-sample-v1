import CircleCheckedFilled from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  ListItemText,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useRef, useState } from "react";
import MuiCheckbox from "../MuiCheckbox";
import EmptyComponent from "./EmptyComponent";
import "./MuiTable.scss";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  even: {
    backgroundColor: "#f5f5f5",
  },
  odd: {
    backgroundColor: "#ffffff",
  },
});

const CustomHeader = (props) => {
  return <div>{props.column.field}</div>;
};

const MuiTable = ({
  columns,
  data,
  loading,
  paginationModel,
  setPaginationModel,
  totalRows,
  style,
  pageSizeOptions = [5, 10, 20, 100],
  rowId = "index",
  rowSelectionModel = null,
  setRowSelectionModel = null,
  density = "compact",
  paginationMode = "server",
  hideFooterPagination = false,
  showManageColumns = false,
}) => {
  // Initialize hiddenColumns based on the columns' hideable and hidden properties
  const initialHiddenColumns = columns
    .filter((col) => col.hideable && col.hidden)
    .map((col) => col.field);

  const [hiddenColumns, setHiddenColumns] = useState(initialHiddenColumns);
  const visibleColumns = columns.filter(
    (col) => !hiddenColumns.includes(col.field)
  );
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleDropdownOpen = () => {
    setOpen(true);

    setTimeout(() => {
      if (dropdownRef?.current) {
        dropdownRef.current.scrollTop = 0;
      }
    }, 0);
  };

  // Function to toggle visibility of hideable columns
  const toggleColumnVisibility = (field) => {
    setHiddenColumns((prev) =>
      prev.includes(field)
        ? prev.filter((col) => col !== field)
        : [...prev, field]
    );
  };
  const classes = useStyles();
  const isTablet = useMediaQuery("(max-width:1024px)");

  return (
    <Box id="MuiTable" className="no_design_scroll">
      {/* Dropdown with checkboxes to toggle column visibility */}
      {showManageColumns && (
        <Box display="flex" alignItems="center" justifyContent="end" p={1}>
          <IconButton
            size="small"
            id="showOption"
            onClick={() => setOpen((prev) => !prev)}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Typography variant="subtitle2" className="secondary grey">
              Show/Hide Columns
            </Typography>
          </IconButton>

          <Select
            ref={dropdownRef}
            multiple
            open={open}
            onOpen={handleDropdownOpen}
            onClose={() => setOpen(false)}
            value={columns
              .filter(
                (col) => col.hideable && !hiddenColumns.includes(col.field)
              )
              .map((col) => col.field)}
            displayEmpty
            renderValue={() => null}
            MenuProps={{
              PaperProps: { sx: { maxHeight: 250 } },
              anchorOrigin: { vertical: "bottom", horizontal: "right" },
              transformOrigin: { vertical: "top", horizontal: "right" },
            }}
            sx={{ mr: 2, cursor: "pointer" }}
          >
            <MenuItem>
              <Checkbox
                checked={hiddenColumns.length === 0}
                indeterminate={
                  hiddenColumns.length > 0 &&
                  hiddenColumns.length <
                    columns.filter((col) => col.hideable).length
                }
                onChange={() => {
                  if (hiddenColumns.length === 0) {
                    setHiddenColumns(
                      columns
                        .filter((col) => col.hideable)
                        .map((col) => col.field)
                    ); // Hide all
                  } else {
                    setHiddenColumns([]);
                  }
                }}
              />
              <ListItemText
                primary="Select All"
                onClick={() => {
                  if (hiddenColumns.length === 0) {
                    setHiddenColumns(
                      columns
                        .filter((col) => col.hideable)
                        .map((col) => col.field)
                    ); // Hide all
                  } else {
                    setHiddenColumns([]);
                  }
                }}
              />
            </MenuItem>

            {/* Individual Column Options */}
            {columns
              .filter((col) => col.hideable) // Only show hideable columns in the toggle UI
              .map((col) => (
                <MenuItem key={col.field} value={col.field}>
                  <Checkbox
                    checked={!hiddenColumns.includes(col.field)}
                    onChange={() => toggleColumnVisibility(col.field)}
                  />
                  <ListItemText
                    primary={col.headerName}
                    onClick={() => toggleColumnVisibility(col.field)}
                  />
                </MenuItem>
              ))}
          </Select>
        </Box>
      )}
      <Card
        className="kpi-card p-4 pt-2"
        sx={{ overflow: "inherit", width: "100%" }}
      >
        {" "}
        {data?.length === 0 && !loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minHeight: "40vh",
            }}
          >
            <Typography style={{ opacity: 0.6, fontSize: "20px" }}>
              There is no data
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: "100%", overflowX: "auto", height: "100%" }}>
            <DataGrid
              rowHeight={60}
              hideFooterPagination={hideFooterPagination}
              slots={{
                noRowsOverlay: EmptyComponent,
                BaseCheckbox: MuiCheckbox,
              }}
              className={`customized datagrid ${
                data?.length == 0 ? "empty" : "not-empty"
              }`}
              getRowId={(row) => row[rowId]}
              disableRowSelectionOnClick
              rowCount={totalRows}
              columns={
                rowSelectionModel && typeof setRowSelectionModel === "function"
                  ? [
                      {
                        field: "select",
                        width: 75,
                        headerClassName: "remove-Icons",
                        headerName: (
                          <MuiCheckbox
                            checkedIcon={
                              rowSelectionModel?.length === data?.length ? (
                                <CircleCheckedFilled />
                              ) : (
                                <RemoveCircleIcon />
                              )
                            }
                            checked={rowSelectionModel?.length > 0}
                            onClick={() => {
                              if (rowSelectionModel.length > 0) {
                                setRowSelectionModel([]);
                              } else {
                                setRowSelectionModel(
                                  data?.map((row, index) =>
                                    rowId === "index"
                                      ? String(index)
                                      : row[rowId]
                                  )
                                );
                              }
                            }}
                          />
                        ),
                        renderCell: (params) => (
                          <MuiCheckbox
                            onClick={() => {
                              setRowSelectionModel((prev) => {
                                if (
                                  rowSelectionModel?.includes(
                                    params?.row[rowId]
                                  )
                                ) {
                                  return prev.filter(
                                    (item) => item !== params?.row[rowId]
                                  );
                                } else {
                                  return [...prev, params?.row[rowId]];
                                }
                              });
                            }}
                            checked={rowSelectionModel?.includes(
                              params?.row[rowId]
                            )}
                          />
                        ),
                      },
                      ...visibleColumns,
                    ]
                  : visibleColumns
              }
              rows={data?.map((item, index) => ({
                ...item,
                index: String(index),
              }))}
              density={density}
              sx={{
                "& .MuiDataGrid-columnSeparator--sideRight": {
                  display: "none",
                },
                width: "100%",
                minWidth: "750px",
                maxWidth: isTablet ? "95vw" : "100%",
                overflowX: "auto",
                ...style,
              }}
              pageSizeOptions={pageSizeOptions}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              paginationMode={paginationMode}
              loading={loading}
              disableColumnFilter
              getRowClassName={(params) =>
                params?.indexRelativeToCurrentPage % 2 === 0
                  ? classes?.even
                  : classes?.odd
              }
              sortingOrder={["asc", "desc", null]}
              disableColumnMenu
            />
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default MuiTable;
