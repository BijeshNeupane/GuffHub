import { useEffect, useState } from "react";
import { SignOutButton } from "@clerk/clerk-react";
import { useAppSelector } from "../../redux/hooks";
import { Link, Outlet, useLocation } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { Bookmark, Grid3x3, Loader } from "lucide-react";

const ProfileLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({} as any);
  const { colors } = useAppSelector((state) => state.theme);
  const { id, email } = useAppSelector((state) => state.auth);
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/${id}`);
        setProfile(data);
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{ color: colors.text }}
        className="flex justify-center h-full mt-40 text-3xl"
      >
        <Loader />
      </div>
    );
  }
  return (
    <div
      className="container"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <div className="flex flex-col items-center py-4">
        <div className="info flex items-center md:gap-4 sm:gap-3 gap-2">
          <div className="image md:h-40 md:w-40 sm:h-32 sm:w-32 h-24 w-24 rounded-full overflow-hidden mt-5 cursor-pointer">
            <img
              src={`${profile.profileImageUrl}`}
              alt="Profile picture"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text">
            <h2 className="md:text-3xl sm:text-2xl text-lg font-bold">
              {profile.username}
            </h2>
            <h3 className="text-sm text-gray-500 md:mt-1">
              {profile.fullName}
            </h3>

            <div className="post flex items-center md:gap-4 sm:gap-3 gap-2 sm:mt-2">
              <p className="sm:text-[0.875rem] text-[0.75rem]">
                {profile?.posts?.length}{" "}
                {profile?.posts?.length === 1 ? "Post" : "Posts"}
              </p>
              <p className="sm:text-[0.875rem] text-[0.75rem]">
                {profile?.followers?.length}{" "}
                {profile?.followers?.length === 1 ? "follower" : "followers"}
              </p>
              <p className="sm:text-[0.875rem] text-[0.75rem]">
                {profile?.following?.length}{" "}
                {profile?.following?.length === 1 ? "following" : "followings"}
              </p>
            </div>

            <p className="text-sm text-gray-500 sm:mt-2">{email}</p>
          </div>
        </div>
        <div className="flex items-center justify-center md:gap-4 sm:gap-3 gap-2 md:mt-5 mt-4">
          <div className="logout">
            <SignOutButton>
              <button className="bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200 active:scale-95 text-white rounded-xl md:px-8 sm:py-2 py-1 sm:px-6 px-4">
                Sign Out
              </button>
            </SignOutButton>
          </div>
          <div className="post">
            <Link to="/create-post">
              <button className="logout bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200 active:scale-95 text-white rounded-xl md:px-8 sm:py-2 py-1 sm:px-6 px-4">
                Create Post
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div
        style={{ borderColor: colors.shadow, borderBottomWidth: "2px" }}
        className="tabs flex items-center justify-center gap-4 my-4"
      >
        <div
          className={`allPost w-[200px] flex items-center justify-center md:py-4 sm:py-3 py-2 cursor-pointer ${
            pathname === "/profile" ? "border-b-2" : ""
          }`}
        >
          <Link to={"/profile"}>
            <Grid3x3 className="md:w-8 md:h-8 sm:w-7 sm:h-7 w-6 h-6" />
          </Link>
        </div>
        <div
          className={`allPost w-[200px] flex items-center justify-center md:py-4 sm:py-3 py-2 cursor-pointer ${
            pathname === "/profile/saved" ? "border-b-2" : ""
          }`}
        >
          <Link to={"/profile/saved"}>
            <Bookmark className="md:w-8 md:h-8 sm:w-7 sm:h-7 w-6 h-6 " />
          </Link>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default ProfileLayout;
