import { Suspense } from "react";
import ShopContent from "./ShopContent";
import HeartLoading from "@/components/HeartLoading/HeartLoading";

const ShopPage = () => {
  return (
    <div>
      <Suspense fallback={<HeartLoading size="medium" />}>
        <ShopContent />
      </Suspense>
    </div>
  );
};

export default ShopPage;
