import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import PostPaidAccountForm from "./AccountTypeForms/PostPaidAccountForm";
import PrepaidAccountForm from "./AccountTypeForms/PrepaidAccountForm";
import PrepaidConfirmation from "./AccountTypeForms/PrepaidConfirmation";

export default function ManageCreateClientAccount({
  handelCloseModal,
  client,
  reseller,
  valueThreshold,
  getNoAccountClients,
}) {
  const [accountType, setAccountType] = useState("");

  const handleChange = (event) => {
    setAccountType(event.target.value);
  };
  return (
    <>
      {reseller?.accountTypeTag == "POSTPAID" && (
        <Grid item xs={12} className="h-32" marginBottom={2}>
          <FormControl fullWidth variant="standard">
            <InputLabel id="AccountType-label">Account Type</InputLabel>
            <Select
              key="AccountType"
              id="AccountType"
              name="AccountType"
              label="AccountType"
              labelId="AccountType-label"
              value={accountType}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="PREPAID">Prepaid Account</MenuItem>
              <MenuItem value="POSTPAID">Postpaid Account</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      )}

      <Grid item xs={12} className="h-32">
        {accountType == "POSTPAID" && (
          <PostPaidAccountForm
            client={client}
            reseller={reseller}
            valueThreshold={valueThreshold}
            getNoAccountClients={getNoAccountClients}
            handelCloseModal={handelCloseModal}
          />
        )}
        {accountType == "PREPAID" && (
          <PrepaidAccountForm
            client={client}
            reseller={reseller}
            getNoAccountClients={getNoAccountClients}
            handelCloseModal={handelCloseModal}
          />
        )}
        {reseller?.accountTypeTag == "PREPAID" && (
          <PrepaidConfirmation
            client={client}
            reseller={reseller}
            getNoAccountClients={getNoAccountClients}
            handelCloseModal={handelCloseModal}
          />
        )}
      </Grid>
    </>
  );
}
