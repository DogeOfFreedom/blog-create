import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignUp from "./SignUp";
import Login from "./Login";
import ErrorPage from "./ErrorPage";
import Redirect from "./Redirect";
import Posts from "./Posts";
import Post from "./Post";
import CreatePost from "./CreatePost";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Posts /> },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "posts/create",
        element: <CreatePost />,
      },
      {
        path: "posts/:id",
        element: <Post />,
      },
    ],
  },
]);

export default router;
