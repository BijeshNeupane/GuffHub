import axiosInstance from "../config/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import timeHelper from "../helper/timeHelper";
import {
  X,
  Heart,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import hasLiked from "../helper/hasLiked";
import { useAppSelector } from "../redux/hooks";

interface Media {
  imageUrl: string;
}

interface Post {
  id: string;
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

const PostModal = ({ post, onClose }: { post: Post; onClose: () => void }) => {
  const { colors } = useAppSelector((state) => state.theme);
  const { id: selfId } = useAppSelector((state) => state.auth);
  if (!post) return null;

  const [hasLikedState, setHasLikedState] = useState(
    hasLiked(post.likes, selfId)
  );
  const [likeCountState, setLikeCountState] = useState(post._count.likes);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;
  const imageCount = post.media.length;

  const handleLike = async () => {
    const newLikedState = !hasLikedState;
    setHasLikedState(newLikedState);
    setLikeCountState(newLikedState ? likeCountState + 1 : likeCountState - 1);

    try {
      await axiosInstance.post(`/post/like`, {
        postId: post.id,
        userId: selfId,
      });
    } catch (error) {
      console.error("Failed to like post:", error);
      toast.error("Failed to like post");
      setHasLikedState(!newLikedState);
      setLikeCountState(
        newLikedState ? likeCountState - 1 : likeCountState + 1
      );
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();

    setShowHeartOverlay(true);

    setTimeout(() => {
      setShowHeartOverlay(false);
    }, 800);

    if (!hasLikedState) {
      handleLike();
    }
  };

  const nextImage = () => {
    if (currentImageIndex < imageCount - 1) setCurrentImageIndex((p) => p + 1);
  };

  const prevImage = () => {
    if (currentImageIndex > 0) setCurrentImageIndex((p) => p - 1);
  };

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setTouchEnd(null);
    if ("targetTouches" in e) {
      setTouchStart(e.targetTouches[0].clientX);
    } else {
      setTouchStart((e as React.MouseEvent).clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if ("targetTouches" in e) {
      setTouchEnd(e.targetTouches[0].clientX);
    } else {
      setTouchEnd((e as React.MouseEvent).clientX);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();
  };

  const { username: postAuthor, profileImageUrl: postProfilePic } = post.author;
  const commentsCount = post._count.comments;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        style={{ backgroundColor: colors.primary }}
        className="relative flex w-full max-w-4xl max-h-[90vh] rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-gray-700 hover:bg-gray-900 rounded-full p-1 z-50 transition"
        >
          <X size={24} />
        </button>

        <div
          className="w-1/2 max-h-[90vh] flex items-center justify-center bg-black relative select-none overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onTouchStart}
          onMouseMove={(e) => {
            if (e.buttons === 1) onTouchMove(e);
          }}
          onMouseUp={onTouchEnd}
          style={{ cursor: imageCount > 1 ? "grab" : "default" }}
        >
          <div
            className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
              showHeartOverlay ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <Heart
              size={120}
              fill="red"
              stroke="none"
              className="drop-shadow-lg animate-ping-once"
            />
          </div>

          <div
            className="flex h-full w-full transition-transform duration-300 ease-out"
            style={{
              width: `${imageCount * 100}%`,
              transform: `translateX(-${
                currentImageIndex * (200 / imageCount)
              }%)`,
            }}
          >
            {post.media.map((mediaItem, index) => (
              <div
                key={index}
                className="min-w-[100%] h-full flex items-center justify-center"
              >
                <img
                  onDoubleClick={handleDoubleTap}
                  src={mediaItem.imageUrl}
                  alt={`post-img-${index}`}
                  draggable="false"
                  className="w-full h-full object-contain cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {imageCount > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                disabled={currentImageIndex === 0}
                className={`absolute top-1/2 left-2 -translate-y-1/2 p-2 z-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-opacity ${
                  currentImageIndex === 0
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100"
                }`}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                disabled={currentImageIndex === imageCount - 1}
                className={`absolute top-1/2 right-2 -translate-y-1/2 p-2 z-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-opacity ${
                  currentImageIndex === imageCount - 1
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100"
                }`}
              >
                <ChevronRight size={24} />
              </button>

              {/* Image Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {post.media.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentImageIndex === idx ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-1/2 p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 border-b pb-4 mb-4">
            <img
              src={postProfilePic}
              alt={postAuthor}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span style={{ color: colors.text }} className="font-bold text-lg">
              {postAuthor}
            </span>
          </div>

          <div
            style={{ color: colors.text }}
            className="flex-grow overflow-y-auto space-y-4"
          >
            <p className=" leading-relaxed">{post.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              Posted {timeHelper(post.createdAt)}
            </p>
          </div>

          <div className="pt-4 border-t mt-4 space-y-2">
            <div className="flex gap-4 items-center">
              <Heart
                style={{ color: colors.text }}
                size={34}
                fill={hasLikedState ? "red" : "none"}
                stroke={hasLikedState ? "red" : "currentColor"}
                className="cursor-pointer active:scale-90 transition-transform duration-200 hover:-translate-y-1"
                onClick={handleLike}
              />
              <MessageSquare
                style={{ color: colors.text }}
                size={34}
                className="cursor-pointer text-gray-500 hover:text-blue-600 transition-colors"
              />
            </div>

            <span className="font-bold text-md text-gray-500 block">
              {likeCountState} {likeCountState === 1 ? "like" : "likes"}
            </span>

            <div className="flex items-center gap-1 text-gray-500">
              <span className="font-semibold text-sm">
                View {commentsCount} comments
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AllPosts = ({ userId }: { userId: string }) => {
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
