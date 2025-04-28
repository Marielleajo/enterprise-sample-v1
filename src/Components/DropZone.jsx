import { Box } from "@mui/material";
import Dropzone from "react-dropzone";
import { withTranslation } from "react-i18next";

const DropzoneComponent = ({
  t,
  onUpload,
  fileUploaded = null,
  accept = `${["image/png", "image/jpeg"].join(",")}`,
  disabled = false,
}) => {
  return (
    <Box className={`dropzone ${fileUploaded && "uploaded"}`}>
      <Dropzone
        onDrop={onUpload}
        accept={accept}
        disabled={disabled}
        multiple={false}
        maxSize={4000000} // 4MB
        maxFiles={1}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps({
              className: `file-dropzone`,
              id: "drag-drop",
            })}
          >
            <input {...getInputProps()} />
            <>
              <b>
                {fileUploaded
                  ? fileUploaded
                  : t("Drag and Drop File Here (Max 4MB)")}
              </b>
              <br />
            </>
          </div>
        )}
      </Dropzone>
    </Box>
  );
};

export default withTranslation("translation")(DropzoneComponent);
