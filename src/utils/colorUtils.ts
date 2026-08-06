/**
 * Centralized mapping of hexadecimal color codes to human-readable color names.
 */
export const COLOR_MAP: Record<string, string> = {
  "#000000": "Black",
  "#ffffff": "White",
  "#c0c0c0": "Silver",
  "#808080": "Gray",
  "#ffd700": "Gold",
  "#0000ff": "Blue",
  "#ff0000": "Red",
  "#008000": "Green",
  "#8b4513": "Brown",
  "#800080": "Purple",
  "#8b0000": "Dark Red",
  "#000080": "Navy",
  "#87ceeb": "Sky Blue",
  "#90ee90": "Light Esthetic Green",
  "#ffb6c1": "Blush Pink",
};

/**
 * Converts a hex color code or raw color string into a clean, human-readable color name.
 * 1. Checks if the product model defines an explicit { name, code } color object.
 * 2. Matches against static COLOR_MAP (case-insensitive).
 * 3. Returns the original string if it is already a text color name or unmapped hex code.
 */
export function getColorName(colorCode?: string, product?: any): string {
  if (!colorCode || typeof colorCode !== "string") return "";

  const trimmed = colorCode.trim();

  // Check product-specific color objects if present
  if (product && Array.isArray(product.colors)) {
    const foundObj = product.colors.find((c: any) =>
      typeof c === "object" && c !== null &&
      (c.code?.toLowerCase() === trimmed.toLowerCase() || c.name?.toLowerCase() === trimmed.toLowerCase())
    );
    if (foundObj && foundObj.name) {
      return foundObj.name;
    }
  }

  // Match against known hex map (case-insensitive)
  const lowerHex = trimmed.toLowerCase();
  if (COLOR_MAP[lowerHex]) {
    return COLOR_MAP[lowerHex];
  }

  // If color string does not start with #, it is already a human-readable name
  if (!trimmed.startsWith("#")) {
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  // Graceful fallback for unknown hex codes without crashing
  return trimmed;
}

/**
 * Formats a clean, professional order message payload for WhatsApp or Email.
 */
export function generateOrderMessage(
  items: any[],
  customerInfo: any,
  orderId: string,
  orderDate: string,
  subtotal: number,
  deliveryFee: number,
  total: number
): string {
  const formattedItems = items.map((item: any, idx: number) => {
    const name = item?.name || "Product";
    const p = typeof item?.price === "number" ? item.price : Number(String(item?.price || 0).replace(/[^0-9.]/g, "")) || 0;
    const q = Math.max(1, Number(item?.quantity) || 1);
    const itemSubtotal = item?.itemSubtotal || p * q;
    const displayColor = getColorName(item?.selectedColor);

    const lines: string[] = [
      `${idx + 1}.\n`,
      `Product:\n${name}`
    ];

    if (item?.penType) {
      lines.push(`Pen Type:\n${item.penType}`);
    }

    if (displayColor) {
      lines.push(`Color:\n${displayColor}`);
    }

    if (item?.selectedSize) {
      lines.push(`Size:\n${item.selectedSize}`);
    }

    if (item?.inkColor) {
      const displayInk = getColorName(item.inkColor);
      lines.push(`Ink Color:\n${displayInk}`);
    }

    if (item?.personalization) {
      lines.push(`Personalization:\n${item.personalization}`);
    }

    lines.push(`Quantity:\n${q}`);
    lines.push(`Unit Price:\nRs. ${p.toLocaleString()}`);
    lines.push(`Subtotal:\nRs. ${itemSubtotal.toLocaleString()}`);

    return lines.join("\n\n");
  }).join("\n\n--------------------------------\n\n");

  return `🛍️ *NEW ORDER*

Order ID:
${orderId}

Order Date:
${orderDate}

--------------------------------

👤 Customer Details

Name:
${customerInfo.fullName}

Phone:
${customerInfo.phone}

Address:
${customerInfo.address}

District:
${customerInfo.district}

Province:
${customerInfo.province || "Western Province"}

--------------------------------

📦 Order Items

${formattedItems}

--------------------------------

Subtotal:
Rs. ${subtotal.toLocaleString()}

Delivery Fee:
Rs. ${deliveryFee.toLocaleString()}

Total:
Rs. ${total.toLocaleString()}

--------------------------------

Thank you.`;
}
