import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function NavBar({ setLoggedIn = () => {}, loggedIn = false }) {
  const navigate = useNavigate();
  const path = window.location.pathname.toLowerCase();

  const logOut = () => {
    fetch(import.meta.env.VITE_HOSTNAME + "/api/logout", {
      credentials: "include",
    }).then(() => {
      setLoggedIn(false);
      navigate("/");
    });
  };

  return (
    <>
      <nav>
        <a href="/">
          <button className="actionBtn">Home</button>
        </a>
        {path !== "/signup" &&
          path !== "/login" &&
          (loggedIn ? (
            <button onClick={logOut} className="actionBtn">
              Log Out
            </button>
          ) : (
            <a href="/signup">
              <button className="actionBtn">Sign In</button>
            </a>
          ))}
      </nav>
    </>
  );
}

NavBar.propTypes = {
  setLoggedIn: PropTypes.func,
  loggedIn: PropTypes.bool,
};
