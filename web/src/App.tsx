import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Search from "./pages/Search";
import AddPost from "./pages/AddPost";
import MainLayout from "./components/layouts/MainLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { SignedIn, SignedOut, SignIn, useUser } from "@clerk/clerk-react";
import axiosInstance from "./config/axiosInstance";
import { useEffect, useState } from "react";
import { CreateAccount } from "./pages/CreateAccount";
import { setHasAccount, setUser } from "./redux/features/auth/authSlice";
import Profile from "./pages/Profile";
import RouteProgress from "./components/RouteProgress";

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
      dispatch(
        setUser({
          email: user?.emailAddresses?.[0]?.emailAddress || "",
          fullName: user?.fullName || "",
          id: data.user.id || "",
          clerkId: user?.id || "",
          username: data.user.username || "",
          profileImage: data.user.profileImageUrl || "",
        })
      );
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
          <>
            <RouteProgress />
            <Routes>
              {/* Layout with navbar */}
              <Route
                element={
                  hasAccount ? (
                    <MainLayout />
                  ) : (
                    <Navigate to="/create-account" />
                  )
                }
              >
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/search" element={<Search />} />
                <Route path="/add-post" element={<AddPost />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Layout without navbar */}
              <Route element={<AuthLayout />}>
                <Route path="/create-account" element={<CreateAccount />} />
              </Route>

              {/* route for 404 */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </SignedIn>
    </div>
  );
};

export default App;
