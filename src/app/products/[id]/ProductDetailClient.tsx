"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";

// PRODUCTS ARRAY - Updated with new data
const products = [
  {
    id: "pilot-custom-98",
    name: "Pilot Custom 98 – FK1MR",
    price: "Rs.10,000",
    priceValue: 10000,
    image: "/products/pilot-custom-98.png",
    colors: ["#000000", "#8b0000"],
    inkColors: ["#000000"],
    penType: "Fountain Pen",
    brand: "Pilot",
    personalization: ["Can Be Engraved"],
    gallery: ["/pilot/pilot-custom1.png", "/pilot/pilot-custom2.png", "/pilot/pilot-custom3.png"],
    description: "The Pilot Custom 98 – FK1MR is a classic fountain pen featuring a 14K gold nib for an exceptional writing experience. This vintage-inspired pen combines traditional craftsmanship with modern reliability.",
    features: [
      "14K Gold nib for smooth writing",
      "Classic design with premium finish",
      "Includes 1 cartridge",
      "Compatible with Con-40 and older Con-20 converters",
      "Snap cap for quick access",
      "Lightweight at just 15.18g"
    ]
  },
  {
    id: "lamy-safari",
    name: "Lamy Safari Fountain Pen",
    price: "Rs.10,000",
    priceValue: 10000,
    image: "/products/lamy-safari.png",
    colors: ["#000000", "#0000ff", "#ff0000", "#ffffff"],
    inkColors: ["#0000ff"],
    penType: "Fountain Pen",
    brand: "Lamy",
    personalization: ["Can Be Engraved"],
    gallery: ["/lamy/lamy-safari1.png", "/lamy/lamy-safari2.png", "/lamy/lamy-safari3.png", "/lamy/lamy-safari4.png"],
    description: "The Lamy Safari is a modern classic, known for its functional design and durability. Made from high-quality ABS plastic, this pen is perfect for daily use and features a polished stainless steel nib.",
    features: [
      "Polished stainless steel nib",
      "Durable ABS plastic construction",
      "Ink window to check ink level",
      "Snap cap for convenience",
      "Ergonomic grip section",
      "Brand new condition"
    ]
  },

  // Shirts
  {
    id: "classic-white-blue-check",
    name: "Classic White and Blue Premium Check Shirt",
    price: "Rs.3,990",
    priceValue: 3990,
    image: "/products/shirt1.png",
    colors: ["#ffffff", "#0000ff"],
    sizes: ["M", "L", "XL"],
    productType: "Shirt",
    brand: "Premium Collection",
    personalization: ["Not Available"],
    gallery: ["/shirts/shirts1-1.png", "/shirts/shirts1-2.png", "/shirts/shirts1-3.png",],
    description: "Elevate your wardrobe with this Classic White and Blue Premium Check Shirt. Featuring a timeless check design and regular fit, this shirt is perfect for both office and casual outings.",
    features: [
      "Classic check design pattern",
      "Regular fit for comfort",
      "Button-down collar",
      "Full sleeves",
      "Premium cotton blend fabric",
      "Perfect for office wear, smart casual, and casual outings",
      "Available in M, L, and XL"
    ]
  },
  {
    id: "classic-grey-check",
    name: "Classic Grey Check Premium Shirt",
    price: "Rs.3,990",
    priceValue: 3990,
    image: "/products/shirt2.png",
    colors: ["#808080", "#ffffff", "#000080"],
    sizes: ["M", "L", "XL"],
    productType: "Shirt",
    brand: "Premium Collection",
    personalization: ["Not Available"],
    gallery: ["/shirts/shirts2-1.png", "/shirts/shirts2-2.png", "/shirts/shirts2-3.png", "/shirts/shirts2-4.png"],
    description: "Make a sophisticated statement with this Classic Grey Check Premium Shirt. The micro check design in grey, white, and navy creates a refined look suitable for any occasion.",
    features: [
      "Micro check design pattern",
      "Regular fit for comfort",
      "Button-down collar",
      "Full sleeves",
      "Premium cotton blend fabric",
      "Perfect for office wear and smart casual",
      "Available in M, L, and XL"
    ]
  },
  {
    id: "sky-blue-check",
    name: "Sky Blue Check Premium Shirt",
    price: "Rs.3,990",
    priceValue: 3990,
    image: "/products/shirt3.png",
    colors: ["#87ceeb", "#ffffff"],
    sizes: ["M", "L", "XL"],
    productType: "Shirt",
    brand: "Premium Collection",
    personalization: ["Not Available"],
    gallery: ["/shirts/shirts3-1.png", "/shirts/shirts3-2.png"],
    description: "Stay fresh and stylish with this Sky Blue Check Premium Shirt. The classic windowpane check pattern and breathable 100% cotton fabric make it an essential addition to any wardrobe.",
    features: [
      "Classic windowpane check pattern",
      "Regular fit for comfort",
      "Premium quality breathable fabric",
      "100% cotton material",
      "Full sleeves",
      "Available in M, L, and XL"
    ]
  },
  {
    id: "navy-plaid",
    name: "Navy Blue and White Plaid Premium Shirt",
    price: "Rs.3,990",
    priceValue: 3990,
    image: "/products/shirt4.png",
    colors: ["#000080", "#ffffff", "#008000"],
    sizes: ["M", "L", "XL"],
    productType: "Shirt",
    brand: "Premium Collection",
    personalization: ["Not Available"],
    gallery: ["/shirts/shirts4-1.png", "/shirts/shirts4-2.png", "/shirts/shirts4-3.png"],
    description: "Add a touch of classic elegance with this Navy Blue and White Plaid Premium Shirt. The traditional tartan check in navy, white, and green creates a timeless and versatile look.",
    features: [
      "Classic plaid/tartan check design",
      "Regular fit for comfort",
      "Premium quality breathable fabric",
      "Full sleeves",
      "Perfect for casual and smart casual occasions",
      "Available in M, L, and XL"
    ]
  },
  {
    id: "light-esthetic-green",
    name: "Plain Light Esthetic Green Shirt",
    price: "Rs.3,990",
    priceValue: 3990,
    image: "/products/shirt5.png",
    colors: ["#90ee90"],
    sizes: ["M", "L", "XL"],
    productType: "Shirt",
    brand: "Premium Collection",
    personalization: ["Not Available"],
    gallery: ["/shirts/shirts5-1.png", "/shirts/shirts5-2.png", "/shirts/shirts5-3.png"],
    description: "Keep it simple and sophisticated with this Plain Light Esthetic Green Shirt. The clean, minimalist design and comfortable cotton fabric make it perfect for any occasion.",
    features: [
      "Plain design for minimalist style",
      "Regular fit for comfort",
      "Premium quality breathable cotton fabric",
      "Full sleeves",
      "All-day comfort",
      "Available in M, L, and XL"
    ]
  },
  {
    id: "pink-white-stripe",
    name: "Pink and White Vertical Stripe Premium Shirt",
    price: "Rs.3,990",
    priceValue: 3990,
    image: "/products/shirt6.png",
    colors: ["#ffb6c1", "#ffffff"],
    sizes: ["M", "L", "XL"],
    productType: "Shirt",
    brand: "Premium Collection",
    personalization: ["Not Available"],
    gallery: ["/shirts/shirts6-1.png", "/shirts/shirts6-2.png", "/shirts/shirts6-3.png", "/shirts/shirts6-4.png", "/shirts/shirts6-5.png", "/shirts/shirts6-6.png"],
    description: "Make a stylish impression with this Pink and White Vertical Stripe Premium Shirt. The classic vertical stripe design in blush pink and white, combined with premium linen fabric, creates a sophisticated look.",
    features: [
      "Classic vertical stripe design",
      "Regular fit for comfort",
      "Premium quality with full linen",
      "Full sleeves",
      "Perfect for smart casual occasions",
      "Available in M, L, and XL"
    ]
  }
];

