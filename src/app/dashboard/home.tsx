import { Navigate } from "react-router";
import { ROUTES } from "@/routes/routeConstant";
import {useAuth} from "@/context/authContext";

export default function Home() {
      const {accessToken}=useAuth();

  const isAuthenticated = !!accessToken;

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div>
      <h1>Public Home Page</h1>
      <a href={ROUTES.LOGIN}>Login</a>
    </div>
  );
}
