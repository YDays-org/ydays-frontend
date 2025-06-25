import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // This line checks if there is a 'userID' stored in localStorage.
  // If 'userID' exists, isAuthenticated will be true; otherwise, it will be false.
  // isAuthenticated will be true if 'userID' exists in localStorage, false otherwise
  const isAuthenticated = !localStorage.getItem('userID');
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute; 