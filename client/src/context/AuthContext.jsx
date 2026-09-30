import {
  createContext,
  useState,
} from "react";

const AuthContext =
  createContext();

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "currentUser"
        )
      ) || null
    );

  const login = (
    userData
  ) => {
    localStorage.setItem(
      "currentUser",
      JSON.stringify(
        userData
      )
    );

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(
      "currentUser"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}