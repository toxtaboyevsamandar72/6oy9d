import React, { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Login() {
  const userNameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  function validate() {
    if (userNameRef.current.value.length < 3) {
      alert("Username is not valid");
      userNameRef.current.focus();
      userNameRef.current.style.outlineColor = "red";
      return false;
    }
    return true;
  }

  function handleLogin(e) {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) {
      return;
    }

    const user = {
      username: userNameRef.current.value,
      password: passwordRef.current.value,
    };

    fetch("https://auth-rg69.onrender.com/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Server response:", data);

        if (data.accessToken && data.id) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("userid", data.id);
          alert("Login successful!");
          navigate("/"); // Bosh sahifaga o'tish
        } else {
          alert("Login failed: " + (data.message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.log("Error:", err);
        alert("Something went wrong! Please try again.");
      });
  }

  return (
    <div className="container form__container">
     
      <form onSubmit={handleLogin}>
        <input
          className="py-4 px-4 border"
          ref={userNameRef}
          type="text"
          placeholder="Enter Username..."
        />
        <input
          className="py-4 px-4 border"
          ref={passwordRef}
          type="password"
          placeholder="Enter Password..."
        />
        <button className="py-4 px-4 border" type="submit">
          Login
        </button>
        <button className="bg-zinc-700 text-white py-2 w-full">
          <Link to="/register">Register</Link>
        </button>
      </form>
    </div>
  );
}

export default Login;
