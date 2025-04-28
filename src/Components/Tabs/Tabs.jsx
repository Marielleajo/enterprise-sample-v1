import {Box} from "@mui/material";
import "./TabsComponent.scss";

const TabsComponent = ({options, option, onClick, disabled = false}) => {
    return (
        <Box id="TabsComponent" className="">
            {options?.map((item, index) => (
                <Box
                    key={index}
                    id={`tab-${item?.text}`}
                    onClick={() => {
                        if (!disabled) onClick(item?.value);
                    }}
                    className={`item ${option == item?.value && "active"} ${disabled ? "disabledTabs" : ""}`}
                >
                    {" "}
                    {item?.text}{" "}
                </Box>
            ))}
        </Box>
    );
};

export default TabsComponent;
