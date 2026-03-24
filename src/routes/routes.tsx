import { lazy } from "react";
import { ROUTES } from "./routeConstant";
const Login=lazy(()=>import('../app/auth/pages/login'));
const User=lazy(()=>import('../app/user/pages/user'));
const Artist=lazy(()=>import('../app/artist/pages/artist'));
const Song=lazy(()=>import('../app/song/pages/song'));
export const RouteList=[
    {
    path: ROUTES.HOME,
    element: <>Home</>,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <>Dashboard</>,
  },
  {
    path:ROUTES.LOGIN,
    element:<Login />,
    layout:'auth'
  },
  {
    path:ROUTES.USERS,
    element:<User />,
  },
  {
    path:ROUTES.ARTISTS,
    element:<Artist />,
  },{
    path:ROUTES.SONGS,
    element:<Song />
  }
]

export const authRoutes = RouteList.filter((r) => r.layout === "auth");
export const appRoutes = RouteList.filter((r) => r.layout !== "auth");