import { NextResponse } from "next/server";

// Sample products metadata for server-side validation
const SHIRT_PRODUCTS: Record<string, { name: string; availableSizes: string[] }> = {
  "classic-white-blue-check": { name: "Classic White and Blue Premium Check Shirt", availableSizes: ["M", "L", "XL"] },
  "classic-grey-check": { name: "Classic Grey Check Premium Shirt", availableSizes: ["M", "L", "XL"] },
  "sky-blue-check": { name: "Sky Blue Check Premium Shirt", availableSizes: ["M", "L", "XL"] },
  "navy-plaid": { name: "Navy Blue and White Plaid Premium Shirt", availableSizes: ["M", "L", "XL"] },
  "light-esthetic-green": { name: "Plain Light Esthetic Green Shirt", availableSizes: ["M", "L", "XL"] },
  "pink-white-stripe": { name: "Pink and White Vertical Stripe Premium Shirt", availableSizes: ["M", "L", "XL"] },
};

const DEFAULT_SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, quantity, selectedSize, selectedColor } = body;

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing productId." },
        { status: 400 }
      );
    }

    if (typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Quantity must be a positive number." },
        { status: 400 }
      );
    }

    // Check if product is a shirt
    const isShirt =
      productId in SHIRT_PRODUCTS ||
      productId.toLowerCase().includes("shirt");

    if (isShirt) {
      if (!selectedSize || typeof selectedSize !== "string") {
        return NextResponse.json(
          {
            success: false,
            error: "Please select a shirt size before continuing.",
          },
          { status: 400 }
        );
      }

      const validSizes = SHIRT_PRODUCTS[productId]?.availableSizes || DEFAULT_SHIRT_SIZES;

      if (!validSizes.includes(selectedSize.toUpperCase())) {
        return NextResponse.json(
          {
            success: false,
            error: `Selected size '${selectedSize}' is unavailable for this shirt. Available sizes: ${validSizes.join(", ")}.`,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Item validated and added to cart successfully.",
      cartItem: {
        productId,
        quantity,
        selectedSize: isShirt ? selectedSize.toUpperCase() : undefined,
        selectedColor: selectedColor || undefined,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid API payload structure." },
      { status: 400 }
    );
  }
}
