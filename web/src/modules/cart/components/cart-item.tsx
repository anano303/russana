import { CartItem as CartItemType } from "@/types/cart";
import { useCart } from "../context/cart-context";
import { useLanguage } from "@/hooks/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import "./cart-item.css";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { t, language } = useLanguage();

  // Display name based on selected language
  const displayName =
    language === "en" && item.nameEn ? item.nameEn : item.name;

  // Function to handle quantity updates with variant information
  const handleQuantityUpdate = (qty: number) => {
    updateQuantity(item.productId, qty, item.size, item.color, item.ageGroup);
  };

  // Function to handle item removal with variant information
  const handleRemoveItem = () => {
    removeItem(item.productId, item.size, item.color, item.ageGroup);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <Image
          src={item.image}
          alt={displayName}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <div className="cart-item-details">
        <div className="cart-item-info">
          <Link href={`/products/${item.productId}`} className="cart-item-name">
            {displayName}
          </Link>
          <p className="cart-item-price">{formatPrice(item.price)}</p>
          {/* Display variant information if available */}
          {(item.size || item.color || item.ageGroup) && (
            <div className="cart-item-variants">
              {item.size && (
                <span className="variant-tag">Size: {item.size}</span>
              )}
              {item.color && (
                <span className="variant-tag">Color: {item.color}</span>
              )}
              {item.ageGroup && (
                <span className="variant-tag">Age: {item.ageGroup}</span>
              )}
            </div>
          )}
        </div>
        <div className="cart-item-actions">
          <div className="cart-item-quantity">
            <select
              value={item.qty.toString()}
              onChange={(e) => handleQuantityUpdate(Number(e.target.value))}
            >
              {[...Array(item.countInStock)].map((_, i) => (
                <option key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="cart-item-total">
            <span className="cart-item-total-price">
              {formatPrice(item.price * item.qty)}
            </span>
            <button onClick={handleRemoveItem} className="remove-button">
              {t("cart.remove")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
