import SavedPosts from "../components/SavedPosts";
import { useAppSelector } from "../redux/hooks";

const ProfileSaved = () => {
  const { id } = useAppSelector((state) => state.auth);

  return <SavedPosts userId={id} />;
};

export default ProfileSaved;
