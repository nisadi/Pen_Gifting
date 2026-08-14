export interface Brand {
  id: string;
  name: string;
  image: string;
  alt: string;
  category: "pen" | "shirt";
  description: string;
}

export const brands: Brand[] = [
  // Pen Brands
  {
    id: "waterman",
    name: "WATERMAN",
    image: "/card1.png",
    alt: "Waterman pen",
    category: "pen",
    description:
      "Experience refined craftsmanship with Waterman Paris, where luxury meets precision. Designed for smooth, effortless writing and finished with sophisticated detailing, each pen is perfect for meaningful gifting. Personalize it with custom engraving to create a gift that leaves a lasting impression.",
  },
  {
    id: "parker",
    name: "PARKER",
    image: "/card2.png",
    alt: "Parker pen box",
    category: "pen",
    description:
      "Renowned for its heritage and innovation, Parker pens represent timeless style and exceptional craftsmanship. With smooth performance and refined finishes, each pen is designed to deliver a superior writing experience. Personalize it with custom engraving to create a distinguished gift that speaks of success and sophistication.",
  },
  {
    id: "mont-blanc",
    name: "MONT BLANC",
    image: "/card3.png",
    alt: "Montblanc pen",
    category: "pen",
    description:
      "A symbol of excellence and prestige, Montblanc pens embody master craftsmanship and timeless elegance. Meticulously crafted with premium materials and iconic design, each piece delivers an unmatched writing experience. Personalize your Montblanc pen with custom engraving to create a truly distinguished gift that reflects success, refinement, and lasting legacy.",
  },

  // Shirt Brands / Collections
  {
    id: "premium-collection-check",
    name: "PREMIUM COLLECTION",
    image: "/products/shirt2.png",
    alt: "Premium Collection Check Shirt",
    category: "shirt",
    description:
      "Elevate your wardrobe with our Premium Collection check shirts. Featuring timeless check patterns, button-down styling, and regular fit comfort crafted from high-grade cotton blend fabric.",
  },
  {
    id: "premium-collection-cotton",
    name: "PREMIUM COLLECTION",
    image: "/products/shirt3.png",
    alt: "Premium Collection Cotton Shirt",
    category: "shirt",
    description:
      "Experience all-day comfort and effortless sophistication with 100% breathable premium cotton shirts. Designed with classic windowpane check details, perfect for office and casual wear.",
  },
  {
    id: "premium-collection-linen",
    name: "PREMIUM COLLECTION",
    image: "/products/shirt6.png",
    alt: "Premium Collection Linen Shirt",
    category: "shirt",
    description:
      "Make a stylish impression with our Premium Collection full linen vertical stripe shirts. Expertly woven for lightweight breathability, ideal for smart casual occasions and warm weather elegance.",
  },
];
