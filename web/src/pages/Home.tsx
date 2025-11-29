import Center from "../components/Home/Center";
import Left from "../components/Home/Left";
import Right from "../components/Home/Right";

const Home = () => {
  return (
    <div className="container grid grid-cols-5 pt-10 pb-10">
      <div className="left col-span-1">
        <Left />
      </div>
      <div className="middle col-span-3 ">
        <Center />
      </div>
      <div className="right col-span-1  ">
        <Right />
      </div>
    </div>
  );
};

export default Home;
