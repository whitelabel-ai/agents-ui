import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import App from '../App';
import AuthContext from '../context/AuthContext.Context';
import SignIn from '../pages/signIn/SignIn';

const MainRouter = () => {
  const { isAuthenticated } = useContext(AuthContext)

  return (
    <Routes>
      { !isAuthenticated ? (
        <>
          <Route path="/login" element={<SignIn />} />
          <Route path="/*" element={<Navigate to='/login' />} />
        </>
        ) : (<>
          <Route path="/dashboard" element={<App />} />
          <Route path="/*" element={<Navigate to='/dashboard' />} />
        </>) }
    </Routes>
  )
}

export default MainRouter;