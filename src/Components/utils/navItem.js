// import p1 from "../../public/png/Group 61.svg";
// import p2 from "../../public/png/Group 54.svg";
// import p3 from "../../public/png/Group 53.svg";
import p4 from "../../../public/png/settings.svg";
import p5 from "../../../public/png/assessments.svg";
import p6 from "../../../public/png/users.svg";
import p7 from "../../../public/png/clinicians.svg";
import p1 from "../../../public/png/dashboard.svg";
import p2 from "../../../public/png/article.svg";
import p3 from "../../../public/png/pound.svg";



export const navItem = [
  // {
  //   title: "Service",
  //   icon: p1,
  //   routes: [
  //     { label: "Hospital", path: "/hospital" },
  //     { label: "Doctors", path: "/doctor" },
  //     { label: "Accomodations", path: "/accomodation" },
  //     { label: "Transportation", path: "/transport" },
  //     { label: "Food", path: "/food" },
  //   ],
  // },
  // {
  //   title: "Sales",
  //   icon: p2,
  //   routes: [
  //     { label: "Sales generate", path: "/generate" },
  //     { label: "Sales head", path: "/head" },
  //     { label: "Invoice", path: "/invoice" },
  //     { label: "Leads", path: "/leads" },
  //     { label: "Sales Force", path: "/sforce" },
  //   ],
  // },
  // {
  //   title: "Accounts",
  //   icon: p3,
  //   routes: [
  //     { label: "Transactions", path: "/transactions" },
  //     { label: "Expenses", path: "/expense" },
  //   ],
  // },

  {
    title: "Dashboard",
    icon: p1,
    path: "/dashboard",
    routes: [],
  },
  {
    title: "Submitted Assessments",
    icon: p5,
    routes: [
      {
        label: "Initial Assessment",
        path: "/submitted-assessments/initial",
      },
      {
        label: "On-demand Assessment",
        path: "/submitted-assessments/on-demand",
      },
    ],
  },

  {
    title: "Patients",
    icon: p6,
    path: "/patients",
    routes: [],
  },
  {
    title: "Clinicians",
    icon: p7,
    path: "/clinicians",
    routes: [
      {
        label: "Clinician List",
        path: "/clinicians",
      },
      {
        label: "Clinician Onboarding",
        path: "/clinician-onboarding",
      },
    ],
  },

  {
    title: "Assessment Questions",
    icon: p5,
    routes: [
      {
        label: "Initial Assessment",
        path: "/assessment-questions/initial",
      },
      {
        label: "On-demand Assessment",
        path: "/assessment-questions/on-demand",
      },
    ],
  },
  {
    title: "Blogs",
    icon: p2,
    path: "/blogs",
    routes: [],
  },
  /*{
    title: "Reports",
    icon: MdBarChart,
    path: "/reports",
    routes: [],
  },*/
  {
    title: "Finances",
    icon: p3,
    path: "/finances",
    routes: [],
  },

  {
    title: "Settings",
    icon: p4,
    routes: [
      { label: "User", path: "/user" },
      { label: "Role", path: "/role" },
      // { label: "Employee", path: "/employee" },
    ],
  },
];
