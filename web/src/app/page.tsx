import HomePagesHead from "@/components/homePagesHead/homePagesHead";
import HomePageShop from "@/components/homePageShop/homePageShop";
// import Navbar from "@/components/navbar/navbar";
import TopItems from "@/components/TopItems/TopItems";
const Home = () => {
  return (
    <div>
      <HomePagesHead />
      <TopItems />
      <div
        className="site-timer-container"
        style={{ position: "relative", zIndex: 20 }}
      >
        {/* ...existing site-timer code... */}
      </div>
      {/* <Navbar/> */}
      <HomePageShop />
    </div>
  );
};

export default Home;
