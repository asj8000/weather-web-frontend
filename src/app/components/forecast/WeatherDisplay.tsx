"use client";

import React from "react";
import { WeatherData, ForecastData } from "../../types/WeatherData";
import ForecastList from "./ForecastList";
import Header from "@/app/components/Header";
import Image from "next/image";
import ForecastDetail from "@/app/components/forecast/ForecastDetail";

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

  const cityName = weatherData.name;
  const country = weatherData.sys.country;

  const currentTemp = Math.round(weatherData.main.temp);
  const weatherIcon = weatherData.weather[0].icon;
  const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  const weatherDescription = weatherData.weather[0].description;

  return (
    <div className="relative h-screen overflow-hidden w-full md:max-w-2xl md:mx-auto">
      <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-[#4e54c8]/80 to-[#8f94fb]/80 md:rounded-2xl shadow-lg opacity-80"></div>
      <Header cityName={cityName} country={country} toggleMenu={toggleMenu} />
      <div className="relative overflow-hidden text-center bg-transparent rounded-2xl h-full w-full scrollbar-hide">
        <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] p-6">
          <div className="flex flex-col mb-6 gap-2">
            <div className="text-7xl font-bold mb-2">{currentTemp}°C</div>
            <div className="text-md text-center flex items-center justify-center gap-2">
              <Image
                src={weatherIconUrl}
                alt="weather icon"
                width={30}
                height={30}
              />
              <p className="text-md font-light">{weatherDescription}</p>
            </div>
          </div>
          <ForecastList
            todayForecast={todayForecast}
            dailyForecast={dailyForecast}
          />
          <ForecastDetail weatherData={weatherData} />
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
