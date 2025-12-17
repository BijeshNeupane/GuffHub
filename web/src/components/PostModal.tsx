import hasLiked from "../helper/hasLiked";
import { useAppSelector } from "../redux/hooks";
import timeHelper from "../helper/timeHelper";
import { useEffect, useState } from "react";
import type { Post } from "./AllPosts";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquare,
} from "lucide-react";
import axiosInstance from "../config/axiosInstance";
import toast from "react-hot-toast";
import Comment from "./Comment";

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

  const [allComments, setAllComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

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

  useEffect(() => {
    const fetchAllCommentsForPost = async () => {
      setCommentsLoading(true);
      try {
        const { data } = await axiosInstance.get(
          `/post/getAllComment/${post.id}`
        );
        setAllComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        toast.error("Failed to fetch comments");
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchAllCommentsForPost();
  }, []);

  const { username: postAuthor, profileImageUrl: postProfilePic } = post.author;
  const commentsCount = post._count.comments;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        style={{ backgroundColor: colors.primary }}
        className="relative flex sm:flex-row flex-col w-full max-w-4xl h-[90vh] rounded-xl overflow-hidden shadow-2xl"
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
          className="sm:w-1/2 sm:h-full w-full h-[50vh] flex items-center justify-center bg-black relative select-none overflow-hidden"
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
            className="flex h-full transition-transform duration-300 ease-out"
            style={{
              width: `${imageCount * 100}%`,
              transform: `translateX(-${currentImageIndex * 100}%)`,
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
                    : "opacity-0"
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

        <div className="sm:w-1/2 sm:h-full w-full h-[50vh] p-6 flex flex-col overflow-auto">
          {/* Header */}
          <div className="flex items-center gap-3 border-b pb-4 mb-4 flex-shrink-0">
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
            className="overflow-y-auto space-y-4 flex-shrink-0"
          >
            <p className="leading-relaxed">{post.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              Posted {timeHelper(post.createdAt)}
            </p>
          </div>

          <div className="pt-4 border-t mt-4 space-y-2 flex-shrink-0">
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
          </div>

          <div className="mt-4 pt-2 border-t flex-1 flex flex-col min-h-0">
            <p className="text-gray-500 font-bold text-md flex-shrink-0">
              {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
            </p>

            <div className="allComments pt-2  flex-1">
              {commentsLoading ? (
                <p className="h-28 flex items-center justify-center">
                  Loading comments ...
                </p>
              ) : allComments.length == 0 ? (
                <p className="h-28 flex items-center justify-center">
                  no comments
                </p>
              ) : (
                allComments.map((comment: any) => (
                  <Comment
                    key={comment.id}
                    profilePic={comment.user.profileImageUrl}
                    time={timeHelper(comment.createdAt)}
                    text={comment.text}
                    userId={comment.userId}
                    username={comment.user.username}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
