import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const Comment = ({
  // id,
  profilePic,
  time,
  text,
  userId,
  username,
}: {
  // id: string;
  profilePic: string;
  time: string;
  text: string;
  userId: string;
  username: string;
}) => {
  const { colors } = useAppSelector((state) => state.theme);
  return (
    <>
      <div
        style={{ backgroundColor: colors.background }}
        className="sm:px-4 sm:py-2 px-2 py-2 rounded-xl sm:mb-4 mb-3"
      >
        <div className="profile flex items-center sm:gap-2 gap-1">
          <div className="image sm:h-10 sm:w-10 h-7 w-7 rounded-full overflow-hidden">
            <Link to={`/user/${userId}`}>
              <img
                className="picture h-full w-full object-cover"
                src={profilePic}
                alt="profile"
              />
            </Link>
          </div>
          <div className="flex sm:gap-2 sm:flex-row flex-col gap-0">
            <p className="name font-bold hover:underline sm:text-[1rem] text-[0.8rem]">
              <Link to={`/user/${userId}`}>{username}</Link>
            </p>
            <span className="text-gray-500 sm:text-[0.9rem] text-[0.7rem]">
              {time}
            </span>
          </div>
        </div>

        <div className="comment mt-2 sm:text-[1rem] text-[0.8rem]">{text}</div>
      </div>
    </>
  );
};

export default Comment;
