"use client";

import React, { useState } from "react";
import Link from "next/link";

interface AdminSupplier {
  id: string;
  name: string;
  inn: string;
  city: string;
  rating: number;
  status: "approved" | "pending" | "blocked";
  createdAt: string;
}

interface AdminProduct {
  id: string;
  supplierName: string;
  name: string;
  price: number;
  unit: string;
  status: "approved" | "blocked";
}

interface AdminDispute {
  id: string;
  orderNumber: string;
  customerName: string;
  supplierName: string;
  amount: number;
  reason: string;
  status: "open" | "refunded" | "rejected";
  createdAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "suppliers" | "products" | "disputes" | "fees"
  >("dashboard");

  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  // --- MOCK DATABASE STATE ---

  // 1. Suppliers
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>([
    { id: "sup_1", name: "Фруктовый двор", inn: "7704123456", city: "Казань", rating: 4.9, status: "approved", createdAt: "10 мая 2026" },
    { id: "sup_2", name: "Молочная ферма", inn: "1655987654", city: "Казань", rating: 4.8, status: "approved", createdAt: "12 мая 2026" },
    { id: "sup_3", name: "Фермер Казань", inn: "1655012345", city: "Казань", rating: 4.7, status: "approved", createdAt: "15 мая 2026" },
    { id: "sup_5", name: "Пасека Татарстана", inn: "1650998877", city: "Казань", rating: 0.0, status: "pending", createdAt: "20 мая 2026" },
  ]);

  // 2. Products
  const [products, setProducts] = useState<AdminProduct[]>([
    { id: "p1", supplierName: "Фермер Казань", name: "Картофель молодой", price: 38, unit: "кг", status: "approved" },
    { id: "p2", supplierName: "Фермер Казань", name: "Яйца куриные C0 (30 шт)", price: 300, unit: "уп", status: "approved" },
    { id: "p3", supplierName: "Молочная ферма", name: "Молоко фермерское 3.2%", price: 85, unit: "л", status: "approved" },
    { id: "p4", supplierName: "Молочная ферма", name: "Творог натуральный 9%", price: 340, unit: "кг", status: "approved" },
    { id: "p5", supplierName: "Фруктовый двор", name: "Клубника садовая", price: 650, unit: "кг", status: "blocked" },
  ]);

  // 3. Disputes
  const [disputes, setDisputes] = useState<AdminDispute[]>([
    { id: "disp_1", orderNumber: "1024", customerName: "Иван Петров", supplierName: "Фермер Казань", amount: 760, reason: "Привезли мелкий картофель вместо крупного, прошу частичный возврат.", status: "open", createdAt: "20 мая, 12:15" },
    { id: "disp_2", orderNumber: "1018", customerName: "Ольга Новикова", supplierName: "Молочная ферма", amount: 1200, reason: "Кислый творог с истекающим сроком годности.", status: "open", createdAt: "19 мая, 15:40" },
  ]);

  // 4. Commission Rate
  const [commissionRate, setCommissionRate] = useState<number>(10); // 10%

  // --- ACTIONS ---

  const handleSupplierStatus = (supId: string, newStatus: AdminSupplier["status"]) => {
    setSuppliers(prev =>
      prev.map(s => (s.id === supId ? { ...s, status: newStatus } : s))
    );
    const supName = suppliers.find(s => s.id === supId)?.name;
    const statusText = newStatus === "approved" ? "одобрен" : newStatus === "blocked" ? "заблокирован" : "на проверке";
    triggerNotification(`Статус поставщика "${supName}" изменен на "${statusText}"`);
  };

  const handleProductStatus = (prodId: string, newStatus: AdminProduct["status"]) => {
    setProducts(prev =>
      prev.map(p => (p.id === prodId ? { ...p, status: newStatus } : p))
    );
    const pName = products.find(p => p.id === prodId)?.name;
    triggerNotification(`Товар "${pName}" теперь ${newStatus === "approved" ? "одобрен и виден всем" : "заблокирован"}`);
  };

