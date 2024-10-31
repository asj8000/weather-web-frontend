import React from "react";

interface HeaderProps {
  cityName: string;
  country: string;
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ cityName, country, toggleMenu }) => {
  return (
    <div className="p-6 relative flex items-center justify-center text-white">
      <button
        onClick={toggleMenu}
        className="absolute left-6 w-8 h-8 bg-white bg-opacity-20 rounded-md flex flex-col items-center justify-center"
      >
        <span className="block w-5 h-0.5 bg-white mb-1"></span>
        <span className="block w-5 h-0.5 bg-white mb-1"></span>
        <span className="block w-5 h-0.5 bg-white"></span>
      </button>

      <div className="text-center">
        <p className="text-lg font-semibold">
          {cityName}, {country}
        </p>
        <p className="text-sm opacity-70">{new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Header;
