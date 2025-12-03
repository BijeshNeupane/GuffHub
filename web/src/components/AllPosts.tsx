import axiosInstance from "../config/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AllPosts = ({ userId }: { userId: any }) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosInstance.get(`/post/${userId}`);
        setPosts(data.posts);
      } catch (error) {
        toast.error("Failed to load posts");
      }
    };
    fetchPosts();
  }, []);

  console.log(posts);

  console.log("UserId from AllPost is ", userId);
  return <div>AllPosts</div>;
};

export default AllPosts;
