import { createContext, useContext, useState, useCallback } from "react";

const FlashContext = createContext();

export const FlashProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  const showMessage = useCallback((text, type = "success") => {
    setMessage({ text, type });
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  }, []);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  return (
    <FlashContext.Provider value={{ message, showMessage, clearMessage }}>
      {children}
    </FlashContext.Provider>
  );
};

export const useFlash = () => useContext(FlashContext);
