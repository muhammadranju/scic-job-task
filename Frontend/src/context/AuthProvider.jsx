/* eslint-disable react/prop-types */
import { signOut as logOut, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [refetch, setRefetch] = useState();
  const [loading, setLoading] = useState(true);
  //   const navigate = useNavigate();

  const signOut = () => {
    setUser(null);
    logOut(auth);
    setLoading(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // navigate("/login");
  };
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unSubscribe;
    };
  }, [refetch]);

  const value = {
    user,
    loading,
    setUser,
    setLoading,
    signOut,
    setRefetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
