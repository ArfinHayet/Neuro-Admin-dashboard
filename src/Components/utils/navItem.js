
import { RiDashboardFill } from "react-icons/ri";
import { RiBarChartBoxFill } from "react-icons/ri";
import { PiUsersFill, PiArticleFill } from "react-icons/pi";
import { TbUserFilled } from "react-icons/tb";
import { PiWalletFill } from "react-icons/pi";
import { IoMdImage } from "react-icons/io";

import p4 from "../../../public/png/settings.svg";


export const navItem = [
 
  {
    title: "Dashboard",
    icon: RiDashboardFill,
    path: "/",
    routes: [],
  },
  {
    title: "Submitted Assessments",
    icon: RiBarChartBoxFill,
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
    icon: PiUsersFill,
    path: "/patients",
    routes: [],
  },
  {
    title: "Clinicians",
    icon: TbUserFilled,
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
    icon: RiBarChartBoxFill,
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
    title: "Articles",
    icon: PiArticleFill,
    path: "/articles",
    routes: [],
  },
 
  {
    title: "Banner",
    icon: IoMdImage,
    path: "/banner_img",
    routes: [],
  },
 
  {
    title: "Finances",
    icon: PiWalletFill,
    path: "/finances",
    routes: [],
  },

  {
    title: "Settings",
    icon: p4,
    routes: [
      { label: "User", path: "/user" },
      // { label: "Role", path: "/role" },
      // { label: "Employee", path: "/employee" },
    ],
  },
];
