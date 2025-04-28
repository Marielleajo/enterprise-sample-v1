import SignInPage from "../../../Authentication/SignIn";
// import PaymentStatus from "../../Containers/PaymentStatus/ActionStatus";
// import Terms from "../../Containers/Terms/Terms";

export const PublicRoutes = [
  {
    path: "/",
    element: <SignInPage />,
    key: "/",
  },
  // {
  //   path: "/tc",
  //   component: Terms,
  //   key: "/tc",
  //   exact: true,
  // },
  // {
  //   path: "/success-unsub",
  //   exact: true,
  //   component: PaymentStatus,
  //   key: "/success-unsub",
  // },
];
