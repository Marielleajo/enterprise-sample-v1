// import AccountCategory from "../../Containers/Account/AccountCategory.jsx";
// import AccountTemplate from "../../Containers/Account/AccountTemplate.jsx";
// import AccountType from "../../Containers/Account/AccountType.jsx";
import Postpaid from "../../Containers/Accounting/Postpaid/Postpaid.jsx";
import Prepaid from "../../Containers/Accounting/Prepaid/Prepaid.jsx";
import ConfigMainPage from "../../Containers/BillingConfiguration/ConfigMainPage.jsx";
import Channels from "../../Containers/Channels/Channels.jsx";
import ClientCategories from "../../Containers/ClientCategories/ClientCategories.jsx";
import AddClients from "../../Containers/Clients/AddClients.jsx";
import ClientsPage from "../../Containers/Clients/ClientsPage.jsx";
import EditClient from "../../Containers/Clients/EditClient.jsx";
import MNC from "../../Containers/Configuration/MNC/MNC.jsx";

import Operator from "../../Containers/Configuration/Operators/Operator.jsx";
import Prefix from "../../Containers/Configuration/Prefixes/Prefix.jsx";
// import ContentManagement from "../../Containers/ContentManagement/ContentManagement.jsx";
import Cost from "../../Containers/Cost/Cost.jsx";
import RatevCost from "../../Containers/CostVRate/RatevCost.jsx";
import CurrenciesMainPage from "../../Containers/Currencies/CurrenciesMainPage.jsx";
import Fees from "../../Containers/Fee/FeeManagement/Fees.jsx";
import Industry from "../../Containers/Industry/Industry.jsx";
// import ErrorLog from "../../Containers/Logging/ErrorLog.jsx";
// import EventLogs from "../../Containers/Logging/EventLogs.jsx";
// import InfoLog from "../../Containers/Logging/InfoLog.jsx";
// import ProviderLog from "../../Containers/Logging/ProviderLog.jsx";
// import ServiceLogs from "../../Containers/Logging/ServiceLogs.jsx";
// import Profile from "../../Containers/Profile/Profile.jsx";
import ProfitLoss from "../../Containers/ProfitLoss/ProfitLoss.jsx";
import AddProvider from "../../Containers/Provider/AddProvider.jsx";
import Provider from "../../Containers/Provider/Provider.jsx";
import ProviderCategory from "../../Containers/Provider/ProviderCategory.jsx";
import RatesMainPage from "../../Containers/Rates/RatesMainPage.jsx";
// import RatingReasonManagement from "../../Containers/RatingReasons/ReasonManagement.jsx";
// import ReasonsTypes from "../../Containers/ReasonTypes/ReasonsTypes.jsx";
// import Reasons from "../../Containers/Reasons/Reasons.jsx";
import Routing from "../../Containers/Routing/Routing.jsx";
// import RoutingReasonManagement from "../../Containers/RoutingReasons/ReasonManagement.jsx";
// import SenderReasons from "../../Containers/SenderReasons/SenderReasons.jsx";
// import AddService from "../../Containers/Services/AddService.jsx";
// import ServiceCategory from "../../Containers/Services/ServiceCategory.jsx";
// import ServiceType from "../../Containers/Services/ServiceType.jsx";
import Services from "../../Containers/Services/Services.jsx";
import Sitemap from "../../Containers/SiteMap/Sitemap.jsx";
import Taxes from "../../Containers/Taxes/Taxes.jsx";
// import Users from "../../Containers/Users/Users.jsx";
import NoAccountClients from "./../../Containers/Clients/NoAccountClients";
// import Frequency from "../../Containers/E-Wallet/Frequency.jsx";
// import Limits from "../../Containers/E-Wallet/Limits.jsx";
// import Discount from "../../Containers/E-Wallet/Discount.jsx";
import City from "../../Containers/LocationManagement/City/City.jsx";
import Country from "../../Containers/LocationManagement/Country/Country.jsx";
import District from "../../Containers/LocationManagement/District/District.jsx";
import State from "../../Containers/LocationManagement/State/State.jsx";
import Zone from "../../Containers/LocationManagement/Zone/Zone.jsx";
// import LiveMonitor from "../../Containers/LiveMonitor/LiveMonitor.jsx";
// import ManageSubscriptions from "../../Containers/Subscriptions/ManageSubscriptions.jsx"; //
import CampaignType from "../../Containers/Campaign/Type/CampaignType.jsx";
import CampaignCategory from "../../Containers/Campaign/Category/CampaignCategory.jsx";
import RedirectionPage from "../../Containers/RedirectionPage/RedirectionPage.jsx";
import LiveMonitor from "../../Containers/LiveMonitor/LiveMonitor.jsx";
import BundleListPage from "../../Containers/BundleList/BundleListPage";
import ResellerTransactionsPage from "../../Containers/ResellerTransactions/ResellerTransactionsPage";
import CurrencyManagement from "../../Containers/CurrencyManagement/CurrencyManagement";
import ResellerMainPage from "../../Containers/Reseller/ResellerMainPage";
import Fee_Type from "../../Containers/Fee/FeeType/Fee_Type";
import Fee_Category from "../../Containers/Fee/FeeCategory/Fee_Category";
import RejectionReason from "../../Containers/RejectionReason/RejectionReason.jsx";

