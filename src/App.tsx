
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
OpenAPI.TOKEN = async () => localStorage.getItem("access_token") ?? "";

const queryClient = new QueryClient()


function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>

        <BrowserRouter>
          <RouteMain />
        </BrowserRouter>
      </QueryClientProvider>
    </>
  )
}

export default App
