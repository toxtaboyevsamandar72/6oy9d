import React, { useRef, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [loading, setLoading] = useState(false);
  const userNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const rePasswordRef = useRef();

  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  function validate() {
    if (userNameRef.current.value.length < 3) {
      alert("Username is not valid");
      userNameRef.current.focus();
      userNameRef.current.style.outlineColor = "red";
      return false;
    }
    if (!validateEmail(emailRef.current.value)) {
      alert("Email is not valid");
      emailRef.current.focus();
      emailRef.current.style.outlineColor = "red";
      return false;
    }
    if (passwordRef.current.value !== rePasswordRef.current.value) {
      alert("Passwords do not match");
      passwordRef.current.focus();
      passwordRef.current.style.outlineColor = "red";
      return false;
    }

    return true;
  }

  function handleRegister(e) {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) {
      return;
    }

    setLoading(true);

    const user = {
      username: userNameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    fetch("https://auth-rg69.onrender.com/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "User registered successfully!") {
          navigate("/login");
        } else if (
          data.message === "Failed! Username is already in use!" ||
          data.message === "Failed! Email is already in use!"
        ) {
          alert(data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="container form__container">
      <form>
        <input
          className="py-4 px-4 border"
          ref={userNameRef}
          type="text"
          placeholder="Enter Username..."
        />
        <input
          className="py-4 px-4 border"
          ref={emailRef}
          type="email"
          placeholder="Enter Email..."
        />
        <input
          className="py-4 px-4 border"
          ref={passwordRef}
          type="password"
          placeholder="Enter Password..."
        />
        <input
          className="py-4 px-4 border"
          ref={rePasswordRef}
          type="password"
          placeholder="Enter Repeat Password..."
        />
        <button
          disabled={loading}
          className="py-4 px-4 border"
          onClick={handleRegister}
        >
          {loading ? "LOADING" : "REGISTER"}
        </button>
        <button className="p-2 bg-zinc-950 text-white">
          <Link to="/login">login</Link>
        </button>
      </form>
    </div>
  );
}

export default Register;
