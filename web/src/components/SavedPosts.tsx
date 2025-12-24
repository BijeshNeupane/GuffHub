import axiosInstance from "../config/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Heart, Loader, MessageSquare } from "lucide-react";
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

const SavedPosts = ({ userId }: { userId: string | null }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const openModal = (post: Post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      try {
        const { data } = await axiosInstance.get<{ posts: any }>(
          `/post/saved/${userId}`
        );
        setPosts(data.posts);
      } catch (error) {
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userId]);

  return (
    <div className="w-full">
      <div className="grid sm:grid-cols-3 grid-cols-2 gap-1 md:gap-4 sm:p-4 px-2 py-4">
        {loading ? (
          <div className="mt-10 col-span-3 flex justify-center">
            <Loader className="animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500 mt-10">
            No Saved posts found.
          </p>
        ) : (
          posts.map((post: any) => (
            <div
              key={post.post.id}
              className="aspect-square bg-gray-200 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition duration-200 relative group "
              onClick={() => openModal(post.post)}
            >
              {post.post.media && post.post.media.length > 0 && (
                <img
                  src={post.post.media[0].imageUrl}
                  alt={post.post.content.substring(0, 20)}
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                <div className="flex gap-4 text-white font-bold">
                  <div className="flex items-center gap-1">
                    <Heart size={20} fill="currentColor" />
                    <span>{post.post._count.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={20} />
                    <span>{post.post._count.comments}</span>
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

export default SavedPosts;
