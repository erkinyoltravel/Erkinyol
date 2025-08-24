import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Plane, Hotel, TramFront, Mountain, Compass, Globe2, Phone, Mail, MapPin, Ship, ShieldCheck, Calendar, Send, Sun, Moon } from "lucide-react";

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

// ✅ Правильная версия Section — НИКАКИХ дополнительных <section ...> ниже быть не должно
type SectionProps = React.PropsWithChildren<{ id?: string; className?: string }>;
const Section: React.FC<SectionProps> = ({ id, className = "", children }) => {
  return (
    <section id={id} className={`container mx-auto px-4 lg:px-8 ${className}`}>
      {children}
    </section>
  );
};

const Badge: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide backdrop-blur bg-white/60 dark:bg-slate-900/40 shadow-sm">{children}</span>
);
const Pill: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" style={{background:"var(--brand-50)", color:"var(--brand-700)"}}>{children}</span>
);

export const I18N = { /* shortened for file size; identical to previous message */ } as any;
// To keep file short in this demo archive, we will reconstruct I18N in runtime:
const I = {
  ru: { code:'ru', locale:'ru_RU', brandTag:'Central Asia Tailor-Made Journeys',
    nav:{services:'Услуги',tours:'Туры',outbound:'Выездные',visa:'Виза',contact:'Контакты'},
    cta:{download:'Скачать каталог',request:'Оставить заявку',pickTour:'Подобрать тур',contactUs:'Связаться с нами',book:'Забронировать',more:'Подробнее',openMap:'Открыть в картах',send:'Отправить'},
    hero:{region:'Туркменистан • Центральная Азия',title:'Незабываемые поездки под ключ — от пустынь Каракумов до древнего Мерва',text:'ErkinYol Travel проектирует безопасные и удобные маршруты, берёт на себя визовую поддержку и всю логистику, а вам остаётся наслаждаться путешествием.'},
    services:{title:'Ключевые услуги',subtitle:'Полный цикл — от визовой поддержки и логистики до авторских туров и выездных программ.',badge:'Что мы делаем'},
    tours:{title:'Популярные маршруты',subtitle:'От огненного кратера Дарваза до горных долин Нохура и древнего Мерва.',badge:'Вдохновение'},
    outbound:{title:'Путешествия за пределами страны',subtitle:'Групповые и индивидуальные поездки в странах региона — с поддержкой на русском и английском.',badge:'Выездные направления'},
    visa:{title:'Letter of Invitation (LOI)',subtitle:'Помогаем оформить приглашение (LOI) для туристической визы. Срок подготовки LOI обычно 15–20 рабочих дней.',badge:'Визовая поддержка',steps:['Заявка и паспортные данные','Подготовка LOI и подача','Получение визы и прилёт']},
    why:{badge:'Почему с нами удобно',title:'Сервис, прозрачность и локальная экспертиза',text:'Мы делаем путешествия простыми: один договор, понятная смета, все брони в одном месте и персональный координатор 24/7.',bullets:['Маршруты с учётом климата и логистики','ЮНЕСКО и локальные гиды','Страхование и надёжные партнёры']},
    contact:{badge:'Связаться',title:'Получить персональное предложение',subtitle:'Заполните форму — и мы вернёмся с маршрутом и сметой.',consent:'Отправляя форму, вы соглашаетесь с обработкой персональных данных.',fields:{name:'Имя',email:'E-mail',phone:'Телефон/WhatsApp',nationality:'Гражданство',dates:'Желаемые даты',pax:'Кол-во путешественников',transport:'Предпочтительный транспорт',languages:'Язык сопровождения',message:'Опишите интересы (природа, история, гастро, треккинг)…'},info:{phone:'Телефон',email:'E-mail',address:'Адрес'}},
    footer:{sections:'Разделы',docs:'Документы',terms:['Договор обслуживания','Политика конфиденциальности','Условия оплаты и отмены'],rights:(y:number)=>`© ${y} ErkinYol Travel. Все права защищены.`},
    taglines:{region:'Сердце Шёлкового пути'}, misc:{days:'дн.',guidePack:'Гид • Трансферы • Проживание'}
  },
  en: { code:'en', locale:'en_US', brandTag:'Central Asia Tailor-Made Journeys',
    nav:{services:'Services',tours:'Tours',outbound:'Outbound',visa:'Visa',contact:'Contacts'},
    cta:{download:'Download Brochure',request:'Request Quote',pickTour:'Find a tour',contactUs:'Contact us',book:'Book',more:'Details',openMap:'Open in Maps',send:'Send'},
    hero:{region:'Turkmenistan • Central Asia',title:'Seamless tailor-made trips — from the Karakum Desert to Ancient Merv',text:'ErkinYol Travel designs safe, convenient routes, handles visas and logistics, so you can simply enjoy the journey.'},
    services:{title:'Core Services',subtitle:'Full cycle from visa support and logistics to signature tours and outbound programs.',badge:'What we do'},
    tours:{title:'Featured Routes',subtitle:'From the burning Darvaza crater to Nokhur valleys and Ancient Merv.',badge:'Inspiration'},
    outbound:{title:'Trips beyond the country',subtitle:'Group and private journeys across the region — with English/Russian support.',badge:'Outbound Destinations'},
    visa:{title:'Letter of Invitation (LOI)',subtitle:'We assist with LOI for tourist visas. Typical processing time is 15–20 business days.',badge:'Visa support',steps:['Application & passport data','LOI preparation & submission','Visa issuance & arrival']},
    why:{badge:'Why travel with us',title:'Service, transparency and local expertise',text:'We make travel easy: one contract, clear budget, all bookings in one place and a 24/7 coordinator.',bullets:['Climate-aware, realistic routes','UNESCO sites & local guides','Insurance and reliable partners']},
    contact:{badge:'Contact',title:'Get a custom proposal',subtitle:"Fill in the form — we'll get back with an itinerary and estimate.",consent:'By sending the form you agree to personal data processing.',fields:{name:'Name',email:'E-mail',phone:'Phone/WhatsApp',nationality:'Citizenship',dates:'Desired dates',pax:'Travelers',transport:'Preferred transport',languages:'Guide language',message:'Describe your interests (nature, history, food, trekking)…'},info:{phone:'Phone',email:'E-mail',address:'Address'}},
    footer:{sections:'Sections',docs:'Documents',terms:['Service agreement','Privacy policy','Payment & cancellation'],rights:(y:number)=>`© ${y} ErkinYol Travel. All rights reserved.`},
    taglines:{region:'Heart of the Silk Road'}, misc:{days:'days',guidePack:'Guide • Transfers • Stays'}
  },
  zh: { code:'zh', locale:'zh_CN', brandTag:'中亚定制旅行',
    nav:{services:'服务',tours:'线路',outbound:'出境',visa:'签证',contact:'联系'},
    cta:{download:'下载手册',request:'申请报价',pickTour:'选线路',contactUs:'联系我们',book:'预订',more:'详情',openMap:'在地图中打开',send:'发送'},
    hero:{region:'土库曼斯坦 • 中亚',title:'省心的一站式定制旅行——从卡拉库姆到古梅尔夫',text:'ErkinYol Travel 设计安全便捷的路线，处理签证与交通，让您只需享受旅程。'},
    services:{title:'核心服务',subtitle:'从签证支持与交通到本地特色线路与出境游。',badge:'我们的工作'},
    tours:{title:'精选线路',subtitle:'从达瓦札火焰地坑到诺库尔山谷与古梅尔夫。',badge:'灵感'},
    outbound:{title:'国外目的地',subtitle:'组织团队/私家出行，提供中文/英语/俄语向导。',badge:'出境目的地'},
    visa:{title:'签证邀请函（LOI）',subtitle:'协助办理旅游签 LOI，通常 15–20 个工作日。',badge:'签证支持',steps:['提交信息与护照页','准备并提交邀请函','获签与到达']},
    why:{badge:'为什么选择我们',title:'服务、透明与本地专家',text:'让旅行变简单：一份合同、清晰预算、所有预订集中管理、24/7 协调员。',bullets:['考虑气候与交通的可行线路','联合国教科文组织遗产与本地向导','保险与可靠合作伙伴']},
    contact:{badge:'联系',title:'获取专属行程',subtitle:'填写表单，我们将发送行程与预算。',consent:'提交即表示同意个人信息处理。',fields:{name:'姓名',email:'E-mail',phone:'电话/WhatsApp',nationality:'国籍',dates:'期望日期',pax:'出行人数',transport:'偏好交通',languages:'向导语言',message:'描述您的兴趣（自然/历史/美食/徒步）…'},info:{phone:'电话',email:'E-mail',address:'地址'}},
    footer:{sections:'栏目',docs:'文件',terms:['服务协议','隐私政策','支付与取消'],rights:(y:number)=>`© ${y} ErkinYol Travel. 版权所有。`},
    taglines:{region:'丝绸之路的心脏'}, misc:{days:'天',guidePack:'导游 • 接送 • 住宿'}
  }
};

