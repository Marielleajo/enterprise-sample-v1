import { Add, Delete, Download, Edit, Upload } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import * as Yup from "yup";
import {
  CHANGE_STATUS_PREFIXES,
  DELETE_PREFIX,
  EXPORT_ALL_PREFIXES,
  GET_ALL_PREFIXES,
  IMPORT_PREFIX,
} from "../../../../APIs/Configuration";
import { GET_ALL_COUNTRIES_API } from "../../../../APIs/Criteria";
import { GET_OPERATORS } from "../../../../APIs/SMSAPIS";
import AdvancedSearch from "../../../../Components/AdvancedSearch/AdvancedSearch";
import ConfirmationModal from "../../../../Components/Dialog/ConfirmationModal";
import MuiModal from "../../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import ManagePrefix from "./ManagePrefix";
import DropZone from "../../../../Components/DropZone";
// import Sample from "./Sample.csv";
import { AsyncPaginate } from "react-select-async-paginate";
import GetActions from "../../../Utils/GetActions";
import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";

function Prefix({ t }) {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [manageAddPrefix, setManageAddPrefix] = useState(false);
  const [manageEditPrefix, setManageEditPrefix] = useState(false);
  const [prefixNumber, setPrefixNumber] = useState([]);
  const [country, setCountry] = useState([]);
  const [operator, setOperator] = useState([]);
  const [selectedPrefix, setSelectedPrefix] = useState([]);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const [Countries, SetCountries] = useState([]);
  const [Operators, setOperators] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [randomValue, setRandomValue] = useState("");

  const handleFilterReset = () => {
    setPrefixNumber("");
    setCountry("");
    setOperator("");
    setSearchQuery("");
    setPaginationModel({ pageSize: 10, page: 0 });
  };

  const handleFilterSearch = () => {
    setPaginationModel({
      pageSize: 10,
      page: 0,
    });
  };

  useEffect(() => {
    GetAllCountries();
  }, []);

  useEffect(() => {
    getAllPrefixes({});
  }, [paginationModel]);

  const handleAddMangePrefix = () => {
    setManageAddPrefix(true);
  };

  const handleEditMangePrefix = (data) => {
    setSelectedPrefix(data);
    setManageEditPrefix(true);
  };

  const DeletePrefix = async (value) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        setLoading(true);

        // Execute all delete promises in parallel
        const deleteResponses = await DELETE_PREFIX({
          RecordGuid: value?.recordGuid,
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "Prefix Deleted Successfully",
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
        getAllPrefixes({});
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

  const GetAllCountries = async () => {
    try {
      let countriesResponse = await GET_ALL_COUNTRIES_API({
        pageSize: 500,
        pageNumber: 1,
      });
      SetCountries(countriesResponse?.data?.data?.countries);
    } catch (e) {
      Notification.error(e);
    }
  };

  const loadOperatorOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_OPERATORS({
        iso: country,
        pageNumber: page,
        pageSize: 10,
        search,
      });

      if (!response.status == "200") {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 10 + response?.data?.data?.items?.length <
        response?.data?.data?.totalRows;

      return {
        options: response?.data?.data?.items?.map((item) => ({
          value: item?.recordGuid,
          label: item?.name,
        })),
        hasMore,
        additional: {
          page: page + 1,
        },
      };
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      return { options: [], hasMore: false }; // Return empty options and mark as no more data
    }
  };

  const getAllPrefixes = async ({ search = null }) => {
    setLoading(true);
    try {
      let response = await GET_ALL_PREFIXES({
        token,
        search,
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        PrefixNumber: prefixNumber ? prefixNumber : null,
        CountryGuid: country ? country : null,
        OperatorGuid: operator?.value ? operator?.value : null,
      });

      const data =
        response?.data?.data?.items?.length > 0
          ? response?.data?.data?.items?.map((item) => ({
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

  const exportAllPrefixes = async ({ search = null }) => {
    setLoading(true);
    try {
      let response = await EXPORT_ALL_PREFIXES({
        token,
        search,
        PrefixNumber: prefixNumber ? prefixNumber : null,
        CountryGuid: country ? country : null,
        OperatorGuid: operator?.value ? operator?.value : null,
      });
      const data = response?.data;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Prefixes.csv`); // Set the desired file name
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const [modalOpenSwitchPrefixes, setModalOpenSwitchPrefixes] = useState(false);
  const [checkedSwitchPrefixes, setCheckedSwitchPrefixes] = useState(false);

  const handleSwitchChangeSwitchPrefixes = (rowId) => {
    setModalOpenSwitchPrefixes(true);
    setCheckedSwitchPrefixes(rowId);
  };

  const handleModalCloseSwitchPrefixes = () => {
    setModalOpenSwitchPrefixes(false);
  };

  const handleModalConfirmSwitchPrefixes = async () => {
    try {
      let postData = {
        RecordGuid: checkedSwitchPrefixes,
      };
      let response = await CHANGE_STATUS_PREFIXES({
        postData,
      });
      if (response?.data?.success) {
        setPaginationModel({
          page: 0,
          pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
        getAllPrefixes({});
        setModalOpenSwitchPrefixes(false);
        setLoading(false);
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      setLoading(false);
    }
  };

  const [importPrefix, setImportPrefix] = useState(false);

  const formik = useFormik({
    initialValues: {
      file: {
        file: null,
        fileName: "",
      },
    },
    validationSchema: Yup.object().shape({
      file: Yup.object().required("File is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("File", values?.file?.file);
        let response = await IMPORT_PREFIX({
          formData,
        });

        if (response?.data?.success) {
          setImportPrefix(false);
          showSnackbar("Import Successful!");
          getAllPrefixes({});
          setLoading(false);
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImportCost = () => {
    setImportPrefix(true);
    formik?.handleReset();
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
            justifyContent={"end"}
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
              <Button
                className="mui-btn grey filled"
                id="send-service-country-id"
                onClick={() => exportAllPrefixes({})}
                startIcon={<Download />}
              >
                Export
              </Button>
              <Button
                className="mui-btn grey filled"
                id="send-service-country-id"
                onClick={() => handleImportCost({})}
                startIcon={<Upload />}
              >
                Import
              </Button>
              <Button
                className="mui-btn primary filled"
                id="send-service-country-id"
                onClick={() => handleAddMangePrefix()}
                startIcon={<Add />}
              >
                Add Prefix
              </Button>
              <Button
                className="mui-btn secondary filled"
                id="send-service-country-id"
                onClick={() => setShowAdvanceSearch(!showAdvanceSearch)}
              >
                <FilterAltIcon fontSize="small" />
              </Button>
            </Grid>
            {showAdvanceSearch && (
              <Grid item xs={12}>
                <AdvancedSearch
                  showAdvanceSearch={showAdvanceSearch}
                  handleFilterReset={handleFilterReset}
                  handleFilterSearch={handleFilterSearch}
                  setShowAdvanceSearch={setShowAdvanceSearch}
                  body={
                    <>
                      <Grid item xs={4}>
                        <FormControl fullWidth variant="standard">
                          <TextField
                            key={"prefixNumber"}
                            fullWidth
                            id={"prefixNumber"}
                            name={"prefixNumber"}
                            label="Search by Prefix Number"
                            variant="standard"
                            type="text"
                            value={prefixNumber}
                            onChange={(e) => setPrefixNumber(e?.target?.value)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl fullWidth variant="standard">
                          <InputLabel>Country</InputLabel>
                          <Select
                            key="country"
                            id="country" // Add an id for accessibility
                            name="country" // Name should match the field name in initialValues
                            value={country}
                            onChange={(e) => {
                              handleCountryChange(e);
                              setRandomValue(Math.random());
                            }}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {Countries?.map((country) => (
                              <MenuItem
                                key={country?.recordGuid}
                                value={country?.recordGuid}
                              >
                                {country?.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        {/* {country.length != 0 ? (
                          <InputLabel
                            sx={{ fontSize: "12px", marginBottom: "-5px" }}
                          >
                            Operator
                          </InputLabel>
                        ) : (
                          <InputLabel sx={{ marginTop: "10px" }} />
                        )}
                        <AsyncPaginate
                          key={randomValue}
                          id="async-menu-style"
                          onChange={(value) => {
                            setOperator(value);
                          }}
                          value={operator}
                          loadOptions={loadOperatorOptions}
                          additional={{
                            page: 1,
                          }}
                          isDisabled={country == "" || country == undefined}
                          placeholder="Operator"
                          classNamePrefix="react-select"
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              maxHeight: 150, // Adjust height as needed
                              overflow: "hidden", // Hide scrollbar
                            }),
                            menuList: (provided) => ({
                              ...provided,
                              maxHeight: 150, // Adjust height as needed
                              overflowY: "auto", // Enable vertical scroll if needed
                            }),
                          }}
                        /> */}
                        <CustomAsyncPaginate
                          key={randomValue}
                          apiFunction={GET_OPERATORS}
                          value={operator}
                          onChange={(value) => {
                            setOperator(value);
                          }}
                          placeholder="Operator"
                          pageSize={10}
                          dataPath="data.data.items"
                          totalRowsPath="data.data.totalRows"
                          method="GET"
                          id={`async-menu-style`}
                          params={{ iso: country }}
                          isDisabled={country == "" || country == undefined}
                        />
                      </Grid>
                    </>
                  }
                />
              </Grid>
            )}

            <Grid item xs={12} marginTop={2}>
              <MuiTable
                rowId="recordGuid"
                columns={[
                  {
                    field: "prefixNumber",
                    headerName: "Prefix Number",
                    flex: 1,
                    minWidth: 300,
                  },
                  {
                    headerName: "Country",
                    field: "country",
                    flex: 1,
                    minWidth: 150,
                    renderCell: (params) => {
                      return params?.row?.operator?.country?.name || ""; // Extract the country name for sorting
                    },
                    sortComparator: (v1, v2, cellParams1, cellParams2) => {
                      return v1?.toString().localeCompare(v2?.toString()); // Sorting strings
                    },
                  },
                  {
                    field: "operator",
                    headerName: "Operator",
                    flex: 1,
                    minWidth: 100,
                    renderCell: (params) => {
                      return params?.row?.operator?.name || ""; // Extract the country name for sorting
                    },
                  },
                  {
                    field: "status",
                    headerName: "Status",
                    flex: 1,
                    minWidth: 100,
                    renderCell: (params) => {
                      const rowId = params?.row?.recordGuid;
                      return (
                        <Box direction="row" spacing={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={params.row?.isActive}
                                onChange={() => {
                                  handleSwitchChangeSwitchPrefixes(rowId);
                                  setSelectedPrefix(params.row);
                                }}
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
                    renderCell: (params) => {
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "left",
                            width: "100%",
                          }}
                        >
                          <Tooltip title="Edit Prefix">
                            <IconButton
                              onClick={() => handleEditMangePrefix(params?.row)}
                              size="small"
                              id="editPrefix"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Prefix">
                            <IconButton
                              onClick={() => DeletePrefix(params?.row)}
                              size="small"
                              id="deletePrefix"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      );
                    },
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
      </Grid>

      {manageAddPrefix && (
        <MuiModal
          title="Add Prefix"
          open={manageAddPrefix}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageAddPrefix(false)}
        >
          <ManagePrefix
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAddPrefix={setManageAddPrefix}
            getAllPrefixes={getAllPrefixes}
          />
        </MuiModal>
      )}

      {manageEditPrefix && (
        <MuiModal
          title="Edit Prefix"
          open={manageEditPrefix}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageEditPrefix(false)}
        >
          <ManagePrefix
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageAddPrefix={setManageEditPrefix}
            getAllPrefixes={getAllPrefixes}
            selectedPrefix={selectedPrefix}
            setSelectedPrefix={setSelectedPrefix}
          />
        </MuiModal>
      )}

      {modalOpenSwitchPrefixes && (
        <ConfirmationModal
          open={modalOpenSwitchPrefixes}
          onClose={handleModalCloseSwitchPrefixes}
          title={selectedPrefix?.isActive ? "Deactivate " : "Activate"}
          text={`Are you sure you want to ${
            selectedPrefix?.isActive ? "deactivate " : "activate"
          } this prefix?`}
          onButtonClick={handleModalConfirmSwitchPrefixes}
        />
      )}

      {importPrefix && (
        <MuiModal
          title="Import File"
          open={importPrefix}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setImportPrefix(false)}
        >
          <Grid item md={12} mt={3}>
            <DropZone
              onUpload={async (acceptedFiles, fileRejections) => {
                formik?.setFieldValue("file", {
                  file: acceptedFiles[0],
                  fileName: acceptedFiles[0]?.name,
                });
              }}
              accept={".xls, .xlsx, .csv"}
              fileUploaded={formik?.values?.file?.fileName}
            />
            {!formik?.values?.file?.file && (
              <FormHelperText style={{ color: "red" }}>
                {"File is required!"}
              </FormHelperText>
            )}
          </Grid>
          <Grid item md={12} className="mb-2 d-flex justify-content-end">
            {/* <a href={Sample}>Download Sample</a> */}
          </Grid>
          <Grid container justifyContent="between" className="my-3">
            <Button
              className="mui-btn secondary outlined"
              onClick={() => setImportPrefix(false)}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              className="mui-btn primary filled"
              disabled={loading}
              onClick={formik?.handleSubmit}
            >
              {loading ? t("Loading...") : t("Confirm")}
            </Button>
          </Grid>
        </MuiModal>
      )}
    </Box>
  );
}

export default withTranslation("translation")(GetActions(Prefix));
