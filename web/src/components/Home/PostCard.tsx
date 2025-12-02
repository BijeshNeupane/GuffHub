import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { Ellipsis, Heart, MessageSquare } from "lucide-react";
import axiosInstance from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { useState } from "react";

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

  const handleLike = async () => {
    setHasLiked(!hasLiked);
    setLikeCountState(hasLiked ? likeCountState - 1 : likeCountState + 1);
    try {
      const { data } = await axiosInstance.post(`/post/like`, {
        postId: id,
        userId: selfId,
      });
      toggleLike(id, selfId);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to like post");
    }
  };
  return (
    <div
      style={{ backgroundColor: colors.primary, color: colors.text }}
      className="card w-full px-6 py-4 rounded-2xl"
    >
      <div className="top flex items-center justify-between px-5">
        <div className="left flex items-center gap-2">
          <div className="profile rounded-full overflow-hidden">
            <Link to={`/user/${userId}`}>
              <img
                className="w-12 h-12 object-cover cursor-pointer hover:scale-110 transition-all duration-300"
                src={profilePic}
                alt="Profile"
              />
            </Link>
          </div>
          <div className="name">
            <Link className="hover:underline" to={`/user/${userId}`}>
              <h1 className="font-bold text-[22px]">{name}</h1>
            </Link>
            <p className="text-[12px]">{time}</p>
          </div>
        </div>
        <div className="right">
          <Ellipsis
            size={32}
            strokeWidth={3}
            className="cursor-pointer hover:text-blue-600 hover:-translate-y-[1px] active:scale-90 transition-all duration-200"
          />
        </div>
      </div>
      <div className="content mt-4">
        <p className="px-5 leading-5">{description}</p>
        <div className="image w-full">
          {image.length > 1 ? (
            <div
              style={{ backgroundColor: colors.primary }}
              className="relative w-full grid grid-cols-2 gap-2 overflow-hidden mt-2"
            >
              <img
                src={image[0]}
                alt=""
                className="col-span-1 h-full  rounded-xl object-cover cursor-pointer"
              />
              <img
                src={image[1]}
                alt=""
                className="col-span-1 h-full  rounded-xl object-cover cursor-pointer"
              />
            </div>
          ) : (
            <div className="relative w-full overflow-hidden rounded-xl bg-black mt-2">
              <img
                src={image[0]}
                alt=""
                className="w-full h-auto object-cover cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
      <div className="likes flex gap-40 items-center mt-4 px-5">
        <div className="likes flex items-center gap-2">
          <Heart
            size={34}
            fill={hasLiked ? "red" : "none"}
            stroke={hasLiked ? "red" : colors.text}
            className="cursor-pointer"
            onClick={() => {
              handleLike();
            }}
          />
          <span className="font-semibold text-xl">{likeCountState}</span>
        </div>
        <div className="comments flex items-center gap-2">
          <MessageSquare size={34} className="cursor-pointer" />
          <span className="font-semibold text-xl">{commentsCount}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
