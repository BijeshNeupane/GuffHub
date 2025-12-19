import { useAppSelector } from "../redux/hooks";

const Chat = () => {
  const { colors } = useAppSelector((state) => state.theme);
  return <div style={{ color: colors.text }}>Chat</div>;
};

export default Chat;
