import { ForecastData } from "@/app/types/WeatherData";

export const formatDailyForecast = (forecastData: ForecastData) => {
  const dailyData: Record<
    string,
    { minTemp: number; maxTemp: number; icon: string }
  > = {};

  forecastData.list.forEach((item) => {
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

  return Object.entries(dailyData).map(([date, data]) => ({
    date,
    minTemp: data.minTemp,
    maxTemp: data.maxTemp,
    icon: data.icon,
  }));
};
