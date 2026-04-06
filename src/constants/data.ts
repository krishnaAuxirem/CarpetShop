import type { Product, BlogPost, Category, User, Order } from "@/types";

export const DEMO_USERS: User[] = [
  {
    id: "u1",
    name: "Demo Customer",
    email: "user@demo.com",
    role: "customer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=customer",
    phone: "+91 98765 43210",
    address: "123 MG Road, Bangalore, Karnataka 560001",
    createdAt: "2024-01-15",
    isActive: true,
  },
  {
    id: "u2",
    name: "Demo Seller",
    email: "seller@demo.com",
    role: "seller",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=seller",
    phone: "+91 91234 56789",
    address: "456 Trade Center, Mumbai, Maharashtra 400001",
    createdAt: "2024-01-10",
    isActive: true,
  },
  {
    id: "u3",
    name: "Admin User",
    email: "admin@demo.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    phone: "+91 88888 77777",
    address: "789 Admin Block, Delhi 110001",
    createdAt: "2023-12-01",
    isActive: true,
  },
];

export const CATEGORIES: Category[] = [
  {
    id: "cat1",
    name: "Persian Carpets",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    description: "Hand-knotted luxury Persian carpets",
    productCount: 48,
  },
  {
    id: "cat2",
    name: "Woolen Rugs",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80",
    description: "Soft and durable woolen rugs",
    productCount: 63,
  },
  {
    id: "cat3",
    name: "Flooring Solutions",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    description: "Modern flooring for every space",
    productCount: 35,
  },
  {
    id: "cat4",
    name: "Runner Rugs",
    image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&q=80",
    description: "Perfect for hallways and corridors",
    productCount: 27,
  },
  {
    id: "cat5",
    name: "Silk Carpets",
    image: "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=600&q=80",
    description: "Luxurious pure silk carpets",
    productCount: 19,
  },
  {
    id: "cat6",
    name: "Outdoor Rugs",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80",
    description: "Weather-resistant outdoor rugs",
    productCount: 22,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Royal Persian Medallion",
    description: "Hand-knotted masterpiece with traditional Persian medallion design. Made by master weavers with premium wool, this carpet features intricate floral patterns in rich burgundy and gold tones. Each piece takes 6 months to complete.",
    price: 45000,
    originalPrice: 65000,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
    ],
    category: "Persian Carpets",
    material: "Pure Wool",
    sizes: ["4x6 ft", "6x8 ft", "8x10 ft", "10x12 ft"],
    colors: ["Burgundy", "Navy Blue", "Forest Green", "Cream"],
    rating: 4.8,
    reviewCount: 124,
    stock: 15,
    sellerId: "u2",
    sellerName: "Heritage Carpets",
    tags: ["luxury", "persian", "hand-knotted", "bestseller"],
    isBestSeller: true,
    isFeatured: true,
    discount: 31,
    createdAt: "2024-01-15",
  },
  {
    id: "p2",
    name: "Modern Geometric Rug",
    description: "Contemporary geometric patterns with bold lines and minimalist design. Perfect for modern living rooms and offices. Made from premium New Zealand wool for superior softness and durability.",
    price: 12500,
    originalPrice: 18000,
    images: [
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    category: "Woolen Rugs",
    material: "New Zealand Wool",
    sizes: ["3x5 ft", "5x7 ft", "6x9 ft", "8x10 ft"],
    colors: ["Grey", "Black", "Ivory", "Charcoal"],
    rating: 4.5,
    reviewCount: 89,
    stock: 28,
    sellerId: "u2",
    sellerName: "Heritage Carpets",
    tags: ["modern", "geometric", "wool"],
    isNew: true,
    isFeatured: true,
    discount: 31,
    createdAt: "2024-02-10",
  },
  {
    id: "p3",
    name: "Kashmiri Silk Paradise",
    description: "Exquisite Kashmiri silk carpet with Paradise garden design. Woven with pure silk threads at 700 knots per square inch. A true work of art that adds unmatched elegance to any space.",
    price: 125000,
    originalPrice: 175000,
    images: [
      "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    category: "Silk Carpets",
    material: "Pure Silk",
    sizes: ["4x6 ft", "6x8 ft", "8x10 ft"],
    colors: ["Ivory", "Rose Gold", "Sapphire Blue"],
    rating: 4.9,
    reviewCount: 42,
    stock: 5,
    sellerId: "u2",
    sellerName: "Heritage Carpets",
    tags: ["silk", "kashmiri", "luxury", "art"],
    isFeatured: true,
    isBestSeller: true,
    discount: 29,
    createdAt: "2024-01-05",
  },
  {
    id: "p4",
    name: "Dhurrie Cotton Flatweave",
    description: "Traditional Indian dhurrie with vibrant geometric patterns. Made from 100% organic cotton, these flatweave rugs are perfect for casual spaces and are easy to clean.",
    price: 3800,
    originalPrice: 5500,
    images: [
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
    ],
    category: "Woolen Rugs",
    material: "Organic Cotton",
    sizes: ["3x5 ft", "4x6 ft", "5x8 ft"],
    colors: ["Blue", "Red", "Yellow", "Multi-color"],
    rating: 4.3,
    reviewCount: 156,
    stock: 42,
    sellerId: "u2",
    sellerName: "Heritage Carpets",
    tags: ["cotton", "dhurrie", "indian", "affordable"],
    discount: 31,
    createdAt: "2024-02-20",
  },
  {
    id: "p5",
    name: "Luxury Hall Runner",
    description: "Elegant runner rug for hallways and corridors. Features traditional floral patterns in warm earth tones. Made from premium wool blend for durability in high-traffic areas.",
    price: 8500,
    originalPrice: 12000,
    images: [
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    category: "Runner Rugs",
    material: "Wool Blend",
    sizes: ["2.5x8 ft", "2.5x10 ft", "2.5x12 ft", "2.5x14 ft"],
    colors: ["Terracotta", "Navy", "Sage Green", "Cream"],
    rating: 4.6,
    reviewCount: 73,
    stock: 20,
    sellerId: "u2",
    sellerName: "Heritage Carpets",
    tags: ["runner", "hallway", "floral"],
    isNew: true,
    discount: 29,
    createdAt: "2024-03-01",
  },
  {
    id: "p6",
    name: "Outdoor All-Weather Rug",
    description: "UV-resistant and waterproof outdoor rug with modern stripe design. Made from recycled polypropylene, it's perfect for patios, balconies, and outdoor areas.",
    price: 5200,
    originalPrice: 7800,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80",
    ],
    category: "Outdoor Rugs",
    material: "Recycled Polypropylene",
    sizes: ["4x6 ft", "5x8 ft", "6x9 ft", "8x10 ft"],
    colors: ["Teal", "Sand", "Coral", "Grey"],
    rating: 4.4,
    reviewCount: 98,
    stock: 35,
    sellerId: "u2",
    sellerName: "Heritage Carpets",
    tags: ["outdoor", "waterproof", "modern"],
    discount: 33,
    createdAt: "2024-02-28",
  },
  {
    id: "p7",
    name: "Jaipur Block Print Rug",
    description: "Hand block-printed rug from the artisans of Jaipur. Features traditional Rajasthani patterns with natural dyes. Each piece is unique, celebrating India's rich textile heritage.",
    price: 7200,
    originalPrice: 10500,
    images: [
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
      "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800&q=80",
    ],
    category: "Woolen Rugs",
    material: "Cotton with Natural Dyes",
    sizes: ["4x6 ft", "5x7 ft", "6x9 ft"],
    colors: ["Indigo", "Rust", "Ochre", "White"],
    rating: 4.7,
    reviewCount: 61,
    stock: 18,
    sellerId: "u2",
    sellerName: "Heritage Carpets",
    tags: ["jaipur", "block-print", "artisan", "rajasthan"],
    isBestSeller: true,
    discount: 31,
    createdAt: "2024-01-25",
  },
  {
    id: "p8",
    name: "Luxury Shag Rug",
    description: "Ultra-soft shag rug with extra-long pile for maximum comfort. Perfect for bedrooms and cozy corners. Made from high-quality microfiber for a plush, cloud-like feel.",
    price: 9800,
    originalPrice: 14500,
    images: [
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
    ],
    category: "Woolen Rugs",
    material: "Microfiber",
    sizes: ["4x6 ft", "5x7 ft", "6x9 ft", "8x10 ft"],
    colors: ["White", "Ivory", "Champagne", "Light Grey"],
    rating: 4.6,
    reviewCount: 112,
    stock: 22,
    sellerId: "u2",
    sellerName: "Heritage Carpets",
    tags: ["shag", "fluffy", "bedroom", "cozy"],
    isNew: true,
    discount: 32,
    createdAt: "2024-03-05",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "b1",
    title: "How to Choose the Perfect Carpet for Your Living Room",
    slug: "choose-perfect-carpet-living-room",
    excerpt: "Selecting the right carpet can transform your living room. Learn about materials, sizes, and design considerations to make the best choice.",
    content: `
# How to Choose the Perfect Carpet for Your Living Room

Choosing the perfect carpet for your living room is one of the most important interior design decisions you'll make. The right carpet can tie a room together, add warmth and comfort, and reflect your personal style.

## Consider the Room's Purpose

Before selecting a carpet, think about how the room is used. High-traffic areas require durable materials like wool or polypropylene, while a formal living room might benefit from the luxury of silk or fine wool.

## Material Matters

**Wool**: The gold standard in carpet materials. Naturally stain-resistant, durable, and beautiful. Wool carpets last 20-30 years with proper care.

**Silk**: Unmatched in luxury and sheen. Best for low-traffic formal areas. Requires professional cleaning.

**Cotton**: Affordable and easy to clean. Good for casual spaces but less durable than wool.

**Synthetic Fibers**: Modern synthetics like polypropylene and nylon offer excellent durability and are often stain-resistant.

## Size Guide

The most common mistake is choosing a carpet that's too small. Follow these rules:
- **Living Room**: Choose a rug large enough that all furniture legs sit on it, or at least the front legs
- **Standard Sizes**: 8x10 or 9x12 feet work well for most living rooms
- **Leave 18-24 inches** of bare floor around the rug edges

## Color and Pattern

Consider your existing furniture and wall colors. A neutral carpet provides flexibility for changing decor, while a patterned carpet can be the room's focal point.

## Care and Maintenance

Regular vacuuming, prompt stain treatment, and professional cleaning every 1-2 years will keep your carpet looking beautiful for years.
    `,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    author: "Priya Sharma",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    category: "Interior Design",
    tags: ["carpet guide", "interior design", "living room"],
    publishedAt: "2024-03-10",
    readTime: 5,
    isPublished: true,
  },
  {
    id: "b2",
    title: "The Art of Persian Carpet Weaving: A 2500-Year Tradition",
    slug: "art-persian-carpet-weaving",
    excerpt: "Explore the ancient craft of Persian carpet weaving, from the skilled artisans of Iran to the masterpieces adorning palaces and museums worldwide.",
    content: `
# The Art of Persian Carpet Weaving: A 2500-Year Tradition

Persian carpets are considered the pinnacle of carpet artistry, with a history spanning over 2,500 years. These magnificent textiles are not just floor coverings—they are works of art that tell stories, preserve cultural heritage, and showcase extraordinary craftsmanship.

## Origins and History

The oldest surviving carpet, the Pazyryk carpet (5th century BCE), demonstrates that sophisticated carpet weaving existed in ancient Persia. Persian carpets flourished during the Safavid dynasty (1501-1736), when royal workshops produced masterpieces for shahs and exported to European royalty.

## The Weaving Process

Creating a Persian carpet is an incredibly labor-intensive process:

1. **Design Creation**: Master designers create detailed patterns on graph paper
2. **Yarn Preparation**: Natural fibers are spun, dyed with natural materials
3. **Weaving**: Skilled weavers tie individual knots, row by row
4. **Finishing**: Washing, stretching, and clipping complete the carpet

## Knot Density

Quality is measured in knots per square inch (KPSI). Fine Persian carpets have:
- **Entry level**: 100-200 KPSI
- **Fine**: 200-500 KPSI  
- **Museum quality**: 500-1000+ KPSI

## Regional Styles

Different regions produce distinctive styles:
- **Tabriz**: Symmetrical designs, high knot density
- **Isfahan**: Floral patterns, rich colors
- **Qom**: Finest silk carpets
- **Kashan**: Medallion designs, deep colors

## Investment Value

Authentic Persian carpets appreciate in value over time. A quality carpet purchased today may be worth significantly more in 20-30 years.
    `,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    author: "Rajesh Kumar",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh",
    category: "Heritage & Culture",
    tags: ["persian carpet", "history", "craftsmanship"],
    publishedAt: "2024-03-05",
    readTime: 7,
    isPublished: true,
  },
  {
    id: "b3",
    title: "5 Ways to Care for Your Luxury Carpet",
    slug: "care-for-luxury-carpet",
    excerpt: "Proper maintenance can extend your carpet's life by decades. Follow these expert tips to keep your investment looking pristine for years to come.",
    content: `
# 5 Ways to Care for Your Luxury Carpet

A quality carpet is a significant investment, and proper care ensures it retains its beauty and value for generations. Follow these expert tips to maintain your luxury carpet.

## 1. Regular Vacuuming

Vacuum at least twice a week using a suction-only vacuum (avoid beater bars on fine carpets). This removes dirt before it settles deep into fibers and prevents premature wear.

## 2. Rotate Your Carpet

Rotate your carpet 180 degrees every 6 months to ensure even wear and sun exposure. This prevents uneven fading and traffic patterns.

## 3. Deal with Spills Immediately

Blot (never rub) spills immediately with a clean white cloth. Work from the outside inward to prevent spreading. For wool carpets, use cool water and mild detergent.

## 4. Use Rug Pads

A quality rug pad prevents slipping, reduces wear on carpet fibers, and protects your floor underneath. Replace every 5 years.

## 5. Professional Cleaning

Have your carpet professionally cleaned every 1-3 years depending on traffic. Professional cleaners use methods appropriate for your carpet's material and construction.

## Storing Your Carpet

If storing, roll (never fold) the carpet around an acid-free tube, wrap in breathable cotton, and store in a cool, dry place. Never store in plastic.
    `,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
    author: "Meera Patel",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=meera",
    category: "Care & Maintenance",
    tags: ["carpet care", "maintenance", "tips"],
    publishedAt: "2024-02-28",
    readTime: 4,
    isPublished: true,
  },
  {
    id: "b4",
    title: "2024 Carpet Trends: What's Hot in Interior Design",
    slug: "2024-carpet-trends",
    excerpt: "From bold geometric patterns to sustainable natural fibers, discover the carpet trends that are dominating interior design in 2024.",
    content: `
# 2024 Carpet Trends: What's Hot in Interior Design

The carpet and rug industry sees exciting new trends each year, influenced by global design movements, sustainability concerns, and changing lifestyles.

## 1. Natural and Sustainable Materials

Eco-consciousness drives demand for organic wool, hemp, jute, and recycled fiber carpets. Consumers increasingly choose products that are both beautiful and environmentally responsible.

## 2. Bold, Oversized Patterns

Large-scale geometric and abstract patterns make a bold statement. Gone are the days of timid, small-repeat patterns—2024 embraces carpets as the room's hero piece.

## 3. Earthy, Warm Tones

Terracotta, burnt orange, warm browns, and sandy neutrals reflect the broader interior design trend toward connection with nature and biophilic design.

## 4. Mixed Textures

Combining different pile heights, materials, and weave techniques creates visual interest and tactile richness. Flatweaves mixed with shag sections offer modern artistic appeal.

## 5. Heritage Revival

Traditional patterns from Indian, Moroccan, and Persian traditions are being reinterpreted in contemporary colorways for a fresh take on classics.

## 6. Custom and Bespoke Carpets

Personalization is king. Custom-sized, custom-colored, and even custom-designed carpets allow homeowners to create truly unique spaces.
    `,
    image: "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800&q=80",
    author: "Anita Desai",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anita",
    category: "Trends",
    tags: ["trends 2024", "interior design", "modern"],
    publishedAt: "2024-02-15",
    readTime: 6,
    isPublished: true,
  },
];

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Sunita Agarwal",
    location: "Mumbai, Maharashtra",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sunita",
    rating: 5,
    comment: "The Persian carpet I ordered exceeded all expectations. The quality is outstanding, and the customization service allowed me to get exactly the size and color I wanted for my living room.",
    product: "Royal Persian Medallion",
  },
  {
    id: "t2",
    name: "Vikram Malhotra",
    location: "Delhi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
    rating: 5,
    comment: "Exceptional quality and service! The Kashmiri silk carpet is absolutely breathtaking. It arrived well-packaged and the delivery was prompt. Will definitely order again.",
    product: "Kashmiri Silk Paradise",
  },
  {
    id: "t3",
    name: "Priya Krishnamurthy",
    location: "Chennai, Tamil Nadu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priyak",
    rating: 4,
    comment: "Great selection of rugs at reasonable prices. The customization tool made it easy to visualize how the carpet would look in my home. Customer support was also very helpful.",
    product: "Modern Geometric Rug",
  },
  {
    id: "t4",
    name: "Rahul Sharma",
    location: "Jaipur, Rajasthan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahuls",
    rating: 5,
    comment: "As someone who appreciates traditional craftsmanship, I'm impressed by the authentic Jaipur block print rug. The colors are vibrant and it adds so much character to my office.",
    product: "Jaipur Block Print Rug",
  },
  {
    id: "t5",
    name: "Deepa Venkataraman",
    location: "Bangalore, Karnataka",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=deepa",
    rating: 5,
    comment: "Ordered two outdoor rugs for my balcony and they're perfect! Weather-resistant as promised, and the modern design complements my outdoor furniture beautifully.",
    product: "Outdoor All-Weather Rug",
  },
  {
    id: "t6",
    name: "Arjun Mehta",
    location: "Pune, Maharashtra",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun",
    rating: 4,
    comment: "The shag rug is incredibly soft and luxurious. My bedroom feels like a 5-star hotel now! Delivery was on time and the packaging was excellent.",
    product: "Luxury Shag Rug",
  },
];

