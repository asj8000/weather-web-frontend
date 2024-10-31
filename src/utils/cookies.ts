import Cookies from "js-cookie";
import { CityData } from "@/app/types/CityData";

export const loadSavedCities = (defaultCity: CityData): CityData[] => {
  const savedCitiesFromCookie = Cookies.get("savedCities");
  return savedCitiesFromCookie
    ? JSON.parse(savedCitiesFromCookie)
    : [defaultCity];
};

export const saveCitiesToCookies = (cities: CityData[]) => {
  if (cities.length > 0) {
    Cookies.set("savedCities", JSON.stringify(cities), { expires: 7 });
  }
};

export const saveSelectedCityToCookies = (cityName: string) => {
  Cookies.set("selectedCity", cityName, { expires: 7 });
};
