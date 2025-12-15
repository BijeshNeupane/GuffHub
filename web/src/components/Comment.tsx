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
        className="px-4 py-2 rounded-xl mb-4"
      >
        <div className="profile flex items-center gap-2">
          <div className="image h-8 w-8 rounded-full overflow-hidden">
            <Link to={`/user/${userId}`}>
              <img
                className="picture h-full w-full object-cover"
                src={profilePic}
                alt="profile"
              />
            </Link>
          </div>
          <p className="name font-bold hover:underline">
            <Link to={`/user/${userId}`}>{username}</Link>
          </p>
          <span className="text-gray-500">{time}</span>
        </div>

        <div className="comment mt-2">{text}</div>
      </div>
    </>
  );
};

export default Comment;