export const MATERIALS = [
  "Pure Wool",
  "New Zealand Wool",
  "Pure Silk",
  "Organic Cotton",
  "Wool Blend",
  "Recycled Polypropylene",
  "Microfiber",
  "Jute",
  "Bamboo Silk",
];

export const CARPET_SIZES = [
  "2x3 ft",
  "2.5x8 ft",
  "2.5x10 ft",
  "2.5x12 ft",
  "3x5 ft",
  "4x6 ft",
  "5x7 ft",
  "5x8 ft",
  "6x8 ft",
  "6x9 ft",
  "8x10 ft",
  "8x11 ft",
  "9x12 ft",
  "10x12 ft",
  "Custom",
];

export const CARPET_COLORS = [
  "Ivory", "Cream", "Beige", "White",
  "Burgundy", "Red", "Rose", "Coral",
  "Navy Blue", "Blue", "Teal", "Turquoise",
  "Forest Green", "Sage", "Olive",
  "Gold", "Ochre", "Yellow",
  "Charcoal", "Grey", "Black",
  "Brown", "Terracotta", "Rust",
  "Multi-color",
];

export const CARPET_DESIGNS = [
  "Medallion", "Floral", "Geometric", "Abstract",
  "Tribal", "Striped", "Solid", "Paisley",
  "Damask", "Bohemian", "Modern", "Traditional",
];

