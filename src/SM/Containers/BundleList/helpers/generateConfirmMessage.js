export const generateConfirmMessage = ({
  category,
  country = {},
  region = {},
  bundle = null,
}) => {
  let message;

  if (bundle) {
    message = `Are you sure you want to update the selling price? This change will also affect the price of the bundle: ${bundle?.bundleName}.`;
    return message;
  }

  switch (category?.value?.toUpperCase()) {
    case "COUNTRY":
      message = `Are you sure you want to update the selling price? This change will also update the prices for all bundles assigned to ${country?.label}.`;
      break;
    case "REGION":
      message = `Are you sure you want to update the selling price? Updating it will also adjust the prices for bundles assigned to the ${region?.label} region.`;
      break;
    case "GLOBAL":
      message = `Are you sure you want to update the selling price? This will affect all bundles globally.`;
      break;
    case "CRUISE":
      message = `Are you sure you want to update the selling price? This change will impact the prices for all cruise bundles.`;
      break;
    default:
      message = `Are you sure you want to set this selling price for the selected filters?`;
  }

  return message;
};
