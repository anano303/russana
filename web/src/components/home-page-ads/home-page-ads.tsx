"use client";

import AdSlideshow from "../ad-slideshow/ad-slideshow";
import "./home-page-ads.css";
// Sample ad data - replace with your actual advertisements
const adSlides = [
  {
    id: 1,
    imageUrl: "/sale1.jpg", // Replace with your actual image paths
    title: "ახალი კოლექცია",
    description: "პიპ! პიიიპ! ახალი პიპინები გელოდება!",
    link: "/shop?collection=new",
  },
  {
    id: 2,
    imageUrl: "/sale2.jpg",
    title: "ფასდაკლება 30 % - მდე",
    description: "გამოიყენეთ შესაძლებლობა ამ კვირაში",
    link: "/shop?sale=true",
  },
  {
    id: 3,
    imageUrl: "/sale3.jpg",
    title: "მეგობრები",
    description: "გაეცანით ჩვენს პარტნიორებს",
    link: "/partners",
  },
];

export default function HomePageAds() {
  return (
    <div className="home-page-ads">
      {/* <h2 className="ads-heading">შეთავაზებები</h2> */}
      <AdSlideshow slides={adSlides} autoplaySpeed={6000} height="400px" />
    </div>
  );
}
