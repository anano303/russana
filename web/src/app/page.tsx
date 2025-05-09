import HomePagesHead from "@/components/homePagesHead/homePagesHead";
import HomePageShop from "@/components/homePageShop/homePageShop";
// import Navbar from "@/components/navbar/navbar";
import TopItems from "@/components/TopItems/TopItems";
const Home = () => {
  return (
    <div>
      <HomePagesHead />
      <TopItems />
      {/* <Navbar/> */}
      <HomePageShop />
    </div>
  );
};

export default Home;
