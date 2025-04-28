import {ThemeProvider} from "@mui/material";
import "font-awesome/css/font-awesome.css";
import {useEffect, useState} from "react";
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import {PersistGate} from "redux-persist/integration/react";
import MuiSnackbar from "./Components/MuiSnackbar";
import {SnackbarProvider} from "./Contexts/SnackbarContext";
import {setMedia} from "./Redux/New/Redux/Reducers/System";
import CombinedRoutes from "./SM/RoutingConfig/CombinedRoutes";
import {getFileDirectory} from "./SM/Utils/Functions";
import {createCustomTheme} from "./Theme";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.scss";
import "./Assets/Css/portal.scss";
import "./index.scss";
import {persistor, store} from "./Redux/New/Redux/Redux";

function App() {
    const [Loading, SetLoading] = useState(false);
    // const dispatch = useDispatch();


    const getMediaDirectory = async () => {
        try {
            let languageResponse = await getFileDirectory();
            store.dispatch(setMedia(languageResponse));
        } catch (e) {
            console.error(e);
        }
    };

    const {
        system: {language, media},
    } = store.getState();

    useEffect(() => {
        if (!media || Object.keys(media)?.length === 0) {
            getMediaDirectory();
        }
    }, []);

    useEffect(() => {
        window.process = {
            ...window.process,
        };

        document.documentElement.style.setProperty(
            "--primary-color",
            import.meta.env.VITE_PRIMARY_COLOR
        );
        document.documentElement.style.setProperty(
            "--secondary-color",
            import.meta.env.VITE_SECONDARY_COLOR
        );
        document.documentElement.style.setProperty(
            "--grey-color",
            import.meta.env.VITE_GREY_COLOR
        );
        document.documentElement.style.setProperty(
            "--black-color",
            import.meta.env.VITE_BLACK_COLOR
        );
        document.documentElement.style.setProperty(
            "--text-white-color",
            import.meta.env.VITE_TEXT_WHITE
        );
    }, []);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SnackbarProvider>
                    <ThemeProvider theme={createCustomTheme({})}>
                        <MuiSnackbar/>
                        <Router history={history}>{<CombinedRoutes/>}</Router>
                    </ThemeProvider>
                </SnackbarProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
