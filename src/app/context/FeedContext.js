"use client";
import { createContext, useContext, useState } from "react";

const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
  const [feedUrl, setFeedUrl] = useState("");

  return (
    <FeedContext.Provider value={{ feedUrl, setFeedUrl }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => useContext(FeedContext);
