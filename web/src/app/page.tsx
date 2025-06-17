import HomePagesHead from "@/components/homePagesHead/homePagesHead";
import HomePageShop from "@/components/homePageShop/homePageShop";
import TopItems from "@/components/TopItems/TopItems";
import PinkCharacter from "@/components/PinkCharacter/PinkCharacter";
// import HomePageAds from "@/components/home-page-ads/home-page-ads";

const Home = () => {
  return (
    <div>
      <HomePagesHead />

      <TopItems />
      {/* <HomePageAds /> */}
      <div
        className="site-timer-container"
        style={{ position: "relative", zIndex: 20 }}
      >
        {/* ...existing site-timer code... */}
      </div>
      <HomePageShop />
      <PinkCharacter />
    </div>
  );
};

export default Home;
