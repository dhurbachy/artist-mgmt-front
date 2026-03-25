import { Navigate } from "react-router";
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  //  const isAuthenticated=true;
     const isAuthenticated = !!localStorage.getItem("access_token");

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


  return <>{children}</>;
}
