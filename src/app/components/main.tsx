"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import fuzzysort from "fuzzysort";
import Cookies from "js-cookie";

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

const DEFAULT_CITY_INFO = {
  id: 315,
  name: "Seoul",
  country: "South Korea",
};

const Main: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [dailyForecast, setDailyForecast] = useState<
    { date: string; minTemp: number; maxTemp: number; icon: string }[]
  >([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [savedCities, setSavedCities] = useState<CityData[]>([]);
  const [allCities, setAllCities] = useState<CityData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<CityData[]>([]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const loadSavedCitiesFromCookies = () => {
    const savedCitiesFromCookie = Cookies.get("savedCities");
    const cities = savedCitiesFromCookie
      ? JSON.parse(savedCitiesFromCookie)
      : [DEFAULT_CITY_INFO];
    setSavedCities(cities);
  };

  const saveCitiesToCookies = (savedCities: CityData[]) => {
    if (savedCities.length > 0) {
      Cookies.set("savedCities", JSON.stringify(savedCities), { expires: 7 });
    }
  };

  const saveSelectedCityToCookies = (selectedCity = "") => {
    Cookies.set("selectedCity", selectedCity, { expires: 7 });
  };

  const fetchWeatherData = async (city: string) => {
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
  };

  const loadCityList = useCallback(async () => {
    try {
      const response = await fetch("/data/city_list.json");
      const cityData = await response.json();
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
  }, []);

  const searchCities = useCallback(
    (searchTerm: string) => {
      if (searchTerm) {
        const results = fuzzysort.go(searchTerm, allCities, {
          keys: ["name", "country"],
          limit: 10,
        });
        setSearchResults(results.map((result) => result.obj));
      } else {
        setSearchResults([]);
      }
    },
    [allCities],
  );

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);

    // cities 데이터 있는지 체크하고, 없으면 패치로 불러옴.
    if (allCities.length === 0) {
      loadCityList().then(() => {});
    }
  };

  useEffect(() => {
    const selectedCityFromCookie = Cookies.get("selectedCity") || "Seoul";
    setSelectedCity(selectedCityFromCookie);
    fetchWeatherData(selectedCityFromCookie);

    loadSavedCitiesFromCookies();
  }, []);

  useEffect(() => {
    saveCitiesToCookies(savedCities);
  }, [savedCities]);

  useEffect(() => {
    const searchCity = selectedCity || "Seoul";
    saveSelectedCityToCookies(selectedCity);
    fetchWeatherData(searchCity);
  }, [selectedCity]);

  useEffect(() => {
    searchCities(searchTerm);
  }, [searchCities, searchTerm]);

  if (!weatherData || !forecastData || dailyForecast.length === 0) {
    // todo 데이터 없으면 배경은 보이되 화면 안쪽에 로딩바 집어넣기.
    // 컴포넌트 분리 리팩토링 이후 작업 ㄱㄱ
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

      <div className="relative h-screen w-full md:max-w-2xl md:mx-auto">
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
          <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-120px)]">
            <div className="p-6 h-full">
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
            className={`absolute top-0 left-0 h-full w-4/5 max-w-xl bg-gray-800 rounded-r-lg shadow-lg p-4 text-left transform ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out`}
          >
            {(!isSearchOpen && (
              <>
                <div className="flex flex-col justify-between w-full h-full">
                  <div className="flex-col flex gap-4">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">My Cities</p>
                      {/*닫기 버튼*/}
                      <button
                        className="text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                    <div className="flex flex-col gap-1">
                      {savedCities.map((city) => (
                        <div
                          key={city.id}
                          className="flex justify-between items-center cursor-pointer p-2"
                          onClick={() => {
                            setSelectedCity(city.name);
                            setIsMenuOpen(false);
                          }}
                        >
                          <p className="cursor-pointer">
                            {city.name} - {city.country}
                          </p>
                          <button
                            className="text-white"
                            onClick={() => {
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
                  </div>
                  <div>
                    <button
                      className="text-white bg-gradient-to-r from-[#4e54c8] to-[#8f94fb] rounded-md p-2 w-full"
                      onClick={toggleSearch}
                    >
                      Add City
                    </button>
                  </div>
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
                    }}
                  />
                  {/*// 검색 결과 표시*/}
                  <div className="mt-4 flex flex-col gap-1">
                    {searchResults.map((city) => (
                      <div
                        key={city.id}
                        className="flex justify-between items-center p-2 cursor-pointer"
                      >
                        <p
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedCity(city.name);
                            setIsMenuOpen(false);
                            setIsSearchOpen(false);
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
  );
};

export default Main;
