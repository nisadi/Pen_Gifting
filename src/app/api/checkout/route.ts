import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

    if (!customerInfo || typeof customerInfo !== "object") {
      return NextResponse.json(
        { success: false, error: "Customer shipping details are required." },
        { status: 400 }
      );
    }

    if (customerInfo.province && customerInfo.province !== "Western Province") {
      return NextResponse.json(
        { success: false, error: "Delivery is currently restricted to Western Province only." },
        { status: 400 }
      );
    }

    if (!customerInfo.district || !VALID_DISTRICTS.includes(customerInfo.district)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid district. Delivery is only available for Colombo, Gampaha, and Kalutara.`,
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

    const validatedItems = [];
    let subtotal = 0;

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

      const price = typeof item.price === "number" ? item.price : Number(String(item.price || 0).replace(/[^0-9.]/g, "")) || 0;
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const itemSubtotal = price * quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        productId: item.productId,
        name: item.name || SHIRT_PRODUCTS[item.productId]?.name || "Product",
        price,
        quantity,
        selectedSize: isShirt ? item.selectedSize.toUpperCase() : undefined,
        selectedColor: item.selectedColor || undefined,
        penType: item.penType || undefined,
        inkColor: item.inkColor || undefined,
        personalization: item.personalization || undefined,
        itemSubtotal
      });
    }

    const deliveryFee = 500;
    const total = subtotal > 0 ? subtotal + deliveryFee : 0;
    const orderId = `PG-ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

    console.log(`\n[Checkout API Pipeline] ====================================================`);
    console.log(`[Checkout API Pipeline] Processing Order ID: ${orderId}`);
    console.log(`[Checkout API Pipeline] Customer: ${customerInfo.fullName} (Phone: ${customerInfo.phone}, Email: ${customerInfo.email || "N/A"})`);

    // 1. Server-Side Customer Email Notification Dispatch
    let emailNotificationStatus = { attempted: false, sent: false, error: null as string | null };

    if (customerInfo.email && customerInfo.email.trim()) {
      emailNotificationStatus.attempted = true;
      const gmailUser = process.env.GMAIL_USER || "nisadiwijerathna@gmail.com";
      const gmailPass = process.env.GMAIL_APP_PASSWORD;

      if (gmailPass) {
        console.log(`[Checkout API Pipeline] Attempting Nodemailer Gmail SMTP email dispatch from ${gmailUser} to ${customerInfo.email}...`);
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: gmailUser,
              pass: gmailPass
            }
          });

          const htmlContent = `
            <div style="font-family: Arial, sans-serif; background-color: #f5f1eb; padding: 24px; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #d6c9b5;">
                <h2 style="color: #7a2e2e; font-family: Georgia, serif; margin-top: 0;">🎉 Order Confirmation</h2>
                <p style="font-size: 15px; color: #555;">Thank you for your purchase from Pen Gifting! Your order has been received successfully.</p>

                <div style="background-color: #f5f1eb; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #d6c9b5;">
                  <p style="margin: 4px 0; font-size: 14px;"><strong>Order ID:</strong> ${orderId}</p>
                  <p style="margin: 4px 0; font-size: 14px;"><strong>Order Date:</strong> ${orderDate}</p>
                </div>

                <h3 style="color: #c5a35d; border-bottom: 1px solid #eee; padding-bottom: 8px;">Customer & Delivery Details</h3>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Name:</strong> ${customerInfo.fullName}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Phone:</strong> ${customerInfo.phone}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Email:</strong> ${customerInfo.email}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Address:</strong> ${customerInfo.address}, ${customerInfo.district}, Western Province</p>

                <h3 style="color: #c5a35d; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 24px;">Ordered Items</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px;">
                  <thead>
                    <tr style="background: #ede0d4; text-align: left;">
                      <th style="padding: 8px; border: 1px solid #ddd;">Product</th>
                      <th style="padding: 8px; border: 1px solid #ddd;">Qty</th>
                      <th style="padding: 8px; border: 1px solid #ddd;">Unit Price</th>
                      <th style="padding: 8px; border: 1px solid #ddd;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${validatedItems.map(item => `
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">
                          <strong>${item.name}</strong>
                          ${item.penType ? `<br/><small style="color: #666;">Pen Type: ${item.penType}</small>` : ''}
                          ${item.selectedSize ? `<br/><small style="color: #666;">Size: ${item.selectedSize}</small>` : ''}
                          ${item.selectedColor ? `<br/><small style="color: #666;">Color: ${item.selectedColor}</small>` : ''}
                          ${item.inkColor ? `<br/><small style="color: #666;">Ink Color: ${item.inkColor}</small>` : ''}
                          ${item.personalization ? `<br/><small style="color: #666;">Personalization: ${item.personalization}</small>` : ''}
                        </td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">Rs. ${item.price.toLocaleString()}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">Rs. ${item.itemSubtotal.toLocaleString()}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>

                <div style="margin-top: 20px; text-align: right; font-size: 14px;">
                  <p style="margin: 4px 0;">Subtotal: <strong>Rs. ${subtotal.toLocaleString()}</strong></p>
                  <p style="margin: 4px 0;">Delivery Fee: <strong>Rs. 500</strong></p>
                  <p style="margin: 8px 0; font-size: 16px; color: #7a2e2e;"><strong>Grand Total: Rs. ${total.toLocaleString()}</strong></p>
                </div>

                <div style="margin-top: 32px; border-top: 1px solid #ddd; padding-top: 16px; font-size: 12px; color: #888; text-align: center;">
                  <p>Pen Gifting Sri Lanka | Premium Collection</p>
                </div>
              </div>
            </div>
          `;

          await transporter.sendMail({
            from: `"Pen Gifting" <${gmailUser}>`,
            to: customerInfo.email,
            subject: `Order Confirmation - ${orderId}`,
            html: htmlContent
          });

          emailNotificationStatus.sent = true;
          console.log(`[Checkout API Pipeline] ✅ Nodemailer Gmail SMTP email sent successfully from ${gmailUser} to ${customerInfo.email}`);
        } catch (smtpErr: any) {
          emailNotificationStatus.error = smtpErr?.message || String(smtpErr);
          console.error(`[Checkout API Pipeline] ❌ Gmail SMTP email dispatch failed:`, smtpErr);
        }
      } else {
        const emailServiceId = process.env.EMAILJS_SERVICE_ID || "service_alm7rgg";
        const emailTemplateId = process.env.EMAILJS_TEMPLATE_ID || "template_efvm3i5";
        const emailUserId = process.env.EMAILJS_USER_ID || process.env.EMAILJS_PUBLIC_KEY || "IdzwzMw0_Z1I4vmAn";

        console.log(`[Checkout API Pipeline] GMAIL_APP_PASSWORD not set. Falling back to EmailJS REST API dispatch from ${gmailUser} to ${customerInfo.email}...`);

        try {
          const orderItemsSummary = validatedItems.map((item) => {
            const details = [
              item.selectedSize ? `Size: ${item.selectedSize}` : null,
              item.selectedColor ? `Color: ${item.selectedColor}` : null,
              `Qty: ${item.quantity}`
            ].filter(Boolean).join(", ");
            return `${item.name} (${details}) - Rs.${item.price.toLocaleString()}`;
          }).join("\n");

          const emailPayload: any = {
            service_id: emailServiceId,
            template_id: emailTemplateId,
            user_id: emailUserId,
            template_params: {
              name: customerInfo.fullName,
              phone: customerInfo.phone,
              email: customerInfo.email,
              address: `${customerInfo.address}, ${customerInfo.district}, Western Province`,
              order: `Order ID: ${orderId}\n\n${orderItemsSummary}`,
              total: total,
              date: orderDate
            }
          };

          const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailPayload)
          });

          const emailResText = await emailRes.text();

          if (emailRes.ok) {
            emailNotificationStatus.sent = true;
            console.log(`[Checkout API Pipeline] ✅ EmailJS REST email dispatch SUCCESS to ${customerInfo.email}:`, emailResText);
          } else {
            emailNotificationStatus.error = `HTTP ${emailRes.status}: ${emailResText}`;
            console.error(`[Checkout API Pipeline] ❌ EmailJS REST email dispatch FAILED (HTTP ${emailRes.status}):`, emailResText);
          }
        } catch (emailErr: any) {
          emailNotificationStatus.error = emailErr?.message || String(emailErr);
          console.error(`[Checkout API Pipeline] ❌ Server email dispatch exception:`, emailErr);
        }
      }
    } else {
      console.log(`[Checkout API Pipeline] ℹ️ Customer did not provide an email address. Skipping email dispatch.`);
    }

    // 2. Server-side Background WhatsApp Notification Dispatch
    let whatsappNotificationStatus = { attempted: true, sent: false, error: null as string | null };
    const targetWhatsAppNumber = process.env.BUSINESS_WHATSAPP_NUMBER || "94760364639";
    const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;
    const whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    const formattedItems = validatedItems.map((item, idx) => {
      const lines = [
        `${idx + 1}.\n`,
        `Product:\n${item.name}`
      ];
      if (item.penType) lines.push(`Pen Type:\n${item.penType}`);
      if (item.selectedColor) lines.push(`Color:\n${item.selectedColor}`);
      if (item.selectedSize) lines.push(`Size:\n${item.selectedSize}`);
      if (item.inkColor) lines.push(`Ink Color:\n${item.inkColor}`);
      if (item.personalization) lines.push(`Personalization:\n${item.personalization}`);
      lines.push(`Quantity:\n${item.quantity}`);
      lines.push(`Unit Price:\nRs. ${item.price.toLocaleString()}`);
      lines.push(`Subtotal:\nRs. ${item.itemSubtotal.toLocaleString()}`);
      return lines.join("\n\n");
    }).join("\n\n--------------------------------\n\n");

    const whatsappMsg = `🛍️ *NEW ORDER*

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
Western Province

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

    if (whatsappApiToken && whatsappPhoneId) {
      console.log(`[Checkout API Pipeline] Attempting Meta WhatsApp Cloud API dispatch to +${targetWhatsAppNumber}...`);
      try {
        const waRes = await fetch(`https://graph.facebook.com/v19.0/${whatsappPhoneId}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${whatsappApiToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: targetWhatsAppNumber,
            type: "text",
            text: { body: whatsappMsg }
          })
        });

        const waResText = await waRes.text();
        if (waRes.ok) {
          whatsappNotificationStatus.sent = true;
          console.log(`[Checkout API Pipeline] ✅ WhatsApp Cloud API dispatch SUCCESS to +${targetWhatsAppNumber}:`, waResText);
        } else {
          whatsappNotificationStatus.error = `HTTP ${waRes.status}: ${waResText}`;
          console.error(`[Checkout API Pipeline] ❌ Meta WhatsApp API dispatch FAILED (HTTP ${waRes.status}):`, waResText);
        }
      } catch (waErr: any) {
        whatsappNotificationStatus.error = waErr?.message || String(waErr);
        console.error(`[Checkout API Pipeline] ❌ Background WhatsApp dispatch exception:`, waErr);
      }
    } else {
      const missingVars = [
        !whatsappApiToken && "WHATSAPP_API_TOKEN",
        !whatsappPhoneId && "WHATSAPP_PHONE_NUMBER_ID"
      ].filter(Boolean).join(", ");
      whatsappNotificationStatus.error = `WhatsApp API keys not configured in environment variables (${missingVars}). Set them in .env.local to enable automated messaging.`;
      console.warn(`[Checkout API Pipeline WARNING] ⚠️ ${whatsappNotificationStatus.error}`);
      console.log(`[Checkout API Pipeline] Formatted WhatsApp payload generated for business owner (+${targetWhatsAppNumber}):\n`, whatsappMsg);
    }
    console.log(`[Checkout API Pipeline] ====================================================\n`);

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order placed successfully.",
      notifications: {
        whatsapp: whatsappNotificationStatus,
        email: emailNotificationStatus
      },
      order: {
        orderId,
        items: validatedItems,
        customerInfo: {
          fullName: customerInfo.fullName,
          phone: customerInfo.phone,
          email: customerInfo.email || null,
          address: customerInfo.address,
          district: customerInfo.district,
          province: "Western Province"
        },
        subtotal,
        deliveryFee,
        total,
        createdDate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[Backend Checkout API Error]", error);
    return NextResponse.json(
      { success: false, error: "Invalid JSON body in checkout request." },
      { status: 400 }
    );
  }
}
