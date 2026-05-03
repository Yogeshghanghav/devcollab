import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchMe, fetchUsers, logout } from "./features/auth/authSlice";
import { initSocket } from "./services/socket";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import MonitorPage from "./pages/MonitorPage";
import AdminPage from "./pages/AdminPage";
function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return;

    const init = async () => {
      try {
        await dispatch(fetchMe()).unwrap();
        dispatch(fetchUsers());
        initSocket(token);
      } catch (err) {
        console.error("Auth init failed:", err);
        dispatch(logout());
      }
    };

    init();
  }, [dispatch, token]);

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ChatPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitor"
          element={
            <ProtectedRoute roles={["admin", "developer"]}>
              <AppLayout>
                <MonitorPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AppLayout>
                <AdminPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </AuthProvider>
  );
}
