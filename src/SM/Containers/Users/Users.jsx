import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  DELETE_USER,
  GET_ALL_USERS,
  UPDATE_USER_STATUS,
} from "../../../APIs/Users";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { GET_ALL_POLICIEs_API } from "../../../Roles/Apis";
import { ROLES } from "../../Utils/Constants";
import { HandleApiError, handleMessageError } from "../../Utils/Functions";
import ManageUsers from "./ManageUsers";
import GetActions from "../../Utils/GetActions";

function Users({ t }) {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [roles, setRoles] = useState([]);
  const { token, role } = useSelector((state) => state.authentication);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [manageEditUser, setManageEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [manageAddUser, setManageAddUser] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    GetPolicies();
  }, []);

  useEffect(() => {
    getAllUsers({});
  }, [paginationModel]);

  const getAllUsers = async ({ retryCount = 0 }) => {
    setLoading(true);
    try {
      let response = await GET_ALL_USERS({
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
      });
      const items = response?.data?.data?.users;
      const data = items?.map((item) => ({
        ...item,
        recordGuid: item?.recordGuid,
        username: item?.username,
        email: item?.email,
        mobileNumber: item?.mobileNumber,
        firstName: item?.firstName,
        lastName: item?.lastName,
        isActive: item?.isActive,
      }));
      SetData(data);
      SetTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      console.error("API call failed:", e);
      if (retryCount < 1) {
        getAllUsers({ retryCount: retryCount + 1 });
      } else {
        showSnackbar(handleMessageError({ e }), "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const DeleteUser = async (value) => {
    const result = await swalDeleteFunction();
    if (result?.isConfirmed) {
      try {
        setLoading(true);
        const deleteResponses = await DELETE_USER(value?.recordGuid);
        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "User Deleted Successfully",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error Deleting User",
            text: "Unknown Error",
            icon: "error",
          });
        }
        getAllUsers({});
      } catch (e) {
        Swal.fire({
          title: "Error Deleting User",
          text: handleMessageError({ e }),
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatus = async (recordGuid, currentStatus) => {
    const result = await Swal.fire({
      title: "Confirm Status Update",
      text: "Are you sure you want to update this service status?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#dd3333",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        let updateResponse = await UPDATE_USER_STATUS(
          recordGuid,
          !currentStatus
        );
        if (updateResponse?.data?.success) {
          Swal.fire({
            title: "Status Updated Successfully",
            icon: "success",
          });
          getAllUsers({});
        }
      } catch (e) {
        Swal.fire({
          title: "Error Updating Status",
          text: handleMessageError({ e }),
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddManageUser = () => {
    setManageAddUser(true);
  };

  const handleEditManageUser = (data) => {
    setSelectedUser(data);
    setManageEditUser(true);
  };

  const GetPolicies = async () => {
    try {
      let policiesResponse = await GET_ALL_POLICIEs_API({ token });
      if (ROLES?.includes(role[0])) {
        setRoles(policiesResponse?.data?.data?.policies);
      } else {
        setRoles(
          policiesResponse?.data?.data?.policies?.filter(
            (item) => !ROLES?.includes(item?.name)
          )
        );
      }
    } catch (e) {
      HandleApiError(e);
    }
  };

  return (
    <>
      <Box className="page_container">
        <Grid container columnSpacing={3} className="section_container scroll">
          <Grid item xs={12} className="sub_section_container">
            <Grid
              container
              className="pt-4"
              paddingRight={2.5}
              display="flex"
              justifyContent="start"
              alignItems="center"
            >
              <Grid item xs={12} md={4}>
                <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                  <Typography className="BreadcrumbsPage">Users</Typography>
                </Breadcrumbs>
              </Grid>
              <Grid
                item
                xs={6}
                md={8}
                display="flex"
                justifyContent="end"
                alignItems="center"
              >
                <Button
                  className="mui-btn primary filled"
                  onClick={handleAddManageUser}
                  startIcon={<Add />}
                >
                  Add User
                </Button>
              </Grid>

              <Grid item xs={12} marginTop={2}>
                <Card className="kpi-card">
                  <MuiTable
                    rowId="recordGuid"
                    columns={[
                      {
                        field: "username",
                        headerName: "Username",
                        flex: 1,
                        minWidth: 200,
                      },
                      {
                        field: "email",
                        headerName: "Email",
                        flex: 1,
                        minWidth: 200,
                      },
                      {
                        field: "firstName",
                        headerName: "First Name",
                        flex: 1,
                        minWidth: 100,
                      },
                      {
                        field: "lastName",
                        headerName: "Last Name",
                        flex: 1,
                        minWidth: 100,
                      },
                      {
                        field: "status",
                        headerName: "Status",
                        flex: 1,
                        renderCell: (params) => {
                          return (
                            <Box direction="row" spacing={2}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={params?.row?.isActive}
                                    onChange={() =>
                                      handleStatus(
                                        params?.row?.recordGuid,
                                        params?.row?.isActive
                                      )
                                    }
                                  />
                                }
                              />
                            </Box>
                          );
                        },
                      },
                      {
                        field: "actions",
                        headerName: "Actions",
                        flex: 1,
                        renderCell: (params) => (
                          <>
                            <Tooltip title="Edit User">
                              <IconButton
                                onClick={() =>
                                  handleEditManageUser(params?.row)
                                }
                                size="small"
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete User">
                              <IconButton
                                onClick={() => DeleteUser(params?.row)}
                                size="small"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </>
                        ),
                      },
                    ]}
                    data={Data}
                    loading={loading}
                    setPaginationModel={setPaginationModel}
                    paginationModel={paginationModel}
                    totalRows={totalRows}
                  />
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {manageAddUser && (
          <MuiModal
            title="Add User"
            open={manageAddUser}
            width="500px"
            handleClose={() => setManageAddUser(false)}
          >
            <ManageUsers
              type="add"
              loading={loading}
              setLoading={setLoading}
              setManageAddUser={setManageAddUser}
              getAllUsers={getAllUsers}
              roles={roles}
            />
          </MuiModal>
        )}

        {manageEditUser && (
          <MuiModal
            title="Edit User"
            open={manageEditUser}
            width="500px"
            handleClose={() => setManageEditUser(false)}
          >
            <ManageUsers
              type="edit"
              loading={loading}
              setLoading={setLoading}
              setManageAddUser={setManageEditUser}
              getAllUsers={getAllUsers}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              roles={roles}
            />
          </MuiModal>
        )}
      </Box>
    </>
  );
}

export default withTranslation("translations")(GetActions(Users));
