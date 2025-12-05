import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import axiosInstance from "../../config/axiosInstance";
import { useAppSelector } from "../../redux/hooks";
import timeFormatter from "../../helper/timeHelper";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import hasLiked from "../../helper/hasLiked";

const Center = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useAppSelector((state) => state.theme);
  const { id } = useAppSelector((state) => state.auth);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosInstance.get("/post");
        setPosts(data.posts);
      } catch (error) {
        toast.error("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const toggleLike = (postId: string, userId: string) => {
    setPosts((prev: any) =>
      prev.map((post: any) => {
        if (post.id !== postId) return post;

        const alreadyLiked = post.likes.some(
          (like: any) => like.userId === userId
        );

        let updatedLikes;
        if (alreadyLiked) {
          updatedLikes = post.likes.filter(
            (like: any) => like.userId !== userId
          );
        } else {
          updatedLikes = [...post.likes, { userId }];
        }

        return {
          ...post,
          likes: updatedLikes,

          _count: {
            ...post._count,
            likes: updatedLikes.length,
          },
        };
      })
    );
  };

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

  if (posts.length === 0) {
    return (
      <div
        style={{ color: colors.text }}
        className="flex justify-center h-full mt-40 text-3xl"
      >
        No posts available.
      </div>
    );
  }

  return (
    <div className="px-10 flex flex-col gap-10">
      {posts.map((post: any) => {
        return (
          <PostCard
            profilePic={post.author.profileImageUrl}
            name={post.author.username}
            time={timeFormatter(post.createdAt)}
            description={post.content}
            image={post.media.map((media: any) => media.imageUrl)}
            likesCount={post._count.likes}
            commentsCount={post._count.comments}
            liked={hasLiked(post.likes, id)}
            userId={post.authorId}
            id={post.id}
            key={post.id}
            toggleLike={toggleLike}
          />
        );
      })}
    </div>
  );
};

export default Center;
