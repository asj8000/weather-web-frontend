"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

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

    fetchWeatherData().then((r) => console.log(r));
  }, []);

  if (!weatherData || !forecastData) {
    return <p>Loading...</p>;
  }

  const { main, weather } = weatherData;
  const dailyForecast = forecastData.list.slice(0, 5);

  return (
    <div className="relative h-screen bg-gray-900 text-white">
      <div className="hidden sm:block absolute inset-0 overflow-hidden h-full w-full ">
        <Image
          src="/images/aurora_mb.webp"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="opacity-60"
        />
      </div>

      <div className="relative h-screen max-w-sm mx-auto md:my-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4e54c8]/80 to-[#8f94fb]/80 rounded-2xl shadow-lg opacity-80"></div>

        <div className="relative overflow-scroll p-6 text-center bg-transparent rounded-2xl h-full">
          <div className="mb-4">
            <p className="text-lg font-semibold">Seoul, KR</p>
            <p className="text-sm opacity-70">{new Date().toLocaleString()}</p>
          </div>

          <div className="text-7xl font-bold mb-2">
            {Math.round(main.temp)}°C
          </div>
          <p className="text-md font-light mb-6">{weather[0].description}</p>

          <div className="flex justify-around items-center bg-white bg-opacity-10 rounded-xl p-4 mb-6">
            <div className="text-center">
              <p>Today</p>
              <p className="font-semibold">↑17° ↓10°</p>
            </div>
            <div className="text-center">
              <p>Yesterday</p>
              <p className="font-semibold">↑17° ↓10°</p>
            </div>
          </div>

          <div className="text-left mb-4">
            <p className="font-semibold text-lg">Hourly Forecast</p>
            <div className="flex overflow-x-auto space-x-4 mt-2">
              {dailyForecast.map((forecast, index) => (
                <div key={index} className="text-center">
                  <Image
                    src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                    alt="weather icon"
                    width={50}
                    height={50}
                  />
                  <p className="font-semibold">
                    {Math.round(forecast.main.temp)}°
                  </p>
                  <p className="text-sm opacity-70">
                    {new Date(forecast.dt * 1000).toLocaleTimeString("en", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-left mt-8">
            <p className="font-semibold text-lg">Tomorrow</p>
            <div className="flex justify-between items-center bg-white bg-opacity-10 rounded-xl p-4 mt-2">
              <Image
                src={`https://openweathermap.org/img/wn/${dailyForecast[0].weather[0].icon}@2x.png`}
                alt="weather icon"
                width={50}
                height={50}
              />
              <p className="text-sm opacity-70">Light Rain Showers</p>
              <p className="font-semibold">↑17° ↓10°</p>
            </div>
          </div>
          <div className="text-left mt-8">
            <p className="font-semibold text-lg">Tomorrow</p>
            <div className="flex justify-between items-center bg-white bg-opacity-10 rounded-xl p-4 mt-2">
              <Image
                src={`https://openweathermap.org/img/wn/${dailyForecast[0].weather[0].icon}@2x.png`}
                alt="weather icon"
                width={50}
                height={50}
              />
              <p className="text-sm opacity-70">Light Rain Showers</p>
              <p className="font-semibold">↑17° ↓10°</p>
            </div>
          </div>
          <div className="text-left mt-8">
            <p className="font-semibold text-lg">Tomorrow</p>
            <div className="flex justify-between items-center bg-white bg-opacity-10 rounded-xl p-4 mt-2">
              <Image
                src={`https://openweathermap.org/img/wn/${dailyForecast[0].weather[0].icon}@2x.png`}
                alt="weather icon"
                width={50}
                height={50}
              />
              <p className="text-sm opacity-70">Light Rain Showers</p>
              <p className="font-semibold">↑17° ↓10°</p>
            </div>
          </div>
          <div className="text-left mt-8">
            <p className="font-semibold text-lg">Tomorrow</p>
            <div className="flex justify-between items-center bg-white bg-opacity-10 rounded-xl p-4 mt-2">
              <Image
                src={`https://openweathermap.org/img/wn/${dailyForecast[0].weather[0].icon}@2x.png`}
                alt="weather icon"
                width={50}
                height={50}
              />
              <p className="text-sm opacity-70">Light Rain Showers</p>
              <p className="font-semibold">↑17° ↓10°</p>
            </div>
          </div>
          <div className="text-left mt-8">
            <p className="font-semibold text-lg">Tomorrow</p>
            <div className="flex justify-between items-center bg-white bg-opacity-10 rounded-xl p-4 mt-2">
              <Image
                src={`https://openweathermap.org/img/wn/${dailyForecast[0].weather[0].icon}@2x.png`}
                alt="weather icon"
                width={50}
                height={50}
              />
              <p className="text-sm opacity-70">Light Rain Showers</p>
              <p className="font-semibold">↑17° ↓10°</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
