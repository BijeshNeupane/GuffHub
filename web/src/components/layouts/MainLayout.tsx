import BottomBar from "../BottomBar";
import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <BottomBar />
    </>
  );
};

export default MainLayout;
