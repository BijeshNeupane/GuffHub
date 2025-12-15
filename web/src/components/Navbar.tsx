import { toggleTheme } from "../redux/features/theme/themeSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
// import { UserButton } from "@clerk/clerk-react";
import { House, MessageCircle, Moon, Search, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();
  const { colors, mode } = useAppSelector((state) => state.theme);
  const { profileImage } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const isActive = (route: string) => pathname === route;

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div
      style={{ backgroundColor: colors.primary }}
      className="sticky top-0 z-20 py-2"
    >
      <div className="container grid grid-cols-2 md:grid-cols-5 items-center">
        {/* Logo */}
        <div className="col-span-1 py-2">
          <Link to="/">
            <img
              className="sm:w-full w-[150px]"
              src="./logo.svg"
              alt="GuffHub logo"
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="col-span-3 hidden md:flex items-center justify-evenly px-40 gap-4">
          <Link to="/chat">
            <MessageCircle
              size={40}
              className={`cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:text-blue-600 active:scale-95
                ${isActive("/chat") ? "text-blue-600" : "text-gray-700"}
              `}
            />
          </Link>

          <Link to="/">
            <House
              size={40}
              className={`cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:text-blue-600 active:scale-95
                ${isActive("/") ? "text-blue-600" : "text-gray-700"}
              `}
            />
          </Link>

          <Link to="/search">
            <Search
              size={40}
              className={`cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:text-blue-600 active:scale-95
                ${isActive("/search") ? "text-blue-600" : "text-gray-600"}
              `}
            />
          </Link>
        </div>

        {/* User */}
        <div className="col-span-1 flex items-center justify-end gap-4">
          {/* <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }} 
          />*/}

          <div className="img-container sm:w-10 md:h-10 w-8 h-8 rounded-full cursor-pointer overflow-hidden">
            <Link to="/profile">
              <img
                className="hover:scale-105 transition-all duration-300 object-cover w-full h-full"
                src={profileImage || ""}
                alt=""
              />
            </Link>
          </div>

          <div
            onClick={() => {
              handleThemeToggle();
            }}
          >
            {mode === "dark" ? (
              <Sun className="sm:w-10 sm:h-10 w-8 h-8 cursor-pointer text-gray-600" />
            ) : (
              <Moon className="sm:w-10 sm:h-10 w-8 h-8 cursor-pointer text-gray-600" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
