import { createContext, useContext, useState } from "react";

const LocationContext = createContext(null);

export const LocationContextProvider = ({ children }) => {
  const [location, setLocation] = useState("Home");

  const home = () => {
    setLocation("Home");
  };

  const work = () => {
    setLocation("Work");
  };

  return (
    <LocationContext.Provider value={{ home, work, location }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);

  if (!context) throw new Error("Please Wrap the context in Higher order");

  return context;
};