export default function ProductDetailClient({ productId }: { productId: string }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  // CURRENT PRODUCT 
  const product = products.find((p) => p.id === productId) || products[0];
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );

  const isShirt =
    product.productType?.toLowerCase() === "shirt" ||
    (product as any).penType?.toLowerCase() === "shirt";
  const availableSizes = isShirt
    ? product.sizes && product.sizes.length > 0
      ? product.sizes
      : ["XS", "S", "M", "L", "XL", "XXL"]
    : [];

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    setSizeError(null);
  };

  const validateAndGetItem = () => {
    if (isShirt && !selectedSize) {
      setSizeError("Please select a shirt size before continuing.");
      return null;
    }
    setSizeError(null);

    const itemId = `${product.id}${selectedColor ? `-${selectedColor}` : ""}${
      selectedSize ? `-${selectedSize}` : ""
    }`;

    return {
      id: itemId,
      productId: product.id,
      name: product.name,
      price: Number(product.price.replace(/[^0-9]/g, "")),
      image: product.image,
      quantity: qty,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
    };
  };

  // Use product.image as the main image, and product.gallery for thumbnails
  const [mainImage, setMainImage] = useState(product.image);

  // Use product gallery if available, otherwise use image as fallback
  const productGallery = product.gallery || [product.image];

  // RELATED PRODUCTS
  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.id !== productId)
      .slice(0, 4);
  }, [productId]);

  // Get product type label
  const getProductType = () => {
    if (product.penType) return product.penType;
    if (product.productType) return product.productType;
    return "Product";
  };

  // Get writing type for pens
  const getWritingType = () => {
    if (product.penType) return product.penType;
    return "N/A";
  };

  // Get brand
  const getBrand = () => {
    return product.brand || "Premium Collection";
  };

  return (
    <main className="bg-[#f5f1eb] w-full min-h-screen">
      <Navbar />

      {/* MAIN */}
      <section className="w-full py-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-16">
          <div className="grid md:grid-cols-[100px_1fr_1fr] gap-6 md:gap-10">

            {/* THUMBNAILS - Horizontal scroll for narrow screens */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide">
              {productGallery.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  onClick={() => setMainImage(img)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 border p-1 cursor-pointer transition-all ${
                    mainImage === img ? "border-black scale-105" : "border-[#e2d8cc]"
                  }`}
                >
                  <img src={img} alt={`Thumbnail view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* IMAGE */}
            <div className="flex justify-center items-center">
              <img
                src={mainImage}
                alt={product.name}
                className="w-[180px] md:w-[250px] object-contain"
              />
            </div>

            {/* DETAILS */}
            <div>
              <h1 className="text-xl sm:text-2xl md:text-[30px] font-serif font-bold text-black leading-tight">
                {product.name}
              </h1>

              {/* Brand and Type */}
              <div className="mt-2 flex flex-wrap gap-2 text-[13px] text-[#5a5a5a]">
                <span className="font-semibold">Brand:</span> {getBrand()}
                <span className="mx-1">|</span>
                <span className="font-semibold">Type:</span> {getProductType()}
              </div>

              <p className="mt-2 text-[13px] text-[#5a5a5a]">
                {product.description ? product.description.substring(0, 120) + "..." : "Premium quality product crafted with attention to detail."}
              </p>

              <div className="mt-3 text-[12px] flex gap-2">
                <span className="text-[#c5a25f]">★★★★★</span>
                <span>5.0</span>
                <span>(128 Reviews)</span>
              </div>

              <div className="mt-1 flex gap-2 text-[12px]">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                <span className="text-green-600">In Stock</span>
              </div>

              <p className="mt-4 text-2xl sm:text-[28px] text-[#c5a25f] font-semibold">
                {product.price}
              </p>

              {/* COLORS */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <p className="text-[13px] font-semibold text-[#7a2d2d]">
                    Colors:
                  </p>
                  <div className="flex gap-3 mt-2 flex-wrap">
                    {product.colors.map((c) => {
                      const isSelected = selectedColor === c;
                      return (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`w-6 h-6 rounded-full border transition-all duration-200 cursor-pointer
                            ${isSelected ? "ring-2 ring-black scale-110" : "hover:scale-105"}`}
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SIZES - For shirts */}
              {isShirt && (
                <div className="mt-4">
                  <div className="flex items-center justify-between max-w-[320px]">
                    <p className="text-[13px] font-semibold text-[#7a2d2d]">
                      Size:
                    </p>
                    {selectedSize && (
                      <span className="text-[13px] font-medium text-black">
                        Selected: <span className="font-bold text-[#7a2d2d]">{selectedSize}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {availableSizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSelectSize(size)}
                          className={`px-4 py-1.5 border rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "bg-[#7a2d2d] text-white border-[#7a2d2d] shadow-sm scale-105"
                              : "border-[#c5a25f] text-[#7a2d2d] hover:bg-[#c5a25f] hover:text-white"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {sizeError && (
                    <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
                      <i className="fa-solid fa-circle-exclamation"></i>
                      {sizeError}
                    </p>
                  )}
                </div>
              )}

              {/* WRITING TYPE - For pens */}
              {product.penType && (
                <p className="mt-4 text-[13px]">
                  <span className="font-semibold text-[#7a2d2d]">
                    Writing Type:
                  </span>{" "}
                  <span className="text-black font-medium">{getWritingType()}</span>
                </p>
              )}

              {/* INK COLORS - For pens */}
              {product.inkColors && product.inkColors.length > 0 && (
                <p className="mt-2 text-[13px]">
                  <span className="font-semibold text-[#7a2d2d]">
                    Ink Color:
                  </span>{" "}
                  <span className="text-black font-medium">{product.inkColors.join(", ")}</span>
                </p>
              )}

              {/* PERSONALIZATION */}
              {product.personalization && product.personalization.length > 0 && (
                <div className="mt-3">
                  <p className="text-[13px] font-semibold text-[#7a2d2d]">
                    Personalization:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.personalization.map((item) => (
                      <span key={item} className="text-[12px] bg-[#e2d8cc] px-2 py-1 rounded-full text-[#5a5a5a]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* QUANTITY */}
              <div className="mt-4 flex items-center border border-[#c5a25f] rounded-full w-fit px-4 py-1.5 gap-4">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-6 h-6 flex items-center justify-center rounded-full border border-[#c5a25f] text-[#7a2d2d] text-sm cursor-pointer hover:bg-[#c5a25f] hover:text-white"
                >
                  -
                </button>

                <span className="text-[16px] font-semibold text-black min-w-[20px] text-center">
                  {qty}
                </span>

                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-6 h-6 flex items-center justify-center rounded-full border border-[#c5a25f] text-[#7a2d2d] text-sm cursor-pointer hover:bg-[#c5a25f] hover:text-white"
                >
                  +
                </button>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                <button 
                  onClick={() => {
                    const item = validateAndGetItem();
                    if (!item) return;
                    const query = encodeURIComponent(JSON.stringify(item));
                    router.push(`/checkout?buyNow=${query}`);
                  }}
                  className="flex-1 bg-transparent border border-[#7a2e2e] text-[#7a2e2e] py-3 sm:py-2.5 text-sm font-semibold rounded-full cursor-pointer hover:bg-[#7a2e2e] hover:text-white transition"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => {
                    const item = validateAndGetItem();
                    if (!item) return;
                    addToCart(item);
                  }}
                  className="flex-1 bg-[#c6a55c] text-[#7a2e2e] py-3 sm:py-2.5 text-sm font-semibold rounded-full cursor-pointer hover:bg-[#b8964f] transition flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-cart-shopping"></i> Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT DETAILS */}
      <section className="w-full bg-[#d6cec4] py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-10 md:px-20">

          <h2 className="text-center text-[#7a2e2e] text-[22px] font-serif font-semibold mb-14">
            Product Details
          </h2>

          <div className="grid md:grid-cols-2 gap-8 md:gap-24 text-[13px] leading-7">

            {/* DESCRIPTION */}
            <div>
              <h3 className="font-semibold text-[16px] mb-4 text-black">
                Description
              </h3>

              <p className="text-[#3f3f3f] text-[15px]">
                {product.description || "This premium product is crafted with the finest materials and attention to detail, ensuring exceptional quality and performance."}
              </p>
            </div>

            {/* FEATURES */}
            <div>
              <h3 className="font-semibold text-[16px] mb-4 text-black">
                Features
              </h3>

              {product.features && product.features.length > 0 ? (
                <ul className="list-disc ml-4 space-y-2 text-[#3f3f3f] text-[15px]">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              ) : (
                <ul className="list-disc ml-4 space-y-2 text-[#3f3f3f] text-[15px]">
                  <li>Premium quality craftsmanship</li>
                  <li>Durable and long-lasting materials</li>
                  <li>Elegant design for any occasion</li>
                  <li>Perfect for gifting</li>
                  <li>Comes in a premium gift box</li>
                </ul>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="py-12 px-4 md:px-16">
        <h3 className="text-center text-[#7a2e2e] text-[20px] mb-8 text-sm font-semibold">
          You May Also Like
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-[1200px] mx-auto">
          {relatedProducts.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`}>
              <div className="border border-[#b76e6e] rounded-xl p-4 text-center hover:shadow-md cursor-pointer">

                <img src={p.image} alt={p.name} className="h-[120px] mx-auto mb-3 object-contain" />

                <p className="text-[13px] font-semibold text-black leading-tight mb-1 line-clamp-2">
                  {p.name}
                </p>

                <p className="text-[#c6a55c] text-xs">{p.price}</p>

                {p.colors && p.colors.length > 0 && (
                  <div className="flex justify-center gap-1 mt-2">
                    {p.colors.slice(0, 4).map((c) => (
                      <span
                        key={c}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                )}

                {p.sizes && p.sizes.length > 0 && (
                  <div className="flex justify-center gap-1 mt-2 text-[10px] text-[#7a2d2d]">
                    {p.sizes.join(", ")}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}