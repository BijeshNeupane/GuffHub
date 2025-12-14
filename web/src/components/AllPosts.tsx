import axiosInstance from "../config/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Heart, MessageSquare } from "lucide-react";
import PostModal from "./PostModal";

interface Media {
  imageUrl: string;
}

export interface Post {
  id: string | null;
  author: {
    username: string;
    profileImageUrl: string;
  };
  content: string;
  createdAt: string;
  media: Media[];
  likes: any[];
  _count: {
    comments: number;
    likes: number;
    saves: number;
  };
}

const AllPosts = ({ userId }: { userId: string | null }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const openModal = (post: Post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosInstance.get<{ posts: Post[] }>(
          `/post/${userId}`
        );
        setPosts(data.posts);
      } catch (error) {
        toast.error("Failed to load posts");
      }
    };
    fetchPosts();
  }, [userId]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-1 md:gap-4 p-4">
        {posts.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500 mt-10">
            No posts found for this user.
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="aspect-square bg-gray-200 overflow-hidden cursor-pointer hover:opacity-80 transition duration-200 relative group"
              onClick={() => openModal(post)}
            >
              {post.media && post.media.length > 0 && (
                <img
                  src={post.media[0].imageUrl}
                  alt={post.content.substring(0, 20)}
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                <div className="flex gap-4 text-white font-bold">
                  <div className="flex items-center gap-1">
                    <Heart size={20} fill="currentColor" />
                    <span>{post._count.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={20} />
                    <span>{post._count.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPost && <PostModal post={selectedPost} onClose={closeModal} />}
    </div>
  );
};

export default AllPosts;
