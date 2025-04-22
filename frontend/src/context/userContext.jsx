import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";
import axios from "axios";
import { toast } from "react-hot-toast";

const userContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  async function loginUser(email, password, navigate) {
    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error) {
      setBtnLoading(false);
      setIsAuth(false);
      toast.error(error.message.data.message);
      console.log(error);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setIsAuth(true);
      setUser(data.user);
      setLoading(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <userContext.Provider
      value={{ user, setUser, setIsAuth, isAuth, loginUser, btnLoading }}
    >
      {children}
    </userContext.Provider>
  );
};

export const UserData = () => useContext(userContext);
