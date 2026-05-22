"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Types matching shared domain types
interface LocalProduct {
  id: string;
  name: string;
  category: string;
  price: number; // in rubles for UI
  unit: string;
  minQuantity: number;
  orderStep: number;
  stockQuantity: number;
  storageConditions?: string;
  status: "active" | "out_of_stock";
}

interface LocalOrderItem {
  productId: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

interface LocalOrder {
  id: string;
  number: string;
  customerName: string;
  phone: string;
  address: string;
  status: "new" | "preparing" | "delivered" | "cancelled";
  deliveryDate: string;
  deliveryWindow: string;
  items: LocalOrderItem[];
  deliveryFee: number;
  cancelReason?: string;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  sender: "supplier" | "customer";
  text: string;
  time: string;
}

interface Chat {
  id: string;
  customerName: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: ChatMessage[];
}

export default function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "orders" | "products" | "delivery" | "messages" | "analytics" | "profile"
  >("dashboard");

  // --- MOCK STATE ---
  
  // 1. Products State
  const [products, setProducts] = useState<LocalProduct[]>([
    {
      id: "prod_1",
      name: "Картофель молодой",
      category: "Овощи и зелень",
      price: 38,
      unit: "кг",
      minQuantity: 10,
      orderStep: 5,
      stockQuantity: 450,
      storageConditions: "Хранить в сухом прохладном месте при температуре +2...+8°C",
      status: "active",
    },
    {
      id: "prod_2",
      name: "Яйца куриные C0 (упаковка 30 шт)",
      category: "Бакалея",
      price: 300,
      unit: "уп",
      minQuantity: 30,
      orderStep: 30,
      stockQuantity: 900,
      storageConditions: "Хранить при температуре от 0 до +20°C",
      status: "active",
    },
    {
      id: "prod_3",
      name: "Молоко фермерское 3.2%",
      category: "Молочные продукты",
      price: 85,
      unit: "л",
      minQuantity: 6,
      orderStep: 1,
      stockQuantity: 200,
      storageConditions: "Хранить при температуре +2...+6°C",
      status: "active",
    },
    {
      id: "prod_4",
      name: "Творог натуральный 9%",
      category: "Молочные продукты",
      price: 340,
      unit: "кг",
      minQuantity: 2,
      orderStep: 0.5,
      stockQuantity: 80,
      storageConditions: "Хранить при температуре +2...+4°C",
      status: "active",
    },
  ]);

  // 2. Orders State
  const [orders, setOrders] = useState<LocalOrder[]>([
    {
      id: "ord_1024",
      number: "1024",
      customerName: "Иван Петров",
      phone: "+7 (903) 123-45-67",
      address: "г. Казань, ул. Баумана, д. 15, кв. 42",
      status: "new",
      deliveryDate: "22 мая 2026",
      deliveryWindow: "10:00 - 14:00",
      deliveryFee: 300,
      createdAt: "20 мая, 11:20",
      items: [
        { productId: "prod_1", name: "Картофель молодой", quantity: 20, unit: "кг", price: 38 },
        { productId: "prod_3", name: "Молоко фермерское 3.2%", quantity: 10, unit: "л", price: 85 },
      ],
    },
    {
      id: "ord_1025",
      number: "1025",
      customerName: "Анна Смирнова",
      phone: "+7 (917) 765-43-21",
      address: "г. Казань, ул. Сибгата Хакима, д. 23, кв. 104",
      status: "preparing",
      deliveryDate: "23 мая 2026",
      deliveryWindow: "14:00 - 18:00",
      deliveryFee: 0,
      createdAt: "20 мая, 09:15",
      items: [
        { productId: "prod_2", name: "Яйца куриные C0 (упаковка 30 шт)", quantity: 60, unit: "уп", price: 300 },
        { productId: "prod_4", name: "Творог натуральный 9%", quantity: 5, unit: "кг", price: 340 },
      ],
    },
  ]);

