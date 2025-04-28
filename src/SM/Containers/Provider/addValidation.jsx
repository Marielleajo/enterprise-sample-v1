import * as Yup from "yup";

const addValidationSchema = [
    Yup.object().shape({
        businessName: Yup.string().required("Business Name is required"),
        category: Yup.object().required("Category is required"),
        accountType: Yup.string().required("Account Type is required"),
        contactType: Yup.string().required("Contact Type is required"),
        mobileNumber: Yup.string().required("Mobile Number is required"),
        email: Yup.string()
            .email("Invalid email address")
            .required("email is required"),
        companyWebsite: Yup.string().matches(
            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            "Enter valid website!"
        ),
        companyEmail: Yup.string().email("Invalid email address"),
        firstName: Yup.string().required("First Name is required"),
    }),
    Yup.object().shape({
        address: Yup.string().required("Address is required"),
        country: Yup.object().required("Country is required"),
        floor: Yup.number().typeError("Floor must be a number!"),
    }),
    Yup.object().shape({
        engagementEmail: Yup.string().email("Invalid email address"),
        supportEmail: Yup.string().email("Invalid email address"),
        billingEmail: Yup.string().email("Invalid email address"),
        technicalEmail: Yup.string().email("Invalid email address"),
        alertEmail: Yup.string().email("Invalid email address"),
        businessWebURL: Yup.string()
            .required("Domain name is required")
            .matches(
                /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)\.([a-zA-Z]{2,})(?:\/\S*)?$/,
                "Invalid domain name"
            ),
    }),
];

export default addValidationSchema;
