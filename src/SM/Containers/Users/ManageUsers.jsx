import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import * as Yup from "yup";
import { GET_ALL_TITLES } from "../../../APIs/Providers";
import { ADD_USER, UPDATE_USER } from "../../../APIs/Users";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";

function ManageUsers({
  type,
  loading,
  setLoading,
  setManageAddUser,
  getAllUsers,
  selectedUser,
  roles,
}) {
  const { showSnackbar } = useSnackbar();
  const [userTypeOptions, setUserTypeOptions] = useState([]);
  const [contactTypeOptions, setContactTypeOptions] = useState([]);

  const getAccountTypes = async () => {
    setLoading(true);
    try {
      let data = { categoryTags: ["USER_TYPE"] };
      let response = await GET_ALL_TITLES({ data });
      setUserTypeOptions(
        response?.data?.data?.criteria?.map((item) => ({
          label: item?.name,
          value: item?.tag,
        }))
      );
      data = { categoryTags: ["CONTACT_TYPE"] };
      response = await GET_ALL_TITLES({ data });
      setContactTypeOptions(
        response?.data?.data?.criteria?.map((item) => ({
          label: item?.name,
          value: item?.tag,
        }))
      );
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccountTypes();
  }, []);

  const UserValidationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    usertype: Yup.string().required("User Type is required"),
    mobileNumber: Yup.string()
      .matches(/^[0-9]+$/, "Mobile Number must be only digits")
      .min(8, "Mobile Number must be at least 8 digits")
      .required("Mobile Number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    contactType: Yup.string().required("Contact Type is required"),
    role: Yup.string().required("User Role is required"),
  });

  const UserEditValidationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: type === "add" ? "" : selectedUser?.username,
      password: type === "add" ? "" : selectedUser?.password,
      confirmPassword: type === "add" ? "" : selectedUser?.password,
      usertype: "",
      mobileNumber: type === "add" ? "" : selectedUser?.mobileNumber,
      email: type === "add" ? "" : selectedUser?.email,
      firstName: type === "add" ? "" : selectedUser?.firstName,
      lastName: type === "add" ? "" : selectedUser?.lastName,
      contactType: "",
      role: "",
    },
    validationSchema:
      type === "add" ? UserValidationSchema : UserEditValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let adddata = {
          Username: values?.username,
          Usertype: values?.usertype,
          PolicyId: values?.role,
          Contacts: [
            {
              MobileNumber: values?.mobileNumber,
              Email: values?.email,
              ContactType: values?.contactType,
              FirstName: values?.firstName,
              LastName: values?.lastName,
            },
          ],
          ...(type === "add" && { Password: values?.password }), // Conditional addition of Password
        };
        let editdata = {
          RecordGuid: selectedUser?.recordGuid,
          FirstName: values?.firstName,
          LastName: values?.lastName,
        };
        let response;
        if (type === "add") {
          response = await ADD_USER(adddata);
        } else {
          response = await UPDATE_USER(editdata);
        }
        if (response?.data?.success) {
          showSnackbar(
            type === "add"
              ? "User Added Successfully!"
              : "User Updated Successfully!"
          );
          setManageAddUser(false);
          getAllUsers({});
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
        <Grid item xs={6}>
          <FormControl fullWidth variant="standard">
            <TextField
              key="username"
              id="username"
              name="username"
              label="Username *"
              variant="standard"
              disabled={type !== "add"}
              value={formik?.values?.username}
              onChange={formik?.handleChange}
              onBlur={formik?.handleBlur}
              helperText={formik?.touched?.username && formik?.errors?.username}
              error={
                formik?.touched?.username && Boolean(formik?.errors?.username)
              }
            />
          </FormControl>
        </Grid>

        {type === "add" && (
          <Grid item xs={6}>
            <FormControl
              fullWidth
              variant="standard"
              error={formik.touched.role && Boolean(formik.errors.role)}
            >
              <InputLabel id="userrole-label">Role *</InputLabel>
              <Select
                key="role"
                id="role"
                name="role"
                label="User Role *"
                labelId="userrole-label"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {roles.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formik.touched.role && formik.errors.role}
              </FormHelperText>
            </FormControl>
          </Grid>
        )}

        {type === "add" && (
          <>
            <Grid item xs={6}>
              <FormControl fullWidth variant="standard">
                <TextField
                  key="password"
                  id="password"
                  name="password"
                  label="Password *"
                  type="password"
                  variant="standard"
                  value={formik?.values?.password}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                  helperText={
                    formik?.touched?.password && formik?.errors?.password
                  }
                  error={
                    formik?.touched?.password &&
                    Boolean(formik?.errors?.password)
                  }
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth variant="standard">
                <TextField
                  key="confirmPassword"
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password *"
                  type="password"
                  variant="standard"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                />
              </FormControl>
            </Grid>
          </>
        )}

        <Grid item xs={6}>
          <FormControl fullWidth variant="standard">
            <TextField
              key="firstName"
              id="firstName"
              name="firstName"
              label="First Name *"
              variant="standard"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={formik.touched.firstName && formik.errors.firstName}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth variant="standard">
            <TextField
              key="lastName"
              id="lastName"
              name="lastName"
              label="Last Name *"
              variant="standard"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={formik.touched.lastName && formik.errors.lastName}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth variant="standard">
            <TextField
              key="email"
              id="email"
              name="email"
              label="Email *"
              type="email"
              variant="standard"
              disabled={type !== "add"}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth variant="standard">
            <TextField
              key="mobileNumber"
              id="mobileNumber"
              name="mobileNumber"
              label="Mobile Number *"
              variant="standard"
              disabled={type !== "add"}
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.touched.mobileNumber && formik.errors.mobileNumber
              }
              error={
                formik.touched.mobileNumber &&
                Boolean(formik.errors.mobileNumber)
              }
            />
          </FormControl>
        </Grid>

        {type === "add" && (
          <Grid item xs={6}>
            <FormControl
              fullWidth
              variant="standard"
              error={formik.touched.usertype && Boolean(formik.errors.usertype)}
            >
              <InputLabel id="usertype-label">User Type *</InputLabel>
              <Select
                key="usertype"
                id="usertype"
                name="usertype"
                label="User Type *"
                labelId="usertype-label"
                value={formik.values.usertype}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {userTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formik.touched.usertype && formik.errors.usertype}
              </FormHelperText>
            </FormControl>
          </Grid>
        )}

        {type === "add" && (
          <Grid item xs={6}>
            <FormControl
              fullWidth
              variant="standard"
              error={
                formik.touched.contactType && Boolean(formik.errors.contactType)
              }
            >
              <InputLabel id="contactType-label">Contact Type *</InputLabel>
              <Select
                key="contactType"
                id="contactType"
                name="contactType"
                label="Contact Type"
                labelId="contactType-label"
                value={formik.values.contactType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {contactTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formik.touched.contactType && formik.errors.contactType}
              </FormHelperText>
            </FormControl>
          </Grid>
        )}

        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="end"
          alignItems="center"
        >
          <Button
            type="submit"
            className="mui-btn primary filled"
            id="add-User"
            disabled={loading}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default withTranslation("translations")(ManageUsers);
