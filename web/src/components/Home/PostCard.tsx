import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import {
  Ellipsis,
  Heart,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axiosInstance from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import CommentModal from "../CommentModal";

type postType = {
  profilePic: string;
  name: string;
  time: string;
  description: string;
  image: string[];
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  userId: string;
  id: string;
  toggleLike: any;
};

const PostCard = ({
  profilePic,
  name,
  time,
  description,
  image,
  likesCount,
  commentsCount,
  liked,
  userId,
  id,
  toggleLike,
}: postType) => {
  const { colors } = useAppSelector((state) => state.theme);
  const { id: selfId } = useAppSelector((state) => state.auth);

  const [hasLiked, setHasLiked] = useState(liked);
  const [likeCountState, setLikeCountState] = useState(likesCount);
  const [commentCountState, setCommentCountState] = useState(commentsCount);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showHeartOverlay, setShowHeartOverlay] = useState(false);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const [commentModalOpen, setCommentModalOpen] = useState(false);

  const handleCommentCLick = () => {
    setCommentModalOpen(true);
  };

  useEffect(() => {
    if (commentModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [commentModalOpen]);

  const handleLike = async () => {
    const newLikedState = !hasLiked;
    setHasLiked(newLikedState);
    setLikeCountState(newLikedState ? likeCountState + 1 : likeCountState - 1);

    try {
      await axiosInstance.post(`/post/like`, { postId: id, userId: selfId });
      toggleLike(id, selfId);
    } catch (error) {
      console.log(error);
      toast.error("Failed to like post");
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();

    setShowHeartOverlay(true);

    setTimeout(() => {
      setShowHeartOverlay(false);
    }, 800);

    if (!hasLiked) {
      handleLike();
    }
  };

  const nextImage = () => {
    if (currentImageIndex < image.length - 1)
      setCurrentImageIndex((p) => p + 1);
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

  return (
    <div
      style={{ backgroundColor: colors.primary, color: colors.text }}
      className="card w-full md:px-6 sm:px-4 px-2 py-4 rounded-2xl"
    >
      <div className="top flex items-center justify-between sm:px-5 px-2">
        <div className="left flex items-center gap-2">
          <div className="profile rounded-full overflow-hidden">
            <Link to={`/user/${userId}`}>
              <img
                className="md:w-12 md:h-12 w-8 h-8 object-cover cursor-pointer hover:scale-110 transition-all duration-300"
                src={profilePic}
                alt="Profile"
              />
            </Link>
          </div>
          <div className="name">
            <Link className="hover:underline" to={`/user/${userId}`}>
              <h1 className="font-bold md:text-[22px] text-[16px]">{name}</h1>
            </Link>
            <p className="md:text-[12px] text-[10px]">{time}</p>
          </div>
        </div>
        <div className="right">
          <Ellipsis
            size={32}
            strokeWidth={3}
            className="cursor-pointer hover:text-blue-600 transition-all duration-200"
          />
        </div>
      </div>

      <div className="content mt-4">
        <p className="md:px-5 px-1 leading-5 text-[14px] md:text-[18px]">
          {description}
        </p>

        <div
          className="image w-full mt-2 relative overflow-hidden rounded-xl group select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onTouchStart}
          onMouseMove={(e) => {
            if (e.buttons === 1) onTouchMove(e);
          }}
          onMouseUp={onTouchEnd}
          style={{ cursor: image.length > 1 ? "grab" : "default" }}
        >
          <div
            className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
              showHeartOverlay ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <Heart
              size={100}
              fill="red"
              stroke="none"
              className="drop-shadow-lg animate-bounce"
            />
          </div>

          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {image.map((imgSrc, index) => (
              <div
                style={{ backgroundColor: colors.primary }}
                key={index}
                className="min-w-full flex justify-center relative mt-2"
              >
                <img
                  onDoubleClick={handleDoubleTap}
                  src={imgSrc}
                  alt={`post-img-${index}`}
                  draggable="false"
                  className="w-full h-auto max-h-[500px] object-contain"
                />
              </div>
            ))}
          </div>

          {image.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                disabled={currentImageIndex === 0}
                className={`absolute top-1/2 left-2 -translate-y-1/2 p-1.5 z-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-opacity ${
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
                disabled={currentImageIndex === image.length - 1}
                className={`absolute top-1/2 right-2 -translate-y-1/2 p-1.5 z-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-opacity ${
                  currentImageIndex === image.length - 1
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100"
                }`}
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-9">
                {image.map((_, idx) => (
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
      </div>

      <div className="likes flex md:gap-40 gap-4 items-center mt-4 sm:px-5 px-1">
        <div className="likes flex items-center gap-2">
          <Heart
            fill={hasLiked ? "red" : "none"}
            stroke={hasLiked ? "red" : colors.text}
            className="md:w-8 md:h-8 w-6 h-6 cursor-pointer active:scale-90 transition-transform duration-200 hover:-translate-y-1"
            onClick={handleLike}
          />
          <span className="font-semibold sm:text-xl text-lg">
            {likeCountState}
          </span>
        </div>
        <div className="comments flex items-center gap-2">
          <MessageSquare
            className="md:w-8 md:h-8 w-6 h-6 cursor-pointer hover:text-blue-600"
            onClick={() => handleCommentCLick()}
          />
          <span className="font-semibold sm:text-xl text-lg">
            {commentCountState}
          </span>
        </div>
      </div>
      {commentModalOpen && (
        <CommentModal
          id={id}
          // profilePic={profilePic}
          // name={name}
          time={time}
          description={description}
          image={image}
          onClose={() => setCommentModalOpen(false)}
          // userId={userId}
          setCommentCountState={setCommentCountState}
        />
      )}
    </div>
  );
};

export default PostCard;

// old one

// import { Link } from "react-router-dom";
// import { useAppSelector } from "../../redux/hooks";
// import { Ellipsis, Heart, MessageSquare } from "lucide-react";
// import axiosInstance from "../../config/axiosInstance";
// import toast from "react-hot-toast";
// import { useState } from "react";

// type postType = {
//   profilePic: string;
//   name: string;
//   time: string;
//   description: string;
//   image: string[];
//   likesCount: number;
//   commentsCount: number;
//   liked: boolean;
//   userId: string;
//   id: string;
//   toggleLike: any;
// };

// const PostCard = ({
//   profilePic,
//   name,
//   time,
//   description,
//   image,
//   likesCount,
//   commentsCount,
//   liked,
//   userId,
//   id,
//   toggleLike,
// }: postType) => {
//   const { colors } = useAppSelector((state) => state.theme);
//   const { id: selfId } = useAppSelector((state) => state.auth);
//   const [hasLiked, setHasLiked] = useState(liked);
//   const [likeCountState, setLikeCountState] = useState(likesCount);

//   const handleLike = async () => {
//     setHasLiked(!hasLiked);
//     setLikeCountState(hasLiked ? likeCountState - 1 : likeCountState + 1);
//     try {
//       const { data } = await axiosInstance.post(`/post/like`, {
//         postId: id,
//         userId: selfId,
//       });
//       toggleLike(id, selfId);
//       console.log(data);
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to like post");
//     }
//   };
//   return (
//     <div
//       style={{ backgroundColor: colors.primary, color: colors.text }}
//       className="card w-full px-6 py-4 rounded-2xl"
//     >
//       <div className="top flex items-center justify-between px-5">
//         <div className="left flex items-center gap-2">
//           <div className="profile rounded-full overflow-hidden">
//             <Link to={`/user/${userId}`}>
//               <img
//                 className="w-12 h-12 object-cover cursor-pointer hover:scale-110 transition-all duration-300"
//                 src={profilePic}
//                 alt="Profile"
//               />
//             </Link>
//           </div>
//           <div className="name">
//             <Link className="hover:underline" to={`/user/${userId}`}>
//               <h1 className="font-bold text-[22px]">{name}</h1>
//             </Link>
//             <p className="text-[12px]">{time}</p>
//           </div>
//         </div>
//         <div className="right">
//           <Ellipsis
//             size={32}
//             strokeWidth={3}
//             className="cursor-pointer hover:text-blue-600 hover:-translate-y-[1px] active:scale-90 transition-all duration-200"
//           />
//         </div>
//       </div>
//       <div className="content mt-4">
//         <p className="px-5 leading-5">{description}</p>
//         <div className="image w-full">
//           {image.length > 1 ? (
//             <div
//               style={{ backgroundColor: colors.primary }}
//               className="relative w-full grid grid-cols-2 gap-2 overflow-hidden mt-2"
//             >
//               <img
//                 src={image[0]}
//                 alt=""
//                 className="col-span-1 h-full  rounded-xl object-cover cursor-pointer"
//               />
//               <img
//                 src={image[1]}
//                 alt=""
//                 className="col-span-1 h-full  rounded-xl object-cover cursor-pointer"
//               />
//             </div>
//           ) : (
//             <div className="relative w-full overflow-hidden rounded-xl bg-black mt-2">
//               <img
//                 src={image[0]}
//                 alt=""
//                 className="w-full h-auto object-cover cursor-pointer"
//               />
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="likes flex gap-40 items-center mt-4 px-5">
//         <div className="likes flex items-center gap-2">
//           <Heart
//             size={34}
//             fill={hasLiked ? "red" : "none"}
//             stroke={hasLiked ? "red" : colors.text}
//             className="cursor-pointer"
//             onClick={() => {
//               handleLike();
//             }}
//           />
//           <span className="font-semibold text-xl">{likeCountState}</span>
//         </div>
//         <div className="comments flex items-center gap-2">
//           <MessageSquare size={34} className="cursor-pointer" />
//           <span className="font-semibold text-xl">{commentsCount}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PostCard;
