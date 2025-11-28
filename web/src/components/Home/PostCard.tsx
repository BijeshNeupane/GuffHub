import { useAppSelector } from "../../redux/hooks";
import { Ellipsis, Heart, MessageSquare } from "lucide-react";

type postType = {
  profilePic: string;
  name: string;
  time: string;
  description: string;
  image: string;
  likesCount: number;
  commentsCount: number;
  liked: boolean;
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
}: postType) => {
  const { colors } = useAppSelector((state) => state.theme);
  return (
    <div
      style={{ backgroundColor: colors.primary, color: colors.text }}
      className="card w-full px-6 py-4 rounded-2xl"
    >
      <div className="top flex items-center justify-between px-5">
        <div className="left flex items-center gap-2">
          <div className="profile rounded-full overflow-hidden">
            <img
              className="w-12 h-12 object-cover cursor-pointer hover:scale-110 transition-all duration-300"
              src={profilePic}
              alt="Profile"
            />
          </div>
          <div className="name">
            <h1 className="font-bold text-[22px]">{name}</h1>
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
          <div className="relative w-full overflow-hidden rounded-xl bg-black mt-2 cursor-pointer">
            <img src={image} alt="" className="w-full h-auto object-cover" />
          </div>
        </div>
      </div>
      <div className="likes flex gap-40 items-center mt-4 px-5">
        <div className="likes flex items-center gap-2">
          <Heart
            size={34}
            fill={liked ? "red" : "none"}
            stroke={liked ? "red" : colors.text}
            className="cursor-pointer"
          />
          <span className="font-semibold text-xl">{likesCount}</span>
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
