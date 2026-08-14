import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFlash } from "../context/FlashContext";

const SignupPage = () => {
  const { signup } = useAuth();
  const { showMessage } = useFlash();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setSubmitting(true);
      const result = await signup(username, password);
      if (result.success) {
        showMessage(result.message || "Welcome to StayNest!");
        navigate("/listings");
      } else {
        showMessage(result.message || "Signup failed", "error");
      }
    } catch (err) {
      showMessage("An error occurred during signup. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-sm border-0" style={{ borderRadius: "16px" }}>
          <div className="card-body p-4">
            <h3 className="text-center fw-bold mb-1">
              <i className="fa-solid fa-user-plus me-2" style={{ color: "#fe424d" }}></i>Sign Up
            </h3>
            <p className="text-center text-muted mb-4">Create your StayNest account</p>

            <form
              onSubmit={handleSubmit}
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              noValidate
            >
              <div className="mb-3">
                <label htmlFor="username" className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <div className="invalid-feedback">Please choose a username.</div>
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="invalid-feedback">Please enter a password.</div>
              </div>

              <button
                type="submit"
                className="btn w-100 text-white fw-semibold"
                style={{
                  background: "linear-gradient(135deg, #fe424d, #e91e63)",
                  border: "none",
                  borderRadius: "50px",
                  padding: "10px",
                }}
                disabled={submitting}
              >
                {submitting ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            <p className="text-center mt-3 mb-0 text-muted">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#fe424d", textDecoration: "none", fontWeight: 600 }}>
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
