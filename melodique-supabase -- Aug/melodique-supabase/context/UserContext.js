import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  return (
    <UserContext.Provider value={{ userId, setUserId, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
