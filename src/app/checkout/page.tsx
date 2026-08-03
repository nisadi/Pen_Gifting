"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, ChangeEvent } from "react";

function CheckoutContent() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isBuyNow = searchParams.has("buyNow");

  const [buyNowItem, setBuyNowItem] = useState(() => {
    const param = searchParams.get("buyNow");
    if (param) {
      try {
        const parsed = JSON.parse(decodeURIComponent(param));
        if (parsed && typeof parsed === "object" && parsed.id) {
          return parsed;
        }
      } catch (error) {
        console.error("Failed to parse buyNow parameter:", error);
      }
    }
    return null;
  });

  const items = isBuyNow && buyNowItem ? [buyNowItem] : cart;

  const handleUpdateQty = (id: string, newQty: number) => {
    const validQty = Math.max(1, newQty);
    if (isBuyNow && buyNowItem) {
      setBuyNowItem({ ...buyNowItem, quantity: validQty });
    } else {
      updateQuantity(id, validQty);
    }
  };

  const handleDelete = (id: string) => {
    if (isBuyNow && buyNowItem) {
      setBuyNowItem(null);
    } else {
      removeFromCart(id);
    }
  };

  const total = items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) || 0;

  // Form State
  const [isEditable, setIsEditable] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    province: "Western Province",
    phone: "",
    district: "",
    address: ""
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    district: "",
    address: "",
    email: ""
  });

  const WESTERN_PROVINCE_DISTRICTS = ["Colombo", "Gampaha", "Kalutara"];

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      phone: "",
      district: "",
      address: "",
      email: ""
    };
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required.";
      isValid = false;
    } else if (!/^(?:\+94|0)?7[0-9]{8}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid Sri Lankan phone number (e.g., 07XXXXXXXX).";
      isValid = false;
    }

    if (!formData.district.trim()) {
      newErrors.district = "Please select a district.";
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Please enter your address.";
      isValid = false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address (e.g., name@example.com).";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    setHasSaved(true);
    setIsEditable(false);
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      district: e.target.value
    });
    if (errors.district) {
      setErrors({ ...errors, district: "" });
    }
  };

  const liveAddress = [formData.address, formData.district, formData.province].filter(Boolean).join(", ");

  const getInputClass = (hasError = false) =>
    `w-full border ${hasError ? 'border-red-500' : 'border-gray-500'} rounded-md p-2.5 text-black placeholder-gray-400 text-[13px] focus:outline-none focus:border-black transition-colors ${
      isEditable ? 'bg-[#e8f0fe] opacity-100' : 'bg-transparent opacity-60 cursor-not-allowed'
    }`;

  const getSelectClass = (val: string, hasError = false) =>
    `w-full border ${hasError ? 'border-red-500' : 'border-gray-500'} rounded-md p-2.5 text-[13px] appearance-none focus:outline-none focus:border-black transition-colors ${
      isEditable ? 'bg-[#e8f0fe] opacity-100 ' + (val ? 'text-black' : 'text-gray-400') : 'bg-transparent opacity-60 cursor-not-allowed text-gray-500'
    }`;

  const [showSuccess, setShowSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWhatsAppConfirm, setShowWhatsAppConfirm] = useState(false);

  const handlePlaceOrderClick = () => {
    if (!validateForm()) {
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      alert("Your order list is empty. Please add items to your cart before placing an order.");
      return;
    }

    setShowWhatsAppConfirm(true);
  };

  const generateOrderMessage = () => {
    const deliveryFee = 500;
    const computedSubtotal = items.reduce((sum, item: any) => {
      const p = typeof item?.price === "number" ? item.price : Number(String(item?.price || 0).replace(/[^0-9.]/g, "")) || 0;
      const q = Math.max(1, Number(item?.quantity) || 1);
      return sum + p * q;
    }, 0);
    const totalWithDelivery = computedSubtotal > 0 ? computedSubtotal + deliveryFee : 0;

    let message = `Thank you for your order!\n\n`;
    message += `Order Details\n`;
    message += `------------------------\n\n`;
    message += `Customer Name: ${formData.fullName}\n`;
    message += `Phone: ${formData.phone}\n`;
    if (formData.email) message += `Email: ${formData.email}\n`;
    
    message += `\nDelivery Address:\n`;
    message += `${formData.address},\n`;
    message += `${formData.district},\n`;
    message += `${formData.province}\n\n`;
    
    message += `Items\n`;
    message += `------------------------\n`;

    items.forEach((item: any) => {
      const p = typeof item?.price === "number" ? item.price : Number(String(item?.price || 0).replace(/[^0-9.]/g, "")) || 0;
      const q = Math.max(1, Number(item?.quantity) || 1);
      
      message += `\n• ${item.name || "Item"}\n`;
      message += `  Quantity: ${q}\n`;
      if (item.selectedSize) message += `  Size: ${item.selectedSize}\n`;
      if (item.selectedColor) message += `  Body Color: ${item.selectedColor}\n`;
      if (item.inkColor) message += `  Ink Color: ${item.inkColor}\n`;
      if (item.penType) message += `  Pen Type: ${item.penType}\n`;
      if (item.personalization) message += `  Personalization: ${item.personalization}\n`;
      message += `  Price: Rs. ${(p * q).toLocaleString()}\n`;
    });

    message += `\nSubtotal: Rs. ${computedSubtotal.toLocaleString()}\n`;
    message += `Delivery Fee: Rs. ${deliveryFee.toLocaleString()}\n`;
    message += `Grand Total: Rs. ${totalWithDelivery.toLocaleString()}\n\n`;
    message += `Your order has been forwarded to our WhatsApp for confirmation.\n`;
    message += `Our team will contact you shortly regarding delivery and payment.\n\n`;
    message += `Thank you for shopping with us.`;

    return message;
  };

  const handleContinueToWhatsApp = () => {
    const orderMessage = generateOrderMessage();
    
    const encodedMessage = encodeURIComponent(orderMessage);
    const whatsappUrl = `https://wa.me/94760364639?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    setShowWhatsAppConfirm(false);
    clearCart();
    setPlacedOrderId(`PG-WA-${Date.now().toString(36).toUpperCase()}`);
    setShowSuccess(true);
  };

  return (
    <main className="bg-[#f5f1eb] min-h-screen flex flex-col relative">
      <Navbar />

      {/* WhatsApp Confirmation Modal */}
      {showWhatsAppConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all duration-300">
          <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-2xl text-center border border-[#d6c9b5] transform scale-100 transition-all duration-300">
            <div className="w-16 h-16 bg-[#e8decb] text-[#25D366] rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <i className="fa-brands fa-whatsapp text-4xl"></i>
            </div>
            
            <h3 className="text-2xl font-serif font-bold text-[#25D366] mb-4">
              Complete via WhatsApp
            </h3>
            
            <p className="text-gray-700 text-[15px] leading-relaxed mb-4 font-medium">
              Your order will now be redirected to WhatsApp to complete the order and payment process with our team.
            </p>

            <p className="text-gray-600 text-[14px] leading-relaxed mb-8">
              Your order details will be sent to our WhatsApp. Our team will confirm your order, delivery, and payment.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowWhatsAppConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 px-6 rounded-xl hover:bg-gray-200 transition shadow-sm focus:outline-none text-[15px]"
              >
                Cancel
              </button>
              <button
                onClick={handleContinueToWhatsApp}
                className="flex-1 bg-[#25D366] text-white font-bold py-3.5 px-6 rounded-xl hover:bg-[#1ebd5a] transition shadow-md focus:outline-none text-[15px] flex items-center justify-center gap-2"
              >
                Continue to WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Placed Successfully Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 transition-all duration-300">
          <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-2xl text-center border border-[#d6c9b5] transform scale-100 transition-all duration-300">
            <div className="w-16 h-16 bg-[#e8decb] text-[#7a2e2e] rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <i className="fa-solid fa-circle-check text-4xl text-[#c5a35d]"></i>
            </div>
            
            <h3 className="text-2xl font-serif font-bold text-[#7a2e2e] mb-2">
              🎉 Order Placed Successfully!
            </h3>
            
            <div className="bg-[#f5f1eb] py-2 px-4 rounded-lg inline-block text-[13px] font-mono text-[#5a5a5a] mb-4 border border-[#d6c9b5]">
              Order ID: <span className="font-bold text-black">{placedOrderId}</span>
            </div>

            <p className="text-gray-700 text-[14px] leading-relaxed mb-4">
              Thank you for your purchase! Your order has been received successfully.
            </p>

            <div className="bg-[#e8f0fe] p-3.5 rounded-lg text-left text-[12.5px] text-[#1c3d5a] space-y-2 mb-6 border border-[#b6d4fe]">
              {formData.email ? (
                <p className="flex items-center gap-2">
                  <i className="fa-solid fa-envelope text-[#c5a35d]"></i>
                  <span>A confirmation email has been sent to <strong>{formData.email}</strong>.</span>
                </p>
              ) : null}
              <p className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-green-600"></i>
                <span>Our team has received your order notification and will contact you shortly.</span>
              </p>
            </div>

            <button
              onClick={() => {
                setShowSuccess(false);
                router.push("/products");
              }}
              className="w-full bg-[#c5a35d] text-[#7a2e2e] font-bold py-3.5 px-6 rounded-xl hover:bg-[#b8954f] hover:text-white transition shadow-md focus:outline-none text-[15px]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <section className="flex-1 max-w-[1200px] w-full mx-auto px-4 md:px-16 py-10 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">

          {/* Shipping Forms Card */}
          <div className="bg-[#ede0d4] p-4 sm:p-8 rounded-xl border border-[#d6c9b5] shadow-sm">
            <h2 className="text-[#7a2e2e] font-serif font-bold text-[22px] mb-8">
              Shipping & Billing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

              {/* Row 1 */}
              <div>
                <label className="block text-[13px] text-black font-semibold mb-1.5 border-b-0">
                  Full Name <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: "" });
                  }}
                  disabled={!isEditable}
                  placeholder="Enter Your Name"
                  className={getInputClass(Boolean(errors.fullName))}
                  required
                />
                {errors.fullName && (
                  <p className="text-red-600 text-[12px] mt-1 flex items-center gap-1">
                    <i className="fa-solid fa-circle-exclamation text-[11px]"></i>
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[13px] text-black font-semibold mb-1.5 border-b-0">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  disabled={!isEditable}
                  placeholder="Enter Your Email"
                  className={getInputClass(Boolean(errors.email))}
                />
                {errors.email && (
                  <p className="text-red-600 text-[12px] mt-1 flex items-center gap-1">
                    <i className="fa-solid fa-circle-exclamation text-[11px]"></i>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Row 2 */}
              <div>
                <label className="block text-[13px] text-black font-semibold mb-1.5">
                  Phone Number <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                  disabled={!isEditable}
                  placeholder="Enter Your Phone Number"
                  className={getInputClass(Boolean(errors.phone))}
                  required
                />
                {errors.phone && (
                  <p className="text-red-600 text-[12px] mt-1 flex items-center gap-1">
                    <i className="fa-solid fa-circle-exclamation text-[11px]"></i>
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[13px] text-black font-semibold mb-1.5">Province</label>
                <input
                  type="text"
                  value="Western Province"
                  readOnly
                  disabled
                  className="w-full border border-gray-400 rounded-md p-2.5 text-gray-700 bg-gray-200 text-[13px] cursor-not-allowed font-medium"
                />
              </div>

              {/* Row 3 - Only District */}
              <div>
                <label className="block text-[13px] text-black font-semibold mb-1.5">
                  District <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.district}
                    onChange={handleDistrictChange}
                    disabled={!isEditable}
                    className={getSelectClass(formData.district, Boolean(errors.district))}
                  >
                    <option value="" disabled hidden>Choose Your District</option>
                    {WESTERN_PROVINCE_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <i className={`fa-solid fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-sm ${isEditable ? 'text-gray-500' : 'text-gray-400 opacity-60'}`}></i>
                </div>
                {errors.district && (
                  <p className="text-red-600 text-[12px] mt-1 flex items-center gap-1">
                    <i className="fa-solid fa-circle-exclamation text-[11px]"></i>
                    {errors.district}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-[13px] text-black font-semibold mb-1.5">
                  Address <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: "" });
                  }}
                  disabled={!isEditable}
                  placeholder="Type Here"
                  className={getInputClass(Boolean(errors.address))}
                  required
                />
                {errors.address && (
                  <p className="text-red-600 text-[12px] mt-1 flex items-center gap-1">
                    <i className="fa-solid fa-circle-exclamation text-[11px]"></i>
                    {errors.address}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex gap-2 sm:gap-4">
              <button
                onClick={handleEdit}
                disabled={isEditable || !hasSaved}
                className={`flex-1 ${(!isEditable && hasSaved) ? 'bg-[#c5a35d] text-[#7a2e2e] hover:bg-[#b8954f]' : 'bg-transparent border border-[#c5a35d] text-[#c5a35d] opacity-50 cursor-not-allowed'} py-3.5 rounded-lg font-bold text-[16px] transition`}
              >
                Edit
              </button>
              <button
                onClick={handleSave}
                disabled={!isEditable}
                className={`flex-1 ${isEditable ? 'bg-[#c5a35d] text-[#7a2e2e] hover:bg-[#b8954f]' : 'bg-transparent border border-[#c5a35d] text-[#c5a35d] opacity-50 cursor-not-allowed'} py-3.5 rounded-lg font-bold text-[16px] transition`}
              >
                Save
              </button>
            </div>
          </div>

          {/* Checkout Products Card */}
          <div className="bg-[#ede0d4] p-4 sm:p-8 rounded-xl border border-[#d6c9b5] shadow-sm mb-16">
            <h2 className="text-[#7a2e2e] font-serif font-bold text-[20px] mb-6 flex items-center gap-2 border-b border-[#d6c9b5] pb-4">
              Products <span className="text-[16px] text-[#7a2e2e] font-normal">({items ? items.length : 0})</span>
            </h2>

            <div className="flex flex-col gap-6 pt-2">
              {!items || items.length === 0 ? (
                <div className="text-[#7a2e2e]">Your checkout list is empty.</div>
              ) : (
                items.map((item: any) => (
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-6">

                    <div className="flex items-center gap-4">
                      <div className="w-[85px] h-[85px] bg-[#beb1a3] rounded-xl flex justify-center items-center overflow-hidden border border-[#a29283]">
                        <img src={item.image} alt={item.name} className="w-[70%] h-auto object-contain" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-black font-serif font-bold text-[16px] leading-tight">{item.name}</h3>
                      {(item.selectedSize || item.selectedColor) && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#5a5a5a] mt-1">
                          {item.selectedSize && (
                            <span>
                              <span className="font-semibold text-[#7a2e2e]">Size:</span> {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="flex items-center gap-1">
                              <span className="font-semibold text-[#7a2e2e]">Color:</span>
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-gray-400 inline-block align-middle"
                                style={{ backgroundColor: item.selectedColor }}
                                title={item.selectedColor}
                              />
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-[#c5a35d] font-semibold text-[14px] mt-1">Rs.{item.price.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center justify-between border border-[#c5a35d] rounded-full px-2 py-1 bg-transparent min-w-[100px]">
                      <button
                        onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                        className="text-[#a19b8f] hover:text-[#7a2e2e] transition text-[14px] px-1"
                      >
                        <i className="fa-solid fa-circle-minus"></i>
                      </button>
                      <span className="text-black font-semibold text-[13px]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                        className="text-[#a19b8f] hover:text-[#7a2e2e] transition text-[14px] px-1"
                      >
                        <i className="fa-solid fa-circle-plus"></i>
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-[#7a2e2e] hover:text-red-700 ml-4 transition"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Tall Card) */}
        <div>
          <div className="bg-[#ede0d4] rounded-xl border border-[#d6c9b5] shadow-sm p-4 sm:p-6 sticky top-6">

            {/* Contact Info Section */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[#7a2e2e] font-serif font-bold text-[18px]">Contact Info</h2>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] text-black font-semibold mb-1">Full Name</label>
                <div className="text-[13px] text-gray-800 break-words">{formData.fullName || "—"}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-black font-semibold mb-1">Email</label>
                  <div className="text-[13px] text-gray-800 break-words truncate">{formData.email || "—"}</div>
                </div>
                <div>
                  <label className="block text-[13px] text-black font-semibold mb-1">Phone</label>
                  <div className="text-[13px] text-gray-800">{formData.phone || "—"}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[#d6c9b5] pt-3">
                <div>
                  <label className="block text-[12px] text-gray-500 font-semibold mb-0.5">Province</label>
                  <div className="text-[13px] text-black">{formData.province || "—"}</div>
                </div>
                <div>
                  <label className="block text-[12px] text-gray-500 font-semibold mb-0.5">District</label>
                  <div className="text-[13px] text-black">{formData.district || "—"}</div>
                </div>
              </div>


              <div>
                <label className="block text-[13px] text-black font-semibold mb-1 border-t border-[#d6c9b5] pt-3">Full Address</label>
                <div className="text-[13px] text-gray-800 break-words italic">
                  {liveAddress || "—"}
                </div>
              </div>
            </div>

            {/* Spacer */}
            <div className="h-8"></div>

            {/* Order Summary Section */}
            <h2 className="text-[#c5a35d] font-serif font-bold text-[18px] mb-5">
              Order Summary
            </h2>

            <div className="flex justify-between text-[#3f3f3f] text-[14px] mb-3">
              <span className="font-semibold">Items Total</span>
              <span className="font-semibold text-[#5a5a5a]">Rs. {total > 0 ? total.toLocaleString() : "0"}</span>
            </div>

            <div className="flex justify-between text-[#3f3f3f] text-[14px] mb-6">
              <span className="font-semibold">Delivery Fee</span>
              <span className="font-semibold text-[#5a5a5a]">LKR 500</span>
            </div>

            <div className="border-t border-[#d6c9b5] pt-5 mb-8 flex justify-between items-center">
              <span className="text-black font-bold text-[16px]">Total</span>
              <span className="text-[#c5a35d] font-bold text-[16px]">LKR {(total > 0 ? total + 500 : 0).toLocaleString()}</span>
            </div>

            <button
              onClick={handlePlaceOrderClick}
              disabled={isSubmitting}
              className={`bg-[#c5a35d] w-full py-3.5 rounded-lg text-[#7a2e2e] font-bold text-[16px] hover:bg-[#b8954f] hover:text-white transition focus:outline-none flex items-center justify-center gap-2 ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              Place the Order
            </button>

          </div>
        </div>

      </section>

      <Footer />
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f1eb] flex items-center justify-center font-serif text-[#7a2e2e] text-lg">Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}