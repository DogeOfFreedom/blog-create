import "./App.css";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = async () => {
      await fetch(import.meta.env.VITE_HOSTNAME + "/api/isLoggedIn", {
        credentials: "include",
      }).then((res) => {
        if (res.status === 200) {
          setLoggedIn(true);
        }
      });
    };
    isLoggedIn();
  }, []);
  return (
    <>
      <div className="contentContainer">
        <NavBar setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
        <Outlet context={{ setLoggedIn, loggedIn }} />
      </div>
      <Footer />
    </>
  );
}

export default App;
