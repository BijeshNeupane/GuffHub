import { Link } from "react-router-dom";

const SearchUser = ({
  id,
  name,
  username,
  profileImageUrl,
  handleImageError,
  colors,
}: {
  id: string;
  name: string;
  username: string;
  profileImageUrl: string;
  handleImageError: any;
  colors: any;
}) => {
  return (
    <Link to={`/user/${id}`}>
      <div
        style={{ backgroundColor: colors.primary, color: colors.text }}
        key={id}
        className="flex items-center justify-between p-3 rounded-xl transition-all hover:scale-[101%] active:scale-95 cursor-pointer"
        role="listitem"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <img
            className="sm:w-12 sm:h-12 w-10 h-10 rounded-full object-cover flex-shrink-0"
            src={profileImageUrl}
            alt={`${name}'s profile`}
            onError={handleImageError}
          />
          <div className="min-w-0 flex-1">
            <Link
              to={`/user/${id}`}
              className="hover:underline focus:underline focus:outline-none"
            >
              <h2 className="text-sm truncate">@{username}</h2>
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchUser;
