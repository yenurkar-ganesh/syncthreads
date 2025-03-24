import { Navigate } from "react-router";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const jwtToken = Cookies.get("jwt_token");

  if (!jwtToken) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
