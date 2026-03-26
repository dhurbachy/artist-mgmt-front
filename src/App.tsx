
import './App.css'
import RouteMain from './routes/routeMain'
import { BrowserRouter } from 'react-router'
import {
  // useQuery,
  // useMutation,
  // useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { OpenAPI } from "@/services/artist-services/core/OpenAPI";
import "./services/apiInterceptor";
OpenAPI.TOKEN = async () => localStorage.getItem("access_token") ?? "";
// import { AuthProvider } from './context/authContext';
const queryClient = new QueryClient()


function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
       {/* <AuthProvider> */}

       
        <BrowserRouter>
          <RouteMain />
        </BrowserRouter>
        {/* </AuthProvider> */}
      </QueryClientProvider>
    </>
  )
}

export default App
