import {
    HomeIcon,
    UserCircleIcon,
    TableCellsIcon,
    InformationCircleIcon,
    ServerStackIcon,
    RectangleStackIcon,
  } from "@heroicons/react/24/solid";
  import { Home, Notifications } from "../admin/pages/dashboard";
  import { SignIn } from "../admin/pages/auth";
  
  const icon = {
    className: "w-5 h-5 text-inherit",
  };
  
  export const routes = [
    {
      layout: "dashboard",
      pages: [
        {
          icon: <HomeIcon {...icon} />,
          name: "dashboard",
          path: "/home",
          element: <Home />,
        },
        
        {
          icon: <InformationCircleIcon {...icon} />,
          name: "notifications",
          path: "/notifications",
          element: <Notifications />,
        },
      ],
    },
    {
      title: "auth pages", 
      layout: "auth",
      pages: [
        {
          icon: <ServerStackIcon {...icon} />,
          name: "sign in",
          path: "/sign-in", 
          element: <SignIn />,
        },
      ],
    },
  ];
  
  export default routes;
  