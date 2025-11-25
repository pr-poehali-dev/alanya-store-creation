import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OrderModal from "@/components/OrderModal";
import CartModal from "@/components/CartModal";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { label: "Главное", href: "#hero" },
  { label: "Каталог", href: "#catalog" },
  { label: "О нас", href: "#about" },
  { label: "Доставка", href: "#delivery" },
  { label: "Контакты", href: "#contacts" },
];

const catalogSections = [
  {
    title: "Майки для танцев",
    description: "Яркие майки с уникальными принтами: геометрия, тропики и этника для свободы движений.",
    tags: ["Геометрический принт", "Тропический принт", "Этнический узор"],
    items: [
      {
        name: "Майка с геометрическим принтом",
        price: "2 500 ₽",
        image: "https://cdn.poehali.dev/projects/70fe6f9c-8231-428b-8399-dc0b53874b78/files/a5d08a0a-b4f9-44c5-978a-bcf8321d6ce1.jpg"
      },
      {
        name: "Майка с тропическим принтом",
        price: "2 400 ₽",
        image: "https://cdn.poehali.dev/projects/70fe6f9c-8231-428b-8399-dc0b53874b78/files/12d57148-f1ff-4c68-bb6b-35af2ab6c677.jpg"
      },
      {
        name: "Майка с этническим узором",
        price: "2 600 ₽",
        image: "https://cdn.poehali.dev/projects/70fe6f9c-8231-428b-8399-dc0b53874b78/files/0ae82bd5-803b-44f3-848a-90f4c5ae0527.jpg"
      }
    ]
  },
  {
    title: "Танцевальные штаны",
    description: "Свободные штаны различных фасонов: шаровары и палаццо для комфорта и стиля.",
    tags: ["Шаровары", "Палаццо", "Свободный крой"],
    items: [
      {
        name: "Шаровары с резинкой",
        price: "3 200 ₽",
        image: "https://cdn.poehali.dev/projects/70fe6f9c-8231-428b-8399-dc0b53874b78/files/0d938e74-77be-4de0-8704-d6e0cf8fbd49.jpg"
      },
      {
        name: "Штаны палаццо",
        price: "3 500 ₽",
        image: "https://cdn.poehali.dev/projects/70fe6f9c-8231-428b-8399-dc0b53874b78/files/a77ce2e7-bb32-4be4-9c0c-d7d1ae17942f.jpg"
      }
    ]
  },
  {
    title: "Танцевальные пояса",
    description: "Декоративные пояса с монетами и кисточками для эффектных выступлений.",
    tags: ["С монетами", "С кисточками", "Яркие цвета"],
    items: [
      {
        name: "Пояс с монетами и кисточками",
        price: "1 800 ₽",
        image: "https://cdn.poehali.dev/projects/70fe6f9c-8231-428b-8399-dc0b53874b78/files/df927229-163e-4974-a59a-c6c42bbc1496.jpg"
      }
    ]
  }
];

const subCategories = [
  {
    title: "Для мужчин",
    groups: [
      { name: "Верх", items: ["Рубашки", "Жилеты", "Кардиганы"] },
      { name: "Низ", items: ["Брюки", "Шорты", "Юкка"] },
      { name: "Outerwear", items: ["Пальто", "Кимоно"] },
    ],
    accent: "bg-stone-100",
  },
  {
    title: "Для женщин",
    groups: [
      { name: "Платья", items: ["Кейпы", "Мини", "Макси"] },
      { name: "Юбки", items: ["Миди", "Клёш", "Многослойные"] },
      { name: "Верх", items: ["Жакеты", "Топы", "Блузы"] },
    ],
    accent: "bg-rose-50",
  },
  {
    title: "Аксессуары",
    groups: [
      { name: "Головные уборы", items: ["Береты", "Банданы"] },
      { name: "Украшения", items: ["Браслеты", "Серьги"] },
      { name: "Сумки", items: ["Тоут", "Кроссбоди"] },
    ],
    accent: "bg-amber-50",
  },
];

