import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="plainTextContainer">
      <h1 className="title">
        You don&apos;t have the right, O, you don&apos;t have the right
      </h1>
      <p>Only those with the right can view posts</p>
      <a href="/login">
        <button className="actionBtn">Login</button>
      </a>
    </div>
  );
}
