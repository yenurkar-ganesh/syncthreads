import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "leaflet/dist/leaflet.css";
import "./index.css";
import Navbar from "../Navbar";

const Map = () => {
  const [mapDetails, setMapDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  //   const parsedData = JSON.parse(mapDetails.data);

  const getCardMapDetails = async () => {
    const jwtToken = Cookies.get("jwt_token");
    const url = `http://localhost:3000/cards/${id}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        setMapDetails(data);
        console.log(data);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch map details.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error while fetching map details:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCardMapDetails();
  }, [id]);

  let parsedData = {};
  try {
    parsedData = mapDetails.data ? JSON.parse(mapDetails.data) : {};
  } catch (error) {
    console.error("Error parsing map data:", error);
  }

  if (isLoading) {
    return <h1>Loading map details...</h1>;
  }

  const countryCenter = [
    `${parsedData.center_coordinates.lat}`,
    `${parsedData.center_coordinates.lng}`,
  ];
  const initialZoom = parsedData.zoom_level;

  const SetViewOnClick = ({ zoomLevel }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(countryCenter, zoomLevel);
    }, [zoomLevel, map]);
    return null;
  };

  console.log(initialZoom);

  return (
    <div className="map-container">
      <Navbar />
      <div className="map-header-section d-flex align-items-center">
        <h1>Map - {mapDetails.title}</h1>
        <img
          className="map-icon"
          src={parsedData.flag_url}
          alt={mapDetails.title}
        />
      </div>
      <p>Desc - {mapDetails.description}</p>
      <p>Type - {mapDetails.type}</p>
      <p>Zoom level - {parsedData.zoom_level} </p>
      <p>
        Center Coordinates -
        {parsedData.center_coordinates
          ? `${parsedData.center_coordinates.lat}, ${parsedData.center_coordinates.lng}`
          : "N/A"}
      </p>
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MapContainer
          className="country-map-container"
          center={countryCenter}
          zoom={initialZoom}
          style={{ height: "80%", width: "80%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
