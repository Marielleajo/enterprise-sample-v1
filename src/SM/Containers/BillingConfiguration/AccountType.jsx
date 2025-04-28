import { Download } from "@mui/icons-material";
import { Button, Card, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  EXPORT_ACCOUNT_TYPE,
  GET_ACCOUNT_TYPE,
} from "../../../APIs/BillingConfig";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";

function AccountType({ setHeaderRight }) {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);

  useEffect(() => {
    setHeaderRight?.(
      <Button
        className="mui-btn grey filled"
        id="export-rate"
        onClick={() => exportAllConfig()}
        startIcon={<Download />}
      >
        Export
      </Button>
    );

    return () => setHeaderRight?.(null); // cleanup when unmounting
  }, []);

  const getAllConfig = async () => {
    setLoading(true);
    try {
      let response = await GET_ACCOUNT_TYPE({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
      });
      const data =
        response?.data?.data?.types?.length > 0
          ? response?.data?.data?.types?.map((item) => ({
              ...item,
            }))
          : [];
      SetData(data);
      SetTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const exportAllConfig = async () => {
    setLoading(true);
    try {
      let response = await EXPORT_ACCOUNT_TYPE({
        token,
        search: "",
      });
      const data = response?.data;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Config.csv`); // Set the desired file name
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllConfig();
  }, []);

  return (
    <>
      <Grid item xs={12} className="sub_section_container">
        <Grid
          container
          className=""
          display={"flex"}
          justifyContent={"start"}
          alignItems={"center"}
        >
          <Grid item xs={12} md={4}></Grid>
          <Grid
            item
            xs={6}
            md={8}
            display={"flex"}
            justifyContent={"end"}
            alignItems={"center"}
          ></Grid>

          <Grid item xs={12} marginTop={2}>
            <MuiTable
              columns={[
                {
                  field: "name",
                  headerName: "Name",
                },
                {
                  field: "description",
                  headerName: "Description",
                  flex: 1,
                },
              ]}
              data={Data}
              loading={loading}
              setPaginationModel={setPaginationModel}
              paginationModel={paginationModel}
              totalRows={totalRows}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default withTranslation("translations")(AccountType);
