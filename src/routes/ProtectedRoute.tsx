import { useGetMe } from "@/app/user/hooks/user";
import Forbidden from "@/utils/forbidden";
import { Navigate } from "react-router";
import { RouteList } from "./routes";
export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {
  //  const isAuthenticated=true;
  const isAuthenticated = !!localStorage.getItem("access_token");
  const { data: user } = useGetMe();
  const currentRoute = RouteList.find(r => r.path === location.pathname);


  if (!isAuthenticated) {
    // authService.signinRedirect();

    // return (
    //   <div
    //     style={{
    //       height: "100vh",
    //       display: "flex",
    //       justifyContent: "center",
    //       alignItems: "center",
    //     }}
    //   >
    //   </div>
    // );
    return <Navigate to="/login" replace />

  }
  if (currentRoute?.roles && !currentRoute?.roles.includes(user?.role)) {
    return <Navigate to="/forbidden" replace />;
  }



  return <>{children}</>;
}
