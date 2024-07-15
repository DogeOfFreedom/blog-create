import { useState } from "react";
import Footer from "./Footer";
import { Link, useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setLoggedIn } = useOutletContext();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState();
  const [error, setError] = useState();

  const handleSubmission = async (e) => {
    e.preventDefault(); // Prevent page reload
    const userObj = {
      username,
      password,
    };
    await fetch(import.meta.env.VITE_HOSTNAME + "/api/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObj),
    })
      .then(async (res) => {
        if (res.status === 200) {
          setLoggedIn(true);
          navigate("/");
        } else {
          const body = await res.json();
          setFormError(body.error);
        }
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      });
  };

  return (
    <>
      <form className="signUpForm" onSubmit={handleSubmission}>
        <h1 className="title">Log In</h1>
        <div className="inputContainer">
          <label htmlFor="username">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            id="username"
            name="username"
            autoComplete="off"
            required
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="password">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            required
          />
        </div>
        {formError && <p className="errorMsg">{formError}</p>}
        <p>
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <button className="actionBtn">Submit</button>
      </form>
      <Footer />
    </>
  );
}