export const SMRoutes = [
  {
    path: "/reseller-management",
    element: <ResellerMainPage />,
    key: "/reseller-management",
    exact: true,
  },
  {
    path: "/cost/:service?",
    element: <Cost />,
    key: "/cost/:service?",
    exact: true,
  },
  {
    path: "/routing/:service?",
    element: <Routing />,
    key: "/routing/:service?",
    exact: true,
  },
  {
    path: "/rates/:service?",
    element: <RatesMainPage />,
    key: "/rates/:service?",
    exact: true,
  },
  {
    path: "/billing/currencies",
    element: <CurrenciesMainPage />,
    key: "/billing/currencies",
    exact: true,
  },
  {
    path: "/profit-loss/:service?",
    element: <ProfitLoss />,
    key: "/profit-loss/:service?",
    exact: true,
  },
  {
    path: "/rate-cost/:service?",
    element: <RatevCost />,
    key: "/rate-cost/:service?",
    exact: true,
  },
  {
    path: "/billing/taxes",
    element: <Taxes />,
    key: "/billing/taxes",
    exact: true,
  },
  {
    path: "/billing/configuration",
    element: <ConfigMainPage />,
    key: "/billing/configuration",
    exact: true,
  },
  {
    path: "/exchange-rate",
    element: <CurrencyManagement />,
    key: "/exchange-rate",
    exact: true,
  },
  {
    path: "/client/client-management",
    element: <ClientsPage />,
    key: "/client/client-management",
    exact: true,
  },
  {
    path: "/client/new-client",
    element: <AddClients />,
    key: "/client/new-client",
    exact: true,
  },
  {
    path: "/client/edit/:clientId",
    element: <EditClient />,
    key: "/client/edit/:clientId",
    exact: true,
  },
  {
    path: "/configuration-management/operator",
    element: <Operator />,
    key: "/configuration-management/operator",
    exact: true,
  },
  {
    path: "/configuration-management/prefix",
    element: <Prefix />,
    key: "/configuration-management/prefix",
    exact: true,
  },
  {
    path: "/configuration-management/mnc",
    element: <MNC />,
    key: "/configuration-management/mnc",
    exact: true,
  },
  {
    path: "/location-management/state",
    element: <State />,
    key: "/location-management/state",
    exact: true,
  },
  {
    path: "/location-management/Zone",
    element: <Zone />,
    key: "/location-management/Zone",
    exact: true,
  },
  {
    path: "/location-management/country",
    element: <Country />,
    key: "/location-management/country",
    exact: true,
  },
  {
    path: "/location-management/district",
    element: <District />,
    key: "/location-management/district",
    exact: true,
  },
  {
    path: "/location-management/city",
    element: <City />,
    key: "/location-management/city",
    exact: true,
  },
  {
    path: "/client/client-categories",
    element: <ClientCategories />,
    key: "/client/client-categories",
    exact: true,
  },
  {
    path: "/providers/providers-management",
    element: <Provider />,
    key: "/providers/providers-management",
    exact: true,
  },

  {
    path: "/providers/new-provider",
    element: <AddProvider />,
    key: "/providers/new-provider",
    exact: true,
  },
  {
    path: "/providers/provider-category",
    element: <ProviderCategory />,
    key: "/providers/provider-category",
    exact: true,
  },
  // {
  //   path: "/reasons-management/routing",
  //   element: RoutingReasonManagement,
  //   key: "/reasons-management",
  //   exact: true,
  // },
  // {
  //   path: "/reasons-management/rating",
  //   element: RatingReasonManagement,
  //   key: "/reasons-management",
  //   exact: true,
  // },
  // {
  //   path: "/reasons-management/reasons-types",
  //   element: ReasonsTypes,
  //   key: "/reasons-management",
  //   exact: true,
  // },
  // {
  //   path: "/reasons-management/sender-reasons",
  //   element: SenderReasons,
  //   key: "/reasons-management",
  //   exact: true,
  // },
  // {
  //   path: "/reasons-management/management",
  //   element: Reasons,
  //   key: "/reasons-management",
  //   exact: true,
  // },
  {
    path: "/sitemap",
    element: <Sitemap />,
    key: "/sitemap",
    exact: true,
  },
  {
    path: "/accounting/postpaid-accounts",
    element: <Postpaid />,
    key: "/accounting/postpaid-accounts",
    exact: true,
  },
  {
    path: "/accounting/prepaid-accounts",
    element: <Prepaid />,
    key: "/accounting/prepaid-accounts",
    exact: true,
  },
  {
    path: "/services/service-management",
    element: <Services />,
    key: "/services/service-management",
    exact: true,
  },
  // {
  //   path: "/account/account-category",
  //   element: AccountCategory,
  //   key: "/account/account-category",
  //   exact: true,
  // },
  // {
  //   path: "/account/account-template",
  //   element: AccountTemplate,
  //   key: "/account/account-template",
  //   exact: true,
  // },
  // {
  //   path: "/users/users-management",
  //   element: Users,
  //   key: "/users",
  //   exact: true,
  // },
  {
    path: "/industry/industry-management",
    element: <Industry />,
    key: "/industry/industry-management",
    exact: true,
  },
  {
    path: "/channels/channel-management",
    element: <Channels />,
    key: "/channels/channel-management",
    exact: true,
  },
  // {
  //   path: "/content-management",
  //   element: ContentManagement,
  //   key: "/content-management",
  //   exact: true,
  // },
  {
    path: "/client/no-account-clients",
    element: <NoAccountClients />,
    key: "/client/no-account-clients",
    exact: true,
  },
  {
    path: "/fee/fees-management",
    element: <Fees />,
    key: "/fee/fees-management",
  },
  {
    path: "/fee/fee-category",
    element: <Fee_Category />,
    key: "/fee/fee-category",
  },
  {
    path: "/fee/fee-type",
    element: <Fee_Type />,
    key: "/fee/fee-type",
  },
  // {
  //   path: "/ewallet/frequency",
  //   element: Frequency,
  //   key: "/ewallet/frequency",
  //   exact: true,
  // },
  // {
  //   path: "/ewallet/limits",
  //   element: Limits,
  //   key: "/ewallet/limits",
  //   exact: true,
  // },
  // {
  //   path: "/ewallet/discounts",
  //   element: Discount,
  //   key: "/ewallet/discounts",
  //   exact: true,
  // },
  // {
  //   path: "/manage-subscriptions",
  //   element: ManageSubscriptions,
  //   key: "/manage-subscriptions",
  //   exact: true,
  // },
  // {
  //   path: "/Zone",
  //   element: Zone,
  //   key: "/Zone",
  //   exact: true,
  // },
  {
    path: "/live-monitor/:service?",
    element: <LiveMonitor />,
    key: "/live-monitor/:service?",
    exact: true,
  },
  {
    path: "/campaign/type",
    element: <CampaignType />,
    key: "/campaign/type",
    exact: true,
  },
  {
    path: "/campaign/category",
    element: <CampaignCategory />,
    key: "/campaign/category",
    exact: true,
  },
  {
    path: "/home",
    element: <RedirectionPage />,
    key: "/home",
  },
  {
    path: "/bundle-form",
    element: <BundleListPage />,
    key: "/bundle-form",
  },
  {
    path: "/reseller-transactions",
    element: <ResellerTransactionsPage />,
    key: "/reseller-transactions",
  },
  {
    path: "/rejection-reason",
    element: <RejectionReason />,
    key: "/rejection-reason",
  },
  {
    path: "/payment",
    element: <PaymentPage />,
    key: "/payment",
  },
];
