import { Suspense } from "react";
import { Route, Routes } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../app/layouts/layout";
import { appRoutes, authRoutes } from "./routes";
import NotFound from "@/utils/notFound";
import Forbidden from "@/utils/forbidden";
// import Guard from "@/components/Guard";
export default function RouteMain() {
    console.log(authRoutes,'authRoutes');
    return (
        <>

            <Suspense fallback={
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    loading...
                </div>
            }>
                <Routes>
                    <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                        {appRoutes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path.replace("/", "")}
                                element={route.element}
                            />
                        ))}
                        <Route path="*" element={<NotFound />} />
                    </Route>

                    {authRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}

                    {/* Catch-all 404 */}
                    <Route path="*" element={<Forbidden />} />
                </Routes>
            </Suspense>

        </>
    )
};