const SERVICES = [
  { icon: Hotel, key: "hotels", ru: { title: "Бронирование отелей", desc: "Подбираем проверенные отели под ваш маршрут и бюджет." }, en: { title: "Hotel booking", desc: "Trusted stays tailored to your route and budget." }, zh: { title: "酒店预订", desc: "根据行程与预算甄选可信住宿。" } },
  { icon: Plane, key: "air", ru: { title: "Авиабилеты (внутренние/междун.)", desc: "Оперативно оформляем билеты и оптимизируем стыковки." }, en: { title: "Flight tickets (domestic/international)", desc: "Fast issuing and smart connections." }, zh: { title: "机票（国内/国际）", desc: "快速出票，优化转机衔接。" } },
  { icon: TramFront, key: "transfer", ru: { title: "Трансферы и транспорт", desc: "Дорога по стране: авто, офф-роуд, поезд или комбинированно." }, en: { title: "Transfers & transport", desc: "Across the country: car, off-road, train or combined." }, zh: { title: "接送与交通", desc: "全国出行：汽车、越野、火车或组合。" } },
  { icon: ShieldCheck, key: "loi", ru: { title: "Визовая поддержка (LOI)", desc: "Готовим приглашение и сопровождаем до получения визы." }, en: { title: "Visa support (LOI)", desc: "LOI preparation with guidance until visa issued." }, zh: { title: "签证支持（LOI）", desc: "准备邀请函并全程指导至出签。" } },
  { icon: Compass, key: "inbound", ru: { title: "Индивидуальные туры по Туркменистану", desc: "Авторские маршруты: Каракумы, крепости, ЮНЕСКО." }, en: { title: "Custom tours in Turkmenistan", desc: "Signature routes: Karakum, fortresses, UNESCO highlights." }, zh: { title: "土库曼斯坦定制游", desc: "特色线路：卡拉库姆、古堡、世界遗产。" } },
  { icon: Globe2, key: "outbound", ru: { title: "Выездные туры", desc: "Иран, Вьетнам, Малайзия, Таиланд, ОАЭ, Китай, Индия, Россия и др." }, en: { title: "Outbound trips", desc: "Iran, Vietnam, Malaysia, Thailand, UAE, China, India, Russia, etc." }, zh: { title: "出境游", desc: "伊朗、越南、马来西亚、泰国、阿联酋、中国、印度、俄罗斯等。" } },
];

