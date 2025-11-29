import { useState, type ChangeEvent, type FormEvent } from "react";
import { useUser } from "@clerk/clerk-react";
import AuthNavbar from "../components/AuthNavbar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import axiosInstance from "../config/axiosInstance";
import toast from "react-hot-toast";
import { setHasAccount, setUser } from "../redux/features/auth/authSlice";
import { Router, useNavigate } from "react-router-dom";

export const CreateAccount: React.FC = () => {
  const { colors } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useUser();
  const [username, setUsername] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { hasAccount } = useAppSelector((state) => state.auth);
  console.log("acc", hasAccount);

  if (hasAccount) {
    setTimeout(() => navigate("/", { replace: true }), 0);
    return null;
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username) return setError("Username is required");
    if (!file) return setError("Profile image is required");
    if (!user) return setError("User not authenticated");
    if (!user.fullName)
      return setError("Could not retrieve full name, please try again later");

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username.trim());
      formData.append("clerkId", user.id);
      formData.append("fullName", user.fullName);
      formData.append("profileImage", file);

      const { data } = await axiosInstance.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(
        setUser({
          email: user.emailAddresses?.[0]?.emailAddress || "",
          fullName: user.fullName || "",
          id: data.id || "",
          clerkId: user.id || "",
          username: data.username || "",
          profileImage: data.profileImage || "",
        })
      );
      toast.success("Account created successfully!");
      dispatch(setHasAccount(true));
      setTimeout(() => navigate("/", { replace: true }), 0);
      return null;
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="absolute top-0 right-0 left-0">
        <AuthNavbar />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-sm mx-auto min-h-screen justify-center items-center py-20"
      >
        {error && <div className="text-red-500">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border-none outline-none p-2 rounded w-full "
        />
        <input
          style={{ color: colors.text }}
          className="w-full"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded disabled:opacity-50 w-full"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </>
  );
};
