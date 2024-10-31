import React from "react";
import Image from "next/image";
import { ForecastData } from "../../types/WeatherData";

interface ForecastListProps {
  todayForecast: ForecastData["list"];
  dailyForecast: Array<{
    date: string;
    minTemp: number;
    maxTemp: number;
    icon: string;
  }>;
}

const ForecastList: React.FC<ForecastListProps> = ({
  todayForecast,
  dailyForecast,
}) => (
  <>
    <div className="text-left mb-4">
      <p className="font-semibold text-lg">Hourly Forecast</p>
      <div className="flex gap-6 overflow-x-auto bg-white bg-opacity-10 rounded-lg py-4 px-6 mb-8 w-full scrollbar-hide  align-baseline mt-2 justify-start">
        {todayForecast.map((forecast, index) => (
          <div key={index} className="text-center">
            <Image
              src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
              alt="weather icon"
              width={50}
              height={50}
            />
            <p className="font-semibold">{Math.round(forecast.main.temp)}°</p>
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
      <p className="font-semibold text-lg">Weekly Forecast</p>
      <div className="bg-white bg-opacity-10 rounded-xl p-4 mt-2 mb-8 text-left">
        <div className="grid grid-cols-1 gap-4">
          {dailyForecast.map((day, index) => (
            <div key={index} className="flex justify-between items-center">
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
          ))}
        </div>
      </div>
    </div>
  </>
);

export default ForecastList;