const TOURS = [
  { slug:"derweze", days:2, image:"https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop",
    ru:{title:"Экспедиция к кратеру Дарваза", blurb:"Ночное свечение газового кратера и ужин под звёздами."},
    en:{title:"Darvaza Crater Expedition", blurb:"Glowing gas crater and a starlit camp dinner."},
    zh:{title:"达瓦札火焰地坑探秘", blurb:"夜观地坑火海与星空营地晚餐。"}
  },
  { slug:"nokhur", days:3, image:"https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop",
    ru:{title:"Нохур: культурное погружение", blurb:"Горное село, ремёсла, гостевые дома и прогулки."},
    en:{title:"Nokhur Cultural Immersion", blurb:"Mountain village, crafts, guesthouses and walks."},
    zh:{title:"诺库尔文化之旅", blurb:"山村、手工艺、民宿与徒步。"}
  },
  { slug:"merv", days:2, image:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
    ru:{title:"Древний Мерв и Серкала", blurb:"Шёлковый путь, ЮНЕСКО, лунные ландшафты."},
    en:{title:"Ancient Merv & Serkala", blurb:"Silk Road heritage, UNESCO, lunar landscapes."},
    zh:{title:"古梅尔夫与塞尔卡拉", blurb:"丝路遗产与地貌奇观。"}
  }
];

const OUTBOUND = [
  { ru: "Иран", en: "Iran", zh: "伊朗" },
  { ru: "Вьетнам", en: "Vietnam", zh: "越南" },
  { ru: "Малайзия", en: "Malaysia", zh: "马来西亚" },
  { ru: "Таиланд", en: "Thailand", zh: "泰国" },
  { ru: "ОАЭ", en: "UAE", zh: "阿联酋" },
  { ru: "Китай", en: "China", zh: "中国" },
  { ru: "Индия", en: "India", zh: "印度" },
  { ru: "Россия", en: "Russia", zh: "俄罗斯" },
  { ru: "Центральная Азия", en: "Central Asia", zh: "中亚" },
];

