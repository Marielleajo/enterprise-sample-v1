import {useState} from "react";
import {Grid, Tab} from "@mui/material";

const LanguageTabs = ({
                          languages,
                          onLanguageChange,
                          setLanguageChangeLoading,
                      }) => {
    const [selectedLanguage, setSelectedLanguage] = useState({
        name: "English",
        code: "en",
    });

    const handleTabChange = (language) => {
        setLanguageChangeLoading(true);
        setSelectedLanguage({
            name: language?.name,
            code: language?.code,
        });

        setTimeout(() => {
            setLanguageChangeLoading(false);
            if (onLanguageChange)
                onLanguageChange({
                    name: language?.name,
                    code: language?.code,
                });
        }, 1000);
    };

    return (
        <Grid
            container
            justifyContent="flex-start"
            sx={{
                overflowY: "auto",
                maxHeight: "145px",
            }}
        >
            {languages.map((option, index) => (
                <Grid item key={index}>
                    <Tab
                        label={option?.name}
                        value={option?.code}
                        id="languagebox"
                        onClick={() => handleTabChange(option)}
                        className={
                            selectedLanguage?.name === option?.name
                                ? "active-lang-tab"
                                : "lang-tab"
                        }
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default LanguageTabs;
