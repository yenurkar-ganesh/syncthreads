import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

const Navbar = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    Cookies.remove("jwt_token");
    navigate("/login");
  };
  return (
    <nav className="navbar">
      <h1 className="logo-heading">SyncThreads</h1>
      <ul className="nav-list">
        <li className="nav-list-item">
          <Link className="nav-link" to="/map">
            <p>Map</p>
          </Link>
        </li>

        <li className="nav-list-item">
          <button className="logout-btn" type="button" onClick={logoutHandler}>
            LOGOUT
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
