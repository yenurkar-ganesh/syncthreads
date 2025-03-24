import { Link } from "react-router";
import "./index.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">SyncThreads</h2>
      <ul className="nav-list">
        <li className="nav-list-item">
          <Link className="nav-link" to="/map">
            <p>Map</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
