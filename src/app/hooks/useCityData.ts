"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { CityData } from "../types/CityData";
import fuzzysort from "fuzzysort";
import {
  loadSavedCities,
  saveCitiesToCookies,
  saveSelectedCityToCookies,
} from "@/utils/cookies";

const DEFAULT_CITY_INFO: CityData = {
  id: 315,
  name: "Seoul",
  country: "South Korea",
};

const useCityData = (fetchWeatherData: (city: string) => void) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY_INFO.name);
  const [savedCities, setSavedCities] = useState<CityData[]>([]);
  const [allCities, setAllCities] = useState<CityData[]>([]);
  const [searchResults, setSearchResults] = useState<CityData[]>([]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const loadCityList = useCallback(async () => {
    try {
      const response = await fetch("/data/city_list.json");
      const cities: CityData[] = await response.json();
      setAllCities(cities);
    } catch (error) {
      console.error("Error loading city list:", error);
    }
  }, []);

  const searchCities = useCallback(
    (term: string) => {
      if (term) {
        const results = fuzzysort.go(term, allCities, {
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

  const addSavedCity = (cityName: string) => {
    const city = allCities.find((c) => c.name === cityName);
    if (city) {
      // 중복 저장 방지
      if (savedCities.some((c) => c.name === cityName)) {
        return;
      }
      setSavedCities((prev) => [...prev, city]);
    }
  };

  const removeSavedCity = (cityName: string) => {
    setSavedCities((prev) => prev.filter((city) => city.name !== cityName));
  };

  useEffect(() => {
    const loadedCities = loadSavedCities(DEFAULT_CITY_INFO);
    setSavedCities(loadedCities);
    const cityFromCookie =
      Cookies.get("selectedCity") || DEFAULT_CITY_INFO.name;
    setSelectedCity(cityFromCookie);
    fetchWeatherData(cityFromCookie);
  }, [fetchWeatherData]);

  useEffect(() => {
    saveCitiesToCookies(savedCities);
  }, [savedCities]);

  useEffect(() => {
    saveSelectedCityToCookies(selectedCity);
    fetchWeatherData(selectedCity);
  }, [selectedCity, fetchWeatherData]);

  useEffect(() => {
    if (allCities.length === 0) {
      loadCityList().then((r) => r);
    }
  }, [allCities.length, isSearchOpen, loadCityList]);

  return {
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
  };
};

export default useCityData;
