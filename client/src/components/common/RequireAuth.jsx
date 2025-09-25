import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const RequireAuth = ({ children }) => {
  const { userData, getToken, fetchUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const ensureAuth = async () => {
      const token = getToken();
      if (!token) {
        navigate("/signin", { replace: true, state: { from: location } });
        return;
      }
      if (!userData && !checking) {
        setChecking(true);
        try {
          await fetchUserData();
        } finally {
          setChecking(false);
        }
      }
    };
    ensureAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const token = getToken();
  if (!token) return null;

  return <>{children}</>;
};

export default RequireAuth;
