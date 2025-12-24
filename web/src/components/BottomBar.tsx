import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { Home, MessageCircleIcon, Search, User } from "lucide-react";

const BottomBar = () => {
  const { colors } = useAppSelector((state) => state.theme);
  const { pathname } = useLocation();

  const isActive = (route: string) => pathname === route;
  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        boxShadow: `0 -1px 1px  ${colors.shadow}`,
      }}
      className="sm:hidden fixed bottom-0 left-0 right-0 pt-3 grid grid-cols-4 gap-2 pb-5"
    >
      <div
        className={`home flex items-center justify-center ${
          isActive("/") ? "text-blue-600" : ""
        }`}
      >
        <Link to="/">
          <Home className="w-7 h-7 cursor-pointer active:scale-105" />
        </Link>
      </div>
      <div
        className={`home flex items-center justify-center ${
          isActive("/search") ? "text-blue-600" : ""
        }`}
      >
        <Link to="/search">
          <Search className="w-7 h-7 cursor-pointer active:scale-105" />
        </Link>
      </div>
      <div
        className={`home flex items-center justify-center ${
          isActive("/chat") ? "text-blue-600" : ""
        }`}
      >
        <Link to="/chat">
          <MessageCircleIcon className="w-7 h-7 cursor-pointer active:scale-105" />
        </Link>
      </div>
      <div
        className={`home flex items-center justify-center ${
          isActive("/profile") ? "text-blue-600" : ""
        }`}
      >
        <Link to="/profile">
          <User className="w-7 h-7 cursor-pointer active:scale-105" />
        </Link>
      </div>
    </div>
  );
};

export default BottomBar;
