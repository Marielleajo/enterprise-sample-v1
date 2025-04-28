import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Tooltip,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { withTranslation } from "react-i18next";
import RemoveIcon from "@mui/icons-material/Remove";

const MessageField = ({
  t,
  UpdateText,
  data,
  formik,
  updateTextFieldSampleTextValue,
}) => {
  const [url, SetUrlText] = useState("");
  const [text, SetText] = useState("");
  const textAreaRef = useRef(null); // Create a ref for the textarea

  // Function to handle inserting variables into the textarea
  const insertVariable = (variable) => {
    const textArea = textAreaRef?.current;
    const { selectionStart, selectionEnd } = textArea;
    const currentValue = textArea?.value;
    // Insert the variable at the caret position
    const newValue =
      currentValue?.substring(0, selectionStart) +
      `{{link}}` +
      currentValue?.substring(selectionEnd);
    textArea.value = newValue; // Update the textarea value
    textArea?.setSelectionRange(
      selectionStart + variable?.length,
      selectionStart + variable?.length
    ); // Set the caret position after the inserted variable
    handleUpdateChange({ text: textArea?.value });
    SetUrlText("{{link}}");
  };

  const handleUpdateChange = ({ text }) => {
    SetText(text);
    updateTextFieldSampleTextValue(text);
    UpdateText(text);
  };

  useEffect(() => {
    SetText(data);
  }, [data]);

  return (
    <Box className="sms_field mt-4 w-100">
      <Grid className="action_tabs">
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={11}>
              {formik.touched.sampleText && formik.errors.sampleText ? (
                <InputLabel style={{ color: "#d32f2f" }} htmlFor="your-input">
                  Sample Text
                </InputLabel>
              ) : (
                <InputLabel htmlFor="your-input">Sample Text</InputLabel>
              )}
              <input
                ref={textAreaRef}
                value={text}
                onChange={(e) => {
                  handleUpdateChange({ text: e?.target?.value });
                  formik.handleChange(e);
                  updateTextFieldSampleTextValue(e?.target?.value);
                }}
                className="w-100"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
                }}
              />
              {formik.touched.sampleText && formik.errors.sampleText && (
                <FormHelperText style={{ color: "#d32f2f" }}>
                  {formik.errors.sampleText}
                </FormHelperText>
              )}
            </Grid>
            <Grid
              item
              xs={1}
              display={"flex"}
              className="justify-content-center align-items-center"
            >
              <Tooltip title={t(url ? "Clear URL" : "Add URL")}>
                <IconButton
                className="mui-btn primary filled"
                  
                  onClick={(e) => {
                    e.preventDefault();
                    if (!url) {
                      insertVariable(url);
                    } else {
                      var modifiedText = text.replace(/\{\{link\}\}/g, "");
                      SetText(modifiedText);
                      updateTextFieldSampleTextValue(modifiedText);
                      SetUrlText("");
                    }
                  }}
                >
                  {!url ? (
                    <Add fontSize="small" />
                  ) : (
                    <RemoveIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default withTranslation("translation")(MessageField);
