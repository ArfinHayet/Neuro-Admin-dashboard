// import p1 from "../../public/png/Group 61.svg";
// import p2 from "../../public/png/Group 54.svg";
// import p3 from "../../public/png/Group 53.svg";
import p4 from "../../../public/png/settings.svg";
import p5 from "../../../public/png/assessment.svg";


import {
  MdDashboard,
  MdOutlinePeopleAlt,
  MdPerson,
  MdAssessment,
  MdArticle,
  MdBarChart,
} from "react-icons/md";
import { RiMoneyPoundBoxLine } from "react-icons/ri";


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
    icon: MdDashboard,
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
    icon: MdOutlinePeopleAlt,
    path: "/patients",
    routes: [],
  },
  {
    title: "Clinicians",
    icon: MdPerson,
    path: "/clinicians",
    routes: [],
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
    icon: MdArticle,
    path: "/blogs",
    routes: [],
  },
  {
    title: "Reports",
    icon: MdBarChart,
    path: "/reports",
    routes: [],
  },
  {
    title: "Finances",
    icon: RiMoneyPoundBoxLine,
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

