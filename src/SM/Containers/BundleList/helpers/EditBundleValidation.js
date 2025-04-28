import * as Yup from "yup";

export const EditvalidationSchema = Yup.object().shape({
    bundleCategory: Yup.object()
        .shape({
            value: Yup.string().nullable().required("Bundle Category is required"),
            label: Yup.string().nullable().required("Bundle Category is required"),
        })
        .nullable()
        .required("Bundle Category is required"),
    bundleName: Yup.string().required("Bundle Name is required"),

    description: Yup.string().required("bundle Marketing Name is required"),
    cost: Yup.number()
        .typeError("Cost Price must be a number")
        .positive("Cost Price must be greater than zero")
        .required("Cost Price is required"),
    price: Yup.number()
        .typeError("Selling Price must be a number")
        .positive("Selling Price must be greater than zero")
        .required("Selling Price is required"),
    currency: Yup.object()
        .shape({
            value: Yup.string().nullable().required("Currency is required"),
            label: Yup.string().nullable().required("Currency label is required"),
        })
        .nullable()
        .required("Currency is required"),

    bundleType: Yup.object()
        .shape({
            value: Yup.string().nullable().required("Bundle Type is required"),
            label: Yup.string().nullable().required("Bundle Type label is required"),
        })
        .nullable()
        .required("Bundle Type is required"),
    BundleCode: Yup.string().required("Bundle Code is required"),
    validity: Yup.number().required("validity is required"),
    Quantity: Yup.number().required("Quantity is required"),
    Threshold: Yup.number().required("Threshold is required"),
    MaxQuantity: Yup.number().required("MaxQuantity is required"),
    SoldQuantity: Yup.number().required("SoldQuantity is required"),
    LockedQuantity: Yup.number().required("Locked Quantity is required"),
    provider: Yup.object()
        .shape({
            value: Yup.string().nullable().required("Provider is required"),
            label: Yup.string().nullable().required("Provider is required"),
        })
        .nullable()
        .required("Provider is required"),
    supportedCountries: Yup.array()
        .min(1, "Select at least one support country")
        .required("This field is required"),
});
