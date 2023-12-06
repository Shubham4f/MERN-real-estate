import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import { signIn, signOut } from "../features/userSlice";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(currentUser);
  const [avatar, setAvatar] = useState(null);
  const [listings, setListings] = useState([]);
  const naviagte = useNavigate();

  const [file, setFile] = useState(undefined);
  const fileRef = useRef(null);
  const [percentage, setPercentage] = useState(0);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    setLoading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setPercentage(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        );
      },
      (error) => {
        setPercentage(0);
        setError("Image upload failed!!!");
        setLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setAvatar(downloadURL);
          setLoading(false);
          setError(null);
        });
      }
    );
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const sendUser = {};
    if (user.username !== currentUser.username)
      sendUser.username = user.username;
    if (user.email !== currentUser.email) sendUser.email = user.email;
    if (user.password) sendUser.password = user.password;
    if (avatar) sendUser.avatar = avatar;
    try {
      const { data } = await axios.post(
        `/api/user/update/${currentUser._id}`,
        sendUser
      );
      if (data.success === false) {
        setError(data.message);
        setSuccess(null);
        setLoading(false);
      } else {
        setError(null);
        dispatch(signIn(data));
        setLoading(false);
        setPercentage(0);
        setSuccess("Profile Updated!!!");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setSuccess(null);
    }
  };

  const handelSignOut = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/auth/signout");
      if (data.success == false) {
        setError(error.message);
        setSuccess(null);
        setLoading(false);
      } else {
        dispatch(signOut());
        setLoading(false);
        naviagte("/sign-in");
      }
    } catch {
      setError(error.message);
      setLoading(false);
    }
  };

  const handelDelete = async () => {
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `/api/user/delete/${currentUser._id}`
      );
      if (data.success == false) {
        setError(error.message);
        setSuccess(null);
        setLoading(false);
      } else {
        dispatch(signOut());
        setLoading(false);
        naviagte("/sign-in");
      }
    } catch {
      setError(error.message);
      setLoading(false);
    }
  };
  const handleShowLisitngs = async () => {
    try {
      const { data } = await axios.get(`/api/user/listings/${currentUser._id}`);
      if (data.success === false) {
        setError(data.message);
      } else {
        setListings(data);
        setError(null);
      }
    } catch (error) {
      setError(error);
    }
  };

  const handelDeleteListing = async (id) => {
    try {
      const { data } = await axios.delete(`/api/listing/${id}`);
      if (data.success === false) {
        setError(data.message);
      } else {
        setError(null);
        setListings(listings.filter((listing) => listing._id != id));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="px-3 py-8 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          id="avatar"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
        />
        <img
          className="mx-auto mt-10 h-24 w-24 rounded-full object-cover cursor-pointer hover:opacity-90"
          onClick={() => fileRef.current.click()}
          src={avatar || currentUser.avatar}
          alt="Avatar"
        />
        {percentage > 0 && percentage < 100 ? (
          <p className="font-semibold text-center text-green-600">
            Uploading... {percentage}%
          </p>
        ) : (
          ""
        )}
        {percentage == 100 && !loading ? (
          <p className="font-semibold text-center text-green-600">
            Upload Successful!!!
          </p>
        ) : (
          ""
        )}
        <input
          id="username"
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          value={user.username}
          onChange={handleChange}
        />
        <input
          id="email"
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          value={user.email}
          onChange={handleChange}
        />
        <input
          id="password"
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 p-3 text-white rounded-lg uppercase cursor-pointer hover:opacity-95 disabled:opacity-80 disabled:cursor-default"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <Link
        to="/add-listing"
        className={`block my-5 bg-green-700 text-center p-3 text-white rounded-lg uppercase cursor-pointer hover:opacity-95 disabled:opacity-80 ${
          loading ? "pointer-events-none" : ""
        }`}
      >
        Add Listing
      </Link>
      <div className="flex justify-between mt-5">
        <span
          onClick={handelDelete}
          className="text-red-700 cursor-pointer hover:opacity-95"
        >
          Delete Account
        </span>
        <span
          onClick={handelSignOut}
          className="text-red-700 cursor-pointer hover:opacity-95"
        >
          Sign Out
        </span>
      </div>
      {error && <div className="bg-red-200 rounded-lg p-3 mt-5">{error}</div>}
      {success && (
        <div className="bg-green-200 rounded-lg p-3 mt-5">{success}</div>
      )}
      <button
        onClick={handleShowLisitngs}
        className="text-green-700 w-full text-center my-10"
      >
        Show Lisitngs
      </button>
      {listings.length > 0 && (
        <div className="flex flex-col">
          <h1 className="w-full text-center font-bold my-7 text-2xl">
            Your listings
          </h1>
          {listings.map((listing, index) => (
            <div
              key={listing._id}
              className="flex justify-between items-center border rounded-lg p-2 my-2"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt={listing.name}
                  className="h-20 w-20 object-contain "
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-slate700 font-semibold truncate hover:underline"
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col justify-between items-center">
                <button
                  onClick={() => handelDeleteListing(listing._id)}
                  className="text-red-700 uppercase hover:underline"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase hover:underline">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
