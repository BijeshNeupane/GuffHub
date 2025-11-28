import { toggleTheme } from "../redux/features/theme/themeSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { UserButton } from "@clerk/clerk-react";
import { House, MessageCircle, Moon, Search, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();
  const { colors, mode } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

  const isActive = (route: string) => pathname === route;

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div style={{ backgroundColor: colors.primary }}>
      <div className="container grid grid-cols-5 items-center">
        {/* Logo */}
        <div className="col-span-1">
          <Link to="/">
            <img
              className="h-16 w-[200px]"
              src="./logo.svg"
              alt="GuffHub logo"
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="col-span-3 flex items-center justify-evenly px-40 gap-4">
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
        <div className="col-span-1 flex justify-end gap-4">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />

          <div
            onClick={() => {
              handleThemeToggle();
            }}
          >
            {mode === "dark" ? (
              <Sun size={40} className="cursor-pointer text-gray-600" />
            ) : (
              <Moon size={40} className="cursor-pointer text-gray-600" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
