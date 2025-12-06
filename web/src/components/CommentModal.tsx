import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { useState } from "react";
import { X } from "lucide-react";

type CommentModalProps = {
  id: string;
  onClose: () => void;
  profilePic: string;
  name: string;
  time: string;
  description: string;
  image: string[];
  userId: string;
};

const CommentModal = ({
  id,
  onClose,
  profilePic,
  name,
  time,
  description,
  image,
  userId,
}: CommentModalProps) => {
  const { colors } = useAppSelector((state) => state.theme);

  const [comment, setComment] = useState("");
  console.log(id);

  const handleCommentType = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.length <= 100) {
      setComment(value);
    }
  };

  return (
    <div
      onClick={onClose}
      className="z-30 fixed inset-0 bg-black/45 flex justify-center items-center p-4 h-full "
    >
      <div
        className="cross bg-gray-800 p-2 rounded-full text-white absolute top-8 right-60 cursor-pointer hover:scale-110 transition-all duration-300 active:scale-95"
        onClick={() => onClose()}
      >
        <X />
      </div>
      <div
        style={{ backgroundColor: colors.background }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-xl p-4 w-full max-w-md "
      >
        <div className="profile flex items-center">
          <Link to={`/user/${userId}`}>
            <div className="imgDiv w-12 h-12 rounded-full cursor-pointer overflow-hidden">
              <img
                src={profilePic}
                alt="profile"
                className="h-full w-full object-cover"
              />
            </div>
          </Link>
          <div className="name ml-4">
            <h2 className="text-[16px]">{name}</h2>
            <p className="text-sm text-gray-500">{time}</p>
          </div>
        </div>
        <div className="content mt-4 flex items-center gap-4">
          <div className="h-auto w-16 rounded-xl overflow-hidden">
            <img
              src={image[0]}
              alt="post"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="description w-1/2 text-nowrap overflow-hidden text-ellipsis">
            {description}
          </div>
        </div>

        <div className="comment mt-6">
          <p className="text-sm mb-2 pl-2 text-gray-500">
            Length: {comment.length}, max: 100
          </p>
          <textarea
            style={{ backgroundColor: colors.primary }}
            className="w-full h-28 rounded-xl resize-none border-none outline-none px-4 py-2"
            placeholder="Enter Your Comment"
            value={comment}
            onChange={(e) => handleCommentType(e)}
          />

          <button className="w-full px-4 py-2 rounded-xl mt-2 bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all duration-300 text-white text-xl">
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
