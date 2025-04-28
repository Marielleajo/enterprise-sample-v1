import axios from "axios";
import {GET_ALL_CHANNELS} from "../../APIs/Common";
import {GET_ALL_SERVICES, GET_ALL_TENANT_LANGUAGE, GET_CURRENCIES,} from "../../APIs/Criteria";
import MontyMobileImage from "../../Assets/saas/MontyMobile/image.png";
import MontyMobileLogo from "../../Assets/saas/MontyMobile/logo.svg";

import {toast} from "react-toastify";
import ComiumImage from "../../Assets/saas/Comium/image.png";
import ComiumLogo from "../../Assets/saas/Comium/logo.png";

import {GET_FILE_DIRCTORY} from "../../APIs/Media";
import {config} from "../../Assets/saas/config.json";
import Notification from "../../Components/Notification/Notification";
import {useSnackbar} from "../../Contexts/SnackbarContext";

function timestampToDate(timestamp) {
    // Create a new Date object and set it to the UTC time based on the timestamp
    const date = new Date(0);
    date.setUTCSeconds(timestamp);

    return date;
}

export const truncateText = (text, maxLength = 25) =>
    text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

export const HandleApiError = (e) => {
    if (e?.response?.data?.Status === 500) {
        Notification.error(e?.response?.data?.Exception || "Something Went Wrong");
    } else {
        Notification.error(
            e?.response?.data?.message ||
            e?.response?.data?.errors?.Name[0] ||
            e?.response?.data?.result?.message ||
            "Something Went Wrong"
        );
    }
};

export const downloadFile = async (url, filename) => {
    try {
        const response = await axios({
            method: "get",
            url: url,
            responseType: "blob",
        });

        const blob = new Blob([response.data], {
            type: response.headers["content-type"],
        });
        url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        throw error; // Propagate the error to the calling function
    }
};

export const handleMessageError = ({e, type = null}) => {
    if (type == "validation") {
        let objKeys = Object.keys(e?.response?.data?.Data || {});
        if (objKeys.length === 0) {
            return (
                e?.response?.data?.errors?.Name[0] ||
                e?.response?.data?.Message ||
                e?.response?.data?.message ||
                e?.response?.data?.result?.message ||
                e?.response?.data?.Exception ||
                "Something Went Wrong"
            );
        }
        return e?.response?.data?.Data[objKeys[0]];
    } else {
        console.log(e?.response);
        if (e?.response?.data?.Status === 500) {
            return e?.response?.data?.Exception || "Something Went Wrong";
        } else {
            return (
                e?.response?.data?.Message ||
                e?.response?.data?.message ||
                e?.response?.data?.errors?.Name[0] ||
                e?.response?.data?.result?.message ||
                "Something Went Wrong"
            );
        }
    }
};

export function updateState(obj, propertyPath, newValue) {
    const keys = propertyPath.split(".");
    const lastIndex = keys.length - 1;
    let currentObj = obj;

    for (let i = 0; i < lastIndex; i++) {
        const key = keys[i];
        if (!currentObj[key] || typeof currentObj[key] !== "object") {
            throw new Error(`Key "${key}" does not exist at this level.`);
        }
        currentObj = currentObj[key];
    }

    const lastKey = keys[lastIndex];
    if (Array.isArray(currentObj)) {
        const index = parseInt(lastKey);
        if (isNaN(index) || index < 0 || index >= currentObj.length) {
            throw new Error(`Invalid array index "${lastKey}".`);
        }
    }

    currentObj[lastKey] = newValue;
    return {...obj}; // Return a new object to ensure immutability
}