export const ORDER_STATUSES = [
  { status: "pending", label: "Order Placed", icon: "ShoppingBag" },
  { status: "confirmed", label: "Confirmed", icon: "CheckCircle" },
  { status: "processing", label: "Processing", icon: "Cog" },
  { status: "shipped", label: "Shipped", icon: "Truck" },
  { status: "out_for_delivery", label: "Out for Delivery", icon: "MapPin" },
  { status: "delivered", label: "Delivered", icon: "PackageCheck" },
];

export const PRICE_MULTIPLIERS: Record<string, number> = {
  "Pure Wool": 1.0,
  "New Zealand Wool": 1.2,
  "Pure Silk": 3.5,
  "Organic Cotton": 0.6,
  "Wool Blend": 0.8,
  "Recycled Polypropylene": 0.5,
  "Microfiber": 0.7,
  "Jute": 0.45,
  "Bamboo Silk": 1.8,
};

export const SIZE_MULTIPLIERS: Record<string, number> = {
  "2x3 ft": 0.3,
  "2.5x8 ft": 0.6,
  "2.5x10 ft": 0.7,
  "2.5x12 ft": 0.8,
  "3x5 ft": 0.4,
  "4x6 ft": 0.6,
  "5x7 ft": 0.8,
  "5x8 ft": 0.9,
  "6x8 ft": 1.0,
  "6x9 ft": 1.1,
  "8x10 ft": 1.5,
  "8x11 ft": 1.7,
  "9x12 ft": 2.0,
  "10x12 ft": 2.3,
  "Custom": 2.5,
};

