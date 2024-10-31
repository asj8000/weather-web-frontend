import axios from "axios";
import { WeatherData, ForecastData } from "@/app/types/WeatherData";

const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

export const fetchCurrentWeather = async (
  city: string,
): Promise<WeatherData> => {
  const response = await axios.get<WeatherData>(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`,
  );
  return response.data;
};

export const fetchForecast = async (city: string): Promise<ForecastData> => {
  const response = await axios.get<ForecastData>(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`,
  );
  return response.data;
};
