import { Moon, Sun } from "lucide-react";
import { toggleTheme } from "../redux/features/theme/themeSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { colors, mode } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

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
        <div className="col-span-3 flex items-center justify-evenly px-40 gap-4"></div>

        {/* User */}
        <div className="col-span-1 flex justify-end gap-4">
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
