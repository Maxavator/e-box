
import { useEffect } from "react";
import { useNavigate, useLocation, NavigateFunction } from "react-router-dom";

const NotFound = () => {
  // Get router hooks safely with fallbacks
  let location;
  let navigate: NavigateFunction | undefined;
  
  try {
    location = useLocation();
    navigate = useNavigate();
  } catch (error) {
    console.error("Router context not available:", error);
    location = { pathname: window.location.pathname };
  }

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    if (navigate) {
      navigate("/");
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <button 
          onClick={handleGoHome}
          className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
