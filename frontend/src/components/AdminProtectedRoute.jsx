
import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AppContext from "../context/AppContext";

const AdminProtectedRoute = () => {
  const { user, token, userProfile } = useContext(AppContext);
  const [checking, setChecking] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let active = true;

    const checkAdmin = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        if (active) {
          setProfile(null);
          setChecking(false);
        }
        return;
      }

      // Use the existing user if already loaded.
      if (user?.role) {
        if (active) {
          setProfile(user);
          setChecking(false);
        }
        return;
      }

      // Otherwise, fetch the profile and wait for the result.
      const loadedUser = await userProfile();

      if (active) {
        setProfile(loadedUser);
        setChecking(false);
      }
    };

    checkAdmin();

    return () => {
      active = false;
    };
  }, [token, user, userProfile]);

  if (checking) {
    return <div className="p-6 text-center">Checking admin access...</div>;
  }

  if (!localStorage.getItem("token") || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (profile.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