function useTheme(){
  const [theme,setTheme] = useState<'light'|'dark'>(() => (typeof window!=='undefined' && (localStorage.getItem('ey-theme') as any)) || 'light');
  useEffect(()=>{
    const root = document.documentElement;
    if(theme==='dark') root.classList.add('dark'); else root.classList.remove('dark');
    if(typeof window!=='undefined') localStorage.setItem('ey-theme', theme);
  },[theme]);
  return { theme, setTheme };
}

export default function ErkinYolLanding(){
  const { theme, setTheme } = useTheme();
  const [lang, setLang] = useState<'ru'|'en'|'zh'>('ru');
  const t = I[lang];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 via-white to-white text-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
      <Helmet htmlAttributes={{ lang: t.code }}>
        <title>ErkinYol Travel — {t.hero.title}</title>
        <link rel="canonical" href="https://erkinyol.com/" />
        <link rel="alternate" href="https://erkinyol.com/?lang=ru" hrefLang="ru" />
        <link rel="alternate" href="https://erkinyol.com/?lang=en" hrefLang="en" />
        <link rel="alternate" href="https://erkinyol.com/?lang=zh" hrefLang="zh" />
        <meta name="description" content={t.hero.text} />
      </Helmet>

      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 dark:bg-slate-950/50 border-b">
        <nav className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl grid place-items-center text-white font-black" style={{background:"var(--brand-600)"}}>EY</div>
            <div className="leading-tight">
              <p className="font-extrabold tracking-tight text-xl">ErkinYol Travel</p>
              <p className="text-xs text-slate-500">{t.brandTag}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#services" className="hover:text-[var(--brand-700)]">{t.nav.services}</a>
            <a href="#tours" className="hover:text-[var(--brand-700)]">{t.nav.tours}</a>
            <a href="#outbound" className="hover:text-[var(--brand-700)]">{t.nav.outbound}</a>
            <a href="#visa" className="hover:text-[var(--brand-700)]">{t.nav.visa}</a>
            <a href="#contact" className="hover:text-[var(--brand-700)]">{t.nav.contact}</a>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <button aria-label="Toggle theme" className="border rounded-lg px-3 py-1" onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?'☀️':'🌙'}</button>
              <button className={`border rounded-lg px-3 py-1 ${lang==='ru'?'bg-[var(--brand-600)] text-white':''}`} onClick={()=>setLang('ru')}>RU</button>
              <button className={`border rounded-lg px-3 py-1 ${lang==='en'?'bg-[var(--brand-600)] text-white':''}`} onClick={()=>setLang('en')}>EN</button>
              <button className={`border rounded-lg px-3 py-1 ${lang==='zh'?'bg-[var(--brand-600)] text-white':''}`} onClick={()=>setLang('zh')}>中文</button>
            </div>
            <button className="hidden md:inline-flex rounded-lg px-3 py-1 text-sm font-semibold text-white" style={{background:"var(--brand-600)"}} onClick={()=>window.open("/catalog.pdf","_blank")}>{t.cta.download}</button>
            <button className="rounded-lg px-3 py-1 text-sm font-semibold text-white" style={{background:"var(--brand-600)"}} onClick={()=>document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'})}>{t.cta.request}</button>
          </div>
        </nav>
      </header>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1920&auto=format&fit=crop" alt="Karakum" className="h-[72vh] w-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white/0"></div>
        </div>
        <Section className="h-[72vh] grid content-center">
          <div className="max-w-3xl">
            <Badge>{t.hero.region}</Badge>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">{t.hero.title}</h1>
            <p className="mt-4 text-white/90 max-w-2xl">{t.hero.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{background:"var(--brand-600)"}} onClick={()=>document.querySelector('#tours')?.scrollIntoView({behavior:'smooth'})}>{t.cta.pickTour}</button>
              <button className="rounded-lg px-4 py-2 text-sm font-semibold border backdrop-blur bg-white/60" onClick={()=>document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'})}>{t.cta.contactUs}</button>
            </div>
          </div>
        </Section>
      </div>

      <Section id="services" className="py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Pill>{t.services.badge}</Pill>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">{t.services.title}</h2>
            <p className="mt-2 text-slate-600 max-w-2xl">{t.services.subtitle}</p>
          </div>
          <div className="hidden md:block text-sm text-slate-500">{lang==='ru'?'Прозрачно. Удобно. В срок.':lang==='zh'?'透明 · 省心 · 准时':'Clear. Simple. On time.'}</div>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({icon:Icon, ru, en, zh, key})=>{
            const item = lang==='ru'?ru:lang==='zh'?zh:en;
            return (
              <div key={key} className="border rounded-2xl bg-white p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-2xl grid place-items-center" style={{background:"var(--brand-50)", color:"var(--brand-700)"}}><Icon className="h-6 w-6"/></div>
                  <div className="text-lg font-semibold">{item.title}</div>
                </div>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="tours" className="py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Pill>{t.tours.badge}</Pill>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">{t.tours.title}</h2>
            <p className="mt-2 text-slate-600 max-w-2xl">{t.tours.subtitle}</p>
          </div>
          <button className="rounded-lg px-3 py-1 text-sm font-semibold border">Смотреть все</button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TOURS.map(tour => (
            <div key={tour.slug} className="overflow-hidden hover:shadow-xl transition-shadow border rounded-2xl bg-white">
              <div className="relative h-52">
                <img src={tour.image} alt={tour[lang].title} className="h-full w-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <Badge>{tour.days} {t.misc.days}</Badge>
                  <Badge>{t.misc.guidePack}</Badge>
                </div>
              </div>
              <div className="p-6">
                <div className="text-xl font-semibold flex items-center gap-2"><Mountain className="h-5 w-5" /> {tour[lang].title}</div>
                <p className="mt-2 text-slate-600">{tour[lang].blurb}</p>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-lg px-3 py-1 text-sm font-semibold text-white" style={{background:"var(--brand-600)"}}>{t.cta.book}</button>
                  <button className="rounded-lg px-3 py-1 text-sm font-semibold border">{t.cta.more}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="outbound" className="py-20">
        <div>
          <Pill>{t.outbound.badge}</Pill>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">{t.outbound.title}</h2>
          <p className="mt-2 text-slate-600 max-w-2xl">{t.outbound.subtitle}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {OUTBOUND.map((d,i)=>(
            <div key={i} className="border rounded-2xl bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3"><Globe2 className="h-5 w-5"/><span className="font-medium">{d[lang]}</span></div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-sm text-slate-500 flex items-center gap-2"><Ship className="h-4 w-4" /> {lang==='ru'? 'Возможны круизы и комбинированные маршруты.' : lang==='zh' ? '可安排邮轮与组合行程。' : 'Cruises and combined routes available.'}</div>
      </Section>

      <Section id="visa" className="py-20">
        <div>
          <Pill>{t.visa.badge}</Pill>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">{t.visa.title}</h2>
          <p className="mt-2 text-slate-600 max-w-2xl">{t.visa.subtitle}</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {t.visa.steps.map((step:string, i:number)=>(
            <div key={step} className="border rounded-2xl bg-white p-6">
              <div className="flex items-center gap-3 text-lg font-semibold">
                <span className="h-8 w-8 rounded-full grid place-items-center font-bold" style={{background:"var(--brand-50)", color:"var(--brand-700)"}}>{i+1}</span> {step}
              </div>
              <p className="mt-3 text-slate-600">{lang==='ru'? 'Мы сопровождаем на каждом этапе и на связи в мессенджерах. При необходимости бронируем отели и билеты под визовые требования.' : lang==='zh' ? '全程协助；可按签证要求预订酒店和机票。' : 'We assist at every step and stay in touch via messengers. We can book hotels and flights to meet visa requirements.'}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="contact" className="py-20">
        <div className="text-center max-w-2xl mx-auto">
          <Pill>{t.contact.badge}</Pill>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">{t.contact.title}</h2>
          <p className="mt-2 text-slate-600">{t.contact.subtitle}</p>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="border rounded-2xl bg-white p-6 lg:col-span-2">
            <form className="grid gap-4" onSubmit={async (e)=>{
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              const data:any = Object.fromEntries(fd.entries());
              try{
                const res = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
                  ...data, transport: fd.getAll('transport'), guideLanguages: fd.getAll('guideLanguages'), lang, source:'erkinyol-landing'
                })});
                if(!res.ok) throw new Error('Bad response');
                alert(lang==='ru'?'Спасибо! Мы свяжемся с вами в ближайшее время.':lang==='zh'?'谢谢！我们会尽快联系您。':"Thank you! We'll get back to you shortly.");
                (e.currentTarget as HTMLFormElement).reset();
              }catch(_){
                const subject = encodeURIComponent(`ErkinYol Travel — ${lang==='ru'?'заявка':lang==='zh'?'咨询':'request'}`);
                const body = encodeURIComponent(`Name: ${data.name||''}\nEmail: ${data.email||''}\nPhone: ${data.phone||''}\nMessage:\n${data.message||''}`);
                window.location.href = `mailto:info@erkinyol.com?subject=${subject}&body=${body}`;
              }
            }}>
              <div className="grid gap-4 md:grid-cols-2">
                <input name="name" className="border rounded-lg px-3 py-2" placeholder={t.contact.fields.name} required />
                <input name="email" type="email" className="border rounded-lg px-3 py-2" placeholder={t.contact.fields.email} required />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input name="phone" className="border rounded-lg px-3 py-2" placeholder={t.contact.fields.phone} />
                <input name="nationality" className="border rounded-lg px-3 py-2" placeholder={t.contact.fields.nationality} />
              </div>
              <textarea name="message" rows={5} className="border rounded-lg px-3 py-2" placeholder={t.contact.fields.message}></textarea>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">{t.contact.consent}</div>
                <button className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{background:"var(--brand-600)"}}><Send className="inline-block h-4 w-4 mr-2"/>{t.cta.send}</button>
              </div>
            </form>
          </div>
          <div className="border rounded-2xl bg-white p-6">
            <div className="space-y-3">
              <div><div className="font-semibold">{t.contact.info.phone}</div><div>+993 xx xxx xx xx</div></div>
              <div><div className="font-semibold">{t.contact.info.email}</div><div>info@erkinyol.com</div></div>
              <div><div className="font-semibold">{t.contact.info.address}</div><div>Gowshut Han 20, Mary city, Turkmenistan</div></div>
            </div>
            <button className="mt-4 w-full rounded-lg px-3 py-1 text-sm font-semibold border">{t.cta.openMap}</button>
            <div className="mt-4 flex items-center gap-2 justify-between md:hidden">
              <button className="border rounded-lg px-3 py-1" onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?'☀️':'🌙'}</button>
              <div className="flex gap-1">
                <button className={`border rounded-lg px-3 py-1 ${lang==='ru'?'bg-[var(--brand-600)] text-white':''}`} onClick={()=>setLang('ru')}>RU</button>
                <button className={`border rounded-lg px-3 py-1 ${lang==='en'?'bg-[var(--brand-600)] text-white':''}`} onClick={()=>setLang('en')}>EN</button>
                <button className={`border rounded-lg px-3 py-1 ${lang==='zh'?'bg-[var(--brand-600)] text-white':''}`} onClick={()=>setLang('zh')}>中文</button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <footer className="mt-20 border-t">
        <Section className="py-10 grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl grid place-items-center text-white font-black" style={{background:"var(--brand-600)"}}>EY</div>
              <span className="font-extrabold">ErkinYol Travel</span>
            </div>
            <p className="mt-3 text-sm text-slate-600 max-w-sm">Central Asia starts here.</p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <div className="font-semibold mb-3">{t.footer.sections}</div>
              <ul className="space-y-2">
                <li><a href="#services" className="hover:text-[var(--brand-700)]">{t.nav.services}</a></li>
                <li><a href="#tours" className="hover:text-[var(--brand-700)]">{t.nav.tours}</a></li>
                <li><a href="#outbound" className="hover:text-[var(--brand-700)]">{t.nav.outbound}</a></li>
                <li><a href="#visa" className="hover:text-[var(--brand-700)]">{t.nav.visa}</a></li>
                <li><a href="#contact" className="hover:text-[var(--brand-700)]">{t.nav.contact}</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3">{t.footer.docs}</div>
              <ul className="space-y-2">
                {(t.footer.terms||[]).map((d:string)=>(<li key={d}>{d}</li>))}
              </ul>
            </div>
          </div>
          <div className="text-sm text-slate-500">{(t.footer.rights||((y:number)=>`© ${y} ErkinYol Travel.`))(new Date().getFullYear())}</div>
        </Section>
      </footer>
    </div>
  );
}
