export type Product = {
  id: number;
  name: string;
  desc: string;
  price: number;
  imageUrl: string;
  stock?: number;
  active?: boolean;
};

export type OrderRecord = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  governorate: string;
  address: string;
  total: number;
  itemCount: number;
  status: "جديد" | "قيد التجهيز" | "خرج للتوصيل" | "مكتمل" | "ملغي";
  createdAt: string;
};

export const STORAGE_KEYS = {
  products: "oasis-admin-products",
  orders: "oasis-admin-orders",
  settings: "oasis-admin-settings",
} as const;

export const defaultProducts: Product[] = [
  {
    id: 1,
    name: "مياه الواحة 200 مل",
    desc: "مياه شرب نقية معبأة في عبوة عملية وآمنة، مثالية للمدارس والفعاليات والضيافة اليومية.",
    price: 0.35,
    stock: 142,
    active: true,
    imageUrl: "https://static.wixstatic.com/media/9a2b6b_3ba353d8d2aa4508a16b722c8c43063d~mv2.png",
  },
  {
    id: 2,
    name: "مياه الواحة 330 مل",
    desc: "حجم مثالي للمنزل والعمل والمدارس والرحلات، بنقاء موثوق وطعم منعش في كل عبوة.",
    price: 0.4,
    stock: 96,
    active: true,
    imageUrl: "https://static.wixstatic.com/media/9a2b6b_92281550ca954f63a7792fcdb735848d~mv2.png",
  },
  {
    id: 3,
    name: "مياه الواحة 500 مل",
    desc: "عبوة يومية متوازنة وسهلة الحمل، مناسبة للاستخدام الشخصي وفي المكتب وأثناء التنقل.",
    price: 0.4,
    stock: 84,
    active: true,
    imageUrl: "https://static.wixstatic.com/media/9a2b6b_13e4d87b194d4b72a03a196923ae0220~mv2.png",
  },
  {
    id: 4,
    name: "مياه الواحة 1.5 لتر",
    desc: "الاختيار العائلي للوجبات والاستخدام اليومي، بعبوة قوية تحافظ على جودة ونقاء المياه.",
    price: 0.55,
    stock: 67,
    active: true,
    imageUrl: "https://static.wixstatic.com/media/9a2b6b_378cfab9e26e404dab0fb7c85f2cce4b~mv2.png",
  },
  {
    id: 5,
    name: "جالون مياه الواحة 5 لتر",
    desc: "جالون عملي قابل للاسترداد للمنازل والمكاتب، مع خدمة تبديل وتوصيل منتظمة إلى بابك.",
    price: 1.5,
    stock: 31,
    active: true,
    imageUrl: "https://static.wixstatic.com/media/9a2b6b_b0a80f2d5bb2425487648c47119aa8cd~mv2.png",
  },
  {
    id: 6,
    name: "موزع مياه ساخن وبارد",
    desc: "موزع أنيق وسهل الاستخدام للمكتب والمنزل، يوفر الماء البارد والساخن طوال اليوم.",
    price: 15,
    stock: 8,
    active: true,
    imageUrl: "https://static.wixstatic.com/media/9a2b6b_25ff8155380e4a1ebd107fbd83cd9a3e~mv2.png",
  },
];

export const governorates = [
  "مسقط", "ظفار", "مسندم", "البريمي", "الداخلية", "شمال الشرقية",
  "جنوب الشرقية", "شمال الباطنة", "جنوب الباطنة", "الوسطى", "الظاهرة",
];
