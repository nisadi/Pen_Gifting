import { NextResponse } from "next/server";

const SHIRT_PRODUCTS: Record<string, { name: string; availableSizes: string[] }> = {
  "classic-white-blue-check": { name: "Classic White and Blue Premium Check Shirt", availableSizes: ["M", "L", "XL"] },
  "classic-grey-check": { name: "Classic Grey Check Premium Shirt", availableSizes: ["M", "L", "XL"] },
  "sky-blue-check": { name: "Sky Blue Check Premium Shirt", availableSizes: ["M", "L", "XL"] },
  "navy-plaid": { name: "Navy Blue and White Plaid Premium Shirt", availableSizes: ["M", "L", "XL"] },
  "light-esthetic-green": { name: "Plain Light Esthetic Green Shirt", availableSizes: ["M", "L", "XL"] },
  "pink-white-stripe": { name: "Pink and White Vertical Stripe Premium Shirt", availableSizes: ["M", "L", "XL"] },
};

const DEFAULT_SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const VALID_DISTRICTS = ["Colombo", "Gampaha", "Kalutara"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerInfo } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Checkout request must contain at least one item." },
        { status: 400 }
      );
    }

    // Validate Customer Details if provided in payload
    if (customerInfo) {
      if (customerInfo.province && customerInfo.province !== "Western Province") {
        return NextResponse.json(
          { success: false, error: "Delivery is currently restricted to Western Province only." },
          { status: 400 }
        );
      }

      if (customerInfo.district && !VALID_DISTRICTS.includes(customerInfo.district)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid district '${customerInfo.district}'. Delivery is only available for Colombo, Gampaha, and Kalutara.`,
          },
          { status: 400 }
        );
      }

      if (!customerInfo.fullName || typeof customerInfo.fullName !== "string" || !customerInfo.fullName.trim()) {
        return NextResponse.json(
          { success: false, error: "Full Name is required." },
          { status: 400 }
        );
      }

      if (!customerInfo.phone || typeof customerInfo.phone !== "string" || !customerInfo.phone.trim()) {
        return NextResponse.json(
          { success: false, error: "Phone Number is required." },
          { status: 400 }
        );
      }

      if (!customerInfo.address || typeof customerInfo.address !== "string" || !customerInfo.address.trim()) {
        return NextResponse.json(
          { success: false, error: "Please enter your address." },
          { status: 400 }
        );
      }
    }

    const validatedItems = [];

    for (let index = 0; index < items.length; index++) {
      const item = items[index];

      if (!item || typeof item !== "object" || !item.productId) {
        return NextResponse.json(
          { success: false, error: `Invalid item format at index ${index}.` },
          { status: 400 }
        );
      }

      const productId = item.productId;
      const isShirt =
        productId in SHIRT_PRODUCTS ||
        productId.toLowerCase().includes("shirt");

      if (isShirt) {
        if (!item.selectedSize || typeof item.selectedSize !== "string") {
          return NextResponse.json(
            {
              success: false,
              error: `Missing size for shirt product '${productId}' at index ${index}.`,
            },
            { status: 400 }
          );
        }

        const validSizes = SHIRT_PRODUCTS[productId]?.availableSizes || DEFAULT_SHIRT_SIZES;

        if (!validSizes.includes(item.selectedSize.toUpperCase())) {
          return NextResponse.json(
            {
              success: false,
              error: `Invalid size '${item.selectedSize}' for shirt product '${productId}'. Available sizes: ${validSizes.join(", ")}.`,
            },
            { status: 400 }
          );
        }
      }

      validatedItems.push({
        productId: item.productId,
        quantity: Math.max(1, Number(item.quantity) || 1),
        selectedSize: isShirt ? item.selectedSize.toUpperCase() : undefined,
        selectedColor: item.selectedColor || undefined,
      });
    }

    const deliveryFee = 500;

    return NextResponse.json({
      success: true,
      message: "Checkout payload validated successfully.",
      order: {
        items: validatedItems,
        customerInfo: customerInfo
          ? {
              ...customerInfo,
              province: "Western Province",
              district: customerInfo.district,
            }
          : null,
        deliveryFee,
        createdDate: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body in checkout request." },
      { status: 400 }
    );
  }
}
