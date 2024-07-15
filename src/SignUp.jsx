import { useCallback, useState } from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import LoadingWheel from "./LoadingWheel";

export default function SignUp() {
  const { setLoggedIn } = useOutletContext();
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAuthor, setIsAuthor] = useState(false);
  const [preview, setPreview] = useState();
  const [uploadFile, setUploadFile] = useState();
  const [formError, setFormError] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const previewFile = acceptedFiles[0];
    setUploadFile(previewFile);
    const URLObject = URL.createObjectURL(previewFile);
    setPreview(URLObject);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
    maxFiles: 1,
  });

  const uploadImage = async () => {
    const responseJSON = await fetch(
      import.meta.env.VITE_HOSTNAME + "/api/signed_upload"
    )
      .then((res) => res.json())
      .catch((err) => setError(err));
    const url =
      "https://api.cloudinary.com/v1_1/" +
      responseJSON.cloudname +
      "/auto/upload";

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("api_key", responseJSON.apikey);
    formData.append("timestamp", responseJSON.timestamp);
    formData.append("signature", responseJSON.signature);

    // Upload to cloudinary
    const cloudinaryResponse = await fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
        setError(err);
      });
    const imgUrl = cloudinaryResponse.url;
    fetch(import.meta.env.VITE_HOSTNAME + "/api/upload", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imgUrl }),
    })
      .then((res) => {
        if (res.status === 200) {
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      });
  };

  const handleSubmission = async (e) => {
    e.preventDefault(); // Prevent page reload

    const hasProfileImg = uploadFile ? true : false;
    const userObj = {
      firstname,
      lastname,
      email,
      username,
      password,
      confirmPassword,
      isAuthor,
      hasProfileImg,
    };
    await fetch(import.meta.env.VITE_HOSTNAME + "/api/sign-up", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObj),
    })
      .then(async (res) => {
        if (res.status === 200) {
          setLoading(true);
          setLoggedIn(true);
          await uploadImage();
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

  if (loading)
    return (
      <>
        <LoadingWheel />
        <p>Submitting Form, please wait</p>
      </>
    );

  return (
    <>
      <form className="signUpForm" onSubmit={handleSubmission}>
        <h1 className="title">Sign Up</h1>
        <div className="inputContainer">
          <label htmlFor="firstname">First Name</label>
          <input
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            type="text"
            name="firstname"
            id="firstname"
            required
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="lastname">Last Name</label>
          <input
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            type="text"
            name="lastname"
            id="lastname"
            required
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            id="email"
            autoComplete="off"
            required
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="username">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            name="username"
            id="username"
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
            name="password"
            id="password"
            required
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="confirm_password">Confirm Password</label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            name="confirm_password"
            id="confirm_password"
            required
          />
        </div>
        <div className="checkboxContainer">
          <input type="checkbox" name="isAuthor" id="isAuthor" />
          <label
            value={isAuthor}
            onChange={(e) => setIsAuthor(e.target.value)}
            htmlFor="isAuthor"
          >
            Author?
          </label>
        </div>
        <div className="inputContainer">
          <label htmlFor="profilePicture">Profile Picture</label>
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps({ id: "profilePicture" })} />
            {!isDragActive && <p>Drag & Drop Here, or Click to Select Files</p>}
            {isDragAccept && <p>Valid File Type</p>}
            {isDragReject && (
              <p>Invalid File Type, only .png, .jpg and .jpeg is accepted</p>
            )}
          </div>
        </div>
        {preview && (
          <div className="previewImgContainer">
            <img className="previewImg" src={preview} alt="" />
          </div>
        )}
        {formError && <p className="errorMsg">{formError}</p>}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <button className="actionBtn">Submit</button>
      </form>
      <Footer />
    </>
  );
}
