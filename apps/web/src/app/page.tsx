import Link from "next/link";

export const metadata = {
  title: "Hoomy Web Portal — Кабинет и Панель Управления",
  description: "Официальный веб-портал Hoomy для локальных поставщиков и администраторов платформы.",
};

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-zinc-950 text-white overflow-hidden selection:bg-primary selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-900">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            hoomy<span className="text-primary">.web</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            v1.0 Mock Mode
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Панель Управления Экосистемой
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Добро пожаловать в веб-интерфейс Hoomy. Выберите необходимый кабинет для управления поставками или администрирования платформы.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Card 1: Supplier Cabinet */}
          <Link
            id="portal-supplier-btn"
            href="/supplier"
            className="group relative flex flex-col justify-between p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-primary/50 hover:bg-zinc-900/80 transition-all duration-300 shadow-xl overflow-hidden backdrop-blur-md"
          >
            {/* Top right subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="space-y-6">
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3M3 12l-3-3m3 3l3-3M9 17h6M9 13h6"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12h19.5M4.5 19.5h15a2.25 2.25 0 002.25-2.25V15M2.25 15v2.25A2.25 2.25 0 004.5 19.5z"
                  />
                </svg>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                  Кабинет Поставщика
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Управляйте каталогом товаров, ценами, остатками на складе, интервалами и зонами доставки, а также обрабатывайте заказы покупателей.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-primary font-semibold text-sm">
              Войти в кабинет
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>

          {/* Card 2: Admin Panel */}
          <Link
            id="portal-admin-btn"
            href="/admin"
            className="group relative flex flex-col justify-between p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all duration-300 shadow-xl overflow-hidden backdrop-blur-md"
          >
            {/* Top right subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="space-y-6">
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold group-hover:text-emerald-400 transition-colors">
                  Панель Администратора
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Проверяйте анкеты новых поставщиков, модерируйте каталог товаров, разрешайте споры, следите за комиссиями и общим объемом продаж (GMV).
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              Войти в панель
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-zinc-500 text-xs border-t border-zinc-900 gap-4">
        <span>© 2026 Hoomy Marketplace. Все права защищены.</span>
        <div className="flex gap-6">
          <span className="hover:text-zinc-300 cursor-default">Условия использования</span>
          <span className="hover:text-zinc-300 cursor-default">Конфиденциальность</span>
          <span className="hover:text-zinc-300 cursor-default">Поддержка</span>
        </div>
      </footer>
    </div>
  );
}
