import Center from "../components/Home/Center";
import Left from "../components/Home/Left";
import Right from "../components/Home/Right";

const Home = () => {
  return (
    <div className="container grid grid-cols-5 pt-5 pb-5">
      <div className="left col-span-1 md:block hidden">
        <Left />
      </div>
      <div className="middle md:col-span-3 col-span-5">
        <Center />
      </div>
      <div className="right col-span-1  md:block hidden">
        <Right />
      </div>
    </div>
  );
};

export default Home;
