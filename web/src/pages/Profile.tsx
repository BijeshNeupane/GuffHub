import { useEffect, useState } from "react";
import { SignOutButton } from "@clerk/clerk-react";
import { useAppSelector } from "../redux/hooks";
import { Link } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import AllPosts from "../components/AllPosts";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({} as any);
  const { colors } = useAppSelector((state) => state.theme);
  const { id, email } = useAppSelector((state) => state.auth);
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
      <div className="flex flex-col items-center">
        <div className="info flex items-center gap-4">
          <div className="image h-40 w-40 rounded-full overflow-hidden mt-5 cursor-pointer">
            <img
              src={`${profile.profileImageUrl}`}
              alt="Profile picture"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text">
            <h2 className="text-3xl font-bold">{profile.username}</h2>
            <h3 className="text-sm text-gray-500 mt-1">{profile.fullName}</h3>

            <div className="post flex items-center  gap-4 mt-2">
              <p className="text-sm">
                {profile?.posts?.length}{" "}
                {profile?.posts?.length === 1 ? "Post" : "Posts"}
              </p>
              <p className="text-sm">
                {profile?.followers?.length}{" "}
                {profile?.followers?.length === 1 ? "follower" : "followers"}
              </p>
              <p className="text-sm">
                {profile?.following?.length}{" "}
                {profile?.following?.length === 1 ? "following" : "followings"}
              </p>
            </div>

            <p className="text-sm text-gray-500 mt-2">{email}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-5">
          <div className="logout">
            <SignOutButton>
              <button className="bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200 active:scale-95 text-white rounded-xl px-8 py-2">
                Sign Out
              </button>
            </SignOutButton>
          </div>
          <div className="post">
            <Link to="/create-post">
              <button className="logout bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200 active:scale-95 text-white rounded-xl px-8 py-2">
                Create Post
              </button>
            </Link>
          </div>
        </div>
      </div>

      <AllPosts userId={id} />
    </div>
  );
};

export default Profile;
