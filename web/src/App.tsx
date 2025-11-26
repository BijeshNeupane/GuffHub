import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { useAppDispatch } from "./redux/hooks";
import { SignedIn, SignedOut, SignIn, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setUser } from "./redux/features/auth/authSlice";
import Navbar from "./components/Navbar";
import Chat from "./pages/Chat";
import Search from "./pages/Search";

const App = () => {
  const dispatch = useAppDispatch();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const data = {
      email: user.emailAddresses?.[0]?.emailAddress || "",
      name: user.firstName || "",
      id: user.id || "",
    };

    dispatch(setUser(data));
  }, [user]);

  return (
    <>
      <SignedOut>
        <div className="bg-[#3f3f3f] h-screen flex items-center justify-center">
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </SignedIn>
    </>
  );
};

export default App;
