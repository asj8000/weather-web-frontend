"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import { WeatherData, ForecastData } from "../types/WeatherData";

const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [dailyForecast, setDailyForecast] = useState<
    Array<{ date: string; minTemp: number; maxTemp: number; icon: string }>
  >([]);

  const fetchWeatherData = useCallback(async (city: string) => {
    if (city === "") return;

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

      const weatherResponse = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`,
      );
      setWeatherData(weatherResponse.data);

      const forecastResponse = await axios.get<ForecastData>(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`,
      );
      setForecastData(forecastResponse.data);

      const dailyData: Record<
        string,
        { minTemp: number; maxTemp: number; icon: string }
      > = {};
      forecastResponse.data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
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
  }, []);

  return { weatherData, forecastData, dailyForecast, fetchWeatherData };
};

export default useWeatherData;
