import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  ASSIGN_SERVICES,
  DELETE_CATEGORY,
  GET_CLIENT_CATEGORIES,
  GET_SERVICES,
  UNASSIGN_SERVICES,
} from "../../../APIs/Clients";
import MuiCheckbox from "../../../Components/MuiCheckbox";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import GetActions from "../../Utils/GetActions";
import ManageClientCategories from "./ManageClientCategories";

function ClientCategories({ t }) {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [manageAddClientCategory, setManageAddClientCategory] = useState(false);
  const [manageEditClientCategory, setManageEditClientCategory] =
    useState(false);
  const [selectedClientCategory, setSelectedClientCategory] = useState([]);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);

  const handleAddMangeClientCategory = () => {
    setManageAddClientCategory(true);
  };

  const handleEditMangeClientCategory = (data) => {
    setSelectedClientCategory(data);
    setManageEditClientCategory(true);
  };

  const DeleteClientCategory = async (value) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        setLoading(true);

        // Execute all delete promises in parallel
        const deleteResponses = await DELETE_CATEGORY({
          RecordGuid: [value?.recordGuid],
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "Client Category Deleted Successfully",
            icon: "success",
          });
        } else {
          // Handle failure, e.g., display an error message for each failed deletion
          Swal.fire({
            title: "Error Updating Status",
            text: "Unknown Error",
            icon: "error",
          });
        }

        // Refresh your data or perform any necessary actions
        getAllClientCategories();
      } catch (e) {
        Swal.fire({
          title: "Error Updating Status",
          text: handleMessageError({ e }),
          icon: "error",
        });
      } finally {
        // Set loading back to false when the operation is complete
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getAllClientCategories();
  }, [paginationModel]);

  const getAllClientCategories = async () => {
    setLoading(true);
    try {
      let response = await GET_CLIENT_CATEGORIES({
        token,
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
      });

      const data =
        response?.data?.data?.clientCategory?.length > 0
          ? response?.data?.data?.clientCategory?.map((item) => ({
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

  const [manageSubsModal, setManageSubsModal] = useState(false);
  const [categoryServices, setCategoryServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [checkedServices, setCheckedServices] = useState([]);

  const manageSubFunction = async (data) => {
    getCategoryServices(data?.recordGuid);
    setManageSubsModal(true);
    setSelectedCategory(data);
  };

  const handleCheckboxChange = (event) => {
    const { id } = event?.target;
    const updatedCheckedItems = checkedServices?.includes(id)
      ? checkedServices?.filter((item) => item !== id)
      : [...checkedServices, id];
    setCheckedServices(updatedCheckedItems);
  };

  const serviceSubscription = async () => {
    setLoading(true);
    try {
      let dataForm = {
        ClientCategoryGuid: selectedCategory?.recordGuid,
        ServicesGuid: checkedServices,
      };
      let response = await ASSIGN_SERVICES({ dataForm });
      if (response?.data?.data?.success) {
        setManageSubsModal(false);
        setCheckedServices([]);
        setLoading(false);
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const serviceUnSubscription = async () => {
    setLoading(true);
    try {
      let notSelectedServices = categoryServices
        ?.filter((item) => !checkedServices?.includes(item?.recordGuid))
        ?.map((item) => item.recordGuid);
      let dataForm = {
        ClientCategoryGuid: selectedCategory?.recordGuid,
        ServicesGuid: notSelectedServices,
      };
      let response = await UNASSIGN_SERVICES({ dataForm });
      if (response?.data?.data?.success) {
        setManageSubsModal(false);
        setCheckedServices([]);
        setLoading(false);
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const callSubscriptionUnsubscriptionServices = async () => {
    try {
      await serviceSubscription();
      await serviceUnSubscription();
      showSnackbar("Subscriptions Updated Successfully!");
    } catch (error) {
      setManageSubsModal(false);
      setCheckedServices([]);
      setLoading(false);
    } finally {
      setLoading(false);
      setManageSubsModal(false);
    }
  };

  const getCategoryServices = async (ClientCategoryGuid) => {
    setCategoryServices([]);
    setLoading(true);
    try {
      let response = await GET_SERVICES({
        token,
        ClientCategoryGuid,
      });

      const data = response?.data?.data?.items.map((item) => ({
        ...item,
      }));
      setCategoryServices(data ?? []);
      const checkedData = response?.data?.data?.items
        ?.filter((item) => item?.isAssigned)
        ?.map((item) => item.recordGuid);
      setCheckedServices([...checkedData]);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="page_container">
      <Grid container columnSpacing={3} className="section_container scroll">
        <Grid item xs={12} className="sub_section_container">
          <Grid
            container
            className="pt-4"
            paddingRight={2.5}
            display={"flex"}
            justifyContent={"start"}
            alignItems={"center"}
          >
            <Grid
              item
              xs={6}
              md={8}
              display={"flex"}
              justifyContent={"end"}
              alignItems={"center"}
            >
              {/* <Button
                className="mui-btn primary filled"
                id="send-service-provider-id"
                onClick={() => handleAddMangeClientCategory()}
                startIcon={<Add />}
              >
                Add Client Category
              </Button> */}
            </Grid>

            <Grid item xs={12} marginTop={2}>
              <MuiTable
                rowId="recordGuid"
                columns={[
                  {
                    field: "name",
                    headerName: "Name",
                    minWidth: 100,

                    flex: 1,
                    renderCell: (value) => {
                      const row = value.row;
                      return `${row?.clientCategoryDetails[0]?.name}`;
                    },
                    sortComparator: (v1, v2, cellParams1, cellParams2) => {
                      return v1?.toString().localeCompare(v2?.toString()); // Sorting strings
                    },
                  },
                  {
                    field: "description",
                    headerName: "Description",
                    minWidth: 100,

                    flex: 1,
                    renderCell: (value) => {
                      const row = value.row;
                      return `${row?.clientCategoryDetails[0]?.description}`;
                    },
                    sortComparator: (v1, v2, cellParams1, cellParams2) => {
                      return v1?.toString().localeCompare(v2?.toString()); // Sorting strings
                    },
                  },
                  // {
                  //   field: "actions",
                  //   headerName: "Actions",
                  //   flex: 1,
                  //   renderCell: (value) => {
                  //     return (
                  //       <>
                  //         <Tooltip title="Edit ClientCategory">
                  //           <IconButton
                  //             onClick={() =>
                  //               handleEditMangeClientCategory(value?.row)
                  //             }
                  //             size="small"
                  //             id="editClientCategory"
                  //           >
                  //             <Edit />
                  //           </IconButton>
                  //         </Tooltip>
                  //         <Tooltip title={"Manage Services"} placement="top">
                  //           <IconButton
                  //             onClick={() => {
                  //               !value.row?.isLocked &&
                  //                 manageSubFunction(value?.row);
                  //             }}
                  //             size="small"
                  //             id="editCost"
                  //           >
                  //             <SettingsSuggestIcon />
                  //           </IconButton>
                  //         </Tooltip>
                  //         <Tooltip title="Delete ClientCategory">
                  //           <IconButton
                  //             onClick={() =>
                  //               DeleteClientCategory(value?.row)
                  //             }
                  //             size="small"
                  //             id="deleteClientCategory"
                  //           >
                  //             <Delete />
                  //           </IconButton>
                  //         </Tooltip>
                  //       </>
                  //     );
                  //   },
                  // },
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
      </Grid>

      {manageAddClientCategory && (
        <MuiModal
          title="Add Client Category"
          open={manageAddClientCategory}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageAddClientCategory(false)}
        >
          <ManageClientCategories
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAddClientCategory={setManageAddClientCategory}
            getAllClientCategories={getAllClientCategories}
          />
        </MuiModal>
      )}

      {manageEditClientCategory && (
        <MuiModal
          title="Edit Client Category"
          open={manageEditClientCategory}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageEditClientCategory(false)}
        >
          <ManageClientCategories
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageAddClientCategory={setManageEditClientCategory}
            getAllClientCategories={getAllClientCategories}
            selectedClientCategory={selectedClientCategory}
          />
        </MuiModal>
      )}

      {manageSubsModal && (
        <MuiModal
          title="Manage Services"
          open={manageSubsModal}
          width="500px"
          id="edit-contact-form"
          handleClose={() => {
            setManageSubsModal(false);
            setCheckedServices([]);
          }}
        >
          <Grid
            container
            justifyContent="start"
            className="my-3"
            sx={{ maxHeight: "300px", overflowY: "auto" }}
          >
            {categoryServices?.length > 0 ? (
              categoryServices?.map((item) => (
                <Grid item xs={12} key={item?.serviceDetails[0]?.recordGuid}>
                  <FormControlLabel
                    control={
                      <MuiCheckbox
                        id={item?.recordGuid}
                        onChange={handleCheckboxChange}
                        checked={checkedServices?.includes(item?.recordGuid)}
                        name={item?.tag}
                      />
                    }
                    label={item?.serviceDetails[0]?.name}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12} display="flex" justifyContent={"center"}>
                No Services Assigned to this category!
              </Grid>
            )}
          </Grid>
          <Grid container justifyContent="end" className="my-3">
            <Button
              onClick={() => callSubscriptionUnsubscriptionServices()}
              className="mui-btn primary filled"
              disabled={loading || categoryServices?.length <= 0}
            >
              {loading ? t("Loading...") : t("Save")}
            </Button>
            <Button
              className="mui-btn secondary outlined"
              onClick={() => {
                setManageSubsModal(false);
                setCheckedServices([]);
              }}
            >
              {t("Cancel")}
            </Button>
          </Grid>
        </MuiModal>
      )}
    </Box>
  );
}

export default withTranslation("translations")(GetActions(ClientCategories));
