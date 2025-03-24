import { Link } from "react-router";
import "./index.css";

const DashboardCard = ({ eachCard }) => {
  const { title, description, data, id } = eachCard;
  const parsedData = JSON.parse(data);

  return (
    <Link className="card-link" to={`/map/${title}/:${id}`}>
      <li className="dashboard-card">
        <img className="card-flag-icon" src={parsedData.flag_url} alt={title} />
        <div className="card-header ">
          <p className="card-title">{title} </p>
        </div>
        <p>{description} </p>
      </li>
    </Link>
  );
};

export default DashboardCard;