const deliverySteps = [
  {
    title: "Эко-упаковка",
    description: "Каждый заказ упаковываем в перерабатываемые материалы без пластика.",
    icon: "Leaf",
  },
  {
    title: "География",
    description: "Доставляем по России и СНГ через СДЭК, Boxberry и курьером в Москве.",
    icon: "Truck",
  },
  {
    title: "Сроки",
    description: "Готовые изделия отправляем в течение 2 дней, пошив занимает 5-10 дней.",
    icon: "Clock3",
  },
];

const contactInfo = [
  {
    title: "Шоу-рум",
    details: "Москва, Большой Харитоньевский переулок, 21",
    icon: "MapPin",
  },
  {
    title: "WhatsApp",
    details: "+7 999 101 00 10",
    icon: "MessageCircle",
  },
  {
    title: "Почта",
    details: "care@alanyastore.ru",
    icon: "Mail",
  },
];

const Index = () => {
  const { addItem, totalItems } = useCart();
  const [selectedItem, setSelectedItem] = useState<{name: string; price: string; image: string} | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const handleOrderClick = (item: {name: string; price: string; image: string}) => {
    setSelectedItem(item);
    setIsOrderModalOpen(true);
  };

  const handleAddToCart = (item: {name: string; price: string; image: string}) => {
    addItem(item);
  };

  return (
    <div className="min-h-screen bg-[#f8f4ef] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#f8f4ef]/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <a href="#hero" className="text-2xl font-semibold tracking-tight md:mr-12">
            Alanya Store
          </a>
          <nav className="flex items-center gap-4">
            <div className="hidden gap-6 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-amber-700">
                {link.label}
              </a>
            ))}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setIsCartModalOpen(true)}
            >
              <Icon name="ShoppingCart" size={20} />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 text-xs font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </Button>
          </nav>
          <div className="hidden flex-1 items-center justify-end gap-3">
            <div className="hidden max-w-xs flex-1 md:flex">
              <Input placeholder="Поиск по сайту" className="bg-white/80" />
            </div>
            <button className="relative rounded-full border border-black/5 p-2">
              <Icon name="Search" size={18} />
            </button>
            <button className="rounded-full border border-black/5 p-2">
              <Icon name="Heart" size={18} />
            </button>
            <button className="rounded-full border border-black/5 p-2">
              <Icon name="ShoppingBag" size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-12">
        <section id="hero" className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-800">
              Ручной пошив / Эко-текстиль
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Коллекция одежды ручной работы с душой средиземноморского побережья
            </h1>
            <p className="text-lg text-slate-600">
              Мы создаём лимитированные капсулы из льна, хлопка и шерсти от проверенных
              фермерских хозяйств. Каждый шов — инструментальное мастерство наших портных.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-amber-900 hover:bg-amber-800">
                Смотреть каталог
              </Button>
              <Button variant="outline" size="lg">
                Индивидуальный заказ
              </Button>
            </div>
            <div className="flex gap-6 text-sm text-slate-500">
              <div>
                <p className="text-2xl font-semibold text-slate-900">120+</p>
                изделий на складе
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">7 дней</p>
                средний срок пошива
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">100%</p>
                натуральные ткани
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-black/5">
            <img
              src="https://cdn.poehali.dev/projects/70fe6f9c-8231-428b-8399-dc0b53874b78/files/b0dded1d-0f40-4907-a5e3-fb7d6bd395c3.jpg"
              alt="Alanya Store коллекция"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section id="catalog" className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-amber-700">Каталог</p>
              <h2 className="text-3xl font-semibold">Коллекции по настроению</h2>
            </div>
            <Button variant="ghost" className="gap-2">
              Скачать lookbook
              <Icon name="Download" size={18} />
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {catalogSections.map((section) => (
              <Card key={section.title} className="border-black/5 bg-white/80">
                <CardHeader>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <div 
                        key={item.name} 
                        className="group cursor-pointer overflow-hidden rounded-xl border border-black/5 bg-white transition-shadow hover:shadow-md"
                        onClick={() => handleOrderClick(item)}
                      >
                        <div className="flex gap-3 p-3">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <p className="text-sm font-medium text-slate-900">{item.name}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-base font-semibold text-amber-700">{item.price}</p>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(item);
                                }}
                              >
                                <Icon name="ShoppingCart" size={14} />
                                В корзину
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {section.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {subCategories.map((category) => (
              <div key={category.title} className={`rounded-2xl ${category.accent} p-6 shadow-sm`}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                  <Icon name="ArrowUpRight" size={20} />
                </div>
                <div className="space-y-4 text-sm text-slate-600">
                  {category.groups.map((group) => (
                    <div key={group.name}>
                      <p className="font-semibold text-slate-900">{group.name}</p>
                      <p>{group.items.join(" · ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-amber-700">О нас</p>
            <h2 className="text-3xl font-semibold">Экологичный бренд с ремесленной философией</h2>
            <p className="text-lg text-slate-600">
              Основанный на берегу Средиземного моря Alanya Store сочетает традиции ручного труда и
              современную эстетику. Мы работаем с малыми ткацкими мастерскими Турции и России,
              отслеживаем цепочку поставок и используем только сертифицированные ткани.
            </p>
            <ul className="space-y-3 text-slate-600">
              <li>• Натуральный лён, хлопок, шерсть и шёлк из устойчивых хозяйств</li>
              <li>• Ручная отделка: вышивка, плетение, окрашивание растительными красителями</li>
              <li>• Каждое изделие проходит 3 этапа контроля качества</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white/80 p-8 shadow-lg">
            <h3 className="mb-6 text-xl font-semibold">Что нас отличает</h3>
            <div className="space-y-6 text-sm text-slate-600">
              <div>
                <p className="text-lg font-semibold text-slate-900">Честное производство</p>
                <p>Все мастера получают достойную оплату, а клиент знает историю каждой вещи.</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">Уважение к природе</p>
                <p>Мы минимизируем отходы и запускаем программу обмена и апсайкла одежды.</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">Премиальный сервис</p>
                <p>Стилист поможет собрать капсулу, а ателье подгонит изделие под ваш силуэт.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="delivery" className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-amber-700">Доставка</p>
            <h2 className="text-3xl font-semibold">Заботимся о каждой посылке</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {deliverySteps.map((step) => (
              <Card key={step.title} className="border-amber-100 bg-white/80">
                <CardHeader className="flex-row items-center gap-3">
                  <div className="rounded-full bg-amber-100 p-3">
                    <Icon name={step.icon} size={20} />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-slate-600">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="contacts" className="grid gap-8 rounded-3xl bg-amber-50 p-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-amber-800">Контакты</p>
            <h2 className="text-3xl font-semibold">Всегда на связи и рады встрече</h2>
            <p className="text-lg text-slate-600">
              Приходите в шоу-рум, попробуйте капсулы и оформите заказ с примеркой. Онлайн мы отвечаем
              в мессенджерах и соцсетях в течение часа.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {contactInfo.map((contact) => (
                <div key={contact.title} className="rounded-2xl bg-white p-4">
                  <div className="mb-3 flex items-center gap-3 text-amber-800">
                    <Icon name={contact.icon} size={20} />
                    <p className="font-semibold text-slate-900">{contact.title}</p>
                  </div>
                  <p className="text-slate-600">{contact.details}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold">Оставьте заявку</h3>
            <p className="mb-6 text-sm text-slate-600">
              Подберём размер, расскажем про ткани и отправим актуальный каталог в течение 30 минут.
            </p>
            <div className="space-y-4">
              <Input placeholder="Имя" />
              <Input placeholder="Телефон или e-mail" />
              <Input placeholder="Желаемая категория" />
              <Button className="w-full bg-amber-900 hover:bg-amber-800">Записаться на консультацию</Button>
            </div>
          </div>
        </section>
      </main>

      <OrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        item={selectedItem}
      />
      <CartModal 
        isOpen={isCartModalOpen} 
        onClose={() => setIsCartModalOpen(false)} 
      />

      <footer className="border-t border-black/5 bg-white/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Alanya Store. Все права защищены.</p>
          <div className="flex gap-4">
            <a href="#catalog">Каталог</a>
            <a href="#delivery">Доставка</a>
            <a href="#contacts">Контакты</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;