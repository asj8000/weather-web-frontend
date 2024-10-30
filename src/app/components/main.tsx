"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import fuzzysort from "fuzzysort";

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

interface CityData {
  id: number;
  name: string;
  country: string;
}

const Main: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [dailyForecast, setDailyForecast] = useState<
    { date: string; minTemp: number; maxTemp: number; icon: string }[]
  >([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Seoul");
  const [savedCities, setSavedCities] = useState<CityData[]>([
    { id: 315, name: "Seoul", country: "South Korea" },
  ]);
  const [allCities, setAllCities] = useState<CityData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<CityData[]>([]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
        const city = selectedCity;

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
  }, [selectedCity]);

  useEffect(() => {
    const fetchCityList = async () => {
      try {
        const response = await fetch("/data/city_list.json");
        const cityData = await response.json();

        // 필요한 필드만 추출하여 저장
        const formattedCities = cityData.map(
          (city: { id: number; name: string; country: string }) => ({
            id: city.id,
            name: city.name,
            country: city.country,
          }),
        );
        setAllCities(formattedCities);
      } catch (error) {
        console.error("Error fetching city list:", error);
      }
    };

    fetchCityList();
  }, []);

  useEffect(() => {
    const search = (term: string) => {
      if (term) {
        const results = fuzzysort.go(term, allCities, {
          keys: ["name", "country"],
          limit: 10,
        });
        setSearchResults(results.map((result) => result.obj));
      } else {
        setSearchResults([]);
      }
    };

    search(searchTerm);
  }, [searchTerm, allCities]);

  useEffect(() => {
    console.log("isMenuOpen");
    console.log(isMenuOpen);
  }, [isMenuOpen]);

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

      <div className="relative h-screen w-full md:max-w-sm md:mx-auto">
        <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-[#4e54c8]/80 to-[#8f94fb]/80 md:rounded-2xl shadow-lg opacity-80"></div>
        <div className="relative overflow-hidden text-center bg-transparent rounded-2xl h-full w-full scrollbar-hide">
          <div className="p-6 relative flex items-center">
            {/* 좌측 햄버거 버튼 */}
            <div className="absolute left-6">
              <button
                onClick={toggleMenu}
                className="w-8 h-8 bg-white bg-opacity-20 rounded-md flex flex-col items-center justify-center"
              >
                <span className="block w-5 h-0.5 bg-white mb-1"></span>
                <span className="block w-5 h-0.5 bg-white mb-1"></span>
                <span className="block w-5 h-0.5 bg-white"></span>
              </button>
            </div>

            {/* 가운데 타이틀 */}
            <div className="mx-auto text-center">
              <p className="text-lg font-semibold">
                {weatherData.name}, {weatherData.sys.country}
              </p>
              <p className="text-sm opacity-70">
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>
          <div className="overflow-y-scroll scrollbar-hide p-6">
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
              <div className="flex gap-6 overflow-x-auto bg-white bg-opacity-10 rounded-lg py-4 px-6 mb-8 w-full scrollbar-hide justify-start align-baseline mt-2">
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
              <p className="font-semibold text-lg">
                Today&#39;s Additional Info
              </p>
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

          {/* 메뉴 패널 */}
          {isMenuOpen && (
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10">
              {/* 메뉴 패널 배경 클릭 시 닫기 */}
              <div
                className="absolute w-full h-full"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSearchOpen(false);
                }}
              ></div>

              {/* 메뉴 패널 */}
              <div
                className={`absolute top-0 left-0 h-full w-4/5 bg-gray-800 rounded-r-lg shadow-lg p-4 text-left transform ${
                  isMenuOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out`}
              >
                {(!isSearchOpen && (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-lg font-semibold">My Cities</p>

                      <button
                        className="text-white"
                        onClick={() => setIsSearchOpen(true)}
                      >
                        Add City
                      </button>
                    </div>
                    <div className="mt-4">
                      {savedCities.map((city) => (
                        <div
                          key={city.id}
                          className="flex justify-between items-center mb-2"
                        >
                          <p
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedCity(city.name);
                              setIsMenuOpen(false);
                            }}
                          >
                            {city.name} - {city.country}
                          </p>
                          <button
                            className="text-white"
                            onClick={() => {
                              console.log("Delete city:", city.name);
                              setSavedCities(
                                savedCities.filter((c) => c.id !== city.id),
                              );
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )) || (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-lg font-semibold">Search City</p>
                      <button
                        className="text-white"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchTerm("");
                        }}
                      >
                        Close
                      </button>
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        className="w-full bg-white rounded-md p-1 mb-4 text-black"
                        placeholder="Search city..."
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          console.log(e.target.value);
                        }}
                      />
                      {/*// 검색 결과 표시*/}
                      <div>
                        {searchResults.map((city) => (
                          <div
                            key={city.id}
                            className="flex justify-between items-center mb-2"
                          >
                            <p
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedCity(city.name);
                                setIsMenuOpen(false);
                              }}
                            >
                              {city.name} - {city.country}
                            </p>
                            <button
                              className="text-white"
                              onClick={() => {
                                console.log("Add city:", city.name);
                                setSavedCities([...savedCities, city]);
                                setIsSearchOpen(false);
                                setSearchTerm("");
                              }}
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
