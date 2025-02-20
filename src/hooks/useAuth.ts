
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "./useAuthActions";

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { handleLogin } = useAuthActions({
    email,
    password,
    setIsLoading,
    navigate,
  });

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
  };
};
