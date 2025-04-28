import * as Yup from "yup";

export const stepValidationSchemas = (category) => [
    // Step 1: General Information
    Yup.object().shape({
        bundleCategory: Yup.object().required("Bundle Category is required"),

        bundleName: Yup.string().required("Bundle Name is required"),
        description: Yup.string().required("Bundle Marketing Name is required"),
        BundleCode: Yup.string().required("Bundle Code is required"),

        provider: Yup.object().required("Provider is required"),

        supportedCountries:
            category?.toLowerCase() === "cruise"
                ? Yup.array()
                : Yup.array()
                    .min(
                        category?.toLowerCase() === "global" ? 50 : 1,
                        category?.toLowerCase() === "global"
                            ? `You should select at least 50 countries to proceed`
                            : "Select at least one support country"
                    )
                    .required("Supported countries are required"),


        bundleType: Yup.string().required("Bundle Type is required"),
    }),

    // Step 2: Pricing
    Yup.object().shape({
        costCurrency: Yup.object().required("Cost Currency is required"),

        cost: Yup.number()
            .typeError("Cost Price must be a number")
            .positive("Cost Price must be greater than zero")
            .required("Cost Price is required"),

        priceCurrency: Yup.object().required("Price Currency is required"),

        price: Yup.number()
            .typeError("Selling Price must be a number")
            .positive("Selling Price must be greater than zero")
            .required("Selling Price is required"),


        validity: Yup.object()

            .nullable()
            .required("Validity is required"),
    }),

    // Step 3: Stock
    Yup.object().shape({
        isStockable: Yup.boolean(),
        Threshold: Yup.number()
            .min(0, "Threshold must be greater than or equal to 0")
            .when('isStockable', {
                is: true,
                then: (schema) => schema.required('Threshold is required'),
                otherwise: (schema) => schema.notRequired(),
            }),
        MaxQuantity: Yup.number()
            .min(0, "Max Quantity must be greater than or equal to 0")
            .when('isStockable', {
                is: true,
                then: (schema) => schema.required('Max Quantity is required'),
                otherwise: (schema) => schema.notRequired(),
            }),
    })
    ,


    // Step 4: Preview (No validation needed)
    Yup.object().shape({}),
];
