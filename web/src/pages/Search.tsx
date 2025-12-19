import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { Loader, Search as SearchIcon, AlertCircle } from "lucide-react";
import axiosInstance from "../config/axiosInstance";
import SearchUser from "../components/SearchUser";

interface SearchUser {
  id: string;
  name: string;
  username: string;
  profileImageUrl: string;
}

const Search = () => {
  const { colors } = useAppSelector((state) => state.theme);

  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchText.trim()) {
      setSearchResults([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await axiosInstance.get<SearchUser[]>(
          `/user/search/${encodeURIComponent(searchText)}`
        );
        setSearchResults(data);
      } catch (err) {
        console.error(err);
        setError("No users found.");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s";
  };

  return (
    <div
      style={{ color: colors.text }}
      className="sm:container mx-auto pt-5 pb-5 sm:px-4 px-2"
    >
      <div className="flex items-center justify-center gap-4">
        <div className="relative w-full max-w-xl">
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchText}
            placeholder="Search users..."
            className="w-full border-none outline-none pl-10 pr-4 py-2 rounded-xl sm:text-xl text-md text-black transition-shadow"
            onChange={(e) => setSearchText(e.target.value)}
            aria-label="Search users"
          />
        </div>
      </div>

      <div className="max-w-xl sm:mt-10 mt-6 mx-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="animate-spin" size={32} />
            <span className="ml-2">Searching...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center gap-2 py-8">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && searchResults.length === 0 && searchText && (
          <p className="flex items-center justify-center py-8 text-gray-500">
            No users found for "{searchText}"
          </p>
        )}

        {!isLoading && !error && searchResults.length === 0 && !searchText && (
          <p className="flex items-center justify-center py-8 text-gray-500">
            Start typing to search for users
          </p>
        )}

        {!isLoading && !error && searchResults.length > 0 && (
          <div className="flex flex-col gap-2" role="list">
            {searchResults.map((user) => (
              <SearchUser
                colors={colors}
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                profileImageUrl={user.profileImageUrl}
                handleImageError={handleImageError}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
