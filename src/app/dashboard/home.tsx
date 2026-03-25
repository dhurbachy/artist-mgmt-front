import { Navigate } from "react-router";
import { ROUTES } from "@/routes/routeConstant";

export default function Home() {
  const isAuthenticated = !!localStorage.getItem("access_token");

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
