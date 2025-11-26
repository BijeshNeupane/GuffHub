import { UserButton } from "@clerk/clerk-react";
import { House, MessageCircle, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();

  const isActive = (route: string) => pathname === route;

  return (
    <div className="bg-white">
      <div className="container grid grid-cols-5 items-center">
        {/* Logo */}
        <div className="col-span-1">
          <Link to="/">
            <img
              className="h-20 w-[200px]"
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
              className={`cursor-pointer transition-all duration-200 active:scale-95
                ${isActive("/chat") ? "text-blue-600" : "text-gray-700"}
              `}
            />
          </Link>

          <Link to="/">
            <House
              size={40}
              className={`cursor-pointer transition-all duration-200 active:scale-95
                ${isActive("/") ? "text-blue-600" : "text-gray-700"}
              `}
            />
          </Link>

          <Link to="/search">
            <Search
              size={40}
              className={`cursor-pointer transition-all duration-200 active:scale-95
                ${isActive("/search") ? "text-blue-600" : "text-gray-700"}
              `}
            />
          </Link>
        </div>

        {/* User */}
        <div className="col-span-1 flex justify-end">
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
