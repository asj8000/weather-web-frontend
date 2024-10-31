import React from "react";
import { WeatherData } from "../../types/WeatherData";
import {
  degreeToDirection,
  metersToKilometers,
} from "@/utils/weatherDataConverter";

interface AdditionalForecastProps {
  weatherData: WeatherData;
}

const ForecastDetail: React.FC<AdditionalForecastProps> = ({ weatherData }) => {
  const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(
    "en",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );
  const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(
    "en",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const humidity = weatherData.main.humidity;
  const visibility = metersToKilometers(weatherData.visibility);
  const windSpeed = weatherData.wind.speed;
  const windDirection = degreeToDirection(weatherData.wind.deg);

  return (
    <div className="text-left mt-8">
      <p className="font-semibold text-lg">Today&#39;s Forecast Detail</p>
      <div className="grid grid-cols-2 gap-4 bg-white bg-opacity-10 p-4 rounded-lg mt-2">
        <div className="text-left">
          <p className="text-xs opacity-70">Humidity</p>
          <p className="text-lg font-semibold">{humidity}%</p>
        </div>
        <div className="text-left">
          <p className="text-xs opacity-70">Visibility</p>
          <p className="text-lg font-semibold">{visibility} km</p>
        </div>
        <div className="text-left">
          <p className="text-xs opacity-70">Wind</p>
          <p className="text-lg font-semibold">{windSpeed} m/s</p>
        </div>
        <div className="text-left">
          <p className="text-xs opacity-70">Wind Degree</p>
          <p className="text-lg font-semibold">{windDirection}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 bg-white bg-opacity-10 p-4 rounded-lg mt-2">
        <div className="text-left">
          <p className="text-xs opacity-70">Sunrise</p>
          <p className="text-lg font-semibold">{sunrise}</p>
        </div>
        <div className="text-left">
          <p className="text-xs opacity-70">Sunset</p>
          <p className="text-lg font-semibold">{sunset}</p>
        </div>
      </div>
    </div>
  );
};

export default ForecastDetail;
