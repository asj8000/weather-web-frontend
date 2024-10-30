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
  sys: {
    country: string;
  };
}

interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    dt_txt: string;
  }[];
}

const Main: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [dailyForecast, setDailyForecast] = useState<
    { date: string; minTemp: number; maxTemp: number; icon: string }[]
  >([]);

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
        const forecastList = forecastResponse.data.list;

        const dailyData: Record<
          string,
          { minTemp: number; maxTemp: number; icon: string }
        > = {};

        forecastList.forEach((item) => {
          const date = item.dt_txt.split(" ")[0]; // "YYYY-MM-DD"
          if (!dailyData[date]) {
            dailyData[date] = {
              minTemp: Math.round(item.main.temp_min),
              maxTemp: Math.round(item.main.temp_max),
              icon: item.weather[0].icon,
            };
          } else {
            dailyData[date].minTemp = Math.min(
              dailyData[date].minTemp,
              Math.round(item.main.temp_min),
            );
            dailyData[date].maxTemp = Math.max(
              dailyData[date].maxTemp,
              Math.round(item.main.temp_max),
            );
          }
        });

        const formattedDailyForecast = Object.entries(dailyData).map(
          ([date, data]) => ({
            date,
            minTemp: data.minTemp,
            maxTemp: data.maxTemp,
            icon: data.icon,
          }),
        );
        setDailyForecast(formattedDailyForecast);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData().then((r) => console.log(r));
  }, []);

  useEffect(() => {
    console.log("weatherData");
    console.log(weatherData);
  }, [weatherData]);

  useEffect(() => {
    console.log("dailyForecast");
    console.log(dailyForecast);
  }, [dailyForecast]);

  if (!weatherData || !forecastData || dailyForecast.length === 0) {
    return <p>Loading...</p>;
  }

  const todayForecast = forecastData.list.slice(0, 10);

  return (
    <div className="relative h-screen bg-gray-900 text-white">
      <div className="absolute inset-0 overflow-hidden h-full w-full">
        <Image
          src="/images/aurora_mb.webp"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="opacity-60"
        />
      </div>

      <div className="relative h-screen w-full md:max-w-sm md:mx-auto ">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4e54c8]/80 to-[#8f94fb]/80 md:rounded-2xl shadow-lg opacity-80"></div>
        <div className="relative overflow-scroll text-center bg-transparent rounded-2xl h-full w-full scrollbar-hide p-6">
          <div className="mb-4">
            <p className="text-lg font-semibold">
              {weatherData.name}, {weatherData.sys.country}
            </p>
            <p className="text-sm opacity-70">{new Date().toLocaleString()}</p>
          </div>

          <div className="text-7xl font-bold mb-2">
            {Math.round(weatherData.main.temp)}°C
          </div>
          <p className="text-md font-light mb-6">
            {weatherData.weather[0].description}
          </p>

          <div className="flex justify-around items-center bg-white bg-opacity-10 rounded-xl p-4 mb-6">
            <div className="text-center">
              <p>Today</p>
              <p className="font-semibold">
                ↑{dailyForecast[0].maxTemp}° ↓{dailyForecast[0].minTemp}°
              </p>
            </div>
            <div className="text-center">
              <p>Yesterday</p>
              <p className="font-semibold">
                ↑{dailyForecast[1].maxTemp}° ↓{dailyForecast[1].minTemp}°
              </p>
            </div>
          </div>

          <div className="text-left mb-4">
            <p className="font-semibold text-lg">Hourly Forecast</p>
            <div className="flex gap-6 overflow-x-auto bg-white bg-opacity-10 rounded-lg py-4 px-6 mb-8 w-full justify-start align-baseline mt-2">
              {todayForecast.map((forecast, index) => (
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

          {/* 주간 날씨 요약 */}
          <div className="text-left mt-8">
            <p className="font-semibold text-lg">Weekly Forecast</p>
            <div className="bg-white bg-opacity-10 rounded-xl p-4 mt-2 mb-8 text-left">
              <div className="grid grid-cols-1 gap-4">
                {dailyForecast.map((day, index) => {
                  if (index === 0) return null; // 오늘은 제외
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {new Date(day.date).toLocaleDateString("en", {
                            weekday: "long",
                          })}
                        </p>
                        <p className="text-xs">
                          {new Date(day.date).toLocaleDateString("en", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center justify-end space-x-2 w-1/2">
                        <Image
                          src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                          alt="weather icon"
                          width={30}
                          height={30}
                        />
                        <p>
                          {day.maxTemp}° / {day.minTemp}°
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

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

export default Main;
