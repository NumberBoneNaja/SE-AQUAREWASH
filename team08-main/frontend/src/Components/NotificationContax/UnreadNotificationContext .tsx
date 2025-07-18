import { createContext, useContext, useState } from "react";

interface UnreadNotificationContextProps {
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

const UnreadNotificationContext = createContext<UnreadNotificationContextProps | undefined>(undefined);

export const UnreadNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <UnreadNotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </UnreadNotificationContext.Provider>
  );
};

export const useUnreadNotification = () => {
  const context = useContext(UnreadNotificationContext);
  if (!context) {
    throw new Error("useUnreadNotification must be used within a UnreadNotificationProvider");
  }
  return context;
};
