// import { useLanguage } from "@/hooks/LanguageContext";
// import Image from "next/image";
// import russanaLogo from "../../assets/Images/Layer_1.png";
import "./homePagesHead.css";
import FlyingHeartWithWings from "../flyingHeartWithWings/FlyingHeartWithWings";

const HomePagesHead = () => {
  // const { t } = useLanguage();

  return (
    <div className="home-pages-head">
      <h1 className="main-slogan">მოგესალმებით საპიპინეთშიიიიიიიიიი !!! </h1>
      <div className="logo-container">
        <p className="sub-slogan">პიიიპ პიიიიპ!</p>
        {/* <Image
          src={russanaLogo}
          alt="Russana Logo"
          width={400}
          height={400}
          className="large-logo"
          priority
        /> */}
        {/* <FlyingHeartWithWings size={200}/>    */}
        <div className="FlyingHeartWithWings-container">
          <FlyingHeartWithWings size={200} />
        </div>

        <p className="sub-slogan">პიიიპ პიიიიპ!</p>
      </div>
    </div>
  );
};

export default HomePagesHead;
