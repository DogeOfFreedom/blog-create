import { useState } from "react";
import LoadingWheel from "./LoadingWheel";
import LoadingError from "./LoadingError";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [formError, setFormError] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newPost = {
      title,
      text,
      isPublished,
    };
    await fetch(import.meta.env.VITE_HOSTNAME + "/api/posts", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    })
      .then(async (res) => {
        if (res.status === 422) {
          const errorData = await res.json();
          setLoading(false);
          return setFormError(errorData.error);
        }
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (loading)
    return (
      <>
        <LoadingWheel />
        <p className="centreText">Submitting Post, please wait</p>
      </>
    );
  if (error) return <LoadingError />;

  return (
    <form className="signUpForm" onSubmit={handleSubmission}>
      <h1 className="title">New Post</h1>
      <div className="inputContainer">
        <label htmlFor="title">Post Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          name="title"
          id="title"
          required
        />
      </div>
      <div className="inputContainer">
        <label htmlFor="text">Post Content</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength="1000"
          id="text"
          className="newPostTextArea"
          required
        ></textarea>
      </div>
      <div className="checkboxContainer">
        <input
          type="checkbox"
          name="isPublished"
          id="isPublished"
          onClick={() => {
            if (isPublished) {
              return setIsPublished(false);
            }
            return setIsPublished(true);
          }}
        />
        <label htmlFor="isPublished">Published?</label>
      </div>
      {formError && <p className="errorMsg">{formError}</p>}
      <button className="actionBtn">Submit</button>
    </form>
  );
}
