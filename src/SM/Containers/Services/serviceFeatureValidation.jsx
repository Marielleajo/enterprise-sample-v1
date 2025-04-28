import * as Yup from "yup";

// Define the schema for an individual feature
const featureSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  featureTypeTag: Yup.string().required("Feature Type Tag is required"),
});

// Define the schema for the entire form, with custom validation for the last feature
const serviceFeatureValidation = Yup.object().shape({
  features: Yup.array()
    .of(featureSchema)
    .test(
      "last-item-validation",
      "The last feature item must be valid",
      (features) => {
        if (!features || features?.length === 0) return true;
        const lastFeature = features[features?.length - 1];
        return featureSchema?.isValidSync(lastFeature);
      }
    ),
});

export default serviceFeatureValidation;
