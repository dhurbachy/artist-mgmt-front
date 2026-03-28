import { lazy } from "react";
import { ROUTES } from "./routeConstant";
import { RoleConstant } from "@/utils/types/role";
const Login = lazy(() => import("../app/auth/pages/login"));
const User = lazy(() => import("../app/user/pages/user"));
const Artist = lazy(() => import("../app/artist/pages/artist"));
const Song = lazy(() => import("../app/song/pages/song"));
const Register = lazy(() => import("../app/auth/pages/register"));
const ForBidden = lazy(() => import("../utils/forbidden"));
const Home = lazy(() => import("../app/dashboard/home"));
const ArtistSongs = lazy(() => import("../app/artist/pages/artistSongs"));
export const RouteList = [
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <>Dashboard</>,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
    layout: "auth",
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
    layout: "auth",
  },
  {
    path: ROUTES.USERS,
    element: <User />,
    protected: true,
    roles: [RoleConstant.Super_Admin],
  },
  {
    path: ROUTES.ARTISTS,
    element: <Artist />,
    protected: true,
    roles: [RoleConstant.Super_Admin, RoleConstant.Artist_Manager],
  },
  {
    path: ROUTES.ARTIST_SONGS,
    element: <ArtistSongs />,
    protected: true,
    roles: [RoleConstant.Super_Admin, RoleConstant.Artist_Manager],
  },
  {
    path: ROUTES.SONGS,
    element: <Song />,
    protected: true,
    roles: [RoleConstant.Super_Admin, RoleConstant.Artist],
  },
  {
    path: ROUTES.FORBIDDEN,
    element: <ForBidden />,
  },
];

export const authRoutes = RouteList.filter((r) => r.layout === "auth");
export const appRoutes = RouteList.filter((r) => r.layout !== "auth");
