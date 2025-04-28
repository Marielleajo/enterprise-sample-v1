import { Box, InputLabel } from "@mui/material";
import React from "react";
import { AsyncPaginate } from "react-select-async-paginate";

const CustomAsyncPaginate = ({
  token,
  apiFunction, // Directly use the API function passed as a prop
  method = "GET", // New prop to handle the request method
  value,
  onChange,
  placeholder = "Select...",
  pageSize = 10,
  additional = { page: 1 },
  dataPath,
  totalRowsPath = "data.data.totalRows",
  customStyles = {},
  isNested = false,
  labelPath,
  id = "async-menu-style",
  isDisabled = false,
  key,
  params,
  isMulti = false,
  excludedItemRecordGuid = "",
  customLabel,
}) => {
  const loadOptions = async (search, loadedOptions, { page }) => {
    try {
      const paramsPost = {
        ...params,
        pageSize: pageSize,
        pageIndex: page,
        search: search,
        Name: search,
      };
      const paramsGet = {
        ...params,
        pageSize: pageSize,
        pageNumber: page,
        search: search,
        Name: search,
      };
      let response;
      if (method === "POST") {
        response = await apiFunction({ postData: paramsPost });
      } else {
        response = await apiFunction({ ...paramsGet });
      }

      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      const data = dataPath.split(".").reduce((acc, key) => acc[key], response);

      const totalRows = totalRowsPath
        .split(".")
        .reduce((acc, key) => acc?.[key], response);

      const hasMore = (page - 1) * pageSize + data.length < totalRows;

      const options = data
        ?.map((item) => {
          // Handle nested paths safely
          let label;
          if (isNested) {
            const nestedValue = labelPath
              ?.split(".")
              .reduce((acc, key) => acc?.[key], item);
            label =
              Array.isArray(nestedValue) && nestedValue[0]
                ? nestedValue[0]?.name
                : "Unnamed";
          } else if (typeof customLabel === "function") {
            label = customLabel(item);
          } else {
            label = item.name || "Unnamed";
          }

          return {
            value: item.recordGuid,
            label: label,
            data: item,
          };
        })
        .filter((option) => option.value !== excludedItemRecordGuid);

      return {
        options: options,
        hasMore,
        additional: { page: page + 1 },
      };
    } catch (error) {
      console.error("Failed to load options:", error);
      return { options: [], hasMore: false };
    }
  };
  return (
    <Box sx={{ position: "relative" }}>
      {(value !== "" && value !== undefined) || value?.length !== 0 ? (
        <InputLabel
          sx={{
            position: "absolute",
            fontSize: "12px",
            marginBottom: "-5px",
          }}
        >
          {placeholder}
        </InputLabel>
      ) : (
        <InputLabel sx={{ position: "absolute", marginTop: "10px" }} />
      )}
      <AsyncPaginate
        key={key}
        value={value}
        loadOptions={loadOptions}
        onChange={onChange}
        placeholder={placeholder}
        additional={additional}
        debounceTimeout={2000}
        isMulti={isMulti}
        isDisabled={isDisabled}
        id={id}
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        menuPlacement="auto"
        closeMenuOnSelect={!isMulti}
        menuShouldScrollIntoView={false}
        styles={{
          control: (base, state) => ({
            ...base,
            alignItems: "end",
          }),
          menu: (base) => ({
            ...base,
            zIndex: 2000,
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 3000,
          }),
          valueContainer: (base) => ({
            ...base,
            marginTop: isMulti ? "20px" : null,
          }),
        }}
      />
    </Box>
  );
};

export default CustomAsyncPaginate;
