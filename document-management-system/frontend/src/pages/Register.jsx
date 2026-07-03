import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "reviewer",
  });

  const [message, setMessage] = useState("");

  const register = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="auth-page">

      <form className="auth-card" onSubmit={register}>

        <h1>Create Account</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e)=>
            setForm({...form,name:e.target.value})
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e)=>
            setForm({...form,email:e.target.value})
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e)=>
            setForm({...form,password:e.target.value})
          }
        />

        <select
          value={form.role}
          onChange={(e)=>
            setForm({...form,role:e.target.value})
          }
        >
          <option value="reviewer">Reviewer</option>
          <option value="manager">Manager</option>
          <option value="finance">Finance</option>
        </select>

        <button>Create Account</button>

        <p className="message">{message}</p>

        <p>
          Already have an account?
          <Link to="/"> Login</Link>
        </p>

      </form>

    </div>
  );
}

export default Register;