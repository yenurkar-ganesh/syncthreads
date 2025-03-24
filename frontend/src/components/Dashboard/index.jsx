import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Navbar from "../Navbar";
import DashboardCard from "../DashboardCard";
import "./index.css";

const Dashboard = () => {
  const [cardList, setCardList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCardList = async () => {
    const jwtToken = Cookies.get("jwt_token");

    try {
      const url = `http://localhost:3000/api/cards`;
      const options = {
        headers: { Authorization: `Bearer ${jwtToken}` },
        method: "GET",
      };
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCardList(data);
      }
    } catch (error) {
      console.error("Error while fetching the card list", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCardList();
  }, []);
  return (
    <div className="dashboard-container">
      <Navbar />
      <section className="dashboard-content-section">
        <h1 className="dashboard-heading">
          "Explore the World, One Map at a Time!" 🗺️✨
        </h1>
        <ul className="card-section">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            cardList.map((eachCard) => (
              <DashboardCard key={eachCard.id} eachCard={eachCard} />
            ))
          )}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
