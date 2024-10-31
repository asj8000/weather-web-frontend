"use client";

import React from "react";
import WeatherDisplay from "./WeatherDisplay";
import SidebarMenu from "./SidebarMenu";
import useWeatherData from "../hooks/useWeatherData";
import useCityData from "../hooks/useCityData";
import Image from "next/image";

const Main = () => {
  const { weatherData, forecastData, dailyForecast, fetchWeatherData } =
    useWeatherData();
  const {
    isMenuOpen,
    toggleMenu,
    isSearchOpen,
    toggleSearch,
    savedCities,
    selectedCity,
    setSelectedCity,
    searchCities,
    searchResults,
    addSavedCity,
    removeSavedCity,
  } = useCityData(fetchWeatherData);

  if (!weatherData || !forecastData || dailyForecast.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative h-screen text-white">
      <div className="absolute inset-0 overflow-hidden h-full w-full">
        <Image
          src="/images/aurora_mb.webp"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="opacity-60"
        />
      </div>
      <WeatherDisplay
        weatherData={weatherData}
        forecastData={forecastData}
        dailyForecast={dailyForecast}
        toggleMenu={toggleMenu}
      />
      {isMenuOpen && (
        <SidebarMenu
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          isSearchOpen={isSearchOpen}
          toggleSearch={toggleSearch}
          savedCities={savedCities}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          searchCities={searchCities}
          searchResults={searchResults}
          addSavedCity={addSavedCity}
          removeSavedCity={removeSavedCity}
        />
      )}
    </div>
  );
};

export default Main;
