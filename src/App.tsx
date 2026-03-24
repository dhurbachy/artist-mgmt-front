
import './App.css'
import RouteMain from './routes/routeMain'
import { BrowserRouter } from 'react-router'
function App() {

  return (
    <>
      <BrowserRouter>
        <RouteMain />
      </BrowserRouter>
    </>
  )
}

export default App
