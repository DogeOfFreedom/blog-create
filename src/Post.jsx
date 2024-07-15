import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import LoadingWheel from "./LoadingWheel";
import Forbidden from "./Forbidden";
import LoadingError from "./LoadingError";
import { convertDate } from "./utils";

export default function Post() {
  const navigate = useNavigate();
  const { loggedIn } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState();
  const [post, setPost] = useState();
  const [comments, setComments] = useState();
  const [userComment, setUserComment] = useState("");
  const { id } = useParams();

  const fetchPost = async () => {
    const res = await fetch(
      import.meta.env.VITE_HOSTNAME + "/api/posts/" + id,
      {
        credentials: "include",
      }
    )
      .then(async (res) => {
        if (res.status !== 200) {
          return navigate("/");
        }
        const data = await res.json();
        setPost(data);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
        setError(e);
      });
    return res;
  };

  const fetchComments = async () => {
    const res = await fetch(
      import.meta.env.VITE_HOSTNAME + "/api/posts/" + id + "/comments",
      { credentials: "include" }
    )
      .then(async (res) => {
        if (res.status !== 200) {
          return navigate("/");
        }
        const data = await res.json();
        setComments(data);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
        setError(e);
      });
    return res;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchPost();
      await fetchComments();
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentsLoading(true);
    const newComment = {
      originPost: id,
      content: userComment,
    };
    // Create new comments
    await fetch(import.meta.env.VITE_HOSTNAME + "/api/comments", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    })
      .then(() => setUserComment(""))
      .catch((error) => {
        console.log(error);
        setError(error);
      });

    // Get list of new comments
    await fetchComments();
  };

  const changePublishStatus = async () => {
    setLoading(true);

    // Change isPublished Status
    const isPublished = post.isPublished;
    const newStatus = isPublished ? false : true;
    const obj = { isPublished: newStatus };
    await fetch(import.meta.env.VITE_HOSTNAME + "/api/posts/" + id, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((res) => {
        if (res.status !== 200) {
          return navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });

    await fetchPost();
    setLoading(false);
  };

  const deleteComment = async (commentId) => {
    await fetch(import.meta.env.VITE_HOSTNAME + "/api/comments/" + commentId, {
      method: "DELETE",
      credentials: "include",
    });

    // Get list of new comments
    await fetchComments();
  };

  if (loading) return <LoadingWheel />;
  if (!loggedIn) return <Forbidden />;
  if (error) return <LoadingError />;

  return (
    <>
      <div className="postContainer">
        <h1 className="title">{post.title}</h1>
        <div className="authorDetails">
          <span>{post.author.username}</span>
          <span>{convertDate(post.timestamp)}</span>
        </div>
        <p>{post.text}</p>
        <div className="publishDetails">
          <span>
            Publish Status:{" "}
            <b>{post.isPublished ? "Published" : "Unpublished"}</b>
          </span>
          <button onClick={changePublishStatus} className="actionBtn">
            {post.isPublished ? "Unpublish Post" : "Publish Post"}
          </button>
        </div>
      </div>
      <form className="createCommentForm" onSubmit={handleCommentSubmit}>
        <h1>Make a new comment</h1>
        <textarea
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
          maxLength="500"
          id="newComment"
          required
        ></textarea>
        <button className="actionBtn" type="submit">
          Submit
        </button>
      </form>
      {commentsLoading ? (
        <LoadingWheel />
      ) : (
        <div className="commentsContainer">
          <h1>Comments</h1>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="userImgContainer">
                  <img
                    className="previewImg"
                    src={comment.author.profilePictureURL}
                    alt="profile picture"
                  />
                </div>
                <div className="commentDetails">
                  <h3>{comment.author.username}</h3>
                  <p>{comment.content}</p>
                </div>
                <button
                  onClick={() => deleteComment(comment._id)}
                  className="deleteBtn"
                >
                  &#128465;
                </button>
              </div>
            ))
          ) : (
            <>
              <h2>No Comments Yet</h2>
            </>
          )}
        </div>
      )}
    </>
  );
}
