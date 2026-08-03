"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function accordionKeyToggle(
  e: React.KeyboardEvent,
  toggle: () => void
) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggle();
  }
}

const products = [
  // New Fountain Pens
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
    personalization: ["Can Be Engraved"]
  },
  {
    id: "lamy-safari",
    name: "Lamy Safari",
    price: "Rs.10,000",
    priceValue: 10000,
    image: "/products/lamy-safari.png",
    colors: ["#000000", "#0000ff", "#ff0000", "#ffffff"],
    inkColors: ["#0000ff"],
    penType: "Fountain Pen",
    brand: "Lamy",
    personalization: ["Can Be Engraved"]
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
    personalization: ["Not Available"]
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
    personalization: ["Not Available"]
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
    personalization: ["Not Available"]
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
    personalization: ["Not Available"]
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
    personalization: ["Not Available"]
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
    personalization: ["Not Available"]
  }
];

export default function ProductsPage() {
  const penTypeOptions = ["Ballpoint Pen", "Rollerball Pen", "Fountain Pen", "Calligraphy Pen", "Pencil"];
  const brandOptions = ["Kaweco", "Lamy", "Mont Blanc", "Parker", "WaterMan", "Sheaffer", "Pilot", "Caran d'ache"];
  const personalizationOptions = ["Can Be Engraved", "30+ Character Engraving"];

  const itemColorOptions = [
    "#111111", // Black
    "#24374b", // Dark Blue
    "#8f8f8f", // Gray
    "#ad2742", // Red/Burgundy
    "#c5a25f", // Gold
    "#ffffff", // White/Silver
  ];

  const inkColorOptions = ["#000000", "#203d6c"];
  const maxPriceLimit = 50000;

  const [selectedPenTypes, setSelectedPenTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPersonalization, setSelectedPersonalization] = useState<string[]>([]);
  const [selectedItemColors, setSelectedItemColors] = useState<string[]>([]);
  const [selectedInkColors, setSelectedInkColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(maxPriceLimit);
  const [sortBy, setSortBy] = useState("recommended");
  const [openSections, setOpenSections] = useState({
    penType: true,
    brand: true,
    personalization: true,
    price: true,
  });
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = sortMenuRef.current;
      if (el && !el.contains(e.target as Node)) {
        setSortMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [sortMenuOpen]);

  const sortOptions: { value: string; label: string }[] = [
    { value: "recommended", label: "Sort By: Recommended" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
  ];
  const sortLabel = sortOptions.find((o) => o.value === sortBy)?.label ?? sortOptions[0].label;

  const toggleSelection = (
    value: string,
    selected: string[],
    setSelected: (next: string[]) => void
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
      return;
    }
    setSelected([...selected, value]);
  };

  const filteredProducts = useMemo(() => {
    const next = products.filter((product) => {
      const penTypeMatch =
        selectedPenTypes.length === 0 ||
        (Boolean(product.penType) && selectedPenTypes.includes(product.penType!));
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const personalizationMatch =
        selectedPersonalization.length === 0 ||
        selectedPersonalization.some((item) => product.personalization.includes(item));
      const priceMatch = product.priceValue >= minPrice && product.priceValue <= maxPrice;
      const itemColorMatch =
        selectedItemColors.length === 0 ||
        (Boolean(product.colors) &&
          selectedItemColors.some((color) =>
            product.colors.map((c) => c.toLowerCase()).includes(color.toLowerCase())
          ));
      const inkColorMatch =
        selectedInkColors.length === 0 ||
        (Boolean(product.inkColors) &&
          selectedInkColors.some((color) =>
            product.inkColors!.map((c) => c.toLowerCase()).includes(color.toLowerCase())
          ));

      return (
        penTypeMatch &&
        brandMatch &&
        personalizationMatch &&
        priceMatch &&
        itemColorMatch &&
        inkColorMatch
      );
    });

    if (sortBy === "price-low-high") {
      return [...next].sort((a, b) => a.priceValue - b.priceValue);
    }
    if (sortBy === "price-high-low") {
      return [...next].sort((a, b) => b.priceValue - a.priceValue);
    }
    return next;
  }, [
    selectedPenTypes,
    selectedBrands,
    selectedPersonalization,
    selectedItemColors,
    selectedInkColors,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const minPercent = (minPrice / maxPriceLimit) * 100;
  const maxPercent = (maxPrice / maxPriceLimit) * 100;

  return (
    <main className="bg-[#f5f1eb] text-gray-800 min-h-screen">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <img
          src="/products/hero.png"
          alt="Luxury pen collection"
          className="w-full h-full object-cover"
        />

        <div className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 bg-[#ebe7dd]/95 max-w-[460px] px-5 md:px-8 py-6 md:py-8 shadow-md">
          <p className="text-[13px] md:text-[15px] leading-6 text-[#4a4a4a]">
            Our pen shop is dedicated to quality, craftsmanship, and choice. We
            specialize in personalized luxury pens, with most styles available
            for custom engraving to create a meaningful gift.
          </p>
          <p className="mt-4 text-[13px] md:text-[15px] leading-6 text-[#4a4a4a]">
            Featuring renowned brands like Parker, Cross, LAMY, Waterman,
            Sheaffer, and Kaweco, our collection offers timeless elegance for
            every writing style - from refined fountain pens to practical
            ballpoints and smooth rollerballs.
          </p>
        </div>
      </section>

      {/* PRODUCTS LISTING */}
      <section className="bg-[#fdf8f1] px-4 md:px-8 lg:px-10 py-8 md:py-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 md:gap-8">
          {/* FILTERS */}
          <aside className="text-[#6a5a4a]">
            <h3 className="text-[22px] font-serif mb-5 text-[#b58921]">Filters</h3>

            <div className="space-y-6 text-[14px]">
              <div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenSections((prev) => ({ ...prev, penType: !prev.penType }))}
                  onKeyDown={(e) =>
                    accordionKeyToggle(e, () =>
                      setOpenSections((prev) => ({ ...prev, penType: !prev.penType }))
                    )
                  }
                  className="w-full flex items-center justify-between font-semibold text-[#7a2d2d] cursor-pointer select-none"
                >
                  Pen Type
                  <span className="text-[#9e8e7e]">{openSections.penType ? "^" : "v"}</span>
                </div>
                {openSections.penType && (
                  <div className="mt-3 space-y-2">
                    {penTypeOptions.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-[14px] text-[#7a2d2d] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPenTypes.includes(option)}
                          onChange={() => toggleSelection(option, selectedPenTypes, setSelectedPenTypes)}
                          className="accent-[#7a2d2d] w-4 h-4"
                        />
                        <span className="text-[14px]">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenSections((prev) => ({ ...prev, brand: !prev.brand }))}
                  onKeyDown={(e) =>
                    accordionKeyToggle(e, () =>
                      setOpenSections((prev) => ({ ...prev, brand: !prev.brand }))
                    )
                  }
                  className="w-full flex items-center justify-between font-semibold text-[#7a2d2d] cursor-pointer select-none"
                >
                  Brand
                  <span className="text-[#9e8e7e]">{openSections.brand ? "^" : "v"}</span>
                </div>
                {openSections.brand && (
                  <div className="mt-3 space-y-2">
                    {brandOptions.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-[14px] text-[#7a2d2d] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(option)}
                          onChange={() => toggleSelection(option, selectedBrands, setSelectedBrands)}
                          className="accent-[#7a2d2d] w-4 h-4"
                        />
                        <span className="text-[14px]">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    setOpenSections((prev) => ({ ...prev, personalization: !prev.personalization }))
                  }
                  onKeyDown={(e) =>
                    accordionKeyToggle(e, () =>
                      setOpenSections((prev) => ({ ...prev, personalization: !prev.personalization }))
                    )
                  }
                  className="w-full flex items-center justify-between font-semibold text-[#7a2d2d] cursor-pointer select-none"
                >
                  Personalization
                  <span className="text-[#9e8e7e]">{openSections.personalization ? "^" : "v"}</span>
                </div>
                {openSections.personalization && (
                  <div className="mt-3 space-y-2">
                    {personalizationOptions.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-[14px] text-[#7a2d2d] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPersonalization.includes(option)}
                          onChange={() =>
                            toggleSelection(option, selectedPersonalization, setSelectedPersonalization)
                          }
                          className="accent-[#7a2d2d] w-4 h-4"
                        />
                        <span className="text-[14px]">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenSections((prev) => ({ ...prev, price: !prev.price }))}
                  onKeyDown={(e) =>
                    accordionKeyToggle(e, () =>
                      setOpenSections((prev) => ({ ...prev, price: !prev.price }))
                    )
                  }
                  className="w-full flex items-center justify-between font-semibold text-[#7a2d2d] cursor-pointer select-none"
                >
                  Price
                  <span className="text-[#9e8e7e]">{openSections.price ? "^" : "v"}</span>
                </div>

                {openSections.price && (
                  <>
                    <p className="text-[15px] mt-3 mb-1 text-[#b58921]">
                      Rs.{minPrice.toLocaleString()} - Rs.{maxPrice.toLocaleString()}
                    </p>
                    <div className="relative w-full h-10 mb-5">
                      <div className="absolute top-1/2 -translate-y-1/2 w-full h-px bg-[#d8d0c4]" />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-[#b58921]"
                        style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
                      />

                      <input
                        type="range"
                        min={1000}
                        max={maxPriceLimit}
                        value={minPrice}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setMinPrice(value > maxPrice ? maxPrice : value);
                        }}
                        className="products-price-range absolute w-full top-1/2 -translate-y-1/2"
                        style={{ zIndex: 2 }}
                      />
                      <input
                        type="range"
                        min={1000}
                        max={maxPriceLimit}
                        value={maxPrice}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setMaxPrice(value < minPrice ? minPrice : value);
                        }}
                        className="products-price-range absolute w-full top-1/2 -translate-y-1/2"
                        style={{ zIndex: 3 }}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mb-5">
                <p className="text-[14px] font-semibold mb-3 text-[#7a2d2d]">Item Color</p>
                <div className="flex flex-wrap gap-3 justify-start max-w-[200px]">
                  {itemColorOptions.map((color, index) => {
                    const active = selectedItemColors.includes(color);
                    return (
                      <div
                        key={color}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleSelection(color, selectedItemColors, setSelectedItemColors)}
                        onKeyDown={(e) =>
                          accordionKeyToggle(e, () =>
                            toggleSelection(color, selectedItemColors, setSelectedItemColors)
                          )
                        }
                        className={`w-6 h-6 rounded-full border shrink-0 cursor-pointer ${active ? "border-[#7a2d2d] border-2" : "border-[#d1c6b8]"}`}
                        style={{ backgroundColor: color }}
                        aria-label={`Filter color ${color}`}
                        aria-pressed={active}
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[14px] font-semibold mb-3 text-[#7a2d2d]">Ink Color</p>
                <div className="flex gap-3">
                  {inkColorOptions.map((color) => {
                    const active = selectedInkColors.includes(color);
                    return (
                      <div
                        key={color}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleSelection(color, selectedInkColors, setSelectedInkColors)}
                        onKeyDown={(e) =>
                          accordionKeyToggle(e, () =>
                            toggleSelection(color, selectedInkColors, setSelectedInkColors)
                          )
                        }
                        className={`w-6 h-6 rounded-full border shrink-0 cursor-pointer ${active ? "border-[#7a2d2d] border-2" : "border-[#d1c6b8]"}`}
                        style={{ backgroundColor: color }}
                        aria-label={`Filter ink color ${color}`}
                        aria-pressed={active}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div>
            <div className="flex justify-start md:justify-end mb-4">
              <div ref={sortMenuRef} className="relative min-w-[220px]">
                <div
                  role="button"
                  tabIndex={0}
                  id="products-sort-trigger"
                  aria-haspopup="listbox"
                  aria-expanded={sortMenuOpen}
                  aria-controls="products-sort-listbox"
                  onClick={() => setSortMenuOpen((o) => !o)}
                  onKeyDown={(e) => accordionKeyToggle(e, () => setSortMenuOpen((o) => !o))}
                  className="border border-[#c6a55c]/40 bg-white text-[13px] text-[#7a2d2d] px-4 py-2.5 rounded-md shadow-sm flex items-center justify-between gap-3 cursor-pointer select-none hover:shadow-md transition duration-200"
                >
                  <span>{sortLabel}</span>
                  <span className="text-[#c6a55c] text-sm">▾</span>

                </div>
                {sortMenuOpen && (
                  <ul
                    id="products-sort-listbox"
                    role="listbox"
                    aria-labelledby="products-sort-trigger"
                    className="absolute right-0 top-full mt-1 z-20 w-full min-w-[220px] border border-[#d8cfc2] bg-[#f7f3ed] py-1 shadow-md"
                  >
                    {sortOptions.map((opt) => (
                      <li key={opt.value} role="presentation">
                        <div
                          role="option"
                          aria-selected={sortBy === opt.value}
                          tabIndex={0}
                          className={`px-3 py-2 text-[12px] cursor-pointer outline-none hover:bg-[#ebe4d8] ${sortBy === opt.value ? "text-[#7a2d2d] font-semibold" : "text-[#7e6e5d]"}`}
                          onClick={() => {
                            setSortBy(opt.value);
                            setSortMenuOpen(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSortBy(opt.value);
                              setSortMenuOpen(false);
                            }
                          }}
                        >
                          {opt.label}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="block"
                >
                  <article
                    className="rounded-2xl border border-[#7a2d2d]/35 bg-[#fdf8f1] px-4 pt-4 pb-3 min-h-[270px] shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#c5a25f]"
                  >
                  <div className="h-[150px] md:h-[165px] flex items-center justify-center mb-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-[85%] object-contain"
                    />
                  </div>

                  <p className="text-[13px] leading-snug font-serif font-semibold text-[#7a2d2d] min-h-[34px]">
                    {product.name}
                  </p>
                  <p className="text-[18px] md:text-[20px] mt-1 text-[#b58921] font-semibold tracking-wide">
                    {product.price}
                  </p>

                  <div className="flex items-center gap-[4px] mt-1.5">
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className="w-2.5 h-2.5 rounded-full border border-[#d2c8ba]"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  </article>
                </Link>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <p className="mt-6 text-sm text-[#7a2d2d]">No products match the selected filters.</p>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

    </main>
  );
}