  const handleDisputeResolution = (dispId: string, action: "refund" | "reject") => {
    setDisputes(prev =>
      prev.map(d =>
        d.id === dispId
          ? { ...d, status: action === "refund" ? ("refunded" as const) : ("rejected" as const) }
          : d
      )
    );
    const disp = disputes.find(d => d.id === dispId);
    const text = action === "refund" ? "Возврат средств подтвержден" : "В споре отказано";
    triggerNotification(`${text} для заказа #${disp?.orderNumber}`);
  };

  // --- CALCULATE SUMMARY METRICS ---
  const pendingSuppliersCount = suppliers.filter(s => s.status === "pending").length;
  const activeSuppliersCount = suppliers.filter(s => s.status === "approved").length;
  const openDisputesCount = disputes.filter(d => d.status === "open").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-emerald-500/40 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Topbar */}
      <header className="h-18 border-b border-zinc-900 px-8 flex items-center justify-between bg-zinc-900/20 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-black text-sm">H</span>
            </div>
            <span className="font-bold tracking-tight text-white">hoomy</span>
          </Link>
          <div className="h-6 w-px bg-zinc-800" />
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-lg text-white">Админ-панель Hoomy</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Администратор
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800 transition-all text-xs font-semibold text-zinc-400 hover:text-white"
          >
            Выйти в меню
          </Link>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-900 p-6 flex flex-col justify-between bg-zinc-950">
          <nav className="space-y-1.5">
            {[
              { id: "dashboard", label: "Сводка (Главная)", icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" },
              { id: "suppliers", label: "Поставщики", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110 20.25a11.38 11.38 0 01-5-1.013v-.11c0-1.11.285-2.158.786-3.069M9 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zm7.5-6a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm-.9 9.34a8.9 8.9 0 00-.737-1.343 8.9 8.9 0 00-6.726 0 8.9 8.9 0 00-.737 1.343" },
              { id: "products", label: "Товары", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" },
              { id: "disputes", label: "Споры / Жалобы", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
              { id: "fees", label: "Комиссии платформы", icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                  </svg>
                  {tab.label}
                  {tab.id === "suppliers" && pendingSuppliersCount > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {pendingSuppliersCount}
                    </span>
                  )}
                  {tab.id === "disputes" && openDisputesCount > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {openDisputesCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          
          <div className="pt-6 border-t border-zinc-900 text-[11px] text-zinc-600 font-mono">
            <span>Админ сессия</span>
            <div className="text-zinc-400 font-sans mt-1">Super User (Read/Write)</div>
          </div>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-8">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 max-w-6xl">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-white">Мониторинг Системы</h2>
                <p className="text-zinc-400 text-sm">Сводные показатели маркетплейса Hoomy.</p>
              </div>

              {/* Stats metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Общий объем продаж (GMV)", val: "1 480 000 ₽", sub: "Комиссия платформы: 148 000 ₽", color: "text-emerald-400" },
                  { label: "Активных поставщиков", val: activeSuppliersCount, sub: `${pendingSuppliersCount} на модерации`, color: "text-white" },
                  { label: "Всего товаров в базе", val: products.length, sub: "Активно продаются: 4", color: "text-white" },
                  { label: "Открытых споров по заказам", val: openDisputesCount, sub: "Требуют решения администратора", color: "text-red-400" },
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

              {/* Live Events log feed */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Последние события на платформе</h3>
                <div className="border border-zinc-900 bg-zinc-900/20 rounded-3xl p-6 divide-y divide-zinc-900 space-y-4">
                  {[
                    { desc: "Новый поставщик «Пасека Татарстана» отправил анкету на модерацию", time: "Сегодня, 13:00", action: "Модерировать", tab: "suppliers" },
                    { desc: "Покупатель Иван Петров открыл спор по заказу #1024 («Фермер Казань»)", time: "Сегодня, 12:15", action: "Решить спор", tab: "disputes" },
                    { desc: "Поставщик «Фермер Казань» перевел статус заказа #1025 в состояние «В сборке»", time: "Сегодня, 11:20", action: "Смотреть детали", tab: "dashboard" }
                  ].map((evt, idx) => (
                    <div key={idx} className="flex justify-between items-center pt-4 first:pt-0">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-zinc-200">{evt.desc}</p>
                        <p className="text-[10px] text-zinc-500 font-medium">{evt.time}</p>
                      </div>
                      <button
                        onClick={() => setActiveTab(evt.tab as any)}
                        className="px-3 py-1.5 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                      >
                        {evt.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUPPLIERS */}
          {activeTab === "suppliers" && (
            <div className="space-y-8 max-w-6xl">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-white">Локальные Поставщики</h2>
                <p className="text-zinc-400 text-sm">Одобряйте анкеты новых фермеров и блокируйте нарушителей.</p>
              </div>

              {/* Table of suppliers */}
              <div className="border border-zinc-900 bg-zinc-900/20 rounded-3xl overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-zinc-900/80 border-b border-zinc-900 text-zinc-400 uppercase tracking-wider text-[10px] font-semibold">
                    <tr>
                      <th className="p-4">Поставщик</th>
                      <th className="p-4">ИНН</th>
                      <th className="p-4">Город</th>
                      <th className="p-4">Дата анкеты</th>
                      <th className="p-4">Статус</th>
                      <th className="p-4 text-right">Управление</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60">
                    {suppliers.map(sup => (
                      <tr key={sup.id} className="hover:bg-zinc-900/20 text-zinc-300">
                        <td className="p-4 font-semibold text-white">
                          {sup.name}
                          {sup.rating > 0 && (
                            <span className="block text-[10px] text-zinc-400 font-normal mt-0.5">Рейтинг: ★ {sup.rating}</span>
                          )}
                        </td>
                        <td className="p-4 font-mono text-xs text-zinc-400">{sup.inn}</td>
                        <td className="p-4">{sup.city}</td>
                        <td className="p-4 text-xs text-zinc-500">{sup.createdAt}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            sup.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            sup.status === "pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>
                            {sup.status === "approved" ? "Активен" :
                             sup.status === "pending" ? "На проверке" : "Заблокирован"}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {sup.status === "pending" && (
                            <button
                              onClick={() => handleSupplierStatus(sup.id, "approved")}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-all"
                            >
                              Одобрить анкету
                            </button>
                          )}
                          {sup.status === "approved" && (
                            <button
                              onClick={() => handleSupplierStatus(sup.id, "blocked")}
                              className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-semibold transition-all"
                            >
                              Заблокировать
                            </button>
                          )}
                          {sup.status === "blocked" && (
                            <button
                              onClick={() => handleSupplierStatus(sup.id, "approved")}
                              className="px-3 py-1.5 border border-zinc-800 text-zinc-300 hover:bg-zinc-900 rounded-xl text-xs font-semibold transition-all"
                            >
                              Разблокировать
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-8 max-w-6xl">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-white">Модерация Товаров</h2>
                <p className="text-zinc-400 text-sm">Скрывайте или активируйте любые товары на маркетплейсе.</p>
              </div>

              {/* Table of all products */}
              <div className="border border-zinc-900 bg-zinc-900/20 rounded-3xl overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-zinc-900/80 border-b border-zinc-900 text-zinc-400 uppercase tracking-wider text-[10px] font-semibold">
                    <tr>
                      <th className="p-4">Товар</th>
                      <th className="p-4">Поставщик</th>
                      <th className="p-4">Цена</th>
                      <th className="p-4">Статус модерации</th>
                      <th className="p-4 text-right">Управление</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-zinc-900/20 text-zinc-300">
                        <td className="p-4 font-semibold text-white">{prod.name}</td>
                        <td className="p-4 font-medium text-zinc-400">{prod.supplierName}</td>
                        <td className="p-4 font-bold text-white">{prod.price} ₽ / {prod.unit}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            prod.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>
                            {prod.status === "approved" ? "Одобрен" : "Заблокирован"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {prod.status === "approved" ? (
                            <button
                              onClick={() => handleProductStatus(prod.id, "blocked")}
                              className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-semibold transition-all"
                            >
                              Скрыть с витрины
                            </button>
                          ) : (
                            <button
                              onClick={() => handleProductStatus(prod.id, "approved")}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-all"
                            >
                              Одобрить показ
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: DISPUTES */}
          {activeTab === "disputes" && (
            <div className="space-y-8 max-w-6xl">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-white">Арбитраж Споров</h2>
                <p className="text-zinc-400 text-sm">Выносите окончательные решения по жалобам и спорным заказам.</p>
              </div>

              {/* Disputes cards layout */}
              <div className="grid lg:grid-cols-2 gap-8">
                {disputes.map(disp => (
                  <div key={disp.id} className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-900 flex flex-col justify-between space-y-6">
                    <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
                      <div>
                        <h3 className="text-base font-bold text-white">Спор по заказу #{disp.orderNumber}</h3>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{disp.createdAt}</p>
                      </div>
                      
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        disp.status === "open" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        disp.status === "refunded" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      }`}>
                        {disp.status === "open" ? "На рассмотрении" :
                         disp.status === "refunded" ? "Одобрен возврат" : "Спор отклонен"}
                      </span>
                    </div>

                    {/* Dispute Info details */}
                    <div className="space-y-3 text-xs leading-relaxed">
                      <div>
                        <span className="text-[10px] text-zinc-500 font-semibold uppercase block mb-0.5">Клиент</span>
                        <div className="text-white font-medium">{disp.customerName}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 font-semibold uppercase block mb-0.5">Поставщик</span>
                        <div className="text-white font-medium">{disp.supplierName}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 font-semibold uppercase block mb-0.5">Сумма спора</span>
                        <div className="text-sm font-bold text-emerald-400">{disp.amount} ₽</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 font-semibold uppercase block mb-0.5">Суть претензии</span>
                        <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl text-zinc-300 italic">
                          « {disp.reason} »
                        </div>
                      </div>
                    </div>

                    {/* Dispute Actions */}
                    {disp.status === "open" && (
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-850">
                        <button
                          onClick={() => handleDisputeResolution(disp.id, "refund")}
                          className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors"
                        >
                          Сделать возврат клиенту
                        </button>
                        <button
                          onClick={() => handleDisputeResolution(disp.id, "reject")}
                          className="py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 font-semibold text-xs transition-colors"
                        >
                          Отклонить спор
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FEES */}
          {activeTab === "fees" && (
            <div className="space-y-8 max-w-xl">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-white">Комиссии Платформы</h2>
                <p className="text-zinc-400 text-sm">Управляйте базовым процентом удержания с продаж поставщиков.</p>
              </div>

              {/* Slider / inputs fees setting */}
              <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-900 space-y-6 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Базовый процент комиссии</label>
                    <span className="text-2xl font-bold text-emerald-400">{commissionRate}%</span>
                  </div>
                  
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="1"
                    value={commissionRate}
                    onChange={e => setCommissionRate(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-zinc-950 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                    <span>Минимум: 5%</span>
                    <span>Рекомендуемая: 10%</span>
                    <span>Максимум: 25%</span>
                  </div>
                </div>

                <div className="p-4.5 rounded-2xl bg-zinc-900/20 border border-zinc-900 text-xs text-zinc-500 leading-relaxed space-y-2">
                  <div className="font-semibold text-zinc-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Правило применения комиссии
                  </div>
                  <p>
                    Комиссия автоматически вычитается из суммы подзаказов в момент перечисления средств поставщику. Она удерживается только с фактически доставленных и оплаченных заказов.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => triggerNotification(`Комиссия платформы успешно сохранена на уровне ${commissionRate}%!`)}
                    className="px-5 py-2.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors text-xs shadow-lg shadow-emerald-500/20"
                  >
                    Сохранить тариф
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
