import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import { ASSIGN_ROLE, GET_ALL_POLICIEs_API, UNASSIGN_ROLE } from "../APIs/Roles";
import MuiModal from "./MuiModal/MuiModal";
import { handleMessageError } from "../SM/Utils/Functions";
import { useSnackbar } from "../Contexts/SnackbarContext";

const AssignRole = ({ open, handleClose, client }) => {

  const [Policies, SetPolicies] = useState([]);
  const filter = createFilterOptions();
  const { showSnackbar } = useSnackbar();
  const GetAllPolicies = async () => {
    try {
      let policiesResponse = await GET_ALL_POLICIEs_API({})
      SetPolicies(policiesResponse?.data?.data?.policies);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    }
  };

  useEffect(() => {
    GetAllPolicies();
  }, []);

  const [value, setValue] = useState(null);

  const handleRoleChange = async (event, newValue) => {
    setValue(newValue);
  };

  const handleAssignRole = async () => {
    try {
      let clientResponse = await UNASSIGN_ROLE({ ExternalUserId: client, PolicyId: process?.env?.REACT_APP_CLIENT_ID })
      if (clientResponse?.data?.success){
        let policiesResponse = await ASSIGN_ROLE({ ExternalUserId: client, PolicyId:value?.id })
        if (policiesResponse?.data?.success){
          handleClose()
        }
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    }
  };

  return (
    <MuiModal title={"Assign role"} open={client} handleClose={handleClose}>
      <Stack rowGap={2}>
        <Autocomplete
          value={value}
          onChange={handleRoleChange}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some(
              (option) => inputValue === option.name
            );
            if (inputValue !== "" && !isExisting) {
              filtered.push({
                inputValue,
                name: `Add "${inputValue}"`,
              });
            }

            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="free-solo-with-text-demo"
          options={Policies}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === "string") {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return option.name;
          }}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          freeSolo
          renderInput={(params) => (
            <TextField {...params} label="Free solo with text demo" />
          )}
        />
        <Button variant="contained" fullWidth onClick={handleAssignRole}>
          {" "}
          Assign Role{" "}
        </Button>
      </Stack>
    </MuiModal>
  );
};

export default AssignRole;