export function generatePassword() {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";
    const digitChars = "0123456789";

    // Initialize an empty password string
    let password = "";

    // Add one character from each character set
    password += uppercaseChars.charAt(
        Math.floor(Math.random() * uppercaseChars.length)
    );
    password += lowercaseChars.charAt(
        Math.floor(Math.random() * lowercaseChars.length)
    );
    password += specialChars.charAt(
        Math.floor(Math.random() * specialChars.length)
    );
    password += digitChars.charAt(Math.floor(Math.random() * digitChars.length));

    // Add additional characters to meet the minimum length
    const minLength = 8;
    const remainingLength = minLength - password.length;

    for (let i = 0; i < remainingLength; i++) {
        const allChars =
            uppercaseChars + lowercaseChars + specialChars + digitChars;
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the characters in the password to make it more random
    password = password.split("");
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }
    password = password.join("");

    return password;
}

export function removeNullKeys(obj) {
    for (const key in obj) {
        if (obj[key] === null) {
            delete obj[key];
        } else if (typeof obj[key] === "object") {
            removeNullKeys(obj[key]);
        }
    }
    return obj;
}

export function convertToTimeString(number) {
    var hours = Math.floor(number); // Integer division to get hours
    var minutes = Math.round((number % 1) * 60); // Remainder converted to minutes

    // Padding single digit hours and minutes with a leading zero
    var hoursString = hours.toString().padStart(2, "0");
    var minutesString = minutes.toString().padStart(2, "0");

    return hoursString + ":" + minutesString;
}

export function getFirstPageRoute(menuData) {
    if (!menuData || menuData.length === 0) {
        return null;
    }

    const firstPage = menuData[0];
    const firstPageUri = firstPage.uri || "";

    if (firstPage.children && firstPage.children.length > 0) {
        const firstSubpageUri = firstPage.children[0].uri || "";
        return `${firstPageUri}/${firstSubpageUri}`;
    }

    return firstPageUri;
}

export function createMenuTree(menuData) {
    // Build a map of menu items using their recordGuid as the key
    const menuMap = menuData?.reduce((map, item) => {
        map[item.recordGuid] = {...item, children: []};
        return map;
    }, {});

    // Organize the menu items into a tree structure
    const rootItems = [];
    menuData?.forEach((item) => {
        const parentItem = menuMap[item?.parentGuid];
        if (item?.parentGuid !== null && parentItem) {
            parentItem?.children?.push(menuMap[item?.recordGuid]);
        } else {
            rootItems?.push(menuMap[item?.recordGuid]);
        }
    });

    return rootItems;
}

export function getSevenDaysAgo() {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
    return sevenDaysAgo;
}

export const GET_CALLBACK = ({provider}) => {
    if (!provider) return null;
    return `${window.location.origin}/callback-${provider}`;
};

export function GET_STATUS({status}) {
    switch (status) {
        case "IDLE":
            return "away";
        case "ONLINE":
            return "online";
        case "OFFLINE":
            return "offline";
        default:
            return "offline";
    }
}

export function getStatusIcon(status) {
    switch (status) {
        case "Failed":
            return <i className="ri-error-warning-line align-middle me-1"></i>;
        case "Sent":
            return <i className="ri-check-line align-middle me-1"></i>;
        case "Delivered":
            return <i className="ri-check-double-line align-middle me-1"></i>;
        case "Read":
            return (
                <i
                    style={{fill: "blue", color: "blue"}}
                    className="ri-check-double-line align-middle me-1"
                ></i>
            );
        default:
            return <i className="ri-loading-line align-middle me-1"></i>;
    }
}

export function getTimeDifference(date) {
    const currentDate = new Date();
    const givenDate = new Date(date);
    const timeDiff = currentDate.getTime() - givenDate.getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60) {
        return "Just now";
    } else if (minutes === 1) {
        return "1 minute ago";
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours === 1) {
        return "1 hour ago";
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days === 1) {
        return "Yesterday";
    } else if (days < 7) {
        return `${days} days ago`;
    } else if (weeks === 1) {
        return "1 week ago";
    } else {
        return `${weeks} weeks ago`;
    }
}

