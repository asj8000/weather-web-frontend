"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface WeatherData {
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  name: string;
}

interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
    };
    weather: {
      icon: string;
    }[];
  }[];
}

const Main: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
        const city = "Seoul";

        // 현재 날씨 데이터
        const weatherResponse = await axios.get<WeatherData>(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`,
        );
        console.log("weatherResponse");
        console.log(weatherResponse);
        setWeatherData(weatherResponse.data);

        // 주간 예보 데이터
        const forecastResponse = await axios.get<ForecastData>(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`,
        );
        setForecastData(forecastResponse.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  if (!weatherData || !forecastData) {
    return <p>Loading...</p>;
  }

  const { main, weather } = weatherData;
  const dailyForecast = forecastData.list.slice(0, 5);

  return (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Morning, Seoul</h2>
          <p>{new Date().toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-8 bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold">Weather</h3>
        <p>{weatherData.name}</p>
        <div className="text-6xl font-bold">{Math.round(main.temp)}°</div>
        <p>{weather[0].description}</p>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Forecast</h3>
        <div className="grid grid-cols-5 gap-4 mt-4">
          {dailyForecast.map((forecast, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg text-center">
              <p>
                {new Date(forecast.dt * 1000).toLocaleDateString("en", {
                  weekday: "short",
                })}
              </p>
              <img
                src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="mx-auto"
              />
              <p>{Math.round(forecast.main.temp)}°</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
