import { useEffect, useState } from "react";
import LoadingWheel from "./LoadingWheel";
import Forbidden from "./Forbidden";
import LoadingError from "./LoadingError";
import { Link, useOutletContext } from "react-router-dom";
import { convertDate, truncate } from "./utils";

export default function Posts() {
  const { loggedIn } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [posts, setPosts] = useState();

  useEffect(() => {
    const fetchPosts = async () => {
      await fetch(
        import.meta.env.VITE_HOSTNAME + "/api/posts?isPublished=true",
        {
          credentials: "include",
        }
      )
        .then(async (res) => {
          if (res.status === 403) {
            setLoading(false);
            setError("");
          } else {
            const data = await res.json();
            setLoading(false);
            setPosts(data);
          }
        })
        .catch((error) => {
          if (error.message === "Forbidden") {
            return;
          }
          return setError(error);
        });
    };
    fetchPosts();
  }, []);

  if (loading) return <LoadingWheel />;
  if (!loggedIn) return <Forbidden />;
  if (error) return <LoadingError />;

  return (
    <div className="allPostsContainer">
      {posts.length === 0 ? (
        <div className="plainTextContainer">
          <h1 className="title">No Posts</h1>
        </div>
      ) : (
        posts.map((post) => (
          <Link key={post._id} className="cardLink" to={`/posts/${post._id}`}>
            <div className="previewCard">
              <div className="cardContentContainer">
                <h1 className="cardTitle">{post.title}</h1>
                <p className="cardText">
                  {post.text.length > 300 ? truncate(post.text) : post.text}
                </p>
                <span className="cardAuthor">{post.author.username}</span>
                <span className="cardTimeStamp">
                  {convertDate(post.timestamp)}
                </span>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
