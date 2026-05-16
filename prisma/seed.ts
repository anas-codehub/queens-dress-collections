
import { PrismaClient } from "@/lib/generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import bcrypt from "bcryptjs"
const adapter = new PrismaNeon({ 
  connectionString: process.env.DATABASE_URL! 
})

const db = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database...")

  // ─── Clean existing data ───────────────────────────────────────────────────
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.cartItem.deleteMany()
  await db.wishlistItem.deleteMany()
  await db.review.deleteMany()
  await db.coupon.deleteMany()
  await db.productVariant.deleteMany()
  await db.productImage.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()
  await db.address.deleteMany()
  await db.user.deleteMany()

  console.log("✅ Cleaned existing data")

  // ─── Admin User ───────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await db.user.create({
    data: {
      name:     "Admin",
      email:    "admin@queensdress.com",
      password: adminPassword,
      role:     "ADMIN",
      phone:    "01700000000",
    },
  })
  console.log("✅ Admin user created:", admin.email)

  // ─── Customer Users ───────────────────────────────────────────────────────
  const customerPassword = await bcrypt.hash("customer123", 12)
  const customers = await Promise.all([
    db.user.create({
      data: {
        name:     "Fatima Rahman",
        email:    "fatima@example.com",
        password: customerPassword,
        role:     "CUSTOMER",
        phone:    "01711111111",
      },
    }),
    db.user.create({
      data: {
        name:     "Nusrat Jahan",
        email:    "nusrat@example.com",
        password: customerPassword,
        role:     "CUSTOMER",
        phone:    "01722222222",
      },
    }),
    db.user.create({
      data: {
        name:     "Sumaiya Islam",
        email:    "sumaiya@example.com",
        password: customerPassword,
        role:     "CUSTOMER",
        phone:    "01733333333",
      },
    }),
  ])
  console.log("✅ Customer users created")

  // ─── Categories ───────────────────────────────────────────────────────────
  const categories = await Promise.all([
    db.category.create({
      data: {
        name:      "Maxi Dresses",
        slug:      "maxi-dresses",
        image:     "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
        isActive:  true,
        sortOrder: 1,
      },
    }),
    db.category.create({
      data: {
        name:      "Midi Dresses",
        slug:      "midi-dresses",
        image:     "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400",
        isActive:  true,
        sortOrder: 2,
      },
    }),
    db.category.create({
      data: {
        name:      "Evening Gowns",
        slug:      "evening-gowns",
        image:     "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
        isActive:  true,
        sortOrder: 3,
      },
    }),
    db.category.create({
      data: {
        name:      "Casual Dresses",
        slug:      "casual-dresses",
        image:     "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400",
        isActive:  true,
        sortOrder: 4,
      },
    }),
    db.category.create({
      data: {
        name:      "Co-ord Sets",
        slug:      "coord-sets",
        image:     "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
        isActive:  true,
        sortOrder: 5,
      },
    }),
    db.category.create({
      data: {
        name:      "Occasion Wear",
        slug:      "occasion-wear",
        image:     "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400",
        isActive:  true,
        sortOrder: 6,
      },
    }),
  ])
  console.log("✅ Categories created")

  // ─── Products ─────────────────────────────────────────────────────────────
  const productData = [
    {
      name:         "Linen Wrap Dress",
      slug:         "linen-wrap-dress",
      description:  "A beautifully crafted linen wrap dress that effortlessly blends comfort with elegance.\nThe relaxed silhouette drapes gracefully, making it perfect for both casual outings and semi-formal occasions.\nMade from 100% premium linen with a soft inner lining for all-day comfort.",
      price:        7200,
      comparePrice: 9500,
      categoryId:   categories[3].id,
      isActive:     true,
      isFeatured:   true,
      isNew:        true,
      tags:         ["linen", "wrap", "casual", "summer"],
      images: [
        { url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600", isPrimary: true,  sortOrder: 0 },
        { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600", isPrimary: false, sortOrder: 1 },
      ],
      variants: [
        { size: "XS", color: "Natural", colorHex: "#c8b8a0", sku: "LWD-XS-NAT", stock: 10, price: null },
        { size: "S",  color: "Natural", colorHex: "#c8b8a0", sku: "LWD-S-NAT",  stock: 15, price: null },
        { size: "M",  color: "Natural", colorHex: "#c8b8a0", sku: "LWD-M-NAT",  stock: 12, price: null },
        { size: "L",  color: "Natural", colorHex: "#c8b8a0", sku: "LWD-L-NAT",  stock: 8,  price: null },
        { size: "XL", color: "Natural", colorHex: "#c8b8a0", sku: "LWD-XL-NAT", stock: 5,  price: null },
        { size: "S",  color: "Ivory",   colorHex: "#f5f0ea", sku: "LWD-S-IVO",  stock: 10, price: null },
        { size: "M",  color: "Ivory",   colorHex: "#f5f0ea", sku: "LWD-M-IVO",  stock: 8,  price: null },
      ],
      coupons: [
        {
          code:       "LINEN20",
          type:       "PERCENT",
          value:      20,
          minOrder:   5000,
          usageLimit: 50,
          isActive:   true,
        },
      ],
    },
    {
      name:         "Satin Midi Dress",
      slug:         "satin-midi-dress",
      description:  "A luxurious satin midi dress perfect for evening occasions.\nThe fluid silhouette skims the body beautifully, while the rich satin fabric catches the light elegantly.\nPaired with heels or flats for effortless glamour.",
      price:        5400,
      comparePrice: 8200,
      categoryId:   categories[1].id,
      isActive:     true,
      isFeatured:   true,
      isNew:        false,
      tags:         ["satin", "midi", "evening", "elegant"],
      images: [
        { url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600", isPrimary: true,  sortOrder: 0 },
        { url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600", isPrimary: false, sortOrder: 1 },
      ],
      variants: [
        { size: "XS", color: "Nude",  colorHex: "#c8a882", sku: "SMD-XS-NUD", stock: 8,  price: null },
        { size: "S",  color: "Nude",  colorHex: "#c8a882", sku: "SMD-S-NUD",  stock: 12, price: null },
        { size: "M",  color: "Nude",  colorHex: "#c8a882", sku: "SMD-M-NUD",  stock: 10, price: null },
        { size: "L",  color: "Nude",  colorHex: "#c8a882", sku: "SMD-L-NUD",  stock: 6,  price: null },
        { size: "S",  color: "Black", colorHex: "#1a1a1a", sku: "SMD-S-BLK",  stock: 15, price: null },
        { size: "M",  color: "Black", colorHex: "#1a1a1a", sku: "SMD-M-BLK",  stock: 10, price: null },
        { size: "L",  color: "Black", colorHex: "#1a1a1a", sku: "SMD-L-BLK",  stock: 8,  price: null },
      ],
      coupons: [],
    },
    {
      name:         "Floral Maxi Dress",
      slug:         "floral-maxi-dress",
      description:  "A stunning floral maxi dress that embodies summer elegance.\nThe flowing silhouette and vibrant floral print make it perfect for garden parties and summer events.\nCrafted from lightweight chiffon for ultimate comfort.",
      price:        6800,
      comparePrice: null,
      categoryId:   categories[0].id,
      isActive:     true,
      isFeatured:   false,
      isNew:        true,
      tags:         ["floral", "maxi", "summer", "chiffon"],
      images: [
        { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600", isPrimary: true,  sortOrder: 0 },
      ],
      variants: [
        { size: "XS", color: "Floral", colorHex: "#d4a5a5", sku: "FMD-XS", stock: 10, price: null },
        { size: "S",  color: "Floral", colorHex: "#d4a5a5", sku: "FMD-S",  stock: 14, price: null },
        { size: "M",  color: "Floral", colorHex: "#d4a5a5", sku: "FMD-M",  stock: 10, price: null },
        { size: "L",  color: "Floral", colorHex: "#d4a5a5", sku: "FMD-L",  stock: 7,  price: null },
        { size: "XL", color: "Floral", colorHex: "#d4a5a5", sku: "FMD-XL", stock: 4,  price: null },
      ],
      coupons: [],
    },
    {
      name:         "Cream Blazer Dress",
      slug:         "cream-blazer-dress",
      description:  "A sophisticated blazer dress that transitions seamlessly from office to evening.\nTailored to perfection with a structured silhouette that flatters every figure.\nPair with heels for a powerful, polished look.",
      price:        9500,
      comparePrice: null,
      categoryId:   categories[3].id,
      isActive:     true,
      isFeatured:   true,
      isNew:        true,
      tags:         ["blazer", "office", "sophisticated", "tailored"],
      images: [
        { url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600", isPrimary: true,  sortOrder: 0 },
      ],
      variants: [
        { size: "XS", color: "Cream", colorHex: "#f5f0ea", sku: "CBD-XS", stock: 6,  price: null },
        { size: "S",  color: "Cream", colorHex: "#f5f0ea", sku: "CBD-S",  stock: 10, price: null },
        { size: "M",  color: "Cream", colorHex: "#f5f0ea", sku: "CBD-M",  stock: 8,  price: null },
        { size: "L",  color: "Cream", colorHex: "#f5f0ea", sku: "CBD-L",  stock: 5,  price: null },
      ],
      coupons: [
        {
          code:       "BLAZER15",
          type:       "PERCENT",
          value:      15,
          minOrder:   8000,
          usageLimit: 30,
          isActive:   true,
        },
      ],
    },
    {
      name:         "Beige Slip Dress",
      slug:         "beige-slip-dress",
      description:  "A minimalist slip dress in the most versatile beige tone.\nThe sleek silhouette and luxe fabric drape beautifully for an effortlessly chic look.\nStyle alone or layer over a crisp white tee.",
      price:        4900,
      comparePrice: null,
      categoryId:   categories[3].id,
      isActive:     true,
      isFeatured:   true,
      isNew:        false,
      tags:         ["slip", "minimal", "beige", "versatile"],
      images: [
        { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600", isPrimary: true,  sortOrder: 0 },
      ],
      variants: [
        { size: "XS", color: "Beige", colorHex: "#e8d5b0", sku: "BSD-XS", stock: 12, price: null },
        { size: "S",  color: "Beige", colorHex: "#e8d5b0", sku: "BSD-S",  stock: 18, price: null },
        { size: "M",  color: "Beige", colorHex: "#e8d5b0", sku: "BSD-M",  stock: 15, price: null },
        { size: "L",  color: "Beige", colorHex: "#e8d5b0", sku: "BSD-L",  stock: 10, price: null },
        { size: "XL", color: "Beige", colorHex: "#e8d5b0", sku: "BSD-XL", stock: 6,  price: null },
      ],
      coupons: [],
    },
    {
      name:         "Nude Pleated Gown",
      slug:         "nude-pleated-gown",
      description:  "A breathtaking pleated gown that commands attention at any formal event.\nThe intricate pleating creates a sculptural silhouette that moves beautifully.\nCrafted from premium georgette for an ethereal finish.",
      price:        14200,
      comparePrice: 18000,
      categoryId:   categories[2].id,
      isActive:     true,
      isFeatured:   true,
      isNew:        false,
      tags:         ["gown", "pleated", "formal", "georgette"],
      images: [
        { url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600", isPrimary: true,  sortOrder: 0 },
      ],
      variants: [
        { size: "XS", color: "Nude",  colorHex: "#c8a882", sku: "NPG-XS-NUD", stock: 4,  price: null },
        { size: "S",  color: "Nude",  colorHex: "#c8a882", sku: "NPG-S-NUD",  stock: 6,  price: null },
        { size: "M",  color: "Nude",  colorHex: "#c8a882", sku: "NPG-M-NUD",  stock: 5,  price: null },
        { size: "L",  color: "Nude",  colorHex: "#c8a882", sku: "NPG-L-NUD",  stock: 3,  price: null },
        { size: "S",  color: "Ivory", colorHex: "#f5f0ea", sku: "NPG-S-IVO",  stock: 4,  price: null },
        { size: "M",  color: "Ivory", colorHex: "#f5f0ea", sku: "NPG-M-IVO",  stock: 3,  price: null },
      ],
      coupons: [
        {
          code:       "GOWN10",
          type:       "PERCENT",
          value:      10,
          minOrder:   12000,
          usageLimit: 20,
          isActive:   true,
        },
      ],
    },
    {
      name:         "Ivory Co-ord Set",
      slug:         "ivory-coord-set",
      description:  "A chic co-ord set in pristine ivory that exudes understated luxury.\nThe matching top and skirt can be worn together or styled separately for versatile looks.\nCrafted from premium cotton-blend fabric.",
      price:        8800,
      comparePrice: null,
      categoryId:   categories[4].id,
      isActive:     true,
      isFeatured:   false,
      isNew:        true,
      tags:         ["coord", "ivory", "matching", "versatile"],
      images: [
        { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600", isPrimary: true,  sortOrder: 0 },
      ],
      variants: [
        { size: "XS", color: "Ivory", colorHex: "#f5f0ea", sku: "ICS-XS", stock: 8,  price: null },
        { size: "S",  color: "Ivory", colorHex: "#f5f0ea", sku: "ICS-S",  stock: 12, price: null },
        { size: "M",  color: "Ivory", colorHex: "#f5f0ea", sku: "ICS-M",  stock: 10, price: null },
        { size: "L",  color: "Ivory", colorHex: "#f5f0ea", sku: "ICS-L",  stock: 6,  price: null },
      ],
      coupons: [],
    },
    {
      name:         "Camel Wrap Midi",
      slug:         "camel-wrap-midi",
      description:  "A timeless wrap midi dress in warm camel tone.\nThe adjustable wrap design flatters all body types while the midi length adds elegance.\nPerfect for work or weekend brunches.",
      price:        6200,
      comparePrice: 7500,
      categoryId:   categories[1].id,
      isActive:     true,
      isFeatured:   false,
      isNew:        false,
      tags:         ["wrap", "camel", "midi", "work"],
      images: [
        { url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600", isPrimary: true,  sortOrder: 0 },
      ],
      variants: [
        { size: "XS", color: "Camel", colorHex: "#b07850", sku: "CWM-XS", stock: 8,  price: null },
        { size: "S",  color: "Camel", colorHex: "#b07850", sku: "CWM-S",  stock: 14, price: null },
        { size: "M",  color: "Camel", colorHex: "#b07850", sku: "CWM-M",  stock: 12, price: null },
        { size: "L",  color: "Camel", colorHex: "#b07850", sku: "CWM-L",  stock: 7,  price: null },
        { size: "XL", color: "Camel", colorHex: "#b07850", sku: "CWM-XL", stock: 4,  price: null },
      ],
      coupons: [],
    },
    {
      name:         "Stone Wrap Dress",
      slug:         "stone-wrap-dress",
      description:  "A sophisticated wrap dress in a muted stone tone.\nThe V-neckline and wrap silhouette create a flattering shape for all figures.\nMade from a premium crepe fabric that drapes beautifully.",
      price:        5900,
      comparePrice: 7200,
      categoryId:   categories[3].id,
      isActive:     true,
      isFeatured:   false,
      isNew:        false,
      tags:         ["wrap", "stone", "crepe", "versatile"],
      images: [
        { url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600", isPrimary: true,  sortOrder: 0 },
      ],
      variants: [
        { size: "S",  color: "Stone", colorHex: "#9a9080", sku: "SWD-S",  stock: 10, price: null },
        { size: "M",  color: "Stone", colorHex: "#9a9080", sku: "SWD-M",  stock: 12, price: null },
        { size: "L",  color: "Stone", colorHex: "#9a9080", sku: "SWD-L",  stock: 8,  price: null },
        { size: "XL", color: "Stone", colorHex: "#9a9080", sku: "SWD-XL", stock: 5,  price: null },
      ],
      coupons: [],
    },
    {
      name:         "Taupe Evening Gown",
      slug:         "taupe-evening-gown",
      description:  "A show-stopping evening gown in sophisticated taupe.\nThe floor-length silhouette and delicate draping make it perfect for black tie events.\nHand-finished with intricate details for a couture feel.",
      price:        16500,
      comparePrice: null,
      categoryId:   categories[2].id,
      isActive:     true,
      isFeatured:   true,
      isNew:        true,
      tags:         ["gown", "taupe", "evening", "formal"],
      images: [
        { url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600", isPrimary: true,  sortOrder: 0 },
      ],
      variants: [
        { size: "XS", color: "Taupe", colorHex: "#b5a090", sku: "TEG-XS", stock: 3,  price: null },
        { size: "S",  color: "Taupe", colorHex: "#b5a090", sku: "TEG-S",  stock: 5,  price: null },
        { size: "M",  color: "Taupe", colorHex: "#b5a090", sku: "TEG-M",  stock: 4,  price: null },
        { size: "L",  color: "Taupe", colorHex: "#b5a090", sku: "TEG-L",  stock: 2,  price: null },
      ],
      coupons: [
        {
          code:       "TAUPE5",
          type:       "PERCENT",
          value:      5,
          minOrder:   15000,
          usageLimit: 10,
          isActive:   true,
        },
      ],
    },
  ]

  // Create products
  for (const data of productData) {
    const { images, variants, coupons, ...productFields } = data
    await db.product.create({
      data: {
        ...productFields,
        images:   { create: images   },
        variants: { create: variants },
        coupons:  { create: coupons  },
      },
    })
  }
  console.log("✅ Products created")

  // ─── Site Settings ────────────────────────────────────────────────────────
  const settings = [
    { key: "storeName",           value: "Queens Dress Collection"                                              },
    { key: "storeTagline",        value: "Timeless elegance, crafted exclusively for her."                      },
    { key: "storeEmail",          value: "hello@queensdress.com"                                                },
    { key: "storePhone",          value: "01700000000"                                                          },
    { key: "announcementText",    value: "Free delivery on orders over ৳3,000 — Use code QUEEN20 for 20% off"  },
    { key: "announcementExtra",   value: "New Summer 2026 Collection — Shop Now"                                },
    { key: "heroTag",             value: "Summer Collection 2026"                                               },
    { key: "heroHeadline",        value: "Dressed for the woman you are"                                        },
    { key: "heroSubtext",         value: "Timeless silhouettes and luxurious fabrics, crafted exclusively for her." },
    { key: "heroCta",             value: "Shop Collection"                                                      },
    { key: "heroCtaLink",         value: "/shop"                                                                },
    { key: "heroCtaSecondary",    value: "View Lookbook"                                                        },
    { key: "heroCtaSecLink",      value: "/collections"                                                         },
    { key: "promoBannerTag",      value: "Limited Time"                                                         },
    { key: "promoBannerTitle",    value: "The Summer Edit"                                                      },
    { key: "promoBannerText",     value: "Up to 40% off selected styles — this week only."                      },
    { key: "promoBannerCta",      value: "Shop the Sale"                                                        },
    { key: "promoBannerLink",     value: "/sale"                                                                 },
    { key: "marqueeItems",        value: JSON.stringify(["New Arrivals", "Summer 2026", "Free Returns", "Exclusively For Her", "Queens Dress Collection"]) },
    { key: "freeShippingThreshold", value: "3000"                                                               },
    { key: "shippingCost",        value: "120"                                                                   },
    { key: "footerTagline",       value: "Timeless elegance, crafted exclusively for her."                      },
  ]

  for (const setting of settings) {
    await db.siteSettings.upsert({
      where:  { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }
  console.log("✅ Site settings seeded")

  // ─── Sample Orders ────────────────────────────────────────────────────────
  const products = await db.product.findMany({ take: 3 })
  const address  = await db.address.create({
    data: {
      userId:    customers[0].id,
      name:      "Fatima Rahman",
      phone:     "01711111111",
      line1:     "House 12, Road 5",
      city:      "Dhaka",
      district:  "Dhaka",
      isDefault: true,
    },
  })

  await db.order.create({
    data: {
      orderNumber:   "QDC-001-2026",
      userId:        customers[0].id,
      addressId:     address.id,
      subtotal:      7200,
      shipping:      0,
      total:         7200,
      status:        "DELIVERED",
      paymentStatus: "PAID",
      paymentMethod: "BKASH",
      items: {
        create: [{
          productId: products[0].id,
          name:      products[0].name,
          price:     products[0].price,
          quantity:  1,
          size:      "M",
          color:     "Natural",
        }],
      },
    },
  })

  await db.order.create({
    data: {
      orderNumber:   "QDC-002-2026",
      userId:        customers[1].id,
      addressId:     address.id,
      subtotal:      12200,
      shipping:      0,
      total:         12200,
      status:        "PROCESSING",
      paymentStatus: "PAID",
      paymentMethod: "CARD",
      items: {
        create: [
          {
            productId: products[1].id,
            name:      products[1].name,
            price:     products[1].price,
            quantity:  1,
            size:      "S",
            color:     "Nude",
          },
          {
            productId: products[2].id,
            name:      products[2].name,
            price:     products[2].price,
            quantity:  1,
            size:      "M",
            color:     "Floral",
          },
        ],
      },
    },
  })

  await db.order.create({
    data: {
      orderNumber:   "QDC-003-2026",
      userId:        customers[2].id,
      addressId:     address.id,
      subtotal:      4900,
      shipping:      120,
      total:         5020,
      status:        "PENDING",
      paymentStatus: "UNPAID",
      paymentMethod: "COD",
      items: {
        create: [{
          productId: products[0].id,
          name:      products[0].name,
          price:     4900,
          quantity:  1,
          size:      "L",
          color:     "Beige",
        }],
      },
    },
  })
  console.log("✅ Sample orders created")

  // ─── Reviews ──────────────────────────────────────────────────────────────
  await db.review.createMany({
    data: [
      {
        productId:  products[0].id,
        userId:     customers[0].id,
        rating:     5,
        title:      "Absolutely love it!",
        body:       "The quality is outstanding and the fit is perfect. I've received so many compliments wearing this dress.",
        isApproved: true,
      },
      {
        productId:  products[0].id,
        userId:     customers[1].id,
        rating:     4,
        title:      "Beautiful dress",
        body:       "The fabric is lovely and the color is exactly as shown. Sizing runs slightly large but overall very happy.",
        isApproved: true,
      },
      {
        productId:  products[1].id,
        userId:     customers[2].id,
        rating:     5,
        title:      "Perfect for my wedding",
        body:       "I wore this to a wedding and felt like royalty. The satin is so luxurious and the cut is very flattering.",
        isApproved: true,
      },
    ],
  })
  console.log("✅ Reviews created")

  console.log("\n🎉 Seeding complete!")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("Admin:    admin@queensdress.com / admin123")
  console.log("Customer: fatima@example.com / customer123")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })