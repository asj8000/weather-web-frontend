"use client";

import React, { useState } from "react";
import { CityData } from "../types/CityData";

interface SidebarMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  isSearchOpen: boolean;
  toggleSearch: () => void;
  savedCities: CityData[];
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  searchCities: (term: string) => void;
  addSavedCity: (cityName: string) => void;
  removeSavedCity: (cityName: string) => void;
  searchResults: CityData[];
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  isMenuOpen,
  toggleMenu,
  isSearchOpen,
  toggleSearch,
  savedCities,
  // selectedCity,
  setSelectedCity,
  searchCities,
  searchResults,
  addSavedCity,
  removeSavedCity,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchCities(term);
  };

  const handleAddNewCity = (cityName: string) => {
    setSelectedCity(cityName);
    toggleMenu();
    toggleSearch();
    setSearchTerm("");
    addSavedCity(cityName);
  };

  return (
    <>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-transparent z-10"
          onClick={toggleMenu}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xl bg-gray-800 rounded-r-lg shadow-lg text-left transform z-20 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {!isSearchOpen ? (
          <div className="flex flex-col justify-between h-full p-4 pb-6">
            <div className="flex-col flex gap-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">My Cities</p>
                <button className="text-white" onClick={toggleMenu}>
                  Close
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {savedCities.map((city) => (
                  <div
                    key={city.id}
                    className="flex justify-between items-center cursor-pointer p-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCity(city.name);
                      toggleMenu();
                    }}
                  >
                    <p>
                      {city.name} - {city.country}
                    </p>
                    <button
                      className="text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeSavedCity(city.name);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="text-white bg-gradient-to-r from-[#4e54c8] to-[#8f94fb] rounded-md p-2 w-full mt-4"
              onClick={() => {
                toggleSearch();
                searchCities("");
              }}
            >
              Add City
            </button>
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full p-4 pb-6">
            <div className="flex-col flex gap-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">Search City</p>
                <button
                  className="text-white"
                  onClick={() => {
                    toggleSearch();
                    setSearchTerm("");
                  }}
                >
                  Cancel
                </button>
              </div>
              <input
                type="text"
                className="w-full bg-white rounded-md p-1 text-black"
                placeholder="Search city..."
                value={searchTerm}
                onChange={handleSearchChange}
              />

              {searchResults && searchResults.length > 0 && (
                <div className="mt-2 flex flex-col gap-1 bg-gray-700 rounded-md p-2">
                  {searchResults.map((city) => (
                    <div
                      key={city.id}
                      className="flex justify-between items-center cursor-pointer p-2"
                      onClick={() => {
                        handleAddNewCity(city.name);
                      }}
                    >
                      <p>
                        {city.name} - {city.country}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SidebarMenu;
