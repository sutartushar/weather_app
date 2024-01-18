import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import "./index.css";
import axios from "axios";

export default function App() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setLocation("");

          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error(error);
          setError(
            "Error fetching location. Please enter a location manually."
          );
        },
        { enableHighAccuracy: true }
      );
    };

    const fetchWeatherData = async (lat, lon) => {
      try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=7177ca258d614819b57123955230107&q=${lat},${lon}&aqi=no`
        );
        setWeatherData(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Error fetching weather data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      setLoading(true);
      const [lat, lon] = location.split(",");
      fetchWeatherData(lat, lon);
    } else {
      getCurrentLocation();
    }
  }, [location]);

  return (
    <>
      <TextField
        label="Enter a location"
        value={location}
        variant="outlined"
        onChange={(e) => setLocation(e.target.value)}
        className="TextField-wrapper"
        InputProps={{
          classes: {
            root: "TextField-root",
            input: "TextField-input",
            notchedOutline: "TextField-notchedOutline",
            focused: "TextField-focused",
          },
        }}
      />
      {error && <Typography color="error">{error}</Typography>}
      {loading && <CircularProgress size={24} />}
      {weatherData && (
        <Card className="Card-wrapper">
          <CardContent className="Card-content">
            <h2>{weatherData.location.name}</h2>
            <p>Temperature: {weatherData.current.temp_c}°C</p>
            <p>Wind Speed: {weatherData.current.wind_kph} km/h</p>
            <p>Condition: {weatherData.current.condition.text}</p>
            <p>Humidity: {weatherData.current.humidity}%</p>
            <p>Cloud Coverage: {weatherData.current.cloud}%</p>
            <p>Last Update: {weatherData.current.last_updated}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
