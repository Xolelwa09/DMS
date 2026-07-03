import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadDocument from "./pages/UploadDocument";
import Documents from "./pages/Documents";
import ProtectedRoute from "./components/ProtectedRoute";
import Reports from "./pages/Reports";
import "./styles/navbar.css";
import Register from "./pages/Register";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/reports"
  element={
    <ProtectedRoute>
      <Reports />
    </ProtectedRoute>
  }
/>

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadDocument />
            </ProtectedRoute>
          }
        />
        <Route
  path="/documents"
  element={
    <ProtectedRoute>
      <Documents />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;