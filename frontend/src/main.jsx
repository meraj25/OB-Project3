import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter,Route,Routes} from "react-router"
import { store } from './lib/store'
import { Provider } from 'react-redux'
import SignupPage from './pages/register.page'
import LoginPage from './pages/login.page'
import ProjectsPage from './pages/projects.page'
import IssuesPage from './pages/issues.page'
import Home from './pages/home.page'
import AcceptInvitePage from './pages/acceptInvite.page'
import VerifyEmailPage from './pages/verify_email.page'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/register' element={<SignupPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/invites/:token' element={<AcceptInvitePage/>}/>
      <Route path='/workspaces/:workspace_id/projects' element={<ProjectsPage />} />
      <Route path="/workspaces/:workspace_id/projects/:project_id/issues" element={<IssuesPage />} />
      <Route path='/verify-email/:token' element={<VerifyEmailPage/>}/>

    </Routes>
  
    
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
