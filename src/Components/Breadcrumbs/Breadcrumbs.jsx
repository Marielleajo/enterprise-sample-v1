import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import * as React from "react";

export default function MuiBreadcrumbs({ breadcrumbsOptions }) {
  const breadcrumbs = [breadcrumbsOptions];

  return (
    <Stack spacing={2}>
      <Breadcrumbs separator={"/"} aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}
//here example of breadcrumbsOptions
// const breadcrumbs = [
//     <Link
//       underline="hover"
//       key="1"
//       color="inherit"
//       href="/"
//       onClick={handleClick}
//     >
//       Manage Tenant
//     </Link>,
//     <Link
//       underline="hover"
//       key="2"
//       color="inherit"
//       href="/material-ui/getting-started/installation/"
//       onClick={handleClick}
//     >
//       Core
//     </Link>,
//     <Typography key="3" color="text.primary">
//       Breadcrumb
//     </Typography>,
//   ];
