import {Navigate} from "react-router-dom";

function ProtectedRoute({children}) {
  let isAuthenticated = localStorage.getItem("auth") ;
  return isAuthenticated ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