export const SAMPLE_ORDERS: Order[] = [
  {
    id: "ORD-2024-001",
    userId: "u1",
    userName: "Demo Customer",
    items: [
      {
        productId: "p1",
        product: PRODUCTS[0],
        quantity: 1,
        selectedSize: "6x8 ft",
        selectedColor: "Burgundy",
        unitPrice: 45000,
      },
    ],
    totalAmount: 46800,
    status: "delivered",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    shippingAddress: {
      name: "Demo Customer",
      phone: "+91 98765 43210",
      line1: "123 MG Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
    },
    createdAt: "2024-02-10",
    updatedAt: "2024-02-18",
    estimatedDelivery: "2024-02-20",
    trackingNumber: "CS2024001789",
  },
  {
    id: "ORD-2024-002",
    userId: "u1",
    userName: "Demo Customer",
    items: [
      {
        productId: "p4",
        product: PRODUCTS[3],
        quantity: 2,
        selectedSize: "4x6 ft",
        selectedColor: "Blue",
        unitPrice: 3800,
      },
    ],
    totalAmount: 8599,
    status: "shipped",
    paymentMethod: "Credit Card",
    paymentStatus: "paid",
    shippingAddress: {
      name: "Demo Customer",
      phone: "+91 98765 43210",
      line1: "123 MG Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
    },
    createdAt: "2024-03-01",
    updatedAt: "2024-03-05",
    estimatedDelivery: "2024-03-10",
    trackingNumber: "CS2024002456",
  },
];
