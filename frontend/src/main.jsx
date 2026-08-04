import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter,Route,Routes} from "react-router"
import { store } from './lib/store'
import { Provider } from 'react-redux'
import SignupPage from './pages/register.page'
import LoginPage from './pages/login.page'
import Home from './pages/home.page'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/register' element={<SignupPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
    </Routes>
    
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
