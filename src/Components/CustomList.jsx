import React, { useState } from "react";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Typography,
  CircularProgress,
  TextField,
  InputLabel,
} from "@mui/material";

const CustomList = ({
  items,
  selectedItems,
  setSelectedItems,
  isLoading,
  itemTextKey = "name",
  itemKey = "recordGuid",
  label = "Search",
  height = 300,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredItems = items?.filter((item) =>
    item[itemTextKey]?.toLowerCase()?.includes(search.toLowerCase())
  );

  const paginatedItems = filteredItems?.slice(0, page * pageSize);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setPage((prev) => prev + 1);
    }
  };

  const handleCheckboxChange = (item) => {
    setSelectedItems((prev) =>
      prev.some((selected) => selected[itemKey] === item[itemKey])
        ? prev.filter((selected) => selected[itemKey] !== item[itemKey])
        : [...prev, item]
    );
  };

  console.log("selectedItems", selectedItems);
  return (
    <Box
      sx={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        padding: "10px",
        borderRadius: "5px",
        width: "100%",
      }}
    >
      <Grid item md={12} className="p-2">
        <InputLabel className="TextField_Label">{label}</InputLabel>
        <TextField
          fullWidth
          variant="standard"
          placeholder={"Search by Country"}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </Grid>
      <Box
        sx={{
          height,
          overflowY: "auto",
        }}
        onScroll={handleScroll}
      >
        <List dense component="div">
          {paginatedItems?.length > 0 ? (
            paginatedItems.map((item, index) => (
              <ListItem key={index} sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <Checkbox
                    checked={selectedItems.some(
                      (selected) => selected[itemKey] === item[itemKey]
                    )}
                    onChange={() => handleCheckboxChange(item)}
                    sx={{
                      color: "primary.main",
                      "&.Mui-checked": { color: "primary.main" },
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" noWrap>
                      {item[itemTextKey]}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          ) : isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{ px: 2, py: 1, display: "flex", justifyContent: "center" }}
            >
              No Data found.
            </Typography>
          )}
        </List>
      </Box>
    </Box>
  );
};

export default CustomList;
