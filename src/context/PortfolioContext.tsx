import { createContext, useContext } from "react";

interface PortfolioContextType {
  userId: string | null;
  username: string | null;
}

const PortfolioContext = createContext<PortfolioContextType>({ userId: null, username: null });

export const usePortfolioOwner = () => useContext(PortfolioContext);

export const PortfolioProvider = ({
  userId,
  username,
  children,
}: {
  userId: string | null;
  username: string | null;
  children: React.ReactNode;
}) => (
  <PortfolioContext.Provider value={{ userId, username }}>
    {children}
  </PortfolioContext.Provider>
);
