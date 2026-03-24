import Forbidden from "@/utils/forbidden";
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
   const isAuthenticated=true;
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
    return <Forbidden />
  }


  return <>{children}</>;
}
