import { useState, type FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { register, loading, error, clearError, registrationSuccess } =
    useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (registrationSuccess) {
      navigate("/login?registered=true");
    }
  }, [registrationSuccess, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");
    await register(name, email.toLowerCase(), password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-5 rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center">
            <div className="rounded-full">
              <svg
                className="w-20 h-20 text-blue-800 mt-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
          <h2 className="mt-0 text-4xl font-extrabold text-center text-gray-900 font-['Times_New_Roman']">
            Create your account
          </h2>
          <p className="mt-0 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {error && (
          <div
            className="p-4 text-sm text-red-700 bg-red-100 rounded-[10px] border border-red-200 flex justify-between items-center"
            role="alert"
          >
            <span className="font-medium">{error}</span>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900 focus:outline-none"
              aria-label="Close"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <form className="mt-0 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-0"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-200 focus:border-blue-200 transition-colors duration-200 sm:text-sm"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-gray-700 mb-0"
              >
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-0"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-0"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 sm:text-sm"
                placeholder="••••••••"
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {passwordError}
                </p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-[10px] text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium text-sm transition-colors duration-300 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 -ml-1 text-white animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </div>

          <div className="text-xs text-center text-gray-500 mt-4">
            By creating an account, you agree to our
            <Link
              to="/terms"
              className="text-blue-600 hover:text-blue-500 ml-1 transition-colors duration-300"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-blue-600 hover:text-blue-500 transition-colors duration-300"
            >
              Privacy Policy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
