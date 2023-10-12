import { createContext } from "react";
import { useContext, useState } from "react";

export const ErrorContext = createContext(null);

export const ErrorProvider = ({ children }) => {
  const [errorObj, setErrorObj] = useState({});

  const setErrorMessage = (error, msg) => {
    setErrorObj((prev) => ({
      ...prev,
      [error]: msg,
    }));
  };

  const deleteErrorMessage = (error) => {
    setErrorObj((prev) => ({
      ...prev,
      [error]: '',
    }));
  };

  return (
    <ErrorContext.Provider
      value={{ 
        errorObj, 
        setErrorObj,
        setErrorMessage,
        deleteErrorMessage }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  return useContext(ErrorContext);
};
