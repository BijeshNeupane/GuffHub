import { useAppSelector } from "../redux/hooks";
import AllPosts from "../components/AllPosts";

const Profile = () => {
  const { id } = useAppSelector((state) => state.auth);

  return <AllPosts userId={id} />;
};

export default Profile;
