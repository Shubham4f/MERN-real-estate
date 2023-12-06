import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn } from "../features/userSlice.js";
import axios from "axios";

function SignIn() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/signin", user);
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
      } else {
        dispatch(signIn(data));
        navigate("/profile");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          id="username"
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
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
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <div className="flex gap-1 my-5">
        <p>Do not have an account? </p>
        <Link to="/sign-up">
          <span className="text-blue-700 cursor-pointer hover:opacity-95">
            Sign up
          </span>
        </Link>
      </div>
      {error && <div className="bg-red-200 rounded-lg p-3">{error}</div>}
    </div>
  );
}

export default SignIn;
