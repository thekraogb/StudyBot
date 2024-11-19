import "./App.css";
import Appbar from "./components/appbar/Appbar";
import Chatbot from "./pages/chatbot/chatbotpage.jsx";
import { SidebarProvider } from "./context/sidebarcontext";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth/authpage";
import RequireAuth from "./components/auth/requireauth.jsx";

function App() {
  return (
    <Routes>
      <Route index element={<AuthPage />} />
      <Route element={<RequireAuth />}>
        <Route
          path="home"
          element={
            <SidebarProvider>
              <Appbar />
              <Chatbot />
            </SidebarProvider>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
