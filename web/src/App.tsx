import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Search from "./pages/Search";
import AddPost from "./components/AddPost";
import MainLayout from "./components/layouts/MainLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { SignedIn, SignedOut, SignIn, useUser } from "@clerk/clerk-react";
import axiosInstance from "./config/axiosInstance";
import { useEffect, useState } from "react";
import { CreateAccount } from "./pages/CreateAccount";
import { setHasAccount } from "./redux/features/auth/authSlice";

const App = () => {
  const navigate = useNavigate();
  const { colors } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const { user, isSignedIn, isLoaded } = useUser();
  const [checking, setChecking] = useState(true);
  const { hasAccount } = useAppSelector((state) => state.auth);

  // Function to check if user exists in backend
  const checkUserExists = async (clerkId: string) => {
    try {
      const { data } = await axiosInstance.post("/auth/check-user", {
        clerkId,
      });
      dispatch(setHasAccount(data.exists));
      return data.exists;
    } catch (err) {
      console.error("Error checking user:", err);
      return false;
    }
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const onboard = async () => {
      try {
        const exists = await checkUserExists(user.id);

        if (!exists) {
          navigate("/create-account");
          return;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    };

    onboard();
  }, [isLoaded, isSignedIn, user]);

  return (
    <div style={{ backgroundColor: colors.background, minHeight: "100vh" }}>
      <Toaster />
      <SignedOut>
        <div className="bg-[#3f3f3f] h-screen flex items-center justify-center">
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        {!isLoaded || checking ? (
          <div
            style={{ backgroundColor: colors.background, color: colors.text }}
            className="flex items-center justify-center h-screen"
          >
            Loading...
          </div>
        ) : (
          <Routes>
            {/* Layout with navbar */}
            <Route
              element={
                hasAccount ? <MainLayout /> : <Navigate to="/create-account" />
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/search" element={<Search />} />
              <Route path="/add-post" element={<AddPost />} />
            </Route>

            {/* Layout without navbar */}
            <Route element={<AuthLayout />}>
              <Route path="/create-account" element={<CreateAccount />} />
            </Route>
          </Routes>
        )}
      </SignedIn>
    </div>
  );
};

export default App;