  // Selected Order for details drawer
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReasonInput, setCancelReasonInput] = useState("");

  // 3. Delivery Settings State
  const [deliverySettings, setDeliverySettings] = useState({
    region: "Республика Татарстан",
    city: "Казань",
    districts: ["Советский", "Вахитовский", "Ново-Савиновский"],
    days: ["Вт", "Чт", "Сб"],
    timeFrom: "10:00",
    timeTo: "18:00",
    deadlineLabel: "до 18:00 за 1 день",
    cost: 300,
    freeFrom: 5000,
    minOrder: 3000,
  });

  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  // 4. Chats & Messages State
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "chat_ivan",
      customerName: "Иван Петров",
      lastMessage: "Здравствуйте! Уточните, картофель мокрый или сухой?",
      time: "11:25",
      unread: true,
      messages: [
        { id: "m1", sender: "customer", text: "Здравствуйте! Уточните, картофель мокрый или сухой?", time: "11:25" },
      ],
    },
    {
      id: "chat_anna",
      customerName: "Анна Смирнова",
      lastMessage: "Спасибо за быструю сборку!",
      time: "09:30",
      unread: false,
      messages: [
        { id: "m2", sender: "supplier", text: "Здравствуйте, Анна! Ваш заказ собран.", time: "09:28" },
        { id: "m3", sender: "customer", text: "Спасибо за быструю сборку!", time: "09:30" },
      ],
    },
  ]);
  const [activeChatId, setActiveChatId] = useState<string>("chat_ivan");
  const [chatInput, setChatInput] = useState("");

  // --- ACTIONS ---

  // Order state update
  const updateOrderStatus = (orderId: string, newStatus: LocalOrder["status"]) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    const orderNum = orders.find(o => o.id === orderId)?.number;
    let statusText = "";
    if (newStatus === "preparing") statusText = "в сборке";
    if (newStatus === "delivered") statusText = "доставлен";
    triggerNotification(`Статус заказа #${orderNum} изменен на "${statusText}"`);
  };

  // Order cancellation
  const handleCancelOrder = () => {
    if (!selectedOrderId || !cancelReasonInput.trim()) return;
    setOrders(prev =>
      prev.map(ord =>
        ord.id === selectedOrderId
          ? { ...ord, status: "cancelled", cancelReason: cancelReasonInput }
          : ord
      )
    );
    const orderNum = orders.find(o => o.id === selectedOrderId)?.number;
    triggerNotification(`Заказ #${orderNum} отменен по причине: ${cancelReasonInput}`);
    setCancelModalOpen(false);
    setCancelReasonInput("");
  };

  // Add Product State
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Овощи и зелень",
    price: "",
    unit: "кг",
    minQuantity: "",
    orderStep: "",
    stockQuantity: "",
    storageConditions: "",
  });
  const [productFormError, setProductFormError] = useState("");

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, category, price, unit, minQuantity, orderStep, stockQuantity, storageConditions } = newProduct;

    if (!name || !price || !minQuantity || !orderStep || !stockQuantity) {
      setProductFormError("Пожалуйста, заполните все обязательные поля");
      return;
    }

    const priceNum = parseFloat(price);
    const minNum = parseFloat(minQuantity);
    const stepNum = parseFloat(orderStep);
    const stockNum = parseFloat(stockQuantity);

    if (priceNum <= 0 || minNum <= 0 || stepNum <= 0 || stockNum < 0) {
      setProductFormError("Числовые значения должны быть положительными");
      return;
    }

    if (minNum > stockNum) {
      setProductFormError("Минимум заказа не может превышать остаток на складе");
      return;
    }

    const newProdItem: LocalProduct = {
      id: `prod_${Date.now()}`,
      name,
      category,
      price: priceNum,
      unit,
      minQuantity: minNum,
      orderStep: stepNum,
      stockQuantity: stockNum,
      storageConditions: storageConditions || undefined,
      status: "active",
    };

    setProducts(prev => [newProdItem, ...prev]);
    setNewProduct({
      name: "",
      category: "Овощи и зелень",
      price: "",
      unit: "кг",
      minQuantity: "",
      orderStep: "",
      stockQuantity: "",
      storageConditions: "",
    });
    setProductFormError("");
    triggerNotification(`Товар "${name}" успешно добавлен!`);
  };

  // Toggle product status
  const toggleProductStatus = (prodId: string) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === prodId
          ? { ...p, status: p.status === "active" ? "out_of_stock" : "active" }
          : p
      )
    );
  };

  // Chat message send and bot auto-reply
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add supplier message
    setChats(prev =>
      prev.map(c => {
        if (c.id === activeChatId) {
          const updatedMessages = [
            ...c.messages,
            { id: `msg_${Date.now()}`, sender: "supplier" as const, text: chatInput, time: timeStr },
          ];
          return {
            ...c,
            messages: updatedMessages,
            lastMessage: chatInput,
            time: timeStr,
          };
        }
        return c;
      })
    );

    const activeChat = chats.find(c => c.id === activeChatId);
    const sentText = chatInput;
    setChatInput("");

    // 2. Trigger auto-reply from buyer after 1.2s
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let replyText = "Хорошо, спасибо за информацию!";
      if (sentText.toLowerCase().includes("да") || sentText.toLowerCase().includes("конечно")) {
        replyText = "Отлично! Жду доставку.";
      } else if (sentText.toLowerCase().includes("нет") || sentText.toLowerCase().includes("не сможем")) {
        replyText = "Поняла, тогда давайте перенесем или отменим.";
      } else if (sentText.toLowerCase().includes("сухой")) {
        replyText = "Замечательно, сухой картофель хранится лучше. Заказываю.";
      }

      setChats(prev =>
        prev.map(c => {
          if (c.id === activeChatId) {
            const updatedMessages = [
              ...c.messages,
              { id: `reply_${Date.now()}`, sender: "customer" as const, text: replyText, time: replyTime },
            ];
            return {
              ...c,
              messages: updatedMessages,
              lastMessage: replyText,
              time: replyTime,
              unread: true,
            };
          }
          return c;
        })
      );
      triggerNotification(`Получено новое сообщение от ${activeChat?.customerName}`);
    }, 1200);
  };

  // --- CALC STATS ---
  const activeOrdersCount = orders.filter(o => o.status === "new" || o.status === "preparing").length;
  const totalSalesRub = orders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, ord) => sum + ord.items.reduce((iSum, i) => iSum + (i.price * i.quantity), 0) + ord.deliveryFee, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-primary selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-primary/40 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Topbar */}
      <header className="h-18 border-b border-zinc-900 px-8 flex items-center justify-between bg-zinc-900/20 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-black text-sm">H</span>
            </div>
            <span className="font-bold tracking-tight text-white">hoomy</span>
          </Link>
          <div className="h-6 w-px bg-zinc-800" />
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-lg text-white">Фермер Казань</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Одобрен
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications Button */}
          <button
            onClick={() => triggerNotification("Уведомлений пока нет. Вы работаете на мок-данных!")}
            className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.049 9.049 0 01-5.185-2.813M9 13.5V9a6 6 0 00-6-6M9 13.5v.09M9 13.5h.09m-1.14 8.25a2.25 2.25 0 004.5 0M12 9a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary" />
          </button>

          {/* User profile Menu switcher */}
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800 transition-all text-xs font-semibold text-zinc-400 hover:text-white"
          >
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              ФК
            </div>
            Выйти
          </Link>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-zinc-900 p-6 flex flex-col justify-between bg-zinc-950">
          <nav className="space-y-1.5">
            {[
              { id: "dashboard", label: "Главная", icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" },
              { id: "orders", label: "Заказы", icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 0A48.536 48.536 0 0112 3m0 0c-2.917 0-5.747.294-8.5.862m0 0a2.25 2.25 0 00-1.797 2.204V18.75A2.25 2.25 0 003.922 21H15" },
              { id: "products", label: "Товары", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" },
              { id: "delivery", label: "Доставка", icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V9.75M3.75 14.25h12m0 0V9.75m0 4.25h3.75M12 9.75V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V14.25m12-4.5h3.75m-3.75 0V4.875c0-.621.504-1.125 1.125-1.125H18" },
              { id: "messages", label: "Сообщения", icon: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025 7.42 7.42 0 01-2.185-4.29C3.75 8.25 7.78 4.5 12.75 4.5S21 8.25 21 12z" },
              { id: "analytics", label: "Аналитика", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
              { id: "profile", label: "Профиль", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                  </svg>
                  {tab.label}
                  {tab.id === "orders" && activeOrdersCount > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-white text-primary text-[10px] font-bold flex items-center justify-center">
                      {activeOrdersCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer of Sidebar */}
          <div className="pt-6 border-t border-zinc-900 text-[11px] text-zinc-600 font-mono">
            <span>Logged in as</span>
            <div className="text-zinc-400 font-sans font-medium mt-1 truncate">Фермер Казань ИНН 1655012345</div>
          </div>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-8">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 max-w-6xl">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-white">Панель управления</h2>
                <p className="text-zinc-400 text-sm">Сводка текущих показателей за сегодня.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Продажи сегодня", val: `${totalSalesRub.toLocaleString()} ₽`, sub: "+14% с прошлой недели", color: "text-primary" },
                  { label: "Заказы активные", val: activeOrdersCount, sub: "Требуют сборки", color: "text-white" },
                  { label: "Просмотры товаров", val: "1 240", sub: "+5.3% за 24 часа", color: "text-white" },
                  { label: "Конверсия", val: "6.7%", sub: "Средняя по Казани: 5.1%", color: "text-emerald-400" },
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-900 flex flex-col justify-between h-36">
                    <span className="text-xs text-zinc-500 font-semibold">{stat.label}</span>
                    <div className="space-y-1">
                      <div className={`text-2xl md:text-3xl font-bold tracking-tight ${stat.color}`}>{stat.val}</div>
                      <p className="text-[10px] text-zinc-500 font-medium">{stat.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nearest Orders section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">Ближайшие заказы</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-xs text-primary font-semibold hover:underline">
                    Смотреть все
                  </button>
                </div>

                <div className="grid gap-4">
                  {orders.map(order => (
                    <div
                      key={order.id}
                      onClick={() => { setSelectedOrderId(order.id); setActiveTab("orders"); }}
                      className="p-5 rounded-2xl bg-zinc-900/20 border border-zinc-900/80 hover:bg-zinc-900/50 hover:border-zinc-800 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-sm text-zinc-300">
                          #{order.number}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{order.customerName}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">{order.address}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-bold text-sm text-white">
                            {(order.items.reduce((s, i) => s + (i.price * i.quantity), 0) + order.deliveryFee).toLocaleString()} ₽
                          </div>
                          <div className="text-xs text-zinc-500 mt-0.5">{order.deliveryDate}</div>
                        </div>

                        {/* Custom Status Pill */}
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === "new" ? "bg-primary/10 text-primary border border-primary/20" :
                          order.status === "preparing" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          order.status === "delivered" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {order.status === "new" ? "Оплачен (Новый)" :
                           order.status === "preparing" ? "В сборке" :
                           order.status === "delivered" ? "Доставлен" : "Отменен"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-8 max-w-6xl">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <h2 className="text-3xl font-black text-white">Заказы клиентов</h2>
                  <p className="text-zinc-400 text-sm">Обрабатывайте и собирайте поступившие заказы.</p>
                </div>
              </div>

              {/* Order table grid list */}
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Orders List Pane */}
                <div className="lg:col-span-7 space-y-4">
                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 border border-zinc-900 rounded-3xl bg-zinc-900/10">
                      У вас пока нет оформленных заказов.
                    </div>
                  ) : (
                    orders.map(order => {
                      const orderTotal = order.items.reduce((s, i) => s + (i.price * i.quantity), 0) + order.deliveryFee;
                      const isSelected = selectedOrderId === order.id;
                      return (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrderId(order.id)}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${
                            isSelected
                              ? "bg-zinc-900 border-primary/50 shadow-lg shadow-primary/5"
                              : "bg-zinc-900/20 border-zinc-900/80 hover:bg-zinc-900/40 hover:border-zinc-800"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-lg">Заказ #{order.number}</span>
                              <span className="text-zinc-600 font-mono text-xs">• {order.createdAt}</span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === "new" ? "bg-primary/10 text-primary border border-primary/20" :
                              order.status === "preparing" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                              order.status === "delivered" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                              "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                              {order.status === "new" ? "Новый" :
                               order.status === "preparing" ? "В сборке" :
                               order.status === "delivered" ? "Доставлен" : "Отменен"}
                            </span>
                          </div>

                          <div className="flex justify-between items-end">
                            <div className="space-y-1">
                              <div className="text-sm font-semibold text-zinc-300">{order.customerName}</div>
                              <div className="text-xs text-zinc-500 max-w-sm truncate">{order.address}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-zinc-500">Сумма заказа</div>
                              <div className="text-base font-bold text-white">{orderTotal.toLocaleString()} ₽</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Selected Order Details Panel */}
                <div className="lg:col-span-5">
                  {selectedOrderId ? (
                    (() => {
                      const order = orders.find(o => o.id === selectedOrderId)!;
                      const itemsTotal = order.items.reduce((s, i) => s + (i.price * i.quantity), 0);
                      const orderTotal = itemsTotal + order.deliveryFee;
                      return (
                        <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-900 space-y-6">
                          <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
                            <div>
                              <h3 className="text-xl font-bold text-white">Заказ #{order.number}</h3>
                              <p className="text-xs text-zinc-500 mt-1">Создан: {order.createdAt}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === "new" ? "bg-primary/10 text-primary border border-primary/20" :
                              order.status === "preparing" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                              order.status === "delivered" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                              "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                              {order.status === "new" ? "Новый" :
                               order.status === "preparing" ? "В сборке" :
                               order.status === "delivered" ? "Доставлен" : "Отменен"}
                            </span>
                          </div>

                          {/* Client Information */}
                          <div className="space-y-2">
                            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Покупатель</span>
                            <div className="text-sm font-semibold text-white">{order.customerName}</div>
                            <div className="text-xs text-zinc-400">{order.phone}</div>
                            <div className="text-xs text-zinc-400">{order.address}</div>
                          </div>

                          {/* Delivery Window */}
                          <div className="space-y-1">
                            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Дата и время доставки</span>
                            <div className="text-sm text-white font-medium">{order.deliveryDate}</div>
                            <div className="text-xs text-zinc-400">Интервал: {order.deliveryWindow}</div>
                          </div>

                          {/* Products Table */}
                          <div className="space-y-2">
                            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Товары в заказе</span>
                            <div className="border border-zinc-800 rounded-xl overflow-hidden">
                              <table className="w-full text-xs text-left">
                                <thead className="bg-zinc-900 text-zinc-400 uppercase tracking-wider text-[10px]">
                                  <tr>
                                    <th className="p-3">Наименование</th>
                                    <th className="p-3 text-center">Кол-во</th>
                                    <th className="p-3 text-right">Сумма</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/80">
                                  {order.items.map((item, idx) => (
                                    <tr key={idx} className="text-zinc-300">
                                      <td className="p-3 max-w-[150px] truncate font-medium">{item.name}</td>
                                      <td className="p-3 text-center">{item.quantity} {item.unit}</td>
                                      <td className="p-3 text-right font-semibold text-white">{(item.price * item.quantity).toLocaleString()} ₽</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Order Price Details */}
                          <div className="space-y-2 border-t border-zinc-800 pt-4 text-sm">
                            <div className="flex justify-between text-zinc-400">
                              <span>Стоимость товаров:</span>
                              <span className="text-white">{itemsTotal.toLocaleString()} ₽</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                              <span>Стоимость доставки:</span>
                              <span className="text-white">{order.deliveryFee === 0 ? "Бесплатно" : `${order.deliveryFee} ₽`}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-white border-t border-zinc-800/50 pt-2">
                              <span>Итого к выплате:</span>
                              <span className="text-primary">{orderTotal.toLocaleString()} ₽</span>
                            </div>
                          </div>

                          {/* Actions Panel */}
                          {order.status !== "delivered" && order.status !== "cancelled" && (
                            <div className="grid grid-cols-2 gap-3 pt-2">
                              {order.status === "new" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "preparing")}
                                  className="col-span-2 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors text-xs flex items-center justify-center gap-1.5"
                                >
                                  Принять и собрать заказ
                                </button>
                              )}
                              {order.status === "preparing" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "delivered")}
                                  className="col-span-2 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors text-xs flex items-center justify-center gap-1.5"
                                >
                                  Доставлен клиенту
                                </button>
                              )}
                              
                              <button
                                onClick={() => {
                                  // Switch to chat
                                  const cId = order.customerName.includes("Иван") ? "chat_ivan" : "chat_anna";
                                  setActiveChatId(cId);
                                  setActiveTab("messages");
                                }}
                                className="py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white transition-all text-xs font-semibold"
                              >
                                Написать клиенту
                              </button>

                              <button
                                onClick={() => setCancelModalOpen(true)}
                                className="py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-semibold hover:border-red-500/30 transition-all text-xs"
                              >
                                Отменить
                              </button>
                            </div>
                          )}

                          {order.status === "cancelled" && (
                            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs text-red-400">
                              <span className="font-semibold block mb-1">Причина отмены:</span>
                              {order.cancelReason || "Не указана"}
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="p-8 text-center text-zinc-500 border border-zinc-900 rounded-3xl bg-zinc-900/10 h-64 flex items-center justify-center">
                      Выберите заказ в левой панели для просмотра деталей
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-8 max-w-6xl">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-white">Каталог товаров</h2>
                <p className="text-zinc-400 text-sm">Управляйте вашим торговым предложением и остатками на складе.</p>
              </div>

              <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Product List Grid */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Table Wrapper */}
                  <div className="border border-zinc-900 bg-zinc-900/20 rounded-3xl overflow-hidden">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-zinc-900/80 border-b border-zinc-900 text-zinc-400 uppercase tracking-wider text-[10px] font-semibold">
                        <tr>
                          <th className="p-4">Наименование</th>
                          <th className="p-4">Цена</th>
                          <th className="p-4 text-center">Минимум</th>
                          <th className="p-4 text-center">Шаг</th>
                          <th className="p-4 text-center">Остаток</th>
                          <th className="p-4 text-right">Действие</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900/60">
                        {products.map(prod => (
                          <tr key={prod.id} className="hover:bg-zinc-900/20 text-zinc-300">
                            <td className="p-4 font-semibold text-white">
                              {prod.name}
                              <span className="block text-[10px] text-zinc-500 font-normal mt-0.5">{prod.category}</span>
                            </td>
                            <td className="p-4 font-bold text-white">
                              {prod.price} ₽<span className="text-[10px] text-zinc-500 font-normal"> / {prod.unit}</span>
                            </td>
                            <td className="p-4 text-center font-medium text-zinc-400">{prod.minQuantity} {prod.unit}</td>
                            <td className="p-4 text-center font-medium text-zinc-400">{prod.orderStep} {prod.unit}</td>
                            <td className="p-4 text-center">
                              <span className={`font-semibold ${prod.stockQuantity < 50 ? "text-amber-400" : "text-zinc-300"}`}>
                                {prod.stockQuantity} {prod.unit}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => toggleProductStatus(prod.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                  prod.status === "active"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                                    : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20"
                                }`}
                              >
                                {prod.status === "active" ? "Активен" : "Скрыт"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add Product Form */}
                <div className="lg:col-span-4 p-6 rounded-3xl bg-zinc-900/40 border border-zinc-900 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Добавить новый товар</h3>
                    <p className="text-xs text-zinc-500 mt-1">Обязательное условие: все количества привязаны к минимуму заказа и шагу.</p>
                  </div>

                  {productFormError && (
                    <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/15 text-xs text-red-400 font-medium">
                      ⚠️ {productFormError}
                    </div>
                  )}

                  <form onSubmit={handleAddProduct} className="space-y-4 text-sm">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400 font-semibold block">Название товара *</label>
                      <input
                        type="text"
                        placeholder="Например: Картофель молодой"
                        value={newProduct.name}
                        onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400 font-semibold block">Категория *</label>
                      <select
                        value={newProduct.category}
                        onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="Овощи и зелень">Овощи и зелень</option>
                        <option value="Фрукты и ягоды">Фрукты и ягоды</option>
                        <option value="Молочные продукты">Молочные продукты</option>
                        <option value="Мясо и птица">Мясо и птица</option>
                        <option value="Бакалея">Бакалея</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Price */}
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-400 font-semibold block">Цена за единицу (₽) *</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="38"
                          value={newProduct.price}
                          onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      {/* Unit */}
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-400 font-semibold block">Ед. измерения *</label>
                        <select
                          value={newProduct.unit}
                          onChange={e => setNewProduct(prev => ({ ...prev, unit: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                        >
                          <option value="кг">кг</option>
                          <option value="л">литр (л)</option>
                          <option value="шт">штука (шт)</option>
                          <option value="уп">упаковка (уп)</option>
                          <option value="кор">коробка (кор)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {/* Min Quantity */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-semibold block">Мин. заказ *</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="10"
                          value={newProduct.minQuantity}
                          onChange={e => setNewProduct(prev => ({ ...prev, minQuantity: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-primary transition-colors text-xs"
                        />
                      </div>

                      {/* Order Step */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-semibold block">Шаг заказа *</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="5"
                          value={newProduct.orderStep}
                          onChange={e => setNewProduct(prev => ({ ...prev, orderStep: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-primary transition-colors text-xs"
                        />
                      </div>

                      {/* Stock quantity */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-semibold block">На складе *</label>
                        <input
                          type="number"
                          placeholder="450"
                          value={newProduct.stockQuantity}
                          onChange={e => setNewProduct(prev => ({ ...prev, stockQuantity: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-primary transition-colors text-xs"
                        />
                      </div>
                    </div>

                    {/* Storage conditions */}
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400 font-semibold block">Условия хранения</label>
                      <input
                        type="text"
                        placeholder="Например: Хранить при температуре +2...+8°C"
                        value={newProduct.storageConditions}
                        onChange={e => setNewProduct(prev => ({ ...prev, storageConditions: e.target.value }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors text-xs mt-2"
                    >
                      Опубликовать товар
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DELIVERY */}
          {activeTab === "delivery" && (
            <div className="space-y-8 max-w-4xl">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-white">Параметры доставки</h2>
                <p className="text-zinc-400 text-sm">Настройте условия, зоны и дедлайны для оформления заказов клиентами.</p>
              </div>

              {/* Form panel container */}
              <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-900 space-y-8 text-sm">
                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* Regions & Cities info */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-2">География</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">Регион</span>
                        <input
                          type="text"
                          disabled
                          value={deliverySettings.region}
                          className="w-full bg-zinc-950/40 border border-zinc-900 rounded-xl px-4 py-2.5 text-zinc-400 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">Город</span>
                        <input
                          type="text"
                          disabled
                          value={deliverySettings.city}
                          className="w-full bg-zinc-950/40 border border-zinc-900 rounded-xl px-4 py-2.5 text-zinc-400 cursor-not-allowed"
                        />
                      </div>

                      {/* Districts multiselect display */}
                      <div>
                        <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-2">Районы обслуживания в Казани</span>
                        <div className="grid grid-cols-2 gap-3">
                          {["Советский", "Вахитовский", "Ново-Савиновский", "Приволжский", "Московский", "Кировский"].map(dist => {
                            const isChecked = deliverySettings.districts.includes(dist);
                            return (
                              <button
                                key={dist}
                                onClick={() => {
                                  setDeliverySettings(prev => {
                                    const updated = prev.districts.includes(dist)
                                      ? prev.districts.filter(d => d !== dist)
                                      : [...prev.districts, dist];
                                    return { ...prev, districts: updated };
                                  });
                                }}
                                className={`px-4 py-2 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                                  isChecked
                                    ? "bg-primary/10 border-primary/40 text-primary"
                                    : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                                }`}
                              >
                                {dist}
                                {isChecked && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Schedule settings */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-2">График и сроки</h3>
                    
                    <div className="space-y-4">
                      {/* Week days selectors */}
                      <div>
                        <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-2">Дни доставки</span>
                        <div className="flex gap-2">
                          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(day => {
                            const isChecked = deliverySettings.days.includes(day);
                            return (
                              <button
                                key={day}
                                onClick={() => {
                                  setDeliverySettings(prev => {
                                    const updated = prev.days.includes(day)
                                      ? prev.days.filter(d => d !== day)
                                      : [...prev.days, day];
                                    return { ...prev, days: updated };
                                  });
                                }}
                                className={`w-10 h-10 rounded-xl border font-bold text-xs flex items-center justify-center transition-all ${
                                  isChecked
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                    : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time window inputs */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">Время с</span>
                          <input
                            type="text"
                            value={deliverySettings.timeFrom}
                            onChange={e => setDeliverySettings(prev => ({ ...prev, timeFrom: e.target.value }))}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white"
                          />
                        </div>
                        <div>
                          <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">Время до</span>
                          <input
                            type="text"
                            value={deliverySettings.timeTo}
                            onChange={e => setDeliverySettings(prev => ({ ...prev, timeTo: e.target.value }))}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white"
                          />
                        </div>
                      </div>

                      {/* Order Deadline */}
                      <div>
                        <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">Дедлайн для заказа</span>
                        <input
                          type="text"
                          value={deliverySettings.deadlineLabel}
                          onChange={e => setDeliverySettings(prev => ({ ...prev, deadlineLabel: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Money settings section */}
                <div className="space-y-6 pt-4 border-t border-zinc-900">
                  <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-2">Коммерческие условия</h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Minimum order limit */}
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400 font-semibold block">Мин. заказ поставщика (₽)</label>
                      <input
                        type="number"
                        value={deliverySettings.minOrder}
                        onChange={e => setDeliverySettings(prev => ({ ...prev, minOrder: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                      />
                      <p className="text-[10px] text-zinc-500 mt-1">Клиент не сможет оформить корзину меньше этой суммы.</p>
                    </div>

                    {/* Delivery fee cost */}
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400 font-semibold block">Базовая доставка (₽)</label>
                      <input
                        type="number"
                        value={deliverySettings.cost}
                        onChange={e => setDeliverySettings(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                      />
                      <p className="text-[10px] text-zinc-500 mt-1">Фиксированная стоимость доставки заказа.</p>
                    </div>

                    {/* Free delivery from limit */}
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400 font-semibold block">Бесплатная доставка от (₽)</label>
                      <input
                        type="number"
                        value={deliverySettings.freeFrom}
                        onChange={e => setDeliverySettings(prev => ({ ...prev, freeFrom: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                      />
                      <p className="text-[10px] text-zinc-500 mt-1">Сумма заказа, при которой доставка станет 0 ₽.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => triggerNotification("Настройки доставки успешно обновлены!")}
                    className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors text-xs shadow-lg shadow-primary/20"
                  >
                    Сохранить параметры доставки
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MESSAGES */}
          {activeTab === "messages" && (
            <div className="space-y-8 max-w-6xl h-[calc(100vh-140px)] flex flex-col">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-white">Сообщения с клиентами</h2>
                <p className="text-zinc-400 text-sm">Общайтесь с покупателями напрямую по их заказам.</p>
              </div>

              {/* Chat room interface wrapper */}
              <div className="flex-1 border border-zinc-900 rounded-3xl overflow-hidden bg-zinc-900/10 flex">
                
                {/* Chat Left pane list */}
                <div className="w-80 border-r border-zinc-900 flex flex-col bg-zinc-950/40">
                  <div className="p-4 border-b border-zinc-900">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Диалоги</span>
                  </div>
                  <div className="flex-1 overflow-y-auto divide-y divide-zinc-900/60">
                    {chats.map(chat => {
                      const isActive = activeChatId === chat.id;
                      return (
                        <div
                          key={chat.id}
                          onClick={() => {
                            setActiveChatId(chat.id);
                            // Mark read
                            setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: false } : c));
                          }}
                          className={`p-4 cursor-pointer transition-all flex flex-col gap-1.5 ${
                            isActive
                              ? "bg-zinc-900/80"
                              : "hover:bg-zinc-900/20"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-sm text-white">{chat.customerName}</span>
                            <span className="text-[10px] text-zinc-500">{chat.time}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-zinc-400 truncate max-w-[180px]">{chat.lastMessage}</p>
                            {chat.unread && (
                              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Conversation right pane chat */}
                <div className="flex-1 flex flex-col justify-between bg-zinc-950/20">
                  {(() => {
                    const activeChat = chats.find(c => c.id === activeChatId)!;
                    return (
                      <>
                        {/* Header of Chat */}
                        <div className="px-6 py-4 border-b border-zinc-900 bg-zinc-950/40 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-white">{activeChat.customerName}</span>
                            <span className="block text-[10px] text-zinc-500 mt-0.5">Покупатель Hoomy</span>
                          </div>
                        </div>

                        {/* Chat Messages flow */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
                          {activeChat.messages.map((msg, index) => {
                            const isSupplier = msg.sender === "supplier";
                            return (
                              <div
                                key={msg.id || index}
                                className={`flex flex-col max-w-md ${
                                  isSupplier ? "self-end items-end" : "self-start items-start"
                                }`}
                              >
                                <div className={`p-4.5 rounded-2xl text-sm ${
                                  isSupplier
                                    ? "bg-primary text-white rounded-br-none"
                                    : "bg-zinc-900 text-zinc-300 rounded-bl-none border border-zinc-800"
                                }`}>
                                  {msg.text}
                                </div>
                                <span className="text-[9px] text-zinc-600 mt-1 font-mono">{msg.time}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Input bar */}
                        <div className="p-4 border-t border-zinc-900 bg-zinc-950/40 flex gap-3">
                          <input
                            type="text"
                            placeholder="Введите сообщение..."
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary text-sm"
                          />
                          <button
                            onClick={handleSendMessage}
                            className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors text-xs"
                          >
                            Отправить
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-8 max-w-5xl">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-white">Аналитика продаж</h2>
                <p className="text-zinc-400 text-sm">Детальный разбор эффективности магазина.</p>
              </div>

              {/* Graphic charts mock container */}
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* 1. Bar Sales today */}
                <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-900 space-y-6">
                  <h3 className="text-sm font-bold text-zinc-400">Продажи по неделям (тыс. ₽)</h3>
                  <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-zinc-800 pb-2">
                    {[
                      { l: "Нед 1", val: "h-[30%]" },
                      { l: "Нед 2", val: "h-[45%]" },
                      { l: "Нед 3", val: "h-[35%]" },
                      { l: "Нед 4", val: "h-[70%]" },
                      { l: "Нед 5 (Тек)", val: "h-[85%]" },
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className={`w-full ${bar.val} bg-primary rounded-t-lg shadow-lg shadow-primary/10 transition-all hover:opacity-85`} />
                        <span className="text-[10px] text-zinc-500 font-medium">{bar.l}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Conversion flow list */}
                <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-900 space-y-6">
                  <h3 className="text-sm font-bold text-zinc-400">Конверсионная воронка</h3>
                  
                  <div className="space-y-4 pt-4">
                    {[
                      { step: "Просмотры профиля", val: "1 240", rate: "100%", w: "w-full bg-zinc-800" },
                      { step: "Клик на товары", val: "480", rate: "38.7%", w: "w-[38.7%] bg-primary/70" },
                      { step: "Добавление в корзину", val: "152", rate: "12.2%", w: "w-[12.2%] bg-primary" },
                      { step: "Оплаченные заказы", val: "12", rate: "6.7%", w: "w-[6.7%] bg-emerald-500" },
                    ].map((step, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-zinc-400">
                          <span>{step.step}</span>
                          <span className="text-white">{step.val} <span className="text-zinc-500 text-[10px]">({step.rate})</span></span>
                        </div>
                        <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${step.w}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 7: PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-8 max-w-3xl">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-white">Профиль компании</h2>
                <p className="text-zinc-400 text-sm">Юридические реквизиты и публичный профиль поставщика.</p>
              </div>

              {/* Company Details profile cards */}
              <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-900 space-y-6 text-sm">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">Название юрлица</span>
                    <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl text-white font-medium">ИП Мухаметшин И. Г.</div>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">ИНН</span>
                    <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl text-white font-medium">165501234567</div>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">ОГРНИП</span>
                    <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl text-white font-medium">315169000012345</div>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">Телефон организации</span>
                    <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl text-white font-medium">+7 (843) 222-33-44</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Юридический адрес</span>
                  <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl text-white font-medium">420111, Республика Татарстан, г. Казань, ул. Баумана, д. 45</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/20 border border-zinc-900 text-xs text-zinc-500 flex items-start gap-3">
                  <svg className="w-5 h-5 text-zinc-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <span className="font-semibold text-zinc-400 block mb-0.5">Внесение изменений в реквизиты</span>
                    Для изменения юридического адреса, ИНН или организационной формы, пожалуйста, обратитесь в службу поддержки администраторов Hoomy.
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Cancel Order Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Укажите причину отмены заказа</h3>
            
            <textarea
              placeholder="Например: Товар закончился на складе"
              value={cancelReasonInput}
              onChange={e => setCancelReasonInput(e.target.value)}
              className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-primary text-sm resize-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => { setCancelModalOpen(false); setCancelReasonInput(""); }}
                className="px-4 py-2 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-400 text-xs font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold"
              >
                Подтвердить отмену
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