export const hexToRgba = (hex, alpha) => {
    let r = 0,
        g = 0,
        b = 0;

    // 3 digits
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);

        // 6 digits
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getCurrenciesData = async (token) => {
    try {
        let currencyResponse = await GET_CURRENCIES(token);
        return currencyResponse?.data?.data?.currencies || [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getAllServices = async (token) => {
    try {
        let res = await GET_ALL_SERVICES(token);
        return res?.data?.data?.items || [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getAllChannelGuid = async (token) => {
    try {
        let res = await GET_ALL_CHANNELS(token);
        return res?.data?.data?.channels || [];
    } catch (e) {
        console.error(e);
        return [];
    }
};
export const getallLanguages = async () => {
    try {
        let res = await GET_ALL_TENANT_LANGUAGE(import.meta.env.VITE_TENANT);
        return res?.data?.data?.channels || [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getFileDirectory = async () => {
    try {
        let response = await GET_FILE_DIRCTORY();
        return response?.data?.data?.paths;
    } catch (e) {
        console.log(e);
        return [];
    }
};

export const Get_Image_Logo = ({env = null}) => {
    env = config?.find((item) =>
        item?.path?.includes(window.location.hostname)
    )?.name;
    switch (env) {
        case "montymobile":
            return {logo: MontyMobileLogo, image: MontyMobileImage};

        case "comium":
            return {logo: ComiumLogo, image: ComiumImage};

        default:
            return {logo: null, image: null};
    }
};

export const ExtractWhatsappTemplate = ({template}) => {
    let header = template?.whatsAppTemplateInfo?.find(
        (item) => item?.typeRequest === "HEADER"
    );
    let body = template?.whatsAppTemplateInfo?.find(
        (item) => item?.typeRequest === "BODY"
    );
    let footer = template?.whatsAppTemplateInfo?.find(
        (item) => item?.typeRequest === "FOOTER"
    );
    let phoneNumber = template?.whatsAppTemplateInfo?.find(
        (item) => item?.typeRequest === "PHONE_NUMBER"
    );
    let url = template?.whatsAppTemplateInfo?.find(
        (item) => item?.typeRequest === "URL"
    );

    return Object.entries({
        TemplateId: template?.recordGuid,
        TypeHeader: header?.format === "TEXT" ? "Text" : "Media",
        Link: null,
        FileName: null,
        HeaderVariable: header?.example,
        BodyVariable: body?.example,
        MediaType:
            header?.format === "IMAGE"
                ? "Image"
                : header?.format === "VIDEO"
                    ? "Video"
                    : header?.format === "DOCUMENT"
                        ? "Document"
                        : "Text",
    })
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(
            ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
};

export const GetConfigValue = ({array, name}) => {
    return array?.find((item) => item?.parameterName == name)?.parameterValue;
};

export const ConvertBlob = ({type, image, output = "image/jpeg"}) => {
    if (type === "blob") {
        return new Promise((resolve, reject) => {
            image.toBlob((blob) => {
                if (blob) {
                    resolve(URL.createObjectURL(blob));
                } else {
                    reject(new Error("Failed to create blob."));
                }
            }, output);
        });
    } else if (type === "file") {
        return new Promise((resolve, reject) => {
            image.toBlob((blob) => {
                if (blob) {
                    const file = new File(
                        [blob],
                        `croppedImage.${output == "image/jpeg" ? "jpeg" : "png"}`,
                        {
                            type: output,
                        }
                    );
                    resolve(file);
                } else {
                    reject(new Error("Failed to create file."));
                }
            }, output);
        });
    } else {
        // Handle other response types or raise an error for unsupported types
        return Promise.reject(new Error("Unsupported responseType"));
    }
};

// Function to convert a file to Base64
export async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            // The result attribute contains the Base64 data
            const base64String = event.target.result;
            resolve(base64String);
        };

        reader.onerror = function (error) {
            reject(error);
        };

        // Read the file as a Data URL, which is a Base64 representation
        reader.readAsDataURL(file);
    });
}

// Adjust dates to local time zone
export const adjustToLocale = (date) => {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60 * 1000);
};

// Convert dates to string in the format suitable for datetime-local input
export const formatForDatetimeLocal = (date) => (date ? date.getTime() : "");

/**
 * Downloads CSV
 * @param {Array} columns Table Columns
 * @param {Array} data Table Data
 * @param {string} title Name of the Excel File
 * @param {Function} t Translation Function (i18n)
 */
export const downloadCSV = (
    columns = [],
    data = [],
    title = "Excel",
    t = (value) => value
) => {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(columns, data);
    if (!csv) return;
    const filename = `${t(title)}.csv`;
    if (!csv.match(/^data:text\/csv/i)) csv = `data:text/csvcharset=utf-8,${csv}`;
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
};

/**
 * Converts array of objects to CSV
 * @param {Array} columns Table Columns
 * @param {Array} data Table Data
 */
export const convertArrayOfObjectsToCSV = (columns = [], data = []) => {
    let result = "",
        keys = [];

    columns.forEach((element) => {
        if (Object.prototype.hasOwnProperty.call(element, "export")) {
            if (element.export) keys.push(element.title);
        } else if (Object.prototype.hasOwnProperty.call(element, "hidden")) {
            if (!element.hidden) keys.push(element.title);
        } else keys.push(element.title);
    });

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    columns.forEach((element, index) => {
        if (Object.prototype.hasOwnProperty.call(element, "export")) {
            if (element.export) keys[index] = element.field || "";
        } else if (Object.prototype.hasOwnProperty.call(element, "hidden")) {
            if (!element.hidden) keys[index] = element.field || "";
        } else keys[index] = element.field || "";
    });

    data.forEach((item) => {
        let ctr = 0;
        keys.forEach((key) => {
            if (ctr > 0) result += columnDelimiter;
            const edited =
                typeof item[key] === "string"
                    ? item[key]?.replace(/,/g, ";")?.replace(/#/g, " ")
                    : item[key];
            result += edited;
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
};

/**
 * A function dedicated to handle all kinds of Axios network errors
 * @param {object} err Axios Catch Error
 * @param {string} exactError Exact Response Error
 * @param {string} message Custom Message Error
 * @param {Function} callback A callback for catching an error
 * @param {Function} t Translation Function (i18n)
 * @param {Array|object} errors Multiple Errors
 */
export const axiosErrorHandler = (
    err = {},
    exactError = null,
    message = "Something Went Wrong",
    t = (value) => value,
    callback = null,
    errors = null
) => {
    console.error(err);
    if (!err.response) toast.error(t("Connection Error"));
    else if (errors) {
        if (Array.isArray(errors)) errors.forEach((err) => toast.error(err));
        else if (typeof errors === "object")
            Object.values(errors).map((error) => {
                if (Array.isArray(error)) error.forEach((err) => toast.error(err));
                else toast.error(error);
            });
        else if (typeof errors === "string") toast.error(errors);
        else
            toast.error(
                exactError ||
                err.response?.data?.result?.message ||
                err.response?.data?.result?.message ||
                message
            );
    } else
        toast.error(
            exactError ||
            err.response?.data?.result?.message ||
            err.response?.data?.result?.message ||
            message
        );
    typeof callback === "function" && callback();
};

/**
 * Convert bytes to its correct size format
 * @param {number} bytes File Size Bytes
 * @param {number} decimals Number of Decimals
 */
export const bytesToSize = (bytes = 0, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const value = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, value)).toFixed(dm))} ${
        sizes[value]
    }`;
};

/**
 * Convert Date to YYYY/MM/DD
 * @param {string|number|Date} date Date Format (default: "")
 * @param {string} separator Date Separator (default: "/")
 */
export const get_DD_MM_YYYY = (date = "", separator = "/") => {
    if (!date) return "";
    const modifiedDate = new Date(date);
    let dd = String(modifiedDate.getDate()).padStart(2, "0");
    let mm = String(modifiedDate.getMonth() + 1).padStart(2, "0"); // January is 0
    let yyyy = modifiedDate.getFullYear();
    return `${dd}${separator}${mm}${separator}${yyyy}`;
};

export const getUnix_DD_MM_YYYY = (date = "", separator = "/") => {
    if (!date) return "";

    // Convert Unix timestamp in seconds to milliseconds
    const modifiedDate = new Date(
        typeof date === "number" && date.toString().length === 10
            ? date * 1000
            : date
    );

    let dd = String(modifiedDate.getDate()).padStart(2, "0");
    let mm = String(modifiedDate.getMonth() + 1).padStart(2, "0");
    let yyyy = modifiedDate.getFullYear();
    return `${dd}${separator}${mm}${separator}${yyyy}`;
};

/**
 * Convert Date to YYYY/MM/DD
 * @param {string|number|Date} date Date Format (default: "")
 * @param {string} separator Date Separator (default: "/")
 */
export const get_YYYY_MM_DD = (date = "", separator = "/") => {
    if (!date) return "";
    const modifiedDate = new Date(date);
    let dd = String(modifiedDate.getDate()).padStart(2, "0");
    let mm = String(modifiedDate.getMonth() + 1).padStart(2, "0"); // January is 0
    let yyyy = modifiedDate.getFullYear();
    return `${yyyy}${separator}${mm}${separator}${dd}`;
};

/**
 * Convert Date to YYYY/MM/DD HH:mm:ss
 * @param {string|number|Date} date Date Format (default: "")
 * @param {string} separator Date Separator (default: "/")
 * @param {string} timeSeparator Time Separator (default: ":")
 */
export const get_YYYY_MM_DD_HH_MM_SS = (
    date = "",
    separator = "/",
    timeSeparator = ":"
) => {
    if (!date) return "";

    if (!isNaN(date)) date = date * 1000; //if date is timestamp

    if (typeof date === "string" && !date.endsWith("Z") && !date.includes("+"))
        date = date + "Z"; // if date is a string without Z at the end

    const modifiedDate = new Date(date);
    let dd = String(modifiedDate.getUTCDate()).padStart(2, "0");
    let mm = String(modifiedDate.getUTCMonth() + 1).padStart(2, "0"); // January is 0
    let yyyy = modifiedDate.getUTCFullYear();
    let m = modifiedDate.getUTCMinutes();
    let hh = modifiedDate.getUTCHours();
    let ss = modifiedDate.getUTCSeconds();
    if (hh < 10) hh = `0${hh}`;
    if (m < 10) m = `0${m}`;
    if (ss < 10) ss = `0${ss}`;
    return `${yyyy}${separator}${mm}${separator}${dd} ${hh}${timeSeparator}${m}${timeSeparator}${ss}`;
};

/**
 * Convert Date to YYYY/DD/MM HH:mm:ss
 * @param {string|number|Date} date Date Format (default: "")
 * @param {string} separator Date Separator (default: "/")
 * @param {string} timeSeparator Time Separator (default: ":")
 */
export const get_YYYY_DD_MM_HH_MM_SS = (
    date = "",
    separator = "/",
    timeSeparator = ":"
) => {
    if (!date) return "";
    const modifiedDate = new Date(date);
    let dd = String(modifiedDate.getDate()).padStart(2, "0");
    let mm = String(modifiedDate.getMonth() + 1).padStart(2, "0"); // January is 0
    let yyyy = modifiedDate.getFullYear();
    let m = modifiedDate.getMinutes();
    let hh = modifiedDate.getHours();
    let ss = modifiedDate.getSeconds();
    if (hh < 10) hh = `0${hh}`;
    if (m < 10) m = `0${m}`;
    if (ss < 10) ss = `0${ss}`;
    return `${yyyy}${separator}${dd}${separator}${mm} ${hh}${timeSeparator}${m}${timeSeparator}${ss}`;
};

export const get_UTC_DateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);

    // Manually construct the formatted date with "-" separator
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hour = String(date.getUTCHours()).padStart(2, "0");
    const minute = String(date.getUTCMinutes()).padStart(2, "0");
    const second = String(date.getUTCSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

/**
 * Convert Date to MM/DD/YYYY HH:mm:ss
 * @param {string|number|Date} date Date Format (default: "")
 * @param {string} separator Date Separator (default: "/")
 * @param {string} timeSeparator Time Separator (default: ":")
 */
export const get_MM_DD_YYYY_HH_MM_SS = (
    date = "",
    separator = "/",
    timeSeparator = ":"
) => {
    if (!date) return "";
    const modifiedDate = new Date(date);
    let dd = String(modifiedDate.getDate()).padStart(2, "0");
    let mm = String(modifiedDate.getMonth() + 1).padStart(2, "0"); // January is 0
    let yyyy = modifiedDate.getFullYear();
    let m = modifiedDate.getMinutes();
    let hh = modifiedDate.getHours();
    let ss = modifiedDate.getSeconds();
    if (hh < 10) hh = `0${hh}`;
    if (m < 10) m = `0${m}`;
    if (ss < 10) ss = `0${ss}`;
    return `${mm}${separator}${dd}${separator}${yyyy} ${hh}${timeSeparator}${m}${timeSeparator}${ss}`;
};

/**
 * Convert Date to Time Format in HH:mm
 * @param {string|number|Date} date Date Format (default: "")
 */
export const get_HH_mm = (date = "") => {
    if (!date) return "";
    const modifiedDate = new Date(date);
    let mm = modifiedDate.getMinutes();
    let HH = modifiedDate.getHours();
    return `${HH}:${mm}`;
};

export const get_HH_MM = (date = "") => {
    if (!date) return "";
    const modifiedDate = new Date(date);
    var mm = modifiedDate.getMinutes();
    var HH = modifiedDate.getHours();
    if (HH < 10) HH = `0${HH}`;
    if (mm < 10) mm = `0${mm}`;
    return `${HH}:${mm}`;
};

/**
 * Checks if HTML element has scroll or overflow. Returns true if it has overflow
 * @param {EventTarget} event.target
 */
export const isOverflown = ({
                                clientWidth,
                                clientHeight,
                                scrollWidth,
                                scrollHeight,
                            } = {}) => scrollHeight > clientHeight || scrollWidth > clientWidth;

/**
 * Transform file object to Base 64 string
 * @param {File} file
 */
export const toBase64 = (file = "") => {
    if (!file) {
        toast.error("Corrupted File Object");
        return false;
    } else
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
};

/**
 * Gets type of Base 64 image string
 * @param {string} base64
 */
export const getBase64ImageType = (base64 = "") => {
    switch (base64 ? base64[0] : "") {
        case "/":
            return "jpg";
        case "i":
            return "png";
        case "R":
            return "gif";
        case "U":
            return "webp";
        default:
            return null;
    }
};

/**
 * Format Number to K, M, B, or T
 * @param {Number} number
 */
export const formatNumber = (number = 0) => {
    if (number < 1e3) return number;
    if (number >= 1e3 && number < 1e6) return `${(number / 1e3).toFixed(1)}K`;
    if (number >= 1e6 && number < 1e9) return `${(number / 1e6).toFixed(1)}M`;
    if (number >= 1e9 && number < 1e12) return `${(number / 1e9).toFixed(1)}B`;
    if (number >= 1e12) return `${(number / 1e12).toFixed(1)}T`;
};

/**
 * Add commas to thousand base numbers
 * @param {Number} number
 */
export const numberWithCommas = (number = 0) =>
    String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/**
 * Add commas to thousand base numbers
 * @param {string} text
 * @param {string} word
 */
export const countWordOccurences = (text = "", word = "") =>
    text.split(word).length - 1;

export function isUrlInMenu(menus, url = window.location.pathname) {
    // If a URL is provided, use it; otherwise, use the current browser URL
    const currentUrlPath = url;

    // Remove query parameters or hash if any
    const cleanUrlPath = currentUrlPath.split(/[?#]/)[0];

    // Extract the last part of the URL path, handling cases where it ends with a slash
    const urlParts = cleanUrlPath.split("/").filter((part) => part); // Remove empty parts
    const urlLastPart = urlParts[urlParts.length - 1];

    // Check if the last part exists in any of the menu uris
    return menus.some((item) => item.uri === urlLastPart);
}

export const FROMDATEConvertToTimesStmp = (date) => {
    if (!date) return null;
    const specificDate = new Date(date); // Specific date
    const timestamp = specificDate.getTime() / 1000; // Timestamp in seconds
    return timestamp;
    // console.log(timestamp);
};

export const TODATEConvertToTimesStmp = (date) => {
    if (!date) return null;

    const [year, month, day] = date.split("-").map(Number);

    const endOfDayUTC = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    return Math.floor(endOfDayUTC.getTime() / 1000);
};

export const FROMTimestmpToDATE = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp * 1000);
    return date.toISOString().split("T")[0];
};

export const TOTimestmpToDATE = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp * 1000);
    return date.toISOString().split("T")[0];
};

export const formatDateCell = (date) => {
    if (!date) return " - ";
    const d =
        typeof date === "string"
            ? new Date(date + "Z")
            : new Date(Number(date) * 1000);
    return d.toLocaleString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

export const formatDate = (timestamp, isMin = false) => {
    if (timestamp !== null) {
        const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds

        const day = ("0" + date.getUTCDate()).slice(-2);
        const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
        const year = date.getUTCFullYear().toString().slice(-2);
        const hours = ("0" + date.getUTCHours()).slice(-2);
        const minutes = ("0" + date.getUTCMinutes()).slice(-2);

        return isMin
            ? `${day}-${month}-${year} ${hours}:${minutes}`
            : `${day}-${month}-${year}`;
    } else return "-";
};

export function convertToTimestamp(dateString) {
    return Math.floor(new Date(dateString).getTime() / 1000);
}

export const useHandleApiError = () => {
    const {showSnackbar} = useSnackbar(); // Access hook here

    const handleApiError = (e) => {
        if (e?.response?.data?.Status === 500) {
            showSnackbar(
                e?.response?.data?.Exception || "Something Went Wrong",
                "error"
            );
        } else {
            showSnackbar(
                e?.response?.data?.message ||
                e?.response?.data?.errors?.Name[0] ||
                e?.response?.data?.result?.message ||
                "Something Went Wrong",
                "error"
            );
        }
    };

    return handleApiError;
};

export const hasAction = (actions, action) => {
    return actions?.some((a) => a.toLowerCase() === action.toLowerCase());
};

export function convertToEpochTimestamp(dateInput) {
    if (!dateInput) return null;

    let dateObj;

    // Handle string input like "2025-04-17"
    if (typeof dateInput === "string") {
        const [year, month, day] = dateInput.split("-").map(Number);
        dateObj = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    } else if (dateInput instanceof Date) {
        const year = dateInput.getUTCFullYear();
        const month = dateInput.getUTCMonth();
        const day = dateInput.getUTCDate();
        dateObj = new Date(Date.UTC(year, month, day, 0, 0, 0));
    } else {
        return null; // unsupported type
    }

    return Math.floor(dateObj.getTime() / 1000);
}

export const truncateValue = (value) => {
    const num = Number(value);
    return isNaN(num)
        ? "-"
        : (Math.floor(num * 100) / 100).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
};

