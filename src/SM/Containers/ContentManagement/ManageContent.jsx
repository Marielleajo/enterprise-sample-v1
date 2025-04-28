import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { GET_ALL_CONTENT_TYPE, POST_CATEGORY } from "../../../APIs/CatalogApi";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import { useEffect } from "react";

const Validation = Yup.object().shape({
  contentCategory: Yup.string().required("Content category is required"),
});

export default function AddContent({ setManageAdd, getAllCategory }) {
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [contentTypeOptions, setContentTypeOptions] = useState([]);

  const formik = useFormik({
    initialValues: {
      contentCategory: "",
    },
    validationSchema: Validation,
    onSubmit: async (values) => {
      const payload = {
        isActive: true,
        contentCategoryDetails: [
          {
            languageCode: "en",
            name: values.contentCategory,
            description: "test",
          },
        ],
      };
      setLoading(true);
      try {
        let response = await POST_CATEGORY({ postData: payload });
        if (response?.data?.success) {
          getAllCategory();
          showSnackbar(response?.data?.message);
          setManageAdd(false);
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

  const handleCancel = () => {
    setManageAdd(false);
  };

  const getAllContentType = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_CONTENT_TYPE();
      const options = response?.data?.data?.items?.map((item) => ({
        value: item?.recordGuid,
        label: item?.tag,
      }));
      setContentTypeOptions(options);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllContentType();
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl variant="standard" fullWidth>
            <TextField
              key={"contentCategory"}
              fullWidth
              id={"contentCategory"}
              name={"contentCategory"}
              label={"Content Category"}
              variant="standard"
              type="text"
              value={formik.values.contentCategory}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.contentCategory &&
                Boolean(formik.errors.contentCategory)
              }
              helperText={
                formik.touched.contentCategory && formik.errors.contentCategory
              }
            />
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          display={"flex"}
          justifyContent={"end"}
          alignItems={"center"}
        >
          <Button
            className="mui-btn primary outlined"
            id="send-service-feature-id"
            disabled={loading}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="mui-btn primary filled"
            id="send-service-feature-id"
            disabled={loading}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
