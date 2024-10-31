"use client";

import React from "react";
import Image from "next/image";
import { WeatherData, ForecastData } from "../types/WeatherData";
import ForecastList from "./ForecastList";
import Header from "@/app/components/Header";

interface WeatherDisplayProps {
  weatherData: WeatherData;
  forecastData: ForecastData;
  dailyForecast: Array<{
    date: string;
    minTemp: number;
    maxTemp: number;
    icon: string;
  }>;
  toggleMenu: () => void;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({
  weatherData,
  forecastData,
  dailyForecast,
  toggleMenu,
}) => {
  const todayForecast = forecastData.list.slice(0, 10);

  return (
    <div className="relative h-screen overflow-hidden w-full md:max-w-2xl md:mx-auto">
      <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-[#4e54c8]/80 to-[#8f94fb]/80 md:rounded-2xl shadow-lg opacity-80"></div>
      <Header
        cityName={weatherData.name}
        country={weatherData.sys.country}
        toggleMenu={toggleMenu}
      />
      <div className="relative overflow-hidden text-center bg-transparent rounded-2xl h-full w-full scrollbar-hide">
        <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] p-6">
          <div className="flex flex-col mb-6 gap-2">
            <div className="text-7xl font-bold mb-2">
              {Math.round(weatherData.main.temp)}°C
            </div>
            <p className="text-md font-light">
              {weatherData.weather[0].description}
            </p>
          </div>
          <ForecastList
            todayForecast={todayForecast}
            dailyForecast={dailyForecast}
          />
          <div className="text-left mt-8">
            <p className="font-semibold text-lg">Today&#39;s Additional Info</p>
            <div className="grid grid-cols-2 gap-4 bg-white bg-opacity-10 p-4 rounded-lg mt-2">
              <div className="text-left">
                <p className="text-xs opacity-70">Humidity</p>
                <p className="text-lg font-semibold">60%</p>
              </div>
              <div className="text-left">
                <p className="text-xs opacity-70">Wind</p>
                <p className="text-lg font-semibold">1 m/s</p>
              </div>
              <div className="text-left">
                <p className="text-xs opacity-70">UV Index</p>
                <p className="text-lg font-semibold">Moderate</p>
              </div>
              <div className="text-left">
                <p className="text-xs opacity-70">Visibility</p>
                <p className="text-lg font-semibold">10 km</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
