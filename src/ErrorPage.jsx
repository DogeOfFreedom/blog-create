import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="errorPageContainer">
      <h1>404 You should not be here...</h1>
      <p>Who sent you?</p>
      <Link to="/">Go Home</Link>
    </div>
  );
}
