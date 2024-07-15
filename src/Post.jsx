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

  useEffect(() => {
    const fetchData = async () => {
      const postData = await fetch(
        import.meta.env.VITE_HOSTNAME + "/api/posts/" + id,
        {
          credentials: "include",
        }
      ).catch((e) => {
        setLoading(false);
        console.log(e);
        setError(e);
      });
      const commentsData = fetch(
        import.meta.env.VITE_HOSTNAME + "/api/posts/" + id + "/comments",
        { credentials: "include" }
      ).catch((e) => {
        setLoading(false);
        console.log(e);
        setError(e);
      });

      Promise.all([postData, commentsData])
        .then(async (promises) => {
          for (let i = 0; i < promises.length; i++) {
            if (promises[i].status !== 200) {
              navigate("/");
              return;
            }
            promises[i] = await promises[i].json();
          }
          setPost(promises[0]);
          setComments(promises[1]);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setError(error);
        });
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
    await fetch(
      import.meta.env.VITE_HOSTNAME + "/api/posts/" + id + "/comments",
      {
        credentials: "include",
      }
    )
      .then(async (res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch comments");
        }
        const data = await res.json();
        setComments(data);
        setCommentsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
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
          {comments ? (
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
              </div>
            ))
          ) : (
            <>
              <h1>No Comments Yet</h1>
            </>
          )}
        </div>
      )}
    </>
  );
}
