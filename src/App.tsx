
import './App.css'
import RouteMain from './routes/routeMain'
import { BrowserRouter } from 'react-router';
import { Toaster } from 'sonner';

import {
  // useQuery,
  // useMutation,
  // useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
// import { OpenAPI } from "@/services/artist-services/core/OpenAPI";
// import "./services/apiInterceptor";
// OpenAPI.TOKEN = async () => localStorage.getItem("access_token") ?? "";
import { AuthProvider } from './context/authContext';
const queryClient = new QueryClient()
import {useAxiosInterceptor} from "./utils/auth";
function AppContent() {
  // ✅ Now this works because it's inside <AuthProvider>
  useAxiosInterceptor(); 

  return (
    <BrowserRouter>
      <RouteMain />
    </BrowserRouter>
  );
}
function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
       <AuthProvider>

       
        {/* <BrowserRouter>
          <RouteMain />
          
        </BrowserRouter> */}
        <AppContent /> 
        </AuthProvider>
      </QueryClientProvider>
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App
