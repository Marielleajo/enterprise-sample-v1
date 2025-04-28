import { Button, Grid } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { POST_CLIENTS } from "../../../../APIs/Prepaid";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";

export default function PrepaidConfirmation({
  client,
  reseller,
  getNoAccountClients,
  handelCloseModal,
}) {
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      reseller: reseller,
      client: client,
    },
    onSubmit: async (values) => {

      const payload = {
        ClientGuid: values?.client?.recordGuid,
        BalanceLimit: values?.balanceLimit?.recordGuid,
      };
      setLoading(true);
      try {
        let response = await POST_CLIENTS({ postData: payload });
  
        if (response?.data?.success) {
          getNoAccountClients();
          showSnackbar(response?.data?.message);
          handelCloseModal();
        } else {
          showSnackbar(response?.data?.message);
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <p>
            Are you sure you want to create a prepaid account for the client{" "}
            <span style={{ color: "#d32f2f" }}> {client.name} </span>
          </p>
        </Grid>

        <Grid
          item
          xs={12}
          display={"flex"}
          justifyContent={"end"}
          alignItems={"center"}
        >
          <Button
            onClick={handelCloseModal}
            className="mui-btn grey button-cancel"
            id="send-service-provider-id"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="mui-btn primary filled"
            id="send-service-provider-id"
            disabled={loading}
          >
            Confirm
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
