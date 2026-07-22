import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  ArrowRight, MapPin, Star, ShieldCheck, Utensils,
  User, KeyRound, Clock, Trash2, AlertCircle,
  ArrowLeft, CheckCircle2, Sparkles, Bed, Trees, Wifi,
  Wind, Coffee, Waves, Users, Package, Eye, Zap, UserCheck,
  History, DoorOpen, Lock, LogOut, Bell, X, Hash,
  RefreshCw, Calendar, CalendarDays, CalendarPlus, Hourglass, Phone, Smartphone,
  ChefHat, Tv, Flame, Bath, Shield, Check, Layers, Refrigerator, Wine, Armchair, WashingMachine,
  ChevronLeft, ChevronRight, Send, Sun, Thermometer, Droplets
} from 'lucide-react';

const SUPABASE_URL = 'https://matlhjhwsspweqxfwzpw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hdGxoamh3c3Nwd2VxeGZ3enB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NjI0NDAsImV4cCI6MjEwMDAzODQ0MH0.Uyso9LTS3qFdFEHQfQh-FHoVExYNMqslu4OeR3B_a2s';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Отправка сообщений в Telegram Бот
const sendTelegramNotification = async (text, inlineKeyboard = null) => {
  try {
    const token = localStorage.getItem('ak_tg_token');
    const chatId = localStorage.getItem('ak_tg_chat');
    if (!token || !chatId) return false;
    const bodyObj = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML'
    };
    if (inlineKeyboard) {
      bodyObj.reply_markup = { inline_keyboard: inlineKeyboard };
    }
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyObj)
    });
    return res.ok;
  } catch (e) {
    console.error('Telegram API error:', e);
    return false;
  }
};

/* ─── Утилиты ───────────────────────────────────────────────── */
const today = () => new Date().toISOString().split('T')[0];
const tomorrow = () => {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};
const fmtDate = (s) => {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
};
const nights = (ci, co) => {
  if (!ci || !co) return 0;
  return Math.max(0, Math.round((new Date(co) - new Date(ci)) / 86400000));
};

const ROOM_NUMBERS = { std: ['101','102','103','104','105'], dlx: ['201','202','203','204'], suite: ['301','302'] };
const ADMIN_PASS = 'aikol2024';

// Функция сжатия фото для сохранения в localStorage без превышения лимитов
const compressImage = (base64Str, maxWidth = 800, maxHeight = 600, quality = 0.7) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(base64Str);
  });
};

const PERK_ICONS_MAP = {
  'кровать':          <Bed size={12} strokeWidth={2} />,
  'спальн':           <Bed size={12} strokeWidth={2} />,
  'балкон':           <Trees size={12} strokeWidth={2} />,
  'ви-фи':            <Wifi size={12} strokeWidth={2} />,
  'wi-fi':            <Wifi size={12} strokeWidth={2} />,
  'wifi':             <Wifi size={12} strokeWidth={2} />,
  'вай фай':          <Wifi size={12} strokeWidth={2} />,
  'кондиционер':      <Wind size={12} strokeWidth={2} />,
  'климат':           <Wind size={12} strokeWidth={2} />,
  'панорам':          <Eye size={12} strokeWidth={2} />,
  'вид':              <Eye size={12} strokeWidth={2} />,
  'кофе':             <Coffee size={12} strokeWidth={2} />,
  'чай':              <Coffee size={12} strokeWidth={2} />,
  'гидромассаж':      <Waves size={12} strokeWidth={2} />,
  'джакузи':          <Waves size={12} strokeWidth={2} />,
  'бассейн':          <Waves size={12} strokeWidth={2} />,
  'завтрак':          <Utensils size={12} strokeWidth={2} />,
  'кухня':            <ChefHat size={12} strokeWidth={2} />,
  'кухон':            <ChefHat size={12} strokeWidth={2} />,
  'посуда':           <Wine size={12} strokeWidth={2} />,
  'посуд':            <Wine size={12} strokeWidth={2} />,
  'телевизор':        <Tv size={12} strokeWidth={2} />,
  'тв':               <Tv size={12} strokeWidth={2} />,
  'tv':               <Tv size={12} strokeWidth={2} />,
  'холодильник':      <Refrigerator size={12} strokeWidth={2} />,
  'мини-бар':         <Package size={12} strokeWidth={2} />,
  'бар':              <Wine size={12} strokeWidth={2} />,
  'батлер':           <UserCheck size={12} strokeWidth={2} />,
  'гостиная':         <Users size={12} strokeWidth={2} />,
  'терраса':          <Zap size={12} strokeWidth={2} />,
  'сейф':             <Shield size={12} strokeWidth={2} />,
  'сауна':            <Flame size={12} strokeWidth={2} />,
  'ванна':            <Bath size={12} strokeWidth={2} />,
  'душ':              <Bath size={12} strokeWidth={2} />,
  'диван':            <Armchair size={12} strokeWidth={2} />,
  'стиральная':       <WashingMachine size={12} strokeWidth={2} />,
};

const getPerkIcon = (perkText) => {
  if (!perkText) return <Sparkles size={12} strokeWidth={2} />;
  const lower = perkText.toLowerCase().trim();
  for (const [key, icon] of Object.entries(PERK_ICONS_MAP)) {
    if (lower.includes(key)) return icon;
  }
  return <CheckCircle2 size={12} strokeWidth={2} />;
};

const INITIAL_ROOMS = [
  { id:'std',   name:'Стандарт',               subtitle:'Комфортный классический номер',        price:'1 500', size:'32 м²', cap:'2 гостя',   img:'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=85', images:['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=85'], perks:['Кровать King‑size','Балкон','Wi‑Fi 100 Мбит/с','Кондиционер'],   priceTiers:{ 1: 1500, 2: 3000, 3: 4500 } },
  { id:'dlx',   name:'Делюкс с видом на озеро', subtitle:'Панорама Иссык-Куля прямо из номера', price:'2 500', size:'48 м²', cap:'2–3 гостя',  img:'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=85', images:['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=85'], perks:['Панорамный вид','Кофемашина','Гидромассаж','Завтрак включён'],   priceTiers:{ 1: 2500, 2: 5000, 3: 7500 } },
  { id:'suite', name:'Президентский Люкс',      subtitle:'Эксклюзивный сьют высшего уровня',    price:'4 000', size:'85 м²', cap:'4 гостя',    img:'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=85', images:['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=900&q=85'], perks:['Гостиная + 2 спальни','Персональный батлер','Свободный мини-бар','Терраса'], priceTiers:{ 1: 4000, 2: 8000, 3: 12000 } },
];

// Получить цену номера по кол-ву гостей
const getRoomPrice = (room, guests = 1) => {
  if (!room) return 0;
  const tiers = room.priceTiers;
  if (!tiers) return parseInt(String(room.price || '0').replace(/\D/g, '')) || 0;
  // Найти подходящий тариф: берём максимальный tier <= guests
  const keys = Object.keys(tiers).map(Number).sort((a, b) => a - b);
  let price = tiers[keys[0]];
  for (const k of keys) { if (guests >= k) price = tiers[k]; }
  return price;
};

const INITIAL_MENU = [
  {
    id: 'f1',
    name: 'Завтрак «Айкөл»',
    category: 'Завтраки',
    price: '450 сом',
    desc: 'Традиционный байский завтрак с сытной яичницей, сочным ячменным хлебом и чаем.',
    ingredients: ['Яичница', 'Домашний сыр', 'Лепёшка', 'Горный мед', 'Байский чай с чабрецом'],
    img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'f2',
    name: 'Бешбармак из баранины',
    category: 'Горячее',
    price: '680 сом',
    desc: 'Нежнейшая парная баранина, сваренная в наваристом бульоне с тончайшей лапшой.',
    ingredients: ['Молодая баранина', 'Домашняя лапша', 'Наваристый туз (соус)', 'Репчатый лук', 'Зелень'],
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'f3',
    name: 'Форель на гриле',
    category: 'Горячее',
    price: '850 сом',
    desc: 'Свежайшая дикая форель из озера Иссык-Куль, запеченная с ароматными травами.',
    ingredients: ['Иссык-кульская форель', 'Лимон', 'Горные травы', 'Запеченный картофель', 'Оливковое масло'],
    img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'f4',
    name: 'Шорпо национальное',
    category: 'Супы',
    price: '380 сом',
    desc: 'Прозрачный густой бульон с мясом на косточке и крупными свежими овощами.',
    ingredients: ['Баранина на кости', 'Картофель', 'Морковь', 'Болгарский перец', 'Свежая зелень'],
    img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'f5',
    name: 'Чайник байского чая',
    category: 'Напитки',
    price: '180 сом',
    desc: 'Ароматный элитный зеленый или черный чай с натуральными горными сборами.',
    ingredients: ['Черный/Зеленый чай', 'Чабрец', 'Душица', 'Мята', 'Ягоды барбариса'],
    img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=85',
  },
];

const getPerksArray = (p) => {
  if (Array.isArray(p)) return p;
  if (typeof p === 'string' && p.trim()) return p.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};

const getIngredientsArray = (ing) => {
  if (Array.isArray(ing)) return ing;
  if (typeof ing === 'string' && ing.trim()) return ing.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};

const DEFAULT_MENU_CATEGORIES = [
  'Завтраки',
  'Горячие блюда',
  'Горячее',
  'Супы и шурпа',
  'Супы',
  'Салаты и закуски',
  'Фастфуд и шаурма',
  'Шашлыки и гриль',
  'Пицца и паста',
  'Десерты и выпечка',
  'Напитки',
  'Кофе и чай',
  'Коктейли',
  'Соусы и хлеб',
  'Детское меню'
];

const getOrderAmount = (o) => {
  if (!o) return 0;
  if (typeof o.amount === 'number' && !isNaN(o.amount)) return o.amount;
  if (typeof o.totalAmount === 'number' && !isNaN(o.totalAmount)) return o.totalAmount;

  if (o.total) {
    const totalDigits = String(o.total).replace(/\D/g, '');
    if (totalDigits) return parseInt(totalDigits, 10) || 0;
  }

  if (o.price) {
    const priceStr = String(o.price).split(/сом|\/|\(/)[0];
    const digits = priceStr.replace(/\D/g, '');
    if (digits) return parseInt(digits, 10) || 0;
  }
  return 0;
};

const parseOrderDate = (o) => {
  if (!o) return null;
  if (o.created_at) {
    const d = new Date(o.created_at);
    if (!isNaN(d.getTime())) return d;
  }
  if (o.checkIn) {
    const d = new Date(o.checkIn);
    if (!isNaN(d.getTime())) return d;
  }
  if (o.date && typeof o.date === 'string') {
    if (o.date.includes('.')) {
      const parts = o.date.split('.');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        if (!isNaN(d.getTime())) return d;
      }
    }
    const d = new Date(o.date);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
};

const isOrderInDateRange = (o, startDateStr, endDateStr, clearedAtIso) => {
  const orderDate = parseOrderDate(o);
  if (clearedAtIso && orderDate) {
    const clearedDate = new Date(clearedAtIso);
    if (orderDate <= clearedDate) return false;
  }
  if (!startDateStr && !endDateStr) return true;
  if (!orderDate) return true;

  if (startDateStr) {
    const start = new Date(startDateStr);
    start.setHours(0, 0, 0, 0);
    if (orderDate < start) return false;
  }
  if (endDateStr) {
    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);
    if (orderDate > end) return false;
  }
  return true;
};

const TRANSLATIONS = {
  ru: {
    welcome: 'Добро пожаловать',
    sub: 'в гостиницу «Айкөл»',
    desc: 'Уют, премиальный комфорт и безупречный сервис на берегу Иссык-Куля.',
    location: 'Балыкчы, ул. Восточная 3',
    rating: 'Рейтинг 4.9',
    safe: 'Безопасно',
    rest: 'Ресторан',
    next: 'Далее',
    guestData: 'Данные гостя',
    guestDesc: 'Администратор свяжется с вами для подтверждения бронирования.',
    nameLabel: 'Ваше имя',
    namePlaceholder: 'Иван Иванов',
    phoneLabel: 'Номер телефона',
    confirmBtn: 'Подтвердить и продолжить',
    yourRoom: 'ВАШ НОМЕР',
    activeRequests: 'АКТИВНЫЕ ЗАКАЗЫ & ЗАПРОСЫ',
    requestsBtn: '🛎️ Запросы',
    extendBtn: '📅 Продлить',
    reviewTitle: 'ОТЗЫВ О ГОСТИНИЦЕ',
    reviewHeader: 'Оцените наше обслуживание',
    reviewPlaceholder: 'Напишите пару слов о проживании или работе персонала...',
    sendReviewBtn: '✈️ Отправить отзыв',
    thanksReview: 'Спасибо за ваш отзыв! Мы делаем всё для вашего комфорта.',
    roomsCatalogTitle: 'Номера гостиницы',
    menuBtn: '🍕 Меню ресторана',
    wifiBtn: '📶 Wi-Fi в отеле',
    bookBtn: 'Забронировать',
    reviewsTitle: 'Отзывы гостей',
    checkInLabel: 'ЗАЕЗД',
    checkOutLabel: 'ВЫЕЗД',
    guestsCount: 'гостя',
    perNight: 'сом/ночь',
    nightShort: 'ноч.',
    guestNameDefault: 'Гость',
    notSpecified: 'Не указан',
    pendingWait: 'Ожидание подтверждения',
    cancelBooking: 'Отменить бронь',
    roomOccupied: 'Занят до',
    bookWithDate: 'Забронировать с',
    serviceTitle: 'Услуги и запросы',
    serviceDesc: 'Выберите нужный запрос или напишите свой',
    orderFoodOption: '🍽️ Заказать еду',
    extraBlanket: '🛏️ Доп. одеяло',
    cleaning: '🧹 Уборка номера',
    towels: '🧴 Полотенца',
    kettle: '☕ Чайник / Посуда',
    callAdmin: '🛎️ Вызов админа',
    customReqLabel: 'Свой запрос',
    customReqPlaceholder: 'Например: принесите утюг или обогреватель...',
    cancel: 'Отмена',
    send: 'Отправить',
    allCat: 'Все',
    detailsBtn: 'Подробнее',
  },
  kg: {
    welcome: 'Кош келиңиздер',
    sub: '«Айкөл» мейманканасына',
    desc: 'Ысык-Көлдүн жээгиндеги жайлуулук, жогорку комфорт жана мыкты кызмат.',
    location: 'Балыкчы к., Чыгыш 3 көч.',
    rating: 'Рейтинг 4.9',
    safe: 'Коопсуз',
    rest: 'Ресторан',
    next: 'Улантуу',
    guestData: 'Коноктун маалыматы',
    guestDesc: 'Администратор ээлөөнү ырастоо үчүн сиз менен байланышат.',
    nameLabel: 'Сиздин атыңыз',
    namePlaceholder: 'Асан Усонов',
    phoneLabel: 'Телефон номериңиз',
    confirmBtn: 'Ырастоо жана улантуу',
    yourRoom: 'СИЗДИН БӨЛМӨҢҮЗ',
    activeRequests: 'АКТИВДҮҮ БУЙРУТМАЛАР ЖАНА СУРООЛОР',
    requestsBtn: '🛎️ Суроолор',
    extendBtn: '📅 Узартуу',
    reviewTitle: 'МЕЙМАНКАНА ЖӨНҮНДӨ ПИКИР',
    reviewHeader: 'Биздин кызматты баалаңыз',
    reviewPlaceholder: 'Ишмердүүлүк же кызматкерлер жөнүндө бир аз пикир жазыңыз...',
    sendReviewBtn: '✈️ Пикирди жөнөтүү',
    thanksReview: 'Пикириңиз үчүн рахмат! Биз сиздин комфортуңуз үчүн иштейбиз.',
    roomsCatalogTitle: 'Мейманкана бөлмөлөрү',
    menuBtn: '🍕 Ресторан менюсу',
    wifiBtn: '📶 Мейманкана Wi-Fi',
    bookBtn: 'Бөлмөнү ээлөө',
    reviewsTitle: 'Коноктордун пикирлери',
    checkInLabel: 'КИРҮҮ',
    checkOutLabel: 'ЧЫГУУ',
    guestsCount: 'конок',
    perNight: 'сом/түн',
    nightShort: 'түн',
    guestNameDefault: 'Конок',
    notSpecified: 'Көрсөтүлгөн эмес',
    pendingWait: 'Ырастоону күтүү',
    cancelBooking: 'Бронду жокко чыгаруу',
    roomOccupied: 'Бош эмес чейин',
    bookWithDate: 'Ээлөө баштап',
    serviceTitle: 'Кызматтар жана суроолор',
    serviceDesc: 'Керектүү суроону тандаңыз же өзүңүздүкүн жазыңыз',
    orderFoodOption: '🍽️ Тамак-аш буйрутмалоо',
    extraBlanket: '🛏️ Кошумча жууркан',
    cleaning: '🧹 Бөлмөнү тазалоо',
    towels: '🧴 Сүлгүлөр',
    kettle: '☕ Чайнек / Идиш-аяк',
    callAdmin: '🛎️ Админди чакыруу',
    customReqLabel: 'Өзүңүздүн сурооңуз',
    customReqPlaceholder: 'Мисалы: үтүк же жылыткыч алып келиңиз...',
    cancel: 'Жокко чыгаруу',
    send: 'Жөнөтүү',
    allCat: 'Бардыгы',
    detailsBtn: 'Кененирээк',
  },
  en: {
    welcome: 'Welcome',
    sub: 'to "Aikol" Hotel',
    desc: 'Cozy, premium comfort and faultless service on the shore of Lake Issyk-Kul.',
    location: 'Balykchy, 3 Vostochnaya St.',
    rating: 'Rating 4.9',
    safe: 'Safe',
    rest: 'Restaurant',
    next: 'Next',
    guestData: 'Guest Information',
    guestDesc: 'The manager will contact you to confirm your reservation.',
    nameLabel: 'Your Full Name',
    namePlaceholder: 'John Doe',
    phoneLabel: 'Phone Number',
    confirmBtn: 'Confirm and Continue',
    yourRoom: 'YOUR ROOM',
    activeRequests: 'ACTIVE ORDERS & REQUESTS',
    requestsBtn: '🛎️ Requests',
    extendBtn: '📅 Extend',
    reviewTitle: 'HOTEL REVIEW',
    reviewHeader: 'Rate our service',
    reviewPlaceholder: 'Write a few words about your stay or hotel staff...',
    sendReviewBtn: '✈️ Submit Review',
    thanksReview: 'Thank you for your review! We strive for your comfort.',
    roomsCatalogTitle: 'Hotel Rooms',
    menuBtn: '🍕 Restaurant Menu',
    wifiBtn: '📶 Hotel Wi-Fi',
    bookBtn: 'Book Room',
    reviewsTitle: 'Guest Reviews',
    checkInLabel: 'CHECK-IN',
    checkOutLabel: 'CHECK-OUT',
    guestsCount: 'guests',
    perNight: 'som/night',
    nightShort: 'night(s)',
    guestNameDefault: 'Guest',
    notSpecified: 'Not specified',
    pendingWait: 'Awaiting confirmation',
    cancelBooking: 'Cancel booking',
    roomOccupied: 'Occupied until',
    bookWithDate: 'Book from',
    serviceTitle: 'Services & Requests',
    serviceDesc: 'Select a request or write your own',
    orderFoodOption: '🍽️ Order Food',
    extraBlanket: '🛏️ Extra Blanket',
    cleaning: '🧹 Room Cleaning',
    towels: '🧴 Fresh Towels',
    kettle: '☕ Electric Kettle',
    callAdmin: '🛎️ Call Manager',
    customReqLabel: 'Custom Request',
    customReqPlaceholder: 'For example: bring an iron or heater...',
    cancel: 'Cancel',
    send: 'Submit',
    allCat: 'All',
    detailsBtn: 'Details',
  }
};

const Loader = () => <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />;

const getLS = (k, fallback) => {
  try {
    const val = localStorage.getItem(k);
    if (!val) return JSON.parse(fallback);
    return JSON.parse(val);
  } catch (e) {
    console.warn(`Ошибка чтения ключа ${k} из localStorage, сброс к дефолту.`, e);
    try { localStorage.removeItem(k); } catch {}
    try { return JSON.parse(fallback); } catch { return null; }
  }
};

/* ─── Статус-бейдж ──────────────────────────────────────────── */
const STATUS_CLS = {
  'Ожидает':      'bg-amber-50 text-amber-600 border-amber-200',
  'Подтверждено': 'bg-[#E0F4F1] text-[#0D6B60] border-[#C7EBE6]',
  'Готовится':    'bg-blue-50 text-blue-600 border-blue-200',
  'В работе':     'bg-indigo-50 text-indigo-600 border-indigo-200',
  'Принят':       'bg-amber-50 text-amber-600 border-amber-200',
  'Отменено':     'bg-red-50 text-red-500 border-red-200',
  'Выполнено':    'bg-gray-50 text-gray-400 border-gray-200',
  'Продлён':      'bg-purple-50 text-purple-600 border-purple-200',
};
const StatusBadge = ({ status }) => (
  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${STATUS_CLS[status] || 'bg-gray-50 text-gray-400 border-gray-200'}`}>
    {status}
  </span>
);

/* ═══════════════════════════════════════════════════════════════
   ADMIN PANEL
═══════════════════════════════════════════════════════════════ */
function AdminPanel({
  onExit,
  rooms,
  setRooms,
  menuList,
  setMenuList,
  history = [],
  setHistory,
  tgToken,
  setTgToken,
  tgChat,
  setTgChat,
  adminPass,
  setAdminPass,
  reviewsList,
  setReviewsList,
  hotelAddress,
  setHotelAddress,
  welcomeBgUrl,
  setWelcomeBgUrl,
  welcomeTexts,
  setWelcomeTexts
}) {
  const [authed, setAuthed]   = useState(false);
  const [pass, setPass]       = useState('');
  const [passErr, setPassErr] = useState('');
  const [addressStatus, setAddressStatus] = useState('');
  const [bgStatus, setBgStatus] = useState('');
  const [wtStatus, setWtStatus] = useState('');

  // Сброс пароля через Telegram
  const [showResetModal, setShowResetModal] = useState(false);
  const [generatedCode, setGeneratedCode]   = useState('');
  const [inputResetCode, setInputResetCode] = useState('');
  const [resetNewPass, setResetNewPass]     = useState('');
  const [resetMsg, setResetMsg]             = useState('');

  // Настройки Telegram & Пароля
  const [tgStatus, setTgStatus] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');
  const [passStatus, setPassStatus] = useState('');

  // Фильтр отчётов по дате
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate]   = useState('');

  // Настройки Wi-Fi
  const [wifiSsid, setWifiSsid] = useState(() => localStorage.getItem('ak_wifi_ssid') || 'Aikol_Guest_WiFi');
  const [wifiPass, setWifiPass] = useState(() => localStorage.getItem('ak_wifi_pass') || 'aikol2026');
  const [wifiStatus, setWifiStatus] = useState('');
  const [wifiCopied, setWifiCopied] = useState(false);
  const [showWifiModal, setShowWifiModal] = useState(false);

  // Сбрасываем пароли при открытии панели — чтобы браузер не заполнял их автоматически
  useEffect(() => {
    setPass('');
    setPassErr('');
    setNewPassInput('');
    setNewPassConfirm('');
  }, []);
  const [filter, setFilter]   = useState('all'); // all | booking | food | edit_rooms | edit_menu

  const refresh = () => {
    const lsOrders = getLS('ak_history', '[]');
    if (setHistory) setHistory(lsOrders);
  };

  // Форма редактирования/добавления номера
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({ id:'', name:'', subtitle:'', price:'', size:'', cap:'', img:'', images:[], perks:'', priceTiers:{ 1:'', 2:'', 3:'' } });

  // Форма редактирования/добавления блюда
  const [editingDish, setEditingDish] = useState(null);
  const [dishForm, setDishForm] = useState({ id:'', name:'', category:'Горячее', price:'', desc:'', ingredients:'', img:'', images:[] });



  // Редактирование номеров
  const handleSaveRoom = async (e) => {
    e.preventDefault();
    const perksArr = roomForm.perks.split(',').map(s => s.trim()).filter(Boolean);
    const mainImg = roomForm.images[0] || roomForm.img || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=85';
    const allImages = roomForm.images.length > 0 ? roomForm.images : [mainImg];

    const rawNum = parseInt(String(roomForm.price || '0').replace(/\D/g, '')) || 0;
    const formattedPrice = rawNum > 0 ? rawNum.toLocaleString('ru-RU') : roomForm.price;
    const tiers = { 1: rawNum };

    let updated;
    if (editingRoom) {
      updated = rooms.map(r => r.id === editingRoom.id ? { ...roomForm, img: mainImg, images: allImages, perks: perksArr, priceTiers: tiers, price: formattedPrice } : r);
    } else {
      const newRoom = { ...roomForm, id: `rm_${Date.now()}`, img: mainImg, images: allImages, perks: perksArr, priceTiers: tiers, price: formattedPrice };
      updated = [...rooms, newRoom];
    }
    setRooms(updated);
    try { localStorage.setItem('ak_custom_rooms', JSON.stringify(updated)); } catch(e){}
    try {
      await supabase.from('orders').upsert([{ id: 'app_rooms', status: 'system', payload: { rooms: updated } }]);
    } catch(err) { console.error('Supabase rooms sync error:', err); }

    setEditingRoom(null);
    setRoomForm({ id:'', name:'', subtitle:'', price:'', size:'', cap:'', img:'', images:[], perks:'', priceTiers:{ 1:'' } });
  };

  const handleDeleteRoom = async (id) => {
    if (confirm('Удалить этот номер?')) {
      const updated = rooms.filter(r => r.id !== id);
      setRooms(updated);
      try { localStorage.setItem('ak_custom_rooms', JSON.stringify(updated)); } catch(e){}
      try {
        await supabase.from('orders').upsert([{ id: 'app_rooms', status: 'system', payload: { rooms: updated } }]);
      } catch(err) { console.error('Supabase rooms delete sync error:', err); }
    }
  };

  // Редактирование блюд
  const handleSaveDish = async (e) => {
    e.preventDefault();
    const ingArr = dishForm.ingredients.split(',').map(s => s.trim()).filter(Boolean);
    const mainImg = dishForm.images[0] || dishForm.img || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85';
    const allImages = dishForm.images.length > 0 ? dishForm.images : [mainImg];

    let updated;
    if (editingDish) {
      updated = menuList.map(m => m.id === editingDish.id ? { ...dishForm, img: mainImg, images: allImages, ingredients: ingArr } : m);
    } else {
      const newDish = { ...dishForm, id: `f_${Date.now()}`, img: mainImg, images: allImages, ingredients: ingArr };
      updated = [...menuList, newDish];
    }
    setMenuList(updated);
    try { localStorage.setItem('ak_custom_menu', JSON.stringify(updated)); } catch(e){}
    try {
      await supabase.from('orders').upsert([{ id: 'app_menu', status: 'system', payload: { menu: updated } }]);
    } catch(err) { console.error('Supabase menu sync error:', err); }

    setEditingDish(null);
    setDishForm({ id:'', name:'', category:'Горячее', price:'', desc:'', ingredients:'', img:'', images:[] });
  };

  const handleDeleteDish = async (id) => {
    if (confirm('Удалить это блюдо из меню?')) {
      const updated = menuList.filter(m => m.id !== id);
      setMenuList(updated);
      try { localStorage.setItem('ak_custom_menu', JSON.stringify(updated)); } catch(e){}
      try {
        await supabase.from('orders').upsert([{ id: 'app_menu', status: 'system', payload: { menu: updated } }]);
      } catch(err) { console.error('Supabase menu delete sync error:', err); }
    }
  };

  const login = (e) => {
    e.preventDefault();
    const currentAdminPass = adminPass || localStorage.getItem('ak_admin_pass') || ADMIN_PASS;
    if (pass === currentAdminPass) { setAuthed(true); setPassErr(''); }
    else setPassErr('Неверный пароль');
  };

  // Запрос сброса пароля через Telegram
  const handleRequestTelegramReset = async () => {
    const token = localStorage.getItem('ak_tg_token') || tgToken;
    const chatId = localStorage.getItem('ak_tg_chat') || tgChat;
    if (!token || !chatId) {
      alert('⚠️ Бот Telegram ещё не настроен.\nВойдите с паролем по умолчанию (aikol2024) и укажите Bot Token и Chat ID во вкладке «Настройки».');
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedCode(code);
    setResetMsg('');
    setShowResetModal(true);

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🔐 <b>СБРОС ПАРОЛЯ АДМИНИСТРАТОРА</b>\n\nКод подтверждения для сброса пароля в панели «Айкөл»:\n\n<code>${code}</code>\n\nНикому не сообщайте этот код!`,
          parse_mode: 'HTML'
        })
      });
      if (res.ok) {
        setResetMsg('✅ Код сброса отправлен в ваш Telegram!');
      } else {
        const errData = await res.json();
        setResetMsg(`❌ Ошибка Telegram: ${errData.description || 'Не удалось отправить'}`);
      }
    } catch (e) {
      setResetMsg('❌ Ошибка сети при подключении к Telegram');
    }
  };

  // Подтверждение сброса пароля
  const handleConfirmReset = async (e) => {
    e.preventDefault();
    if (inputResetCode.trim() !== generatedCode) {
      setResetMsg('❌ Неверный код из Telegram!');
      return;
    }
    if (resetNewPass.trim().length < 4) {
      setResetMsg('❌ Пароль должен быть от 4 символов');
      return;
    }
    const newP = resetNewPass.trim();
    localStorage.setItem('ak_admin_pass', newP);
    setAdminPass(newP);
    try {
      await supabase.from('orders').upsert([{ id: 'app_admin_pass', status: 'system', payload: { pass: newP } }]);
    } catch(err){}
    setAuthed(true);
    setShowResetModal(false);
    setInputResetCode('');
    setResetNewPass('');
    alert('✅ Пароль успешно изменён! Вы вошли в систему.');
  };

  const orders = history;

  const updateStatus = async (id, status) => {
    // 1. Сначала обновить Supabase и дождаться результата
    const { error } = await supabase.from('orders').update({ status, payload: { ...history.find(o => o.id === id), status } }).eq('id', id);
    if (error) { console.error('Ошибка обновления статуса:', error); return; }
    // 2. Только после успешного ответа — обновить локальный state
    const updated = history.map(o => o.id === id ? { ...o, status } : o);
    setHistory(updated);
    try { localStorage.setItem('ak_history', JSON.stringify(updated)); } catch (e) {}
  };

  const del = async (id) => {
    // 1. Сначала удаляем из Supabase
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) { console.error('Ошибка удаления из Supabase:', error); return; }
    // 2. Затем обновляем локальное состояние и localStorage
    const updated = history.filter(o => o.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem('ak_history', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleClearReports = async () => {
    if (!window.confirm('📊 Сбросить показатели финансовой отчётности на 0 сом?\n\nВсе брони и заказы останутся активными для гостей и в списке заказов! Сбросятся только цифры в отчёте.')) {
      return;
    }
    const nowIso = new Date().toISOString();
    setReportClearedAt(nowIso);
    localStorage.setItem('ak_report_cleared_at', nowIso);
    try {
      await supabase.from('orders').upsert([{ id: 'app_report_cleared_at', status: 'system', payload: { clearedAt: nowIso } }]);
      alert('✅ Отчётность обнулена! Все текущие брони и заказы остались активными.');
    } catch (err) {
      console.error('Ошибка сброса отчётности:', err);
      alert('✅ Отчётность обнулена!');
    }
  };

  const handleRestoreReports = async () => {
    if (!window.confirm('Восстановить отчётность за всё время?')) return;
    setReportClearedAt(null);
    localStorage.removeItem('ak_report_cleared_at');
    try {
      await supabase.from('orders').delete().eq('id', 'app_report_cleared_at');
    } catch(e){}
  };

  const filtered = filter === 'all'
    ? orders
    : filter === 'request'
    ? orders.filter(o => o.type === 'request' || o.id?.startsWith('RQ-') || o.title?.includes('Просьба'))
    : filter === 'food'
    ? orders.filter(o => o.type === 'food' && !o.id?.startsWith('RQ-') && !o.title?.includes('Просьба'))
    : orders.filter(o => o.type === filter);

  if (!authed) return (
    <div className="min-h-screen welcome-bg flex items-center justify-center p-4" style={{ backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.4), rgba(13, 107, 96, 0.3)), url('${welcomeBgUrl}')` }}>
      <div className="welcome-card w-full max-w-sm p-8 space-y-6 animate-scale">
        <button onClick={onExit} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#0F0F0F] transition-colors">
          <ArrowLeft size={15} strokeWidth={2.5} /> Назад
        </button>
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-[16px] bg-[#0D6B60]/10 flex items-center justify-center">
            <Lock size={22} className="text-[#0D6B60]" strokeWidth={2} />
          </div>
          <h2 className="font-display text-2xl font-semibold text-[#0F0F0F]">Панель управления</h2>
          <p className="text-[13px] text-[#6B7280]">Только для персонала гостиницы «Айкөл»</p>
        </div>
        <form onSubmit={login} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Пароль</label>
            <input
              type="text"
              style={{ WebkitTextSecurity: 'disc' }}
              className={`input-soft ${passErr ? 'error' : ''}`}
              placeholder="Введите пароль"
              value={pass}
              onChange={e => { setPass(e.target.value); setPassErr(''); }}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
            {passErr && <div className="flex items-center gap-1.5 text-[12px] text-red-500 font-medium"><AlertCircle size={14} />{passErr}</div>}
          </div>
          <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            <Lock size={15} /> Войти
          </button>
        </form>

        <div className="pt-2 text-center">
          <button type="button" onClick={handleRequestTelegramReset} className="text-[12px] text-[#0D6B60] font-semibold hover:underline flex items-center gap-1.5 mx-auto">
            🔑 Забыли пароль? Сброс через Telegram
          </button>
        </div>

        {/* Модал сброса пароля */}
        {showResetModal && (
          <div className="modal-backdrop animate-scale">
            <div className="modal-box space-y-4">
              <div className="space-y-1">
                <p className="text-[12px] font-semibold text-[#0D6B60] uppercase tracking-wider">Сброс пароля</p>
                <h3 className="font-display text-xl font-semibold text-[#0F0F0F]">Проверка Telegram</h3>
                <p className="text-[12px] text-[#6B7280]">Мы отправили 6-значный код в ваш Telegram Бот.</p>
              </div>

              {resetMsg && (
                <div className={`text-[12px] p-2.5 rounded-lg border font-medium ${resetMsg.includes('✅') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                  {resetMsg}
                </div>
              )}

              <form onSubmit={handleConfirmReset} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Код из Telegram</label>
                  <input type="text" className="input-soft mt-1 font-mono text-[16px] tracking-widest text-center"
                    placeholder="123456" maxLength={6} required
                    value={inputResetCode} onChange={e => setInputResetCode(e.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Новый пароль</label>
                  <input type="text" style={{ WebkitTextSecurity: 'disc' }} className="input-soft mt-1" placeholder="Минимум 4 символа" required autoComplete="off"
                    value={resetNewPass} onChange={e => setResetNewPass(e.target.value)} />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowResetModal(false)} className="btn-outline flex-1 py-2.5">Отмена</button>
                  <button type="submit" className="btn-primary flex-1 py-2.5">Сменить пароль</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-white border-b border-[#EDE9E3] px-5 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <p className="text-[11px] text-[#B8963A] font-semibold uppercase tracking-wider">Айкөл · Персонал</p>
            <h1 className="text-[15px] font-bold text-[#0F0F0F]">Панель управления</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refresh} className="w-9 h-9 border border-[#E8E4DF] rounded-[10px] flex items-center justify-center text-[#6B7280] hover:bg-[#F6F4F1] transition-all">
              <RefreshCw size={15} strokeWidth={2} />
            </button>
            <button onClick={onExit} className="w-9 h-9 border border-[#E8E4DF] rounded-[10px] flex items-center justify-center text-[#6B7280] hover:bg-[#F6F4F1] transition-all">
              <LogOut size={15} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 pt-4 grid grid-cols-4 gap-2">
          {[
            { label: 'Всего',    value: orders.length },
            { label: 'Ожидает',  value: orders.filter(o => o.status === 'Ожидает' || o.status === 'Принят').length, cls: 'text-amber-500' },
            { label: 'Брони',    value: orders.filter(o => o.type === 'booking').length, cls: 'text-[#0D6B60]' },
            { label: 'Запросы',  value: orders.filter(o => o.type === 'request' || o.id?.startsWith('RQ-') || o.title?.includes('Запрос') || o.title?.includes('Просьба')).length, cls: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#EDE9E3] rounded-[14px] p-2.5 text-center">
              <p className={`text-[18px] font-black ${s.cls || 'text-[#0F0F0F]'}`}>{s.value}</p>
              <p className="text-[9px] text-[#A09A92] font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="px-4 pt-3 flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {[
            {id:'all',      label:'Все'},
            {id:'booking',  label:'🏨 Брони'},
            {id:'request',  label:'🛎️ Запросы в номер'},
            {id:'food',     label:'🍽 Еда'},
            {id:'edit_rooms',label:'⚙️ Номера'},
            {id:'edit_menu',label:'🍕 Меню'},
            {id:'reports',  label:'📊 Отчётность'},
            {id:'reviews',  label:`⭐ Отзывы (${reviewsList.length})`},
            {id:'settings', label:'🔒 Настройки & Telegram'},
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-2 rounded-[10px] text-[11.5px] font-semibold whitespace-nowrap transition-all ${filter === f.id ? 'bg-[#0D6B60] text-white shadow-sm' : 'bg-white border border-[#E8E4DF] text-[#6B7280] hover:bg-[#F6F4F1]'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Редактирование Номеров */}
        {filter === 'edit_rooms' && (
          <div className="px-4 py-4 space-y-4">
            <div className="bg-white border border-[#EDE9E3] rounded-[16px] p-4 space-y-3 shadow-sm">
              <h3 className="font-bold text-[14px] text-[#0F0F0F]">
                {editingRoom ? `Редактирование: ${editingRoom.name}` : '➕ Добавить новый номер'}
              </h3>
              <form onSubmit={handleSaveRoom} className="space-y-3 text-[12px]">
                <div>
                  <label className="font-semibold text-[#6B7280]">Название номера</label>
                  <input className="input-soft mt-1" required value={roomForm.name} onChange={e => setRoomForm({...roomForm, name: e.target.value})} placeholder="Например: Люкс с терассой" />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7280]">Подзаголовок / Описание</label>
                  <input className="input-soft mt-1" required value={roomForm.subtitle} onChange={e => setRoomForm({...roomForm, subtitle: e.target.value})} placeholder="Описание номера" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-[#6B7280]">Площадь</label>
                    <input className="input-soft mt-1" required value={roomForm.size} onChange={e => setRoomForm({...roomForm, size: e.target.value})} placeholder="40 м²" />
                  </div>
                  <div>
                    <label className="font-semibold text-[#6B7280]">Вместимость</label>
                    <input className="input-soft mt-1" required value={roomForm.cap} onChange={e => setRoomForm({...roomForm, cap: e.target.value})} placeholder="2 гостя" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-[#6B7280]">Цена за 1 гостя (сом/ночь)</label>
                  <input
                    type="number"
                    className="input-soft mt-1"
                    required
                    value={roomForm.price}
                    onChange={e => setRoomForm({...roomForm, price: e.target.value, priceTiers: { 1: e.target.value }})}
                    placeholder="1500"
                  />
                  <p className="text-[10px] text-[#A09A92] mt-1">Гость при бронировании выберет количество гостей, и цена пересчитается автоматически.</p>
                </div>
                <div>
                  <label className="font-semibold text-[#6B7280]">Фотографии номера (можно выбать много)</label>
                  <div className="space-y-2 mt-1">
                    <div className="flex gap-2 items-center">
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        id="room-file-input"
                        className="hidden" 
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          files.forEach(file => {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              const compressed = await compressImage(reader.result);
                              setRoomForm(prev => ({
                                ...prev,
                                images: [...(prev.images || []), compressed]
                              }));
                            };
                            reader.readAsDataURL(file);
                          });
                        }} 
                      />
                      <label 
                        htmlFor="room-file-input" 
                        className="btn-outline text-[11px] py-2 px-3 flex items-center gap-1.5 cursor-pointer shrink-0">
                        📸 Добавить фото (галерея)
                      </label>
                    </div>

                    {/* Сетка фото */}
                    {roomForm.images && roomForm.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 pt-1">
                        {roomForm.images.map((img, idx) => (
                          <div key={idx} className="relative h-16 rounded-lg overflow-hidden border border-[#EDE9E3] group">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => setRoomForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] shadow">
                              ✕
                            </button>
                            {idx === 0 && <span className="absolute bottom-0 inset-x-0 bg-[#0D6B60] text-white text-[8px] font-bold text-center">Главное</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-[#6B7280]">Удобства (через запятую)</label>
                  <input className="input-soft mt-1" value={roomForm.perks} onChange={e => setRoomForm({...roomForm, perks: e.target.value})} placeholder="Балкон, Wi‑Fi 100 Мбит/с, Кондиционер" />
                </div>
                <div className="flex gap-2 pt-1">
                  {editingRoom && (
                    <button type="button" onClick={() => { setEditingRoom(null); setRoomForm({ id:'', name:'', subtitle:'', price:'', size:'', cap:'', img:'', images:[], perks:'', priceTiers:{ 1:'', 2:'', 3:'' } }); }} className="btn-outline flex-1 py-2">
                      Отмена
                    </button>
                  )}
                  <button type="submit" className="btn-primary flex-1 py-2">
                    {editingRoom ? 'Сохранить изменения' : 'Добавить номер'}
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-3">
              <p className="font-bold text-[13px] text-[#0F0F0F]">Существующие номера ({rooms.length}):</p>
              {rooms.map(r => (
                <div key={r.id} className="bg-white border border-[#EDE9E3] rounded-[14px] p-3 flex items-center justify-between gap-3">
                  <img src={r.img} alt="" className="w-14 h-14 object-cover rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[13px] text-[#0F0F0F] truncate">{r.name}</p>
                    <p className="text-[11px] text-[#0D6B60] font-bold mt-0.5">{r.price} сом/ночь (за 1 чел.)</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { 
                      setEditingRoom(r); 
                      const imgs = r.images && r.images.length > 0 ? r.images : (r.img ? [r.img] : []);
                      const rawPrice = String(r.price || '').replace(/\D/g, '');
                      setRoomForm({ ...r, price: rawPrice, img: r.img || imgs[0] || '', images: imgs, perks: getPerksArray(r.perks).join(', ') }); 
                    }} className="p-2 border rounded-lg text-[#6B7280] hover:bg-[#F6F4F1]">✏️</button>
                    <button onClick={() => handleDeleteRoom(r.id)} className="p-2 border rounded-lg text-red-400 hover:bg-red-50">🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Редактирование Меню */}
        {filter === 'edit_menu' && (
          <div className="px-4 py-4 space-y-4">
            <div className="bg-white border border-[#EDE9E3] rounded-[16px] p-4 space-y-3 shadow-sm">
              <h3 className="font-bold text-[14px] text-[#0F0F0F]">
                {editingDish ? `Редактирование: ${editingDish.name}` : '➕ Добавить новое блюдо'}
              </h3>
              <form onSubmit={handleSaveDish} className="space-y-3 text-[12px]">
                <div>
                  <label className="font-semibold text-[#6B7280]">Название блюда</label>
                  <input className="input-soft mt-1" required value={dishForm.name} onChange={e => setDishForm({...dishForm, name: e.target.value})} placeholder="Например: Плов по-самаркандски" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-[#6B7280]">Категория</label>
                    <select 
                      className="input-soft mt-1" 
                      value={dishForm.category} 
                      onChange={e => {
                        if (e.target.value === '__custom__') {
                          const newCat = prompt('Введите название вашей категории:');
                          if (newCat && newCat.trim()) {
                            setDishForm({ ...dishForm, category: newCat.trim() });
                          }
                        } else {
                          setDishForm({ ...dishForm, category: e.target.value });
                        }
                      }}>
                      {Array.from(new Set([...DEFAULT_MENU_CATEGORIES, ...menuList.map(m => m.category).filter(Boolean)])).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__custom__">➕ Своя категория (ввести вручную)...</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-[#6B7280]">Цена</label>
                    <input className="input-soft mt-1" required value={dishForm.price} onChange={e => setDishForm({...dishForm, price: e.target.value})} placeholder="500 сом" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-[#6B7280]">Описание</label>
                  <input className="input-soft mt-1" required value={dishForm.desc} onChange={e => setDishForm({...dishForm, desc: e.target.value})} placeholder="Краткое описание" />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7280]">Ингредиенты (через запятую)</label>
                  <input className="input-soft mt-1" value={dishForm.ingredients} onChange={e => setDishForm({...dishForm, ingredients: e.target.value})} placeholder="Баранина, Рис, Морковь" />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7280]">Фотографии блюда (можно выбрать много)</label>
                  <div className="space-y-2 mt-1">
                    <div className="flex gap-2 items-center">
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        id="dish-file-input"
                        className="hidden" 
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          files.forEach(file => {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              const compressed = await compressImage(reader.result);
                              setDishForm(prev => ({
                                ...prev,
                                images: [...(prev.images || []), compressed]
                              }));
                            };
                            reader.readAsDataURL(file);
                          });
                        }} 
                      />
                      <label 
                        htmlFor="dish-file-input" 
                        className="btn-outline text-[11px] py-2 px-3 flex items-center gap-1.5 cursor-pointer shrink-0">
                        📸 Добавить фото (галерея)
                      </label>
                    </div>

                    {/* Сетка фото */}
                    {dishForm.images && dishForm.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 pt-1">
                        {dishForm.images.map((img, idx) => (
                          <div key={idx} className="relative h-16 rounded-lg overflow-hidden border border-[#EDE9E3] group">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => setDishForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] shadow">
                              ✕
                            </button>
                            {idx === 0 && <span className="absolute bottom-0 inset-x-0 bg-[#0D6B60] text-white text-[8px] font-bold text-center">Главное</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  {editingDish && (
                    <button type="button" onClick={() => { setEditingDish(null); setDishForm({ id:'', name:'', category:'Горячее', price:'', desc:'', ingredients:'', img:'' }); }} className="btn-outline flex-1 py-2">
                      Отмена
                    </button>
                  )}
                  <button type="submit" className="btn-primary flex-1 py-2">
                    {editingDish ? 'Сохранить изменения' : 'Добавить блюдо'}
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-3">
              <p className="font-bold text-[13px] text-[#0F0F0F]">Существующие блюда ({menuList.length}):</p>
              {menuList.map(m => (
                <div key={m.id} className="bg-white border border-[#EDE9E3] rounded-[14px] p-3 flex items-center justify-between gap-3">
                  <img src={m.img} alt="" className="w-14 h-14 object-cover rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[13px] text-[#0F0F0F] truncate">{m.name}</p>
                    <p className="text-[11px] text-[#0D6B60] font-bold">{m.price}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { 
                      setEditingDish(m); 
                      const imgs = m.images && m.images.length > 0 ? m.images : (m.img ? [m.img] : []);
                      setDishForm({ ...m, img: m.img || imgs[0] || '', images: imgs, ingredients: getIngredientsArray(m.ingredients).join(', ') }); 
                    }} className="p-2 border rounded-lg text-[#6B7280] hover:bg-[#F6F4F1]">✏️</button>
                    <button onClick={() => handleDeleteDish(m.id)} className="p-2 border rounded-lg text-red-400 hover:bg-red-50">🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Настройки Telegram & Смена пароля */}
        {filter === 'settings' && (
          <div className="px-4 py-4 space-y-4">
            {/* Telegram настройки */}
            <div className="bg-white border border-[#EDE9E3] rounded-[16px] p-4 space-y-3 shadow-sm">
              <h3 className="font-bold text-[14px] text-[#0F0F0F] flex items-center gap-1.5">
                <Send size={16} className="text-[#0D6B60]" /> Настройки Telegram Бота
              </h3>
              <p className="text-[11px] text-[#6B7280]">
                Укажите Bot Token и Chat ID для получения новых броней, заказов еды и кодов сброса пароля.
              </p>
              <form onSubmit={(e) => {
                e.preventDefault();
                localStorage.setItem('ak_tg_token', tgToken);
                localStorage.setItem('ak_tg_chat', tgChat);
                setTgStatus('💾 Настройки сохранены!');
              }} className="space-y-3 text-[12px]">
                <div>
                  <label className="font-semibold text-[#6B7280]">Telegram Bot Token</label>
                  <input className="input-soft mt-1 font-mono text-[11px]"
                    placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyZ"
                    value={tgToken} onChange={e => setTgToken(e.target.value.trim())} />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7280]">Telegram Chat ID (ID чата или группы)</label>
                  <input className="input-soft mt-1 font-mono text-[11px]"
                    placeholder="987654321 или -100123456789"
                    value={tgChat} onChange={e => setTgChat(e.target.value.trim())} />
                </div>
                {tgStatus && (
                  <div className={`text-[11px] p-2.5 rounded-lg border font-medium ${tgStatus.includes('✅') || tgStatus.includes('💾') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {tgStatus}
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={async () => {
                    if (!tgToken || !tgChat) { setTgStatus('⚠️ Заполните Token и Chat ID!'); return; }
                    setTgStatus('⏳ Отправка...');
                    localStorage.setItem('ak_tg_token', tgToken);
                    localStorage.setItem('ak_tg_chat', tgChat);
                    try {
                      await supabase.from('orders').upsert([{ id: 'tg_config', status: 'system', payload: { token: tgToken, chat: tgChat } }]);
                    } catch (e) {}
                    const ok = await sendTelegramNotification('✅ <b>Тестовое сообщение!</b>\nУведомления гостиницы «Айкөл» настроены!');
                    if (ok) setTgStatus('✅ Сообщение отправлено в Telegram!');
                    else setTgStatus('❌ Ошибка! Проверьте Token и Chat ID.');
                  }} className="btn-outline flex-1 py-2 text-[11px] flex items-center justify-center gap-1">
                    🧪 Проверить связь
                  </button>
                  <button type="submit" onClick={async () => {
                    localStorage.setItem('ak_tg_token', tgToken);
                    localStorage.setItem('ak_tg_chat', tgChat);
                    try {
                      await supabase.from('orders').upsert([{ id: 'tg_config', status: 'system', payload: { token: tgToken, chat: tgChat } }]);
                    } catch (e) {}
                    setTgStatus('💾 Настройки сохранены и синхронизированы!');
                  }} className="btn-primary flex-1 py-2 text-[11px]">
                    Сохранить
                  </button>
                </div>

                <div className="pt-2 border-t border-[#EDE9E3]">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!tgToken) { setTgStatus('⚠️ Заполните Telegram Bot Token!'); return; }
                      let origin = window.location.origin;
                      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
                        const customUrl = prompt('Введите ваш Vercel URL для Telegram Webhook (например: https://aikolbooking.vercel.app):');
                        if (!customUrl) return;
                        origin = customUrl.trim().replace(/\/$/, '');
                      }
                      const webhookUrl = `${origin}/api/telegram`;
                      try {
                        const res = await fetch(`https://api.telegram.org/bot${tgToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
                        const data = await res.json();
                        if (data.ok) {
                          setTgStatus(`✅ Кнопки в Telegram подключены!\nWebhook: ${webhookUrl}`);
                        } else {
                          setTgStatus(`❌ Ошибка Telegram: ${data.description}`);
                        }
                      } catch (e) {
                        setTgStatus('❌ Ошибка сети при настройке Webhook');
                      }
                    }}
                    className="btn-outline w-full py-2 text-[11px] flex items-center justify-center gap-1.5 text-purple-700 border-purple-200 hover:bg-purple-50">
                    🔗 Активировать интерактивные кнопки в Telegram
                  </button>
                </div>
              </form>
            </div>

            {/* Редактирование адреса гостиницы */}
            <div className="bg-white border border-[#EDE9E3] rounded-[16px] p-4 space-y-3 shadow-sm">
              <h3 className="font-bold text-[14px] text-[#0F0F0F] flex items-center gap-1.5">
                <MapPin size={16} className="text-[#0D6B60]" /> Адрес и локация гостиницы для гостей
              </h3>
              <p className="text-[11.5px] text-[#6B7280]">
                Этот адрес будет мгновенно обновлен у всех гостей на главном экране, в карточках номеров и бронировании.
              </p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!hotelAddress.trim()) return;
                const addr = hotelAddress.trim();
                localStorage.setItem('ak_hotel_address', addr);
                if (typeof setHotelAddress === 'function') setHotelAddress(addr);
                try {
                  await supabase.from('orders').upsert([{ id: 'app_hotel_address', status: 'system', payload: { address: addr } }]);
                  setAddressStatus('✅ Адрес сохранён и обновлён на всех устройствах!');
                  setTimeout(() => setAddressStatus(''), 4000);
                } catch(err){
                  setAddressStatus('✅ Адрес сохранён локально!');
                }
              }} className="space-y-3 text-[12px]">
                <div>
                  <label className="font-semibold text-[#6B7280]">Адрес гостиницы (город, улица, дом)</label>
                  <input
                    type="text"
                    className="input-soft mt-1 text-[13px]"
                    required
                    placeholder="Например: Балыкчы, ул. Восточная 3"
                    value={hotelAddress}
                    onChange={e => setHotelAddress(e.target.value)}
                  />
                </div>
                {addressStatus && (
                  <div className="text-[11px] p-2.5 rounded-lg border font-medium bg-green-50 text-green-700 border-green-200">
                    {addressStatus}
                  </div>
                )}
                <button type="submit" className="btn-primary w-full py-2.5 text-[12px]">
                  Сохранить новый адрес
                </button>
              </form>
            </div>

            {/* Настройка фоновых обоев Иссык-Куля */}
            <div className="bg-white border border-[#EDE9E3] rounded-[16px] p-4 space-y-3 shadow-sm">
              <h3 className="font-bold text-[14px] text-[#0F0F0F] flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#0D6B60]" /> Фоновые обои сайта (Иссык-Куль)
              </h3>
              <p className="text-[11.5px] text-[#6B7280]">
                Выберите готовый вариант фона Иссык-Куля или вставьте ссылку на любую свою фотографию:
              </p>

              {/* Пресеты фонов */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: '🏔️ Естественный Иссык-Куль', url: '/issyk_kul_bg2.png' },
                  { name: '🌄 Горы и озеро', url: '/issyk_kul_bg.png' },
                  { name: '🌊 Лазурный пляж', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85' },
                  { name: '🌅 Закат на Иссык-Куле', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85' }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={async () => {
                      if (typeof setWelcomeBgUrl === 'function') setWelcomeBgUrl(preset.url);
                      localStorage.setItem('ak_welcome_bg', preset.url);
                      try {
                        await supabase.from('orders').upsert([{ id: 'app_welcome_bg', status: 'system', payload: { bgUrl: preset.url } }]);
                        setBgStatus(`✅ Установлен фон: ${preset.name}`);
                        setTimeout(() => setBgStatus(''), 4000);
                      } catch(e){}
                    }}
                    className={`p-2 rounded-[12px] border text-[11px] font-bold text-left transition-all flex items-center gap-2 ${
                      welcomeBgUrl === preset.url ? 'border-[#0D6B60] bg-[#E0F4F1] text-[#0D6B60]' : 'border-[#EDE9E3] bg-[#F6F4F1] hover:bg-[#E8E4DF] text-[#0F0F0F]'
                    }`}>
                    <span className="truncate">{preset.name}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!welcomeBgUrl.trim()) return;
                const url = welcomeBgUrl.trim();
                localStorage.setItem('ak_welcome_bg', url);
                if (typeof setWelcomeBgUrl === 'function') setWelcomeBgUrl(url);
                try {
                  await supabase.from('orders').upsert([{ id: 'app_welcome_bg', status: 'system', payload: { bgUrl: url } }]);
                  setBgStatus('✅ Своё фоновое фото сохранено на всех устройствах!');
                  setTimeout(() => setBgStatus(''), 4000);
                } catch(err){
                  setBgStatus('✅ Фото сохранено локально!');
                }
              }} className="space-y-3 text-[12px] pt-1">
                <div>
                  <label className="font-semibold text-[#6B7280]">Или укажите свою ссылку на фото (URL)</label>
                  <input
                    type="text"
                    className="input-soft mt-1 text-[12px]"
                    placeholder="https://images.unsplash.com/..."
                    value={welcomeBgUrl}
                    onChange={e => setWelcomeBgUrl(e.target.value)}
                  />
                </div>
                {bgStatus && (
                  <div className="text-[11px] p-2.5 rounded-lg border font-medium bg-green-50 text-green-700 border-green-200">
                    {bgStatus}
                  </div>
                )}
                <button type="submit" className="btn-primary w-full py-2.5 text-[12px]">
                  Сохранить своё фоновое фото
                </button>
              </form>
            </div>

            {/* Редактор текстов приветственного экрана */}
            <div className="bg-white border border-[#EDE9E3] rounded-[16px] p-4 space-y-4 shadow-sm">
              <h3 className="font-bold text-[14px] text-[#0F0F0F] flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#0D6B60]" /> Тексты приветственного экрана
              </h3>
              <p className="text-[11.5px] text-[#6B7280]">
                Настройте заголовок, подзаголовок и описание приветствия для каждого языка:
              </p>
              {[
                { code: 'ru', flag: '🇷🇺', label: 'Русский', defaults: { welcome: 'Добро пожаловать', sub: 'в гостиницу «Айкөл»', desc: 'Уют, премиальный комфорт и безупречный сервис на берегу Иссык-Куля.' } },
                { code: 'kg', flag: '🇰🇬', label: 'Кыргызча', defaults: { welcome: 'Кош келиңиздер', sub: '«Айкөл» мейманканасына', desc: 'Ысык-Көлдүн жээгиндеги жайлуулук, жогорку комфорт жана мыкты кызмат.' } },
                { code: 'en', flag: '🇬🇧', label: 'English', defaults: { welcome: 'Welcome', sub: 'to "Aikol" Hotel', desc: 'Cozy, premium comfort and faultless service on the shore of Lake Issyk-Kul.' } },
              ].map(({ code, flag, label, defaults }) => {
                const cur = (welcomeTexts && welcomeTexts[code]) || {};
                return (
                  <div key={code} className="border border-[#EDE9E3] rounded-[12px] p-3 space-y-2 bg-[#FAFAF8]">
                    <div className="text-[12px] font-bold text-[#0F0F0F] flex items-center gap-1.5">{flag} {label}</div>
                    {[
                      { field: 'welcome', placeholder: defaults.welcome, label: 'Заголовок (H1)' },
                      { field: 'sub',     placeholder: defaults.sub,     label: 'Подзаголовок (italic)' },
                      { field: 'desc',    placeholder: defaults.desc,    label: 'Описание (серый текст)' },
                    ].map(({ field, placeholder, label: fLabel }) => (
                      <div key={field}>
                        <label className="text-[10.5px] font-semibold text-[#6B7280] uppercase tracking-wide">{fLabel}</label>
                        <input
                          type="text"
                          className="input-soft mt-0.5 text-[12px]"
                          placeholder={placeholder}
                          value={cur[field] || ''}
                          onChange={e => {
                            const updated = {
                              ...(welcomeTexts || {}),
                              [code]: { ...(welcomeTexts?.[code] || {}), [field]: e.target.value }
                            };
                            setWelcomeTexts(updated);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
              {wtStatus && (
                <div className="text-[11px] p-2.5 rounded-lg border font-medium bg-green-50 text-green-700 border-green-200">
                  {wtStatus}
                </div>
              )}
              <button
                type="button"
                onClick={async () => {
                  const texts = welcomeTexts || {};
                  localStorage.setItem('ak_welcome_texts', JSON.stringify(texts));
                  try {
                    await supabase.from('orders').upsert([{ id: 'app_welcome_texts', status: 'system', payload: texts }]);
                    setWtStatus('✅ Тексты приветствия сохранены на всех устройствах!');
                  } catch(err) {
                    setWtStatus('✅ Тексты сохранены локально!');
                  }
                  setTimeout(() => setWtStatus(''), 4000);
                }}
                className="btn-primary w-full py-2.5 text-[12px]"
              >
                Сохранить тексты приветствия
              </button>
            </div>

            {/* Смена пароля */}
            <div className="bg-white border border-[#EDE9E3] rounded-[16px] p-4 space-y-3 shadow-sm">
              <h3 className="font-bold text-[14px] text-[#0F0F0F] flex items-center gap-1.5">
                <Lock size={16} className="text-[#0D6B60]" /> Смена пароля администратора
              </h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (newPassInput.length < 4) { setPassStatus('❌ Пароль должен быть от 4 символов'); return; }
                if (newPassInput !== newPassConfirm) { setPassStatus('❌ Пароли не совпадают'); return; }
                const newP = newPassInput.trim();
                localStorage.setItem('ak_admin_pass', newP);
                setAdminPass(newP);
                try {
                  await supabase.from('orders').upsert([{ id: 'app_admin_pass', status: 'system', payload: { pass: newP } }]);
                } catch(err){}
                setPassStatus('✅ Новый пароль сохранён на всех устройствах!');
                setNewPassInput('');
                setNewPassConfirm('');
              }} className="space-y-3 text-[12px]">
                <div>
                  <label className="font-semibold text-[#6B7280]">Новый пароль</label>
                  <input type="text" style={{ WebkitTextSecurity: 'disc' }} className="input-soft mt-1" required placeholder="Минимум 4 символа" autoComplete="off"
                    value={newPassInput} onChange={e => setNewPassInput(e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold text-[#6B7280]">Подтверждение пароля</label>
                  <input type="text" style={{ WebkitTextSecurity: 'disc' }} className="input-soft mt-1" required placeholder="Повторите новый пароль" autoComplete="off"
                    value={newPassConfirm} onChange={e => setNewPassConfirm(e.target.value)} />
                </div>
                {passStatus && (
                  <div className={`text-[11px] p-2.5 rounded-lg border font-medium ${passStatus.includes('✅') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                    {passStatus}
                  </div>
                )}
                <button type="submit" className="btn-primary w-full py-2.5 text-[12px]">
                  Обновить пароль
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── ВКЛАДКА: ОТЧЁТНОСТЬ & АНАЛИТИКА ── */}
        {filter === 'reports' && (() => {
          const reportFilteredHistory = history.filter(o => isOrderInDateRange(o, reportStartDate, reportEndDate, reportClearedAt));
          return (
            <div className="px-4 py-4 space-y-4 animate-up">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#0F0F0F]">📊 Финансовая отчётность</h3>
                  <p className="text-[12px] text-[#6B7280]">
                    Сводный анализ всех доходов, броней и заказов
                    {reportClearedAt && (
                      <span className="block text-[11px] text-amber-600 font-medium mt-0.5">
                        ⏳ Отчётность сброшена в 0 ({new Date(reportClearedAt).toLocaleDateString('ru-RU')} {new Date(reportClearedAt).toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'})})
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      const rows = [
                        ['ID', 'Тип', 'Название/Описание', 'Гость', 'Телефон', 'Комната', 'Сумма (сом)', 'Статус', 'Дата'],
                        ...reportFilteredHistory.map(o => [
                          o.id,
                          o.type === 'booking' ? 'Бронирование' : o.type === 'food' ? 'Еда' : 'Запрос в номер',
                          o.title || '',
                          o.guest || '',
                          o.phone || '',
                          o.roomNo || '',
                          getOrderAmount(o),
                          o.status || '',
                          o.date || ''
                        ])
                      ];
                      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement('a');
                      link.setAttribute('href', encodedUri);
                      link.setAttribute('download', `Aikol_Report_${new Date().toISOString().slice(0,10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="btn-outline py-2 px-3 text-[12px] flex items-center gap-1.5 text-[#0D6B60] border-[#C7EBE6] hover:bg-[#F0FAF8]">
                    📥 Скачать Excel / CSV
                  </button>
                  {reportClearedAt ? (
                    <button
                      onClick={handleRestoreReports}
                      className="btn-outline py-2 px-3 text-[12px] flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 font-semibold transition-colors">
                      ↩️ Восстановить всё
                    </button>
                  ) : (
                    <button
                      onClick={handleClearReports}
                      className="btn-outline py-2 px-3 text-[12px] flex items-center gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 font-semibold transition-colors">
                      🗑️ Сбросить всё в 0
                    </button>
                  )}
                </div>
              </div>

              {/* 📅 Фильтр по датам */}
              <div className="bg-white border border-[#EDE9E3] rounded-[16px] p-4 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-[#0D6B60]" />
                    <h4 className="font-bold text-[13.5px] text-[#0F0F0F]">Фильтр по дате периода</h4>
                  </div>
                  {(reportStartDate || reportEndDate) && (
                    <button 
                      onClick={() => { setReportStartDate(''); setReportEndDate(''); }}
                      className="text-[11.5px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg border border-red-200 transition-colors">
                      🧹 Очистить фильтр
                    </button>
                  )}
                </div>

                {/* Выбор диапазона дат и кнопки быстрых периодов */}
                <div className="flex flex-wrap items-center gap-3 text-[12px]">
                  <div className="flex items-center gap-2">
                    <label className="font-semibold text-[#6B7280]">С:</label>
                    <input 
                      type="date" 
                      value={reportStartDate} 
                      onChange={e => setReportStartDate(e.target.value)} 
                      className="input-soft py-1.5 px-3 text-[12px] border-[#EDE9E3]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="font-semibold text-[#6B7280]">По:</label>
                    <input 
                      type="date" 
                      value={reportEndDate} 
                      onChange={e => setReportEndDate(e.target.value)} 
                      className="input-soft py-1.5 px-3 text-[12px] border-[#EDE9E3]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 ml-auto">
                    <button 
                      onClick={() => {
                        const todayStr = new Date().toISOString().slice(0, 10);
                        setReportStartDate(todayStr);
                        setReportEndDate(todayStr);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F6F4F1] hover:bg-[#E0F4F1] text-[#0F0F0F] hover:text-[#0D6B60] border border-[#EDE9E3] transition-colors">
                      Сегодня
                    </button>
                    <button 
                      onClick={() => {
                        const y = new Date(); y.setDate(y.getDate() - 1);
                        const yStr = y.toISOString().slice(0, 10);
                        setReportStartDate(yStr);
                        setReportEndDate(yStr);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F6F4F1] hover:bg-[#E0F4F1] text-[#0F0F0F] hover:text-[#0D6B60] border border-[#EDE9E3] transition-colors">
                      Вчера
                    </button>
                    <button 
                      onClick={() => {
                        const endStr = new Date().toISOString().slice(0, 10);
                        const d = new Date(); d.setDate(d.getDate() - 7);
                        const startStr = d.toISOString().slice(0, 10);
                        setReportStartDate(startStr);
                        setReportEndDate(endStr);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F6F4F1] hover:bg-[#E0F4F1] text-[#0F0F0F] hover:text-[#0D6B60] border border-[#EDE9E3] transition-colors">
                      За 7 дней
                    </button>
                    <button 
                      onClick={() => {
                        const now = new Date();
                        const startStr = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
                        const endStr = now.toISOString().slice(0, 10);
                        setReportStartDate(startStr);
                        setReportEndDate(endStr);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F6F4F1] hover:bg-[#E0F4F1] text-[#0F0F0F] hover:text-[#0D6B60] border border-[#EDE9E3] transition-colors">
                      Этот месяц
                    </button>
                    <button 
                      onClick={() => { setReportStartDate(''); setReportEndDate(''); }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#0D6B60] text-white hover:bg-[#0B574F] transition-colors">
                      Всё время
                    </button>
                  </div>
                </div>
              </div>

              {/* Карточки KPI */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Общий доход */}
                <div className="bg-white border border-[#EDE9E3] p-3.5 rounded-[16px] shadow-sm space-y-1">
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider leading-tight">💰 Общий доход</p>
                  <p className="text-base sm:text-lg font-black text-[#0D6B60] leading-tight whitespace-nowrap overflow-x-auto">
                    {reportFilteredHistory
                      .filter(o => !['Отменено'].includes(o.status))
                      .reduce((acc, o) => acc + getOrderAmount(o), 0)
                      .toLocaleString('ru-RU')} сом
                  </p>
                  <p className="text-[11px] text-[#A09A92]">Брони + Кухня</p>
                </div>

                {/* Доход с номеров */}
                <div className="bg-white border border-[#EDE9E3] p-3.5 rounded-[16px] shadow-sm space-y-1">
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider leading-tight">🏨 Выручка номеров</p>
                  <p className="text-base sm:text-lg font-black text-[#0F0F0F] leading-tight whitespace-nowrap overflow-x-auto">
                    {reportFilteredHistory
                      .filter(o => o.type === 'booking' && !['Отменено'].includes(o.status))
                      .reduce((acc, o) => acc + getOrderAmount(o), 0)
                      .toLocaleString('ru-RU')} сом
                  </p>
                  <p className="text-[11px] text-[#A09A92]">
                    {reportFilteredHistory.filter(o => o.type === 'booking' && !['Отменено'].includes(o.status)).length} броней
                  </p>
                </div>

                {/* Доход с кухни */}
                <div className="bg-white border border-[#EDE9E3] p-3.5 rounded-[16px] shadow-sm space-y-1">
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider leading-tight">🍕 Выручка кухни</p>
                  <p className="text-base sm:text-lg font-black text-amber-600 leading-tight whitespace-nowrap overflow-x-auto">
                    {reportFilteredHistory
                      .filter(o => o.type === 'food' && !['Отменено'].includes(o.status))
                      .reduce((acc, o) => acc + getOrderAmount(o), 0)
                      .toLocaleString('ru-RU')} сом
                  </p>
                  <p className="text-[11px] text-[#A09A92]">
                    {reportFilteredHistory.filter(o => o.type === 'food' && !['Отменено'].includes(o.status)).length} заказов
                  </p>
                </div>

                {/* Запросов в номер */}
                <div className="bg-white border border-[#EDE9E3] p-3.5 rounded-[16px] shadow-sm space-y-1">
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider leading-tight">🛎️ Запросы в номер</p>
                  <p className="text-base sm:text-lg font-black text-purple-700 leading-tight whitespace-nowrap">
                    {reportFilteredHistory.filter(o => o.type === 'request' || o.id?.startsWith('RQ-')).length}
                  </p>
                  <p className="text-[11px] text-[#A09A92]">Обслуживание</p>
                </div>
              </div>

              {/* Детализация по статусам */}
              <div className="bg-white border border-[#EDE9E3] rounded-[16px] p-4 space-y-3 shadow-sm">
                <h4 className="font-bold text-[13px] text-[#0F0F0F] flex items-center justify-between">
                  <span>📈 Статусы заявок</span>
                  <span className="text-[11px] font-normal text-[#6B7280]">Найдено: {reportFilteredHistory.length}</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {[
                    { label: 'Подтверждено', statusArr: ['Подтверждено', 'Заселён'], color: 'bg-green-50 text-green-700 border-green-200' },
                    { label: 'В работе', statusArr: ['В работе', 'Готовится', 'Принят', 'Ожидает'], color: 'bg-amber-50 text-amber-700 border-amber-200' },
                    { label: 'Выполнено', statusArr: ['Выполнено', 'Выехал'], color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { label: 'Отменено', statusArr: ['Отменено'], color: 'bg-red-50 text-red-700 border-red-200' },
                  ].map(st => {
                    const count = reportFilteredHistory.filter(o => st.statusArr.includes(o.status)).length;
                    const percent = reportFilteredHistory.length > 0 ? Math.round((count / reportFilteredHistory.length) * 100) : 0;
                    return (
                      <div key={st.label} className={`p-3 rounded-xl border ${st.color} space-y-1`}>
                        <p className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider leading-tight">{st.label}</p>
                        <div className="flex items-baseline justify-between gap-1">
                          <p className="text-lg font-black">{count}</p>
                          <p className="text-[11px] font-bold opacity-80">{percent}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Таблица последних финансовых операций */}
              <div className="bg-white border border-[#EDE9E3] rounded-[16px] p-4 space-y-3 shadow-sm">
                <h4 className="font-bold text-[13px] text-[#0F0F0F]">📑 История финансовых операций ({reportFilteredHistory.length})</h4>
                <div className="overflow-x-auto -mx-1 px-1">
                  <table className="w-full text-left text-[12px] border-collapse min-w-[560px]">
                    <thead>
                      <tr className="border-b border-[#EDE9E3] text-[#6B7280] font-semibold text-[10.5px] uppercase tracking-wider whitespace-nowrap">
                        <th className="py-2.5 px-3">Код</th>
                        <th className="py-2.5 px-3">Тип</th>
                        <th className="py-2.5 px-3">Описание</th>
                        <th className="py-2.5 px-3">Гость / Номер</th>
                        <th className="py-2.5 px-3">Сумма</th>
                        <th className="py-2.5 px-3">Статус</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F6F4F1]">
                      {reportFilteredHistory.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-[#A09A92]">История операций за выбранный период пуста</td>
                        </tr>
                      ) : (
                        reportFilteredHistory.slice(0, 50).map(o => {
                          const amt = getOrderAmount(o);
                          return (
                            <tr key={o.id} className="hover:bg-[#FAFAF8] transition-colors whitespace-nowrap">
                              <td className="py-2.5 px-3 font-mono font-bold text-[11px] text-[#0F0F0F]">{o.id}</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  o.type === 'booking' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                                  o.type === 'food' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                  'bg-purple-50 text-purple-700 border border-purple-200'
                                }`}>
                                  {o.type === 'booking' ? '🏨 Бронь' : o.type === 'food' ? '🍕 Еда' : '🛎️ Запрос'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-medium max-w-[160px] truncate text-[#0F0F0F]">{o.title}</td>
                              <td className="py-2.5 px-3 text-[#6B7280]">
                                {o.guest || '—'} {o.roomNo ? `(№ ${o.roomNo})` : ''}
                              </td>
                              <td className="py-2.5 px-3 font-bold text-[#0D6B60]">
                                {amt > 0 ? `${amt.toLocaleString('ru-RU')} сом` : (o.price || '0 сом')}
                              </td>
                              <td className="py-2.5 px-3"><StatusBadge status={o.status} /></td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── ВКЛАДКА: ОТЗЫВЫ ГОСТЕЙ И МОДЕРАЦИЯ ── */}
        {filter === 'reviews' && (
          <div className="px-4 py-4 space-y-4 animate-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-[#0F0F0F]">⭐ Отзывы и оценки гостей</h3>
                <p className="text-[12px] text-[#6B7280]">Модерация отзывов и удаление неадекватных комментариев</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-[12px] font-bold text-amber-800 flex items-center gap-1.5 shadow-sm">
                <span>⭐</span>
                <span>
                  {reviewsList.length > 0
                    ? (reviewsList.reduce((a, r) => a + (r.stars || 5), 0) / reviewsList.length).toFixed(1)
                    : '5.0'} / 5.0
                </span>
                <span className="text-[#6B7280] font-normal">({reviewsList.length})</span>
              </div>
            </div>

            {reviewsList.length === 0 ? (
              <div className="bg-white border border-[#EDE9E3] rounded-[16px] p-8 text-center space-y-2 shadow-sm">
                <Star size={32} className="text-[#D8D3CC] mx-auto" />
                <p className="text-[13px] text-[#A09A92] font-medium">Отзывов пока нет</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviewsList.map(rev => (
                  <div key={rev.id} className="bg-white border border-[#EDE9E3] rounded-[16px] p-4 space-y-2.5 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[13.5px] text-[#0F0F0F]">{rev.guest}</p>
                          {rev.roomNo && <span className="text-[10px] bg-[#E0F4F1] text-[#0D6B60] font-bold px-2 py-0.5 rounded">№ {rev.roomNo}</span>}
                        </div>
                        <p className="text-[11px] text-[#6B7280]">{rev.phone} · {rev.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-[12px] font-bold text-amber-500 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          {'⭐'.repeat(rev.stars || 5)} <span className="text-[10.5px] text-[#0F0F0F]">({rev.stars}/5)</span>
                        </div>
                        <button
                          onClick={async () => {
                            if (!confirm('Удалить этот отзыв из системы?')) return;
                            const updated = reviewsList.filter(r => r.id !== rev.id);
                            setReviewsList(updated);
                            try { localStorage.setItem('ak_reviews', JSON.stringify(updated)); } catch(e){}
                            try { await supabase.from('orders').delete().eq('id', rev.id); } catch(e){}
                          }}
                          className="p-1.5 border border-red-200 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Удалить нехороший отзыв">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-[12.5px] text-[#4B5563] bg-[#F6F4F1] p-3 rounded-[12px] leading-relaxed border border-[#E8E4DF]">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* List */}
        {['all', 'booking', 'food', 'request'].includes(filter) && (
        <div className="px-4 py-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Bell size={32} className="text-[#D8D3CC] mx-auto" strokeWidth={1.5} />
              <p className="text-[13px] text-[#A09A92] font-medium">Заявок нет</p>
            </div>
          ) : filtered.map(order => (
            <div key={order.id} className={`bg-white rounded-[16px] p-4 space-y-3 shadow-sm border ${['Ожидает','Принят'].includes(order.status) ? 'border-amber-200 shadow-amber-50' : 'border-[#EDE9E3]'}`}>
              {/* Top */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-[#A09A92] font-mono font-semibold">{order.id}</span>
                    {order.pin && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        🔑 ПИН: {order.pin}
                      </span>
                    )}
                    {order.roomNo && (
                      <span className="bg-[#0D6B60]/10 text-[#0D6B60] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Hash size={9} strokeWidth={2.5} />№ {order.roomNo}
                      </span>
                    )}
                    {(order.type === 'request' || order.id?.startsWith('RQ-') || order.title?.includes('Запрос') || order.title?.includes('Просьба')) && (
                      <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        🛎️ Запрос
                      </span>
                    )}
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-[14px] font-bold text-[#0F0F0F] leading-tight">{order.title}</p>
                  {order.guest && <p className="text-[12px] text-[#6B7280]">Гость: <span className="font-semibold text-[#0F0F0F]">{order.guest}</span></p>}
                  {order.phone && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <a href={`tel:${order.phone}`} className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0D6B60] bg-[#E0F4F1] px-2.5 py-1 rounded-md border border-[#C7EBE6] hover:bg-[#c7ede8] transition-colors">
                        <Phone size={12} strokeWidth={2.5} /> {order.phone}
                      </a>
                    </div>
                  )}
                </div>
                <button onClick={() => { if (confirm('Удалить?')) del(order.id); }}
                  className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[#C4BDB5] hover:text-red-400 hover:bg-red-50 transition-all">
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>

              {/* Dates for bookings */}
              {order.type === 'booking' && (order.checkIn || order.checkOut) && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#F6F4F1] rounded-[10px] px-3 py-2">
                    <p className="text-[9px] text-[#A09A92] font-semibold uppercase tracking-wider">Заезд</p>
                    <p className="text-[12px] font-bold text-[#0F0F0F]">{fmtDate(order.checkIn)}</p>
                  </div>
                  <div className="bg-[#F6F4F1] rounded-[10px] px-3 py-2">
                    <p className="text-[9px] text-[#A09A92] font-semibold uppercase tracking-wider">Выезд</p>
                    <p className="text-[12px] font-bold text-[#0F0F0F]">{fmtDate(order.checkOut)}</p>
                  </div>
                </div>
              )}

              {order.type === 'booking' && order.checkIn && order.checkOut && (
                <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
                  <span>{nights(order.checkIn, order.checkOut)} ноч. · {order.price}</span>
                  {order.guests && (
                    <span className="bg-[#F6F4F1] border border-[#EDE9E3] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      👤 {order.guests} чел.
                    </span>
                  )}
                </div>
              )}

              <div className="divider" />

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {order.type === 'booking' && order.status === 'Ожидает' && (
                  <button onClick={() => updateStatus(order.id, 'Подтверждено')}
                    className="btn-primary flex-1 py-2 text-[12px] flex items-center justify-center gap-1.5 min-w-0">
                    <CheckCircle2 size={13} /> Подтвердить
                  </button>
                )}
                {(order.type === 'food' || order.type === 'request' || order.id?.startsWith('RQ-')) && order.status === 'Принят' && (
                  <button onClick={() => updateStatus(order.id, 'В работе')}
                    className="btn-primary flex-1 py-2 text-[12px] flex items-center justify-center gap-1.5 min-w-0">
                    <Sparkles size={13} /> В работу
                  </button>
                )}
                {(order.type === 'food' || order.type === 'request' || order.id?.startsWith('RQ-')) && ['Готовится', 'В работе'].includes(order.status) && (
                  <button onClick={() => updateStatus(order.id, 'Выполнено')}
                    className="btn-primary flex-1 py-2 text-[12px] flex items-center justify-center gap-1.5 min-w-0">
                    <CheckCircle2 size={13} /> Выполнено
                  </button>
                )}
                {!['Отменено','Выполнено'].includes(order.status) && (
                  <button onClick={() => updateStatus(order.id, 'Отменено')}
                    className="btn-outline py-2 px-3 text-[12px] text-red-400 border-red-200 hover:bg-red-50">
                    Отменить
                  </button>
                )}
              </div>
            </div>
          ))}
          <p className="text-center text-[11px] text-[#A09A92] pb-6">
            Нажмите 🔄 для обновления списка
          </p>
        </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [step, setStep]           = useState('welcome');
  const [lang, setLang]           = useState(() => localStorage.getItem('ak_lang') || 'ru');
  const [hotelAddress, setHotelAddress] = useState(() => localStorage.getItem('ak_hotel_address') || 'Балыкчы, ул. Восточная 3');
  const [welcomeBgUrl, setWelcomeBgUrl] = useState(() => localStorage.getItem('ak_welcome_bg') || '/issyk_kul_bg2.png');
  const [welcomeTexts, setWelcomeTexts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ak_welcome_texts') || 'null') || null; } catch(e) { return null; }
  });
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ru;
  const [showAdmin, setShowAdmin] = useState(false);
  const [inputName, setInputName] = useState(() => localStorage.getItem('ak_name') || '');
  const [guestName, setGuestName] = useState(() => localStorage.getItem('ak_name') || '');
  const [inputPhone, setInputPhone] = useState(() => localStorage.getItem('ak_phone') || '');
  const [guestPhone, setGuestPhone] = useState(() => localStorage.getItem('ak_phone') || '');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading]     = useState(false);
  const [history, setHistory]     = useState(() => getLS('ak_history', '[]'));
  const [reportClearedAt, setReportClearedAt] = useState(() => localStorage.getItem('ak_report_cleared_at') || null);
  const [myTokens, setMyTokens]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('ak_my_tokens') || '[]'); } catch(e) { return []; }
  });
  const [inputPin, setInputPin]   = useState('');
  const [pinError, setPinError]   = useState('');
  const [showShareModal, setShowShareModal] = useState(null);
  const [activeRoom, setActiveRoom] = useState(() => getLS('ak_active_room', 'null'));
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [weatherData, setWeatherData] = useState({
    temp: 26,
    waterTemp: 22,
    condition: 'Солнечно',
    icon: '☀️',
    wind: 4,
    code: 0
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=42.46&longitude=76.19&current_weather=true');
        const data = await res.json();
        if (data && data.current_weather) {
          const t = Math.round(data.current_weather.temperature);
          const wind = Math.round(data.current_weather.windspeed);
          const code = data.current_weather.weathercode;
          
          let condition = 'Солнечно';
          let icon = '☀️';
          if (code === 1 || code === 2) { condition = 'Малооблачно'; icon = '🌤️'; }
          else if (code === 3) { condition = 'Облачно'; icon = '☁️'; }
          else if (code >= 51 && code <= 67) { condition = 'Дождь'; icon = '🌧️'; }
          else if (code >= 80 && code <= 82) { condition = 'Ливень'; icon = '🌦️'; }

          const month = new Date().getMonth();
          let water = 21;
          if (month >= 5 && month <= 7) water = Math.min(24, Math.max(19, Math.round(t * 0.7 + 4)));
          else if (month === 8) water = 19;
          else water = 14;

          setWeatherData({ temp: t, waterTemp: water, condition, icon, wind, code });
        }
      } catch (e) {
        console.log('Weather fetch fallback used');
      }
    };
    fetchWeather();
    const timer = setInterval(fetchWeather, 300000);
    return () => clearInterval(timer);
  }, []);

  const addMyToken = (token) => {
    if (!token) return;
    setMyTokens(prev => {
      if (prev.includes(token)) return prev;
      const updated = [...prev, token];
      localStorage.setItem('ak_my_tokens', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlPin = urlParams.get('pin');
      if (urlPin && history && history.length > 0) {
        const found = history.find(b => b.pin && String(b.pin) === String(urlPin));
        if (found && found.secretToken) {
          addMyToken(found.secretToken);
        }
      }
    } catch(e) {}
  }, [history]);

  // Глобальные состояния Telegram, Пароля и Отзывов
  const [tgToken, setTgToken] = useState(() => localStorage.getItem('ak_tg_token') || '');
  const [tgChat, setTgChat]   = useState(() => localStorage.getItem('ak_tg_chat') || '');
  const [adminPass, setAdminPass] = useState(() => localStorage.getItem('ak_admin_pass') || ADMIN_PASS);
  const [reviewsList, setReviewsList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ak_reviews') || '[]'); } catch(e) { return []; }
  });
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleSendFeedback = async (e, roomNo) => {
    e.preventDefault();
    const newReview = {
      id: `rev_${Date.now()}`,
      guest: guestName || 'Гость',
      phone: guestPhone || '—',
      roomNo: roomNo || activeRoom?.roomNo || '—',
      stars: ratingStars,
      comment: ratingComment,
      date: new Date().toLocaleDateString('ru-RU')
    };

    const updatedReviews = [newReview, ...reviewsList];
    setReviewsList(updatedReviews);
    try { localStorage.setItem('ak_reviews', JSON.stringify(updatedReviews)); } catch(e){}
    setFeedbackSent(true);

    try {
      await supabase.from('orders').insert([{
        id: newReview.id,
        status: 'review',
        payload: newReview
      }]);
    } catch(e){}

    const starsStr = '⭐'.repeat(ratingStars);
    const tgMsg = `⭐ <b>НОВЫЙ ОТЗЫВ О ГОСТИНИЦЕ «АЙКӨЛ»!</b>\n\n<b>Оценка:</b> ${starsStr} (${ratingStars}/5)\n<b>Гость:</b> ${guestName || 'Гость'}\n<b>Комната:</b> № ${roomNo || activeRoom?.roomNo || '—'}\n<b>Телефон:</b> ${guestPhone || 'Не указан'}\n\n<b>Отзыв:</b>\n"${ratingComment || 'Без комментария'}"`;
    sendTelegramNotification(tgMsg);
  };

  // Динамические номера и меню из localStorage
  // При загрузке добавляем priceTiers и images если в кеше их нет
  const [rooms, setRooms] = useState(() => {
    const saved = getLS('ak_custom_rooms', JSON.stringify(INITIAL_ROOMS));
    return saved.map(r => {
      const def = INITIAL_ROOMS.find(ir => ir.id === r.id);
      let updated = { ...r };
      if (!r.priceTiers || Object.keys(r.priceTiers).length === 0) {
        if (def && def.priceTiers) updated.priceTiers = def.priceTiers;
      }
      if (!r.images || r.images.length <= 1) {
        if (def && def.images) updated.images = def.images;
      }
      return updated;
    });
  });
  const [menuList, setMenuList] = useState(() => getLS('ak_custom_menu', JSON.stringify(INITIAL_MENU)));

  // Индексы фото на карточках номеров
  const [cardImgIndices, setCardImgIndices] = useState({});

  // Ожидание подтверждения администратором
  const [pendingId, setPendingId] = useState(() => localStorage.getItem('ak_pending_id') || null);

  const [viewRoom, setViewRoom]       = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0); // Индекс активного фото галереи номера
  const [viewDish, setViewDish]       = useState(null); // Детали блюда
  const [activeDishImgIndex, setActiveDishImgIndex] = useState(0); // Индекс активного фото галереи блюда
  const [showMenuScreen, setShowMenuScreen] = useState(false); // Полноценный экран меню
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [bookRoom, setBookRoom]       = useState(null);
  const [modal, setModal]             = useState(null); // confirm | food | history | extend | service
  const [customRequest, setCustomRequest] = useState('');

  // Даты бронирования
  const [checkIn, setCheckIn]     = useState(today);
  const [checkOut, setCheckOut]   = useState(tomorrow);

  // Количество гостей
  const [guestsCount, setGuestsCount] = useState(1);

  // Новая дата выезда для продления
  const [extendDate, setExtendDate] = useState('');

  // Скрытый доступ к админке — 5 тапов на логотип или ссылка /adminaikol
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('adminaikol') || hash.includes('adminaikol')) {
        setShowAdmin(true);
      }
    };
    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  const tapCount = useRef(0);
  const tapTimer = useRef(null);
  const handleLogoTap = () => {
    tapCount.current += 1;
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 2000);
    if (tapCount.current >= 5) { tapCount.current = 0; setShowAdmin(true); }
  };

  // Подключение Supabase Realtime и авто-загрузка заказов
  useEffect(() => {
    // 1. Первоначальная и регулярная загрузка из Supabase
    const fetchSupabaseOrders = async () => {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          // Синхронизация Telegram конфига
          const tgRow = data.find(d => d.id === 'tg_config');
          if (tgRow && tgRow.payload) {
            if (tgRow.payload.token) {
              localStorage.setItem('ak_tg_token', tgRow.payload.token);
              setTgToken(tgRow.payload.token);
            }
            if (tgRow.payload.chat) {
              localStorage.setItem('ak_tg_chat', tgRow.payload.chat);
              setTgChat(tgRow.payload.chat);
            }
          }

          // Синхронизация пароля администратора
          const passRow = data.find(d => d.id === 'app_admin_pass');
          if (passRow && passRow.payload && passRow.payload.pass) {
            localStorage.setItem('ak_admin_pass', passRow.payload.pass);
            setAdminPass(passRow.payload.pass);
          }

          // Синхронизация списка номеров
          const roomsRow = data.find(d => d.id === 'app_rooms');
          if (roomsRow && roomsRow.payload && Array.isArray(roomsRow.payload.rooms)) {
            const normalizedRooms = roomsRow.payload.rooms.map(r => ({
              ...r,
              perks: getPerksArray(r.perks),
              images: Array.isArray(r.images) && r.images.length > 0 ? r.images : (r.img ? [r.img] : [])
            }));
            localStorage.setItem('ak_custom_rooms', JSON.stringify(normalizedRooms));
            setRooms(normalizedRooms);
          }

          // Синхронизация списка блюд
          const menuRow = data.find(d => d.id === 'app_menu');
          if (menuRow && menuRow.payload && Array.isArray(menuRow.payload.menu)) {
            const normalizedMenu = menuRow.payload.menu.map(m => ({
              ...m,
              ingredients: getIngredientsArray(m.ingredients),
              images: Array.isArray(m.images) && m.images.length > 0 ? m.images : (m.img ? [m.img] : [])
            }));
            localStorage.setItem('ak_custom_menu', JSON.stringify(normalizedMenu));
            setMenuList(normalizedMenu);
          }

          // Синхронизация отзывов
          const reviewsRows = data.filter(d => d.status === 'review' || d.id?.startsWith('rev_'));
          if (reviewsRows.length > 0) {
            const revs = reviewsRows.map(r => r.payload || r);
            localStorage.setItem('ak_reviews', JSON.stringify(revs));
            setReviewsList(revs);
          }

          // Синхронизация сброса отчётности
          const clearedRow = data.find(d => d.id === 'app_report_cleared_at');
          if (clearedRow && clearedRow.payload && clearedRow.payload.clearedAt) {
            localStorage.setItem('ak_report_cleared_at', clearedRow.payload.clearedAt);
            setReportClearedAt(clearedRow.payload.clearedAt);
          } else if (clearedRow === undefined && localStorage.getItem('ak_report_cleared_at')) {
            // Если в Supabase запись была удалена
            localStorage.removeItem('ak_report_cleared_at');
            setReportClearedAt(null);
          }

          // Синхронизация фоновых обоев
          const bgRow = data.find(d => d.id === 'app_welcome_bg');
          if (bgRow && bgRow.payload && bgRow.payload.bgUrl) {
            localStorage.setItem('ak_welcome_bg', bgRow.payload.bgUrl);
            setWelcomeBgUrl(bgRow.payload.bgUrl);
          }

          // Синхронизация кастомных текстов приветствия
          const wtRow = data.find(d => d.id === 'app_welcome_texts');
          if (wtRow && wtRow.payload) {
            localStorage.setItem('ak_welcome_texts', JSON.stringify(wtRow.payload));
            setWelcomeTexts(wtRow.payload);
          }

          // История заказов (исключая системные записи и отзывы)
          const systemIds = ['tg_config', 'app_admin_pass', 'app_rooms', 'app_menu', 'app_report_cleared_at', 'app_welcome_bg', 'app_welcome_texts'];
          const formatted = data
            .filter(d => !systemIds.includes(d.id) && d.status !== 'review' && !d.id?.startsWith('rev_'))
            .map(d => ({
              ...d.payload,
              id: d.id || d.payload?.id,
              status: d.status || d.payload?.status
            }));
          setHistory(formatted);
          try { localStorage.setItem('ak_history', JSON.stringify(formatted)); } catch(e) {}
        }
      } catch (e) {
        console.log('Supabase fetch error', e);
      }
    };

    fetchSupabaseOrders();
    const intervalId = setInterval(fetchSupabaseOrders, 2000);

    // 2. Realtime подписка на изменения
    const subscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchSupabaseOrders();
      })
      .subscribe();

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(subscription);
    };
  }, []);

  // Сохраняем activeRoom
  useEffect(() => {
    try {
      localStorage.setItem('ak_active_room', JSON.stringify(activeRoom));
    } catch (e) {
      console.warn('Ошибка сохранения ak_active_room:', e);
    }
  }, [activeRoom]);

  // Сохраняем pendingId
  useEffect(() => {
    try {
      if (pendingId) localStorage.setItem('ak_pending_id', pendingId);
      else localStorage.removeItem('ak_pending_id');
    } catch (e) {
      console.warn('Ошибка сохранения ak_pending_id:', e);
    }
  }, [pendingId]);

  // Polling — проверяем статус от администратора каждые 3 сек
  useEffect(() => {
    const interval = setInterval(() => {
      const orders = getLS('ak_history', '[]');

      // 1. Если ждём первичного подтверждения
      if (pendingId) {
        const booking = orders.find(o => o.id === pendingId);
        if (booking) {
          if (booking.status === 'Подтверждено') {
            setActiveRoom({ ...booking.roomData, checkIn: booking.checkIn, checkOut: booking.checkOut, phone: booking.phone, bookingId: booking.id });
            setPendingId(null);
            setHistory(orders);
          } else if (booking.status === 'Отменено') {
            setPendingId(null);
            setHistory(orders);
            alert('❌ Ваша заявка была отменена администратором.');
          }
        }
      }

      // 2. Если у гостя уже ЕСТЬ активный забронированный номер
      if (activeRoom) {
        const currentBooking = orders.find(o => 
          (o.id && activeRoom.bookingId && o.id === activeRoom.bookingId) ||
          (o.type === 'booking' && o.roomNo === activeRoom.roomNo && o.guest === guestName)
        );

        // Если бронь отменена админом или удалена из списка
        if (!currentBooking || currentBooking.status === 'Отменено') {
          setActiveRoom(null);
          localStorage.removeItem('ak_active_room');
          setHistory(orders);
          alert('ℹ️ Ваше бронирование номера было отменено администратором.');
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [pendingId, activeRoom, guestName]);

  const goToRooms = () => {
    if (guestName.trim().length >= 2 && guestPhone.trim().length >= 6) { setStep('rooms'); return; }
    setStep('name');
  };

  const submitName = (e) => {
    e?.preventDefault();
    const n = inputName.trim();
    const p = inputPhone.trim();
    let hasErr = false;

    if (n.length < 2) { setNameError('Введите имя — минимум 2 символа'); hasErr = true; }
    else { setNameError(''); }

    if (p.length < 6) { setPhoneError('Введите корректный номер телефона'); hasErr = true; }
    else { setPhoneError(''); }

    if (hasErr) return;

    setLoading(true);
    setTimeout(() => {
      setGuestName(n);
      setGuestPhone(p);
      localStorage.setItem('ak_name', n);
      localStorage.setItem('ak_phone', p);
      setLoading(false);
      setStep('rooms');
    }, 600);
  };

  // Гость отправляет заявку → статус "Ожидает", activeRoom НЕ ставим
  const confirmBooking = () => {
    try {
      const room = bookRoom;
      if (!room) return;
      const nums = ROOM_NUMBERS[room.id] || ['100'];
      const roomNo = nums[Math.floor(Math.random() * nums.length)];
      const id = `BK-${Math.floor(100 + Math.random() * 900)}`;
      const pin = Math.floor(1000 + Math.random() * 9000).toString();
      const secretToken = `sec_${id}_${Math.random().toString(36).substring(2, 9)}`;
      const n = nights(checkIn, checkOut);
      const numericPrice = getRoomPrice(room, guestsCount);
      const totalPrice = `${(numericPrice * Math.max(n, 1)).toLocaleString('ru-RU')} сом`;
      const priceLabel = `${numericPrice.toLocaleString('ru-RU')} сом/ночь (${guestsCount} чел.)`;
      const entry = {
        id,
        type:     'booking',
        title:    room.name,
        guest:    guestName,
        phone:    guestPhone,
        roomNo,
        pin,
        secretToken,
        roomData: { ...room, roomNo },
        checkIn,
        checkOut,
        nights:   n,
        guests:   guestsCount,
        price:    priceLabel,
        total:    totalPrice,
        date:     new Date().toLocaleDateString('ru-RU'),
        status:   'Ожидает',
      };
      const currentHistory = getLS('ak_history', '[]');
      const newHistory = [entry, ...currentHistory];
      setHistory(newHistory);
      addMyToken(secretToken);
      
      // Легкий пейлоад без тяжелых base64 массива изображений для мгновенной отправки в Supabase
      const cleanEntry = {
        id,
        type:     'booking',
        title:    room.name,
        guest:    guestName,
        phone:    guestPhone,
        roomNo,
        pin,
        secretToken,
        roomData: { id: room.id, name: room.name, price: room.price, img: room.img, roomNo },
        checkIn,
        checkOut,
        nights:   n,
        guests:   guestsCount,
        price:    priceLabel,
        total:    totalPrice,
        date:     new Date().toLocaleDateString('ru-RU'),
        status:   'Ожидает',
      };

      // Мгновенная отправка в Supabase
      try {
        localStorage.setItem('ak_history', JSON.stringify(newHistory));
        supabase.from('orders').upsert([{ id: cleanEntry.id, status: cleanEntry.status, payload: cleanEntry }]).then(({ data, error }) => {
          if (error) console.error('Ошибка Supabase:', error);
          else console.log('Успешно создано в Supabase:', data);
        });
        window.dispatchEvent(new Event('ak_orders_updated'));
      } catch (e) {
        console.warn('Ошибка отправки в Supabase:', e);
      }

      // Отправка уведомления в Telegram Бот
      sendTelegramNotification(
        `🏨 <b>НОВАЯ ЗАЯВКА НА БРОНИРОВАНИЕ!</b>\n\n` +
        `<b>Код:</b> <code>${cleanEntry.id}</code>\n` +
        `<b>🔑 ПИН-код доступа:</b> <code>${pin}</code>\n` +
        `<b>Номер:</b> ${room.name} (№ ${roomNo})\n` +
        `<b>Гость:</b> ${guestName}\n` +
        `<b>Телефон:</b> <code>${guestPhone}</code>\n` +
        `<b>Гостей:</b> ${guestsCount} чел.\n` +
        `<b>Заезд:</b> ${fmtDate(checkIn)}\n` +
        `<b>Выезд:</b> ${fmtDate(checkOut)} (${n} ноч.)\n` +
        `<b>Итого:</b> ${totalPrice}`,
        [
          [
            { text: '✅ Подтвердить', callback_data: `confirm_${cleanEntry.id}` },
            { text: '❌ Отменить', callback_data: `cancel_${cleanEntry.id}` }
          ]
        ]
      );
      setPendingId(id);   // ждём подтверждения
      try {
        localStorage.setItem('ak_pending_id', id);
      } catch (e) {}
      setModal(null);
      setBookRoom(null);
      setViewRoom(null);
    } catch (err) {
      console.error(' Ошибка при отправке заявки на бронирование:', err);
      setModal(null);
    }
  };

  // Продление проживания
  const extendBooking = async () => {
    if (!activeRoom || !extendDate) return;
    const updatedRoom = { ...activeRoom, checkOut: extendDate };
    setActiveRoom(updatedRoom);
    try {
      localStorage.setItem('ak_active_room', JSON.stringify(updatedRoom));
    } catch (e) {}

    const targetOrder = history.find(o =>
      o.id === activeRoom.bookingId ||
      o.id === pendingId ||
      (o.type === 'booking' && o.roomNo === activeRoom.roomNo && ['\u041fодтверждено', '\u0417аселён', '\u041fродлён'].includes(o.status))
    );

    if (targetOrder) {
      const updatedEntry = { ...targetOrder, checkOut: extendDate, status: '\u041fродлён' };
      const updatedHistory = history.map(o => o.id === targetOrder.id ? updatedEntry : o);
      setHistory(updatedHistory);
      try {
        localStorage.setItem('ak_history', JSON.stringify(updatedHistory));
        await supabase.from('orders').update({
          status: '\u041fродлён',
          payload: updatedEntry
        }).eq('id', targetOrder.id);
      } catch (e) {
        console.error('Ошибка продления в Supabase:', e);
      }
    }
    setModal(null);
    setExtendDate('');
  };

  const orderFood = async (dishToOrder) => {
    if (!activeRoom) return;
    const targetDish = dishToOrder || viewDish;
    const dishTitle = targetDish ? `${targetDish.name} (${targetDish.price})` : `Заказ еды в номер: № ${activeRoom.roomNo}`;
    const id = `OD-${Math.floor(1000 + Math.random() * 9000)}`;
    const entry = {
      id,
      type:   'food',
      title:  dishTitle,
      guest:  guestName,
      phone:  guestPhone,
      roomNo: activeRoom.roomNo,
      date:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price:  targetDish ? targetDish.price : '—',
      status: 'Принят',
    };
    const currentHistory = getLS('ak_history', '[]');
    const newHistory = [entry, ...currentHistory];
    setHistory(newHistory);

    // Сохранение в Supabase
    try {
      localStorage.setItem('ak_history', JSON.stringify(newHistory));
      await supabase.from('orders').upsert([{ id: entry.id, status: entry.status, payload: entry }]);
      window.dispatchEvent(new Event('ak_orders_updated'));
    } catch (e) {
      console.warn('Ошибка отправки заказа еды в Supabase:', e);
    }

    // Отправка уведомления в Telegram Бот
    sendTelegramNotification(
      `🍽️ <b>НОВЫЙ ЗАКАЗ ЕДЫ В НОМЕР!</b>\n\n` +
      `<b>Код:</b> <code>${entry.id}</code>\n` +
      `<b>Заказ:</b> ${dishTitle}\n` +
      `<b>Номер комнаты:</b> № ${activeRoom.roomNo} (${activeRoom.name})\n` +
      `<b>Гость:</b> ${guestName}\n` +
      `<b>Телефон:</b> <code>${guestPhone}</code>\n` +
      `<b>Время заказа:</b> ${entry.date}`,
      [
        [
          { text: '⚡ В работу', callback_data: `work_${entry.id}` },
          { text: '✅ Выполнено', callback_data: `done_${entry.id}` }
        ]
      ]
    );

    setModal(null);
    setViewDish(null);
    setTimeout(() => alert(`🍽️ Заказ принят!\n${dishTitle}\nДоставка в комнату № ${activeRoom.roomNo}\nВремя: 20–30 минут.`), 100);
  };

  // Запрос / Сервис в номер
  const submitGuestRequest = async (reqText) => {
    if (!activeRoom || !reqText || !reqText.trim()) return;
    const title = `Запрос в номер: ${reqText.trim()}`;
    const id = `RQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const entry = {
      id,
      type:   'request',
      title,
      guest:  guestName,
      phone:  guestPhone,
      roomNo: activeRoom.roomNo,
      date:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price:  '—',
      status: 'Принят',
    };
    const currentHistory = getLS('ak_history', '[]');
    const newHistory = [entry, ...currentHistory];
    setHistory(newHistory);

    try {
      localStorage.setItem('ak_history', JSON.stringify(newHistory));
      await supabase.from('orders').upsert([{ id: entry.id, status: entry.status, payload: entry }]);
      window.dispatchEvent(new Event('ak_orders_updated'));
    } catch (e) {
      console.warn('Ошибка отправки запроса в Supabase:', e);
    }

    sendTelegramNotification(
      `🛎️ <b>НОВЫЙ ЗАПРОС В НОМЕР!</b>\n\n` +
      `<b>Код:</b> <code>${entry.id}</code>\n` +
      `<b>Номер комнаты:</b> № ${activeRoom.roomNo} (${activeRoom.name})\n` +
      `<b>Запрос:</b> ${reqText.trim()}\n` +
      `<b>Гость:</b> ${guestName}\n` +
      `<b>Телефон:</b> <code>${guestPhone}</code>\n` +
      `<b>Время:</b> ${entry.date}`,
      [
        [
          { text: '⚡ В работу', callback_data: `work_${entry.id}` },
          { text: '✅ Выполнено', callback_data: `done_${entry.id}` }
        ]
      ]
    );

    setModal(null);
    setCustomRequest('');
    setTimeout(() => alert(`🛎️ Запрос принят!\n«${reqText.trim()}»\nАдминистратор уже занимается вашим запросом.`), 100);
  };

  const checkOut2 = () => {
    setActiveRoom(null);
    localStorage.removeItem('ak_active_room');
  };

  // Заявка гостя в ожидании
  const pendingEntry = pendingId ? history.find(o => o.id === pendingId) : null;

  // Проверка занятости номера по данным Supabase (история общая для всех)
  const todayStr = new Date().toISOString().slice(0, 10);
  const ACTIVE_STATUSES = ['\u041fодтверждено', '\u0417аселён', '\u041fродлён'];

  const isRoomOccupied = (room) => {
    if (!room) return false;
    return (history || []).some(o =>
      o &&
      o.type === 'booking' &&
      ACTIVE_STATUSES.includes(o.status) &&
      (o.roomData?.id === room.id || o.roomData?.name === room.name) &&
      o.checkIn && o.checkOut &&
      o.checkIn <= todayStr &&
      o.checkOut > todayStr
    );
  };

  // Получить даты занятости номера (с учётом продлений и цепочки броней)
  const getRoomOccupancy = (room) => {
    if (!room) return null;
    const currentBookings = (history || []).filter(o =>
      o &&
      o.type === 'booking' &&
      ACTIVE_STATUSES.includes(o.status) &&
      (o.roomData?.id === room.id || o.roomData?.name === room.name) &&
      o.checkIn && o.checkOut &&
      o.checkIn <= todayStr &&
      o.checkOut > todayStr
    );

    if (currentBookings.length === 0) return null;

    currentBookings.sort((a, b) => String(b.checkOut || '').localeCompare(String(a.checkOut || '')));
    let mainBooking = { ...currentBookings[0] };

    // Проверяем цепочку последующих подтвержденных броней для этого же номера
    let maxCheckOut = mainBooking.checkOut || todayStr;
    let foundMore = true;
    let safeguard = 0;
    while (foundMore && safeguard < 20) {
      safeguard++;
      foundMore = false;
      const nextBooking = (history || []).find(o =>
        o &&
        o.type === 'booking' &&
        ACTIVE_STATUSES.includes(o.status) &&
        (o.roomData?.id === room.id || o.roomData?.name === room.name) &&
        o.checkIn && o.checkOut &&
        o.checkIn <= maxCheckOut &&
        o.checkOut > maxCheckOut
      );
      if (nextBooking) {
        maxCheckOut = nextBooking.checkOut;
        foundMore = true;
      }
    }

    mainBooking.checkOut = maxCheckOut;
    return mainBooking;
  };

  /* ── ADMIN ── */
  if (showAdmin) return (
    <AdminPanel 
      onExit={() => setShowAdmin(false)} 
      rooms={rooms} 
      setRooms={(newRooms) => {
        setRooms(newRooms);
        try {
          localStorage.setItem('ak_custom_rooms', JSON.stringify(newRooms));
        } catch (e) {
          console.warn('Не удалось сохранить в localStorage (превышен лимит памяти):', e);
        }
      }} 
      menuList={menuList} 
      setMenuList={(newMenu) => {
        setMenuList(newMenu);
        try {
          localStorage.setItem('ak_custom_menu', JSON.stringify(newMenu));
        } catch (e) {
          console.warn('Не удалось сохранить в localStorage (превышен лимит памяти):', e);
        }
      }} 
      history={history}
      setHistory={setHistory}
      tgToken={tgToken}
      setTgToken={setTgToken}
      tgChat={tgChat}
      setTgChat={setTgChat}
      adminPass={adminPass}
      setAdminPass={setAdminPass}
      reviewsList={reviewsList}
      setReviewsList={setReviewsList}
      hotelAddress={hotelAddress}
      setHotelAddress={setHotelAddress}
      welcomeBgUrl={welcomeBgUrl}
      setWelcomeBgUrl={setWelcomeBgUrl}
      welcomeTexts={welcomeTexts}
      setWelcomeTexts={setWelcomeTexts}
    />
  );

  /* ─── WELCOME ───────────────────────────────────────────────── */
  if (step === 'welcome') return (
    <div className="min-h-screen welcome-bg flex items-center justify-center p-4" style={{ backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.4), rgba(13, 107, 96, 0.3)), url('${welcomeBgUrl}')` }}>
      <div className="welcome-card w-full max-w-sm p-7 sm:p-9 text-center space-y-6 animate-up">
        
        {/* Переключатель языка / Language Selector */}
        <div className="flex items-center justify-center gap-1 p-1 bg-white/40 backdrop-blur-md border border-white/60 rounded-full max-w-[275px] mx-auto shadow-sm">
          <button
            type="button"
            onClick={() => { setLang('kg'); localStorage.setItem('ak_lang', 'kg'); }}
            className={`flex-1 py-1.5 px-2 rounded-full text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              lang === 'kg' ? 'bg-[#0D6B60] text-white shadow-md scale-105' : 'text-[#374151] hover:text-[#0F0F0F]'
            }`}>
            <span>🇰🇬</span> Кыргызча
          </button>
          <button
            type="button"
            onClick={() => { setLang('ru'); localStorage.setItem('ak_lang', 'ru'); }}
            className={`flex-1 py-1.5 px-2 rounded-full text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              lang === 'ru' ? 'bg-[#0D6B60] text-white shadow-md scale-105' : 'text-[#374151] hover:text-[#0F0F0F]'
            }`}>
            <span>🇷🇺</span> Русский
          </button>
          <button
            type="button"
            onClick={() => { setLang('en'); localStorage.setItem('ak_lang', 'en'); }}
            className={`flex-1 py-1.5 px-2 rounded-full text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              lang === 'en' ? 'bg-[#0D6B60] text-white shadow-md scale-105' : 'text-[#374151] hover:text-[#0F0F0F]'
            }`}>
            <span>🇬🇧</span> English
          </button>
        </div>

        <div className="mx-auto w-[72px] h-[72px] rounded-[22px] bg-[#0D6B60] flex items-center justify-center shadow-[0_12px_32px_rgba(13,107,96,0.4)] cursor-pointer select-none"
          onClick={handleLogoTap}>
          <span className="font-display text-white font-bold text-3xl leading-none">А</span>
        </div>
        <div><span className="badge-gold bg-[#F5EDD4]/90 backdrop-blur-md shadow-sm"><MapPin size={11} strokeWidth={2.5} /> {hotelAddress || t.location}</span></div>
        <div className="space-y-1">
          <h1 className="font-display text-[26px] sm:text-[30px] font-semibold text-[#0F0F0F] leading-[1.2]">
            {welcomeTexts?.[lang]?.welcome || t.welcome}
          </h1>
          <p className="font-display text-[17px] text-[#0D6B60] italic font-semibold leading-snug">
            {welcomeTexts?.[lang]?.sub || t.sub}
          </p>
        </div>
        <p className="text-[13px] text-[#374151] font-medium leading-relaxed max-w-[260px] mx-auto">
          {welcomeTexts?.[lang]?.desc || t.desc}
        </p>
        <div className="flex items-center justify-center gap-3 bg-white/40 backdrop-blur-md border border-white/60 py-2.5 px-3 rounded-2xl shadow-sm">
          <div className="flex items-center gap-1.5 text-[11.5px] text-[#1F2937] font-bold">
            <Star size={13} className="text-[#B8963A] fill-[#B8963A]" strokeWidth={1} /> {t.rating}
          </div>
          <span className="w-px h-4 bg-[#6B7280]/30" />
          <div className="flex items-center gap-1.5 text-[11.5px] text-[#1F2937] font-bold">
            <ShieldCheck size={13} className="text-[#0D6B60]" strokeWidth={2} /> {t.safe}
          </div>
          <span className="w-px h-4 bg-[#6B7280]/30" />
          <div className="flex items-center gap-1.5 text-[11.5px] text-[#1F2937] font-bold">
            <Utensils size={13} className="text-[#0D6B60]" strokeWidth={2} /> {t.rest}
          </div>
        </div>
        <button onClick={goToRooms} className="btn-primary w-full flex items-center justify-center gap-2.5 group">
          {t.next} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  /* ─── NAME & PHONE ────────────────────────────────────────────── */
  if (step === 'name') return (
    <div className="min-h-screen welcome-bg flex items-center justify-center p-4" style={{ backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.4), rgba(13, 107, 96, 0.3)), url('${welcomeBgUrl}')` }}>
      <div className="welcome-card w-full max-w-sm p-8 sm:p-10 space-y-6 animate-scale">
        <button onClick={() => setStep('welcome')} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#0F0F0F] transition-colors">
          <ArrowLeft size={15} strokeWidth={2.5} /> {lang === 'en' ? 'Back' : lang === 'kg' ? 'Артка' : 'Назад'}
        </button>
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-[16px] bg-[#E0F4F1] flex items-center justify-center">
            <User size={22} className="text-[#0D6B60]" strokeWidth={2} />
          </div>
          <h2 className="font-display text-2xl font-semibold text-[#0F0F0F]">{t.guestData}</h2>
          <p className="text-[13px] text-[#6B7280] leading-relaxed">{t.guestDesc}</p>
        </div>
        <form onSubmit={submitName} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">{t.nameLabel}</label>
            <input className={`input-soft ${nameError ? 'error' : ''}`} placeholder={t.namePlaceholder}
              value={inputName} onChange={e => { setInputName(e.target.value); setNameError(''); }} autoFocus />
            {nameError && <div className="flex items-center gap-1.5 text-[12px] text-red-500 font-medium"><AlertCircle size={14} />{nameError}</div>}
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
              <Phone size={13} className="text-[#0D6B60]" /> {t.phoneLabel}
            </label>
            <input className={`input-soft ${phoneError ? 'error' : ''}`} placeholder="0555 00-00-00" type="tel"
              value={inputPhone} onChange={e => { setInputPhone(e.target.value); setPhoneError(''); }} />
            {phoneError && <div className="flex items-center gap-1.5 text-[12px] text-red-500 font-medium"><AlertCircle size={14} />{phoneError}</div>}
          </div>

          <button type="submit" disabled={inputName.trim().length < 2 || inputPhone.trim().length < 6 || loading}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <Loader /> : <>{t.confirmBtn} <ArrowRight size={16} /></>}
          </button>
        </form>
      </div>
    </div>
  );

  /* ─── ROOM DETAIL ───────────────────────────────────────────── */
  if (viewRoom) {
    const roomPhotos = viewRoom.images && viewRoom.images.length > 0 ? viewRoom.images : [viewRoom.img];
    const currentPhoto = roomPhotos[activeImgIndex] || roomPhotos[0] || viewRoom.img;

    return (
      <div className="min-h-screen bg-[#FAFAF8] flex justify-center">
        <div className="w-full max-w-md flex flex-col" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1) both' }}>
          <div className="relative h-[55vw] max-h-[300px] min-h-[220px] overflow-hidden shrink-0 group">
            <img src={currentPhoto} alt={viewRoom.name} className="w-full h-full object-cover transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <button onClick={() => { setViewRoom(null); setActiveImgIndex(0); }} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all z-10">
              <ArrowLeft size={17} strokeWidth={2.5} />
            </button>
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md z-10">
              <span className="text-[13px] font-black text-[#0F0F0F]">{viewRoom.price}</span>
              <span className="text-[11px] text-[#6B7280] font-normal"> сом/ночь</span>
            </div>

            {/* Стрелки переключения фото номера */}
            {roomPhotos.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveImgIndex(prev => (prev === 0 ? roomPhotos.length - 1 : prev - 1)); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/60 transition-all">
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveImgIndex(prev => (prev === roomPhotos.length - 1 ? 0 : prev + 1)); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/60 transition-all">
                  <ChevronRight size={20} />
                </button>
                <span className="absolute bottom-3 right-4 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {activeImgIndex + 1} / {roomPhotos.length}
                </span>
              </>
            )}

            {viewRoom.id === 'suite' && !isRoomOccupied(viewRoom) && <div className="absolute bottom-14 left-4 badge-gold"><Sparkles size={10} /> Премиум</div>}
            {/* Бейдж занятости на детальной странице */}
            {isRoomOccupied(viewRoom) ? (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-[12px] font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-red-200 animate-pulse" /> Занято
              </div>
            ) : (
              <div className="absolute top-4 left-4 bg-green-500/90 text-white text-[12px] font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-green-200 animate-pulse" /> Свободно
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="font-display text-white text-[24px] font-semibold leading-tight">{viewRoom.name}</h1>
              <p className="text-white/75 text-[13px] mt-0.5">{viewRoom.subtitle}</p>
            </div>
          </div>

          {/* Галерея превью фото номера */}
          {roomPhotos.length > 1 && (
            <div className="flex gap-2 px-4 pt-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {roomPhotos.map((ph, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImgIndex(i)}
                  className={`relative h-14 w-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${activeImgIndex === i ? 'border-[#0D6B60] scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={ph} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        <div className="flex-1 px-4 py-5 space-y-5 overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            {[{label:'Площадь',value:viewRoom.size},{label:'Вместимость',value:viewRoom.cap},{label:'Рейтинг',value:'★ 4.9'}].map(s => (
              <div key={s.label} className="bg-white border border-[#EDE9E3] rounded-[14px] p-3 text-center">
                <p className="text-[13px] font-bold text-[#0D6B60]">{s.value}</p>
                <p className="text-[10px] text-[#A09A92] font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2.5">
            <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Удобства</p>
            <div className="grid grid-cols-2 gap-2">
              {getPerksArray(viewRoom.perks).map(p => (
                <div key={p} className="bg-white border border-[#EDE9E3] rounded-[12px] px-3 py-2.5 flex items-center gap-2.5">
                  <span className="text-[#0D6B60]">{getPerkIcon(p)}</span>
                  <span className="text-[12.5px] font-medium text-[#0F0F0F]">{p}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Статус занятости номера */}
          {(() => {
            const occ = getRoomOccupancy(viewRoom);
            if (occ) return (
              <div className="bg-red-50 border border-red-200 rounded-[14px] p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-lg">🔒</div>
                <div>
                  <p className="text-[13px] font-bold text-red-600">Номер занят</p>
                  <p className="text-[12px] text-red-400 mt-0.5">Свободится {fmtDate(occ.checkOut)}</p>
                </div>
              </div>
            );
            return (
              <div className="bg-green-50 border border-green-200 rounded-[14px] p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-lg">✅</div>
                <div>
                  <p className="text-[13px] font-bold text-green-700">Номер свободен</p>
                  <p className="text-[12px] text-green-500 mt-0.5">Доступен для бронирования</p>
                </div>
              </div>
            );
          })()}
          <div className="bg-[#F0FAF8] border border-[#C7EBE6] rounded-[14px] p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-[#6B7280] font-medium">Стоимость за ночь</p>
              <p className="text-[22px] font-black text-[#0D6B60] leading-tight">{viewRoom.price} <span className="text-[13px] font-semibold text-[#6B7280]">сом</span></p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[#6B7280] font-medium">г. Балыкчы, ул. Восточная 3</p>
              <p className="text-[11px] text-[#0D6B60] font-semibold flex items-center gap-1 justify-end mt-0.5">
                <MapPin size={10} strokeWidth={2.5} /> Иссык-Куль
              </p>
            </div>
          </div>
          {isRoomOccupied(viewRoom) ? (
            <button onClick={() => {
              const occ = getRoomOccupancy(viewRoom);
              setBookRoom(viewRoom);
              // Автоматически выставляем дату заезда = день освобождения
              if (occ) setCheckIn(occ.checkOut);
              setCheckOut('');
              setModal('confirm');
            }}
              className="btn-primary w-full py-4 text-[15px] flex items-center justify-center gap-2.5">
              <KeyRound size={18} /> Забронировать с {fmtDate(getRoomOccupancy(viewRoom)?.checkOut)}
            </button>
          ) : (
            <button onClick={() => { setBookRoom(viewRoom); setModal('confirm'); }}
              className="btn-primary w-full py-4 text-[15px] flex items-center justify-center gap-2.5">
              <KeyRound size={18} /> Забронировать этот номер
            </button>
          )}
        </div>
      </div>

      {/* Confirm Modal on detail page */}
      {modal === 'confirm' && bookRoom && (
        <div className="modal-backdrop animate-scale">
          <div className="modal-box space-y-4">
            <div className="space-y-1">
              <p className="text-[12px] font-semibold text-[#B8963A] uppercase tracking-wider">Бронирование</p>
              <h3 className="font-display text-xl font-semibold text-[#0F0F0F]">{bookRoom.name}</h3>
            </div>

            {/* Даты */}
            <div className="space-y-3">
              {/* Если номер занят — показать уведомление */}
              {(() => {
                const occ = getRoomOccupancy(bookRoom);
                if (!occ) return null;
                return (
                  <div className="bg-amber-50 border border-amber-200 rounded-[12px] px-3 py-2.5 flex items-center gap-2 text-[12px] text-amber-700">
                    <span>📅</span>
                    <span>Номер занят до <strong>{fmtDate(occ.checkOut)}</strong>. Заезд не раньше этой даты.</span>
                  </div>
                );
              })()}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarDays size={12} className="text-[#0D6B60]" /> Заезд
                  </label>
                  <input type="date" className="input-soft text-[13px] py-2.5" value={checkIn}
                    min={getRoomOccupancy(bookRoom)?.checkOut || today()}
                    onChange={e => setCheckIn(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarDays size={12} className="text-[#0D6B60]" /> Выезд
                  </label>
                  <input type="date" className="input-soft text-[13px] py-2.5" value={checkOut}
                    min={checkIn || getRoomOccupancy(bookRoom)?.checkOut || today()} onChange={e => setCheckOut(e.target.value)} />
                </div>
              </div>

              {nights(checkIn,checkOut) > 0 && (
                <div className="bg-[#F0FAF8] border border-[#C7EBE6] rounded-[12px] px-4 py-2.5 flex justify-between text-[13px]">
                  <span className="text-[#6B7280]">{nights(checkIn,checkOut)} ноч. × {getRoomPrice(bookRoom, guestsCount).toLocaleString('ru-RU')} сом</span>
                  <span className="font-black text-[#0D6B60]">
                    {(getRoomPrice(bookRoom, guestsCount) * nights(checkIn,checkOut)).toLocaleString('ru-RU')} сом
                  </span>
                </div>
              )}
            </div>

            <div className="bg-[#F6F4F1] rounded-[14px] p-3.5 space-y-2 text-[13px]">
              <div className="flex justify-between"><span className="text-[#6B7280]">Гость</span><span className="font-bold">{guestName}</span></div>
              <div className="divider" />
              <div className="flex justify-between"><span className="text-[#6B7280]">Телефон</span><span className="font-bold text-[#0D6B60]">{guestPhone}</span></div>
              <div className="divider" />
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280]">Количество гостей</span>
                <div className="flex items-center gap-2">
                  <button type="button"
                    onClick={() => setGuestsCount(g => Math.max(1, g - 1))}
                    className="w-7 h-7 rounded-full bg-[#E8E4DF] flex items-center justify-center text-[#0F0F0F] font-bold text-[16px] hover:bg-[#d9d4ce] transition-colors">−</button>
                  <span className="font-bold text-[#0F0F0F] min-w-[20px] text-center">{guestsCount}</span>
                  <button type="button"
                    onClick={() => setGuestsCount(g => Math.min(20, g + 1))}
                    className="w-7 h-7 rounded-full bg-[#0D6B60] flex items-center justify-center text-white font-bold text-[16px] hover:bg-[#0a5a51] transition-colors">+</button>
                </div>
              </div>
              <div className="divider" />
              <div className="flex justify-between"><span className="text-[#6B7280]">Локация</span><span className="font-bold">г. Балыкчы, ул. Восточная 3</span></div>
            </div>

            <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-[10px] px-3 py-2 flex items-center gap-2">
              <Hourglass size={13} /> Администратор перезвонит вам по номеру {guestPhone} для подтверждения
            </p>

            <div className="flex gap-2.5">
              <button onClick={() => { setModal(null); setBookRoom(null); }} className="btn-outline flex-1 py-3">Отмена</button>
              <button onClick={confirmBooking} disabled={nights(checkIn,checkOut) < 1}
                className="btn-primary flex-1 py-3 flex items-center justify-center gap-1.5">
                <CheckCircle2 size={16} /> Отправить заявку
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

  /* ─── RESTAURANT FULL SCREEN ─────────────────────────────── */
  if (showMenuScreen) {
    const existingCats = Array.from(new Set(menuList.map(m => m.category).filter(Boolean)));
    const categories = ['Все', ...Array.from(new Set([...DEFAULT_MENU_CATEGORIES.filter(c => existingCats.includes(c) || ['Завтраки', 'Горячее', 'Супы', 'Фастфуд и шаурма', 'Напитки', 'Десерты и выпечка', 'Шашлыки и гриль'].includes(c)), ...existingCats]))];
    const filteredMenu = selectedCategory === 'Все'
      ? menuList
      : menuList.filter(f => f.category === selectedCategory);

    return (
      <div className="min-h-screen bg-[#FAFAF8] flex justify-center">
        <div className="w-full max-w-md flex flex-col" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1) both' }}>
          
          {/* Header Bar */}
          <div className="bg-white border-b border-[#EDE9E3] px-5 py-4 flex items-center justify-between sticky top-0 z-30">
            <button onClick={() => setShowMenuScreen(false)}
              className="flex items-center gap-1.5 text-[13px] text-[#6B7280] font-medium hover:text-[#0F0F0F] transition-colors">
              <ArrowLeft size={16} strokeWidth={2.5} /> Назад
            </button>
            <div className="text-center">
              <h1 className="font-display text-[17px] font-semibold text-[#0F0F0F]">Ресторан «Айкөл»</h1>
            </div>
            <div className="w-12"></div>
          </div>

          <div className="flex-1 px-4 py-5 space-y-5 overflow-y-auto">

            {/* Banner */}
            <div className="relative h-[140px] rounded-[22px] overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85"
                alt="Ресторан" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end items-center text-center p-4 text-white">
                <h2 className="font-display text-[22px] font-semibold">Меню блюд</h2>
                <p className="text-[11px] text-white/80">Доставка прямо в ваш номер</p>
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {categories.map(c => (
                <button key={c} onClick={() => setSelectedCategory(c)}
                  className={`px-4 py-2 rounded-[12px] text-[12px] font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === c
                      ? 'bg-[#0D6B60] text-white shadow-sm'
                      : 'bg-white border border-[#EDE9E3] text-[#6B7280] hover:bg-[#F6F4F1]'
                  }`}>
                  {c}
                </button>
              ))}
            </div>

            {/* Menu Cards */}
            <div className="space-y-4">
              {filteredMenu.map((dish) => (
                <div key={dish.id} 
                  onClick={() => { 
                    const freshDish = menuList.find(m => m.id === dish.id) || dish;
                    setViewDish(freshDish); 
                    setActiveDishImgIndex(0); 
                  }}
                  className="room-card animate-up flex flex-col sm:flex-row overflow-hidden cursor-pointer active:scale-[0.98] transition-transform">
                  <div className="relative h-[160px] sm:w-[150px] shrink-0 overflow-hidden bg-[#F6F4F1]">
                    <img 
                      src={dish.images?.[0] || dish.img || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85'} 
                      alt={dish.name} 
                      className="w-full h-full object-cover" 
                    />
                    <span className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-[#0D6B60] text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm">
                      {dish.price}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-[16px] font-semibold text-[#0F0F0F] leading-tight">{dish.name}</h3>
                      </div>
                      <p className="text-[12px] text-[#6B7280] mt-1 leading-relaxed line-clamp-2">{dish.desc}</p>

                      {/* Ингредиенты на карточке */}
                      {(() => {
                        const ings = getIngredientsArray(dish.ingredients);
                        if (ings.length === 0) return null;
                        return (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {ings.slice(0, 3).map((ing, idx) => (
                              <span key={idx} className="text-[10px] bg-[#F6F4F1] text-[#6B7280] px-2 py-0.5 rounded-md border border-[#EDE9E3]">
                                {ing}
                              </span>
                            ))}
                            {ings.length > 3 && (
                              <span className="text-[10px] bg-[#F6F4F1] text-[#0D6B60] font-bold px-1.5 py-0.5 rounded-md">
                                +{ings.length - 3}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {activeRoom ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const freshDish = menuList.find(m => m.id === dish.id) || dish;
                          orderFood(freshDish);
                        }} 
                        className="btn-primary py-2 text-[12px] flex items-center justify-center gap-1.5 mt-2 active:scale-[0.98] transition-transform">
                        <Utensils size={13} /> Заказать в номер № {activeRoom.roomNo}
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#0D6B60] font-semibold mt-2 flex items-center gap-1">
                        Подробнее о блюде →
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Dish Detail Modal — фиксировано по центру экрана вне прокручиваемой области */}
        {viewDish && (() => {
          const dishPhotos = (viewDish.images && viewDish.images.length > 0) ? viewDish.images : (viewDish.img ? [viewDish.img] : []);
          const currentDishPhoto = dishPhotos[activeDishImgIndex] || dishPhotos[0] || viewDish.img || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85';

          return (
            <div className="modal-backdrop animate-scale" onClick={() => { setViewDish(null); setActiveDishImgIndex(0); }}>
              <div className="modal-box p-0 overflow-hidden space-y-0 max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="relative h-[220px] overflow-hidden group">
                  <img src={currentDishPhoto} alt={viewDish.name} className="w-full h-full object-cover transition-all duration-300" />
                  <button 
                    onClick={() => { setViewDish(null); setActiveDishImgIndex(0); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm z-10 hover:bg-black/60">
                    <X size={16} strokeWidth={2.5} />
                  </button>
                  <span className="absolute bottom-3 left-3 bg-[#0D6B60] text-white text-[12px] font-bold px-3 py-1 rounded-full shadow-md z-10">
                    {viewDish.category}
                  </span>

                  {/* Стрелки слайдера блюда */}
                  {dishPhotos.length > 1 && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveDishImgIndex(prev => (prev === 0 ? dishPhotos.length - 1 : prev - 1)); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/60 transition-all">
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveDishImgIndex(prev => (prev === dishPhotos.length - 1 ? 0 : prev + 1)); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/60 transition-all">
                        <ChevronRight size={20} />
                      </button>
                      <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {activeDishImgIndex + 1} / {dishPhotos.length}
                      </span>
                    </>
                  )}
                </div>

                {/* Лента миниатюр снизу фото блюда */}
                {dishPhotos.length > 1 && (
                  <div className="flex gap-2 px-4 py-2.5 overflow-x-auto bg-[#F6F4F1] border-b border-[#EDE9E3]" style={{ scrollbarWidth: 'none' }}>
                    {dishPhotos.map((ph, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveDishImgIndex(idx)}
                        className={`relative h-12 w-16 rounded-md overflow-hidden border-2 shrink-0 transition-all ${activeDishImgIndex === idx ? 'border-[#0D6B60] scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                        <img src={ph} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-[#0F0F0F] leading-tight">{viewDish.name}</h3>
                  <span className="font-black text-[18px] text-[#0D6B60] shrink-0">{viewDish.price}</span>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Описание</p>
                  <p className="text-[13px] text-[#4B5563] leading-relaxed bg-[#F6F4F1] p-3 rounded-[12px]">
                    {viewDish.desc}
                  </p>
                </div>

                {/* Секция с Ингредиентами в описании */}
                {(() => {
                  const ings = getIngredientsArray(viewDish.ingredients);
                  if (ings.length === 0) return null;
                  return (
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Состав и ингредиенты</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ings.map((ing, idx) => (
                          <span key={idx} className="text-[11.5px] bg-[#E0F4F1] text-[#0D6B60] font-medium px-2.5 py-1 rounded-lg border border-[#C7EBE6] flex items-center gap-1">
                            • {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {activeRoom ? (
                  <button 
                    onClick={() => { orderFood(viewDish); }} 
                    className="btn-primary w-full py-3 text-[13px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                    <Utensils size={15} /> Заказать в номер № {activeRoom.roomNo}
                  </button>
                ) : (
                  <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-[12px]">
                    <p className="text-[11.5px] text-amber-700 font-medium">
                      Заказ еды с доставкой станет доступен после заселения в номер.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          );
        })()}
      </div>
    );
  }

  /* ─── ROOMS ─────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen welcome-bg flex justify-center" style={{ backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.4), rgba(13, 107, 96, 0.3)), url('${welcomeBgUrl}')` }}>
      <div className="w-full max-w-md bg-[#FAFAF8] min-h-screen shadow-2xl border-x border-[#EDE9E3]/50">

        {/* Top Bar */}
        <div className="bg-white border-b border-[#EDE9E3] px-5 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0D6B60] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {(guestName && guestName.length > 0 ? guestName[0] : 'Г').toUpperCase()}
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#0F0F0F] leading-tight">{guestName || 'Гость'}</p>
              <p className="text-[11px] text-[#6B7280] flex items-center gap-1">
                <Phone size={10} className="text-[#0D6B60]" /> {guestPhone || 'Не указан'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowWeatherModal(true)}
              title="Погода и температура воды"
              className="h-9 px-2.5 flex items-center justify-center gap-1 border border-[#C7EBE6] rounded-[10px] bg-[#E0F4F1] hover:bg-[#cbeee8] transition-all text-[#0D6B60] text-[11px] font-bold shadow-sm">
              <span>{weatherData.icon}</span>
              <span>{weatherData.temp > 0 ? `+${weatherData.temp}` : weatherData.temp}°C</span>
              <span className="hidden sm:inline text-[10px] text-[#6B7280]">· 🌊 +{weatherData.waterTemp}°C</span>
            </button>
            <button onClick={() => setShowMenuScreen(true)}
              title="Ресторан и меню"
              className="w-9 h-9 flex items-center justify-center border border-[#EDE9E3] rounded-[10px] bg-[#E0F4F1] hover:bg-[#cbeee8] transition-all text-[#0D6B60]">
              <Utensils size={18} strokeWidth={2} />
            </button>
            <button onClick={() => setModal('history')}
              className="relative w-9 h-9 flex items-center justify-center border border-[#E8E4DF] rounded-[10px] hover:bg-[#F6F4F1] transition-all text-[#6B7280]">
              <History size={18} strokeWidth={2} />
              {history.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] bg-[#0D6B60] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                  {history.length}
                </span>
              )}
            </button>
            <select
              value={lang}
              onChange={e => { setLang(e.target.value); localStorage.setItem('ak_lang', e.target.value); }}
              className="bg-[#F6F4F1] border border-[#EDE9E3] rounded-[10px] text-[11px] font-bold px-1.5 h-9 text-[#0D6B60] outline-none cursor-pointer">
              <option value="kg">🇰🇬 KG</option>
              <option value="ru">🇷🇺 RU</option>
              <option value="en">🇬🇧 EN</option>
            </select>
            <button onClick={() => { setInputName(guestName); setInputPhone(guestPhone); setStep('name'); }}
              className="text-[12px] text-[#6B7280] border border-[#E8E4DF] w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[#F6F4F1] transition-all">
              ✏️
            </button>
          </div>
        </div>

        <div className="px-4 py-5 space-y-5 animate-up">

          {/* ── ОЖИДАНИЕ ПОДТВЕРЖДЕНИЯ ── */}
          {pendingEntry && (
            <div className="animate-up">
              <div className="text-center py-2 mb-1">
                <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-widest">Ожидание подтверждения</span>
                <div className="mt-1.5 mx-auto w-8 h-[2px] rounded-full bg-amber-400" />
              </div>
              <div className="room-card border-[1.5px] border-amber-200 shadow-[0_4px_24px_rgba(251,191,36,0.1)]">
                <div className="relative h-[140px] overflow-hidden">
                  <img src={pendingEntry.roomData?.img} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 bg-amber-400 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Hourglass size={11} strokeWidth={2.5} className="animate-pulse" /> Ожидает
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="font-display text-white text-[17px] font-semibold">{pendingEntry.title}</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#F6F4F1] rounded-[10px] px-3 py-2">
                      <p className="text-[9px] text-[#A09A92] font-semibold uppercase tracking-wider">Заезд</p>
                      <p className="text-[12px] font-bold text-[#0F0F0F]">{fmtDate(pendingEntry.checkIn)}</p>
                    </div>
                    <div className="bg-[#F6F4F1] rounded-[10px] px-3 py-2">
                      <p className="text-[9px] text-[#A09A92] font-semibold uppercase tracking-wider">Выезд</p>
                      <p className="text-[12px] font-bold text-[#0F0F0F]">{fmtDate(pendingEntry.checkOut)}</p>
                    </div>
                  </div>
                  <p className="text-[12px] text-[#6B7280] text-center">
                    Администратор перезвонит вам по номеру <span className="font-bold text-[#0F0F0F]">{pendingEntry.phone}</span> для подтверждения
                  </p>
                  <button onClick={() => { 
                    if (confirm('Отменить заявку?')) { 
                      setPendingId(null); 
                      setHistory(h => h.map(o => o.id === pendingEntry.id ? {...o, status:'Отменено'} : o));
                      try { supabase.from('orders').update({ status: 'Отменено' }).eq('id', pendingEntry.id); } catch(e){}
                    }
                  }}
                    className="w-full btn-outline text-[12px] py-2.5 text-red-400 border-red-200 hover:bg-red-50">
                    Отменить заявку
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── АКТИВНЫЕ НОМЕРА ГОСТЯ (подтверждённые) ── */}
          {(() => {
            const cleanP = p => String(p || '').replace(/\D/g, '');
            const curPhone = cleanP(guestPhone);
            const curName  = String(guestName || '').trim().toLowerCase();

            const myConfirmedBookings = history.filter(o => {
              if (o.type !== 'booking' || !['Подтверждено', 'Заселён', 'Продлён'].includes(o.status)) return false;
              const oPhone = cleanP(o.phone);
              const oGuest = String(o.guest || '').trim().toLowerCase();

              const phoneMatch = curPhone.length >= 3 && oPhone.length >= 3 && (oPhone.includes(curPhone) || curPhone.includes(oPhone));
              const nameMatch  = curName.length >= 2 && oGuest.length >= 2 && oGuest === curName;

              return phoneMatch || nameMatch;
            });

            if (myConfirmedBookings.length === 0 || pendingId) return null;

            // Разделяем на авторизованные (на этом устройстве) и неавторизованные
            const authorizedBookings = myConfirmedBookings.filter(b => 
              (!b.secretToken && !b.pin) || (b.secretToken && myTokens.includes(b.secretToken))
            );
            const unauthorizedBookings = myConfirmedBookings.filter(b => 
              b.secretToken && !myTokens.includes(b.secretToken)
            );

            // Если есть неавторизованные бронирования и устройство еще не авторизовалось
            if (authorizedBookings.length === 0 && unauthorizedBookings.length > 0) {
              const targetBk = unauthorizedBookings[0];
              return (
                <div className="bg-white border-[1.5px] border-[#0D6B60]/30 rounded-[20px] p-5 space-y-4 shadow-md animate-up">
                  <div className="text-center space-y-1.5">
                    <div className="w-12 h-12 rounded-full bg-[#E0F4F1] flex items-center justify-center mx-auto text-[#0D6B60]">
                      <Lock size={22} />
                    </div>
                    <p className="text-[11px] font-bold text-[#0D6B60] uppercase tracking-wider">Защита доступа к номеру</p>
                    <h3 className="font-display text-lg font-bold text-[#0F0F0F]">
                      Номер № {targetBk.roomNo} забронирован
                    </h3>
                    <p className="text-[12px] text-[#6B7280] leading-relaxed">
                      Для подключения этого устройства введите 4-значный ПИН-код (нажмите «📱 2-е устройство» на первом смартфоне или спросите у администратора):
                    </p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const target = unauthorizedBookings.find(b => String(b.pin || '').trim() === inputPin.trim());
                    if (target && target.secretToken) {
                      addMyToken(target.secretToken);
                      setInputPin('');
                      setPinError('');
                    } else {
                      setPinError('Неверный ПИН-код. Проверьте 4 цифры и попробуйте снова.');
                    }
                  }} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        maxLength={6}
                        className={`input-soft text-center text-xl font-bold tracking-widest ${pinError ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="ПИН-код (напр. 4821)"
                        value={inputPin}
                        onChange={e => { setInputPin(e.target.value); setPinError(''); }}
                        autoFocus
                      />
                      {pinError && <p className="text-[11.5px] text-red-500 font-medium text-center mt-1.5">{pinError}</p>}
                    </div>
                    <button type="submit" className="btn-primary w-full py-3 text-[13px] flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} /> Подтвердить и открыть доступ
                    </button>
                  </form>
                </div>
              );
            }

            const myActiveRoomsList = authorizedBookings.map(b => ({
              bookingId: b.id,
              roomNo: b.roomNo,
              pin: b.pin,
              name: b.roomData?.name || (b.title ? String(b.title).split('(')[0]?.trim() : null) || 'Номер',
              size: b.roomData?.size || '32 м²',
              cap: b.roomData?.cap || `${b.guests || 1} гостя`,
              price: b.roomData?.price || b.price,
              img: b.roomData?.img || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=85',
              perks: b.roomData?.perks || ['Кровать King-size', 'Wi-Fi 100 Мбит/с'],
              checkIn: b.checkIn,
              checkOut: b.checkOut,
              status: b.status
            }));

            if (myActiveRoomsList.length === 0) return null;

            return (
              <div className="space-y-4 animate-up">
                <div className="text-center py-2 mb-1">
                  <span className="text-[11px] font-semibold text-[#0D6B60] uppercase tracking-widest">
                    {myActiveRoomsList.length > 1 ? `${t.yourRoom} (${myActiveRoomsList.length})` : t.yourRoom}
                  </span>
                  <div className="mt-1.5 mx-auto w-8 h-[2px] rounded-full bg-[#0D6B60]" />
                </div>

                {myActiveRoomsList.map((rm, roomIdx) => (
                  <div key={rm.bookingId || roomIdx} className="room-card border-[1.5px] border-[#0D6B60]/20 shadow-[0_4px_24px_rgba(13,107,96,0.1)]">
                    <div className="relative h-[160px] overflow-hidden">
                      <img src={rm.img} alt={rm.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                        <div className="bg-[#0D6B60] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" /> {rm.status || 'Заселён'}
                        </div>
                        {rm.pin && (
                          <button
                            type="button"
                            onClick={() => setShowShareModal(rm)}
                            className="bg-black/40 hover:bg-black/60 text-white text-[10.5px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-1 transition-all">
                            <Smartphone size={11} /> 📱 2-е устройство
                          </button>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                        <div>
                          <p className="font-display text-white text-[17px] font-semibold leading-tight">{rm.name}</p>
                          <p className="text-white/70 text-[12px]">{rm.size} · {rm.cap}</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-[12px] px-3 py-2 text-center min-w-[56px]">
                          <p className="text-white/70 text-[9px] font-semibold uppercase tracking-wider">Комната</p>
                          <p className="text-white font-black text-[22px] leading-tight">{rm.roomNo}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {/* Даты */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#F6F4F1] rounded-[12px] px-3 py-2.5">
                          <p className="text-[9px] text-[#A09A92] font-semibold uppercase tracking-wider flex items-center gap-1"><CalendarDays size={9}/> {t.checkInLabel}</p>
                          <p className="text-[12px] font-bold text-[#0F0F0F] mt-0.5">{fmtDate(rm.checkIn)}</p>
                        </div>
                        <div className="bg-[#F6F4F1] rounded-[12px] px-3 py-2.5">
                          <p className="text-[9px] text-[#A09A92] font-semibold uppercase tracking-wider flex items-center gap-1"><CalendarDays size={9}/> {t.checkOutLabel}</p>
                          <p className="text-[12px] font-bold text-[#0F0F0F] mt-0.5">{fmtDate(rm.checkOut)}</p>
                        </div>
                      </div>
                      {nights(rm.checkIn, rm.checkOut) > 0 && (
                        <p className="text-[11px] text-[#6B7280] text-center">
                          {nights(rm.checkIn, rm.checkOut)} {t.nightShort} · {rm.price} {t.perNight}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {getPerksArray(rm.perks).map(p => (
                          <span key={p} className="chip flex items-center gap-1">{getPerkIcon(p)}{p}</span>
                        ))}
                      </div>

                      {/* Минималистичный статус-бар активных блюд и запросов */}
                      {(() => {
                        const activeReqs = history.filter(o =>
                          (o.roomNo === rm.roomNo || o.roomNo === String(rm.roomNo)) &&
                          ['food', 'request'].includes(o.type) &&
                          ['Принят', 'Ожидает', 'В работе', 'Готовится'].includes(o.status)
                        );
                        if (activeReqs.length === 0) return null;

                        return (
                          <div className="bg-[#F0FAF8] border border-[#C7EBE6] rounded-[14px] p-3 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-[#0D6B60] uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#0D6B60] animate-ping" />
                                {t.activeRequests} ({activeReqs.length})
                              </span>
                            </div>
                            {activeReqs.map(req => (
                              <div key={req.id} className="bg-white rounded-[10px] p-2.5 border border-[#EDE9E3] space-y-2 text-[12px]">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-bold text-[#0F0F0F] line-clamp-1 flex-1">{req.title}</span>
                                  <StatusBadge status={req.status} />
                                </div>
                                <div className="pt-0.5 space-y-1">
                                  <div className="flex justify-between text-[9.5px] font-semibold">
                                    <span className={req.status === 'Принят' || req.status === 'Ожидает' ? 'text-amber-600 font-bold' : 'text-[#A09A92]'}>
                                      📩 Отправлено
                                    </span>
                                    <span className={['В работе', 'Готовится'].includes(req.status) ? 'text-[#0D6B60] font-bold flex items-center gap-1' : 'text-[#A09A92]'}>
                                      {['В работе', 'Готовится'].includes(req.status) && <span className="w-1.5 h-1.5 rounded-full bg-[#0D6B60] animate-pulse" />}
                                      👀 Прочитано · В работе
                                    </span>
                                    <span className={req.status === 'Выполнено' ? 'text-green-600 font-bold' : 'text-[#A09A92]'}>
                                      ✅ Готово
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-[#EDE9E3] rounded-full overflow-hidden flex">
                                    <div className={`h-full transition-all duration-500 rounded-full ${
                                      req.status === 'Выполнено'
                                        ? 'w-full bg-green-500'
                                        : ['В работе', 'Готовится'].includes(req.status)
                                        ? 'w-2/3 bg-[#0D6B60]'
                                        : 'w-1/3 bg-amber-500'
                                    }`} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}

                      <div className="divider" />
                      <div className="flex gap-2">
                        <button onClick={() => { setActiveRoom(rm); setModal('service'); }}
                          className="btn-primary flex-1 py-3 text-[13px] flex items-center justify-center gap-2">
                          <Bell size={15} /> {t.requestsBtn}
                        </button>
                        <button onClick={() => { setActiveRoom(rm); setExtendDate(rm.checkOut); setModal('extend'); }}
                          className="btn-outline flex-1 py-3 text-[13px] flex items-center justify-center gap-2 text-[#0D6B60] border-[#C7EBE6]">
                          <CalendarPlus size={15} /> {t.extendBtn}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* ⭐ Виджет отзыва о проживании */}
                <div className="bg-white border border-[#EDE9E3] rounded-[20px] p-4 space-y-3 shadow-sm animate-up">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-bold text-[#B8963A] uppercase tracking-wider">{t.reviewTitle}</p>
                      <h4 className="font-display text-base font-bold text-[#0F0F0F]">{t.reviewHeader}</h4>
                    </div>
                    <span className="text-xl">⭐</span>
                  </div>

                  {feedbackSent ? (
                    <div className="bg-green-50 border border-green-200 rounded-[12px] p-3 text-center space-y-1 animate-scale">
                      <p className="text-[13px] font-bold text-green-700">{t.thanksReview} 🙏</p>
                    </div>
                  ) : (
                    <form onSubmit={(e) => handleSendFeedback(e, myActiveRoomsList[0]?.roomNo)} className="space-y-3">
                      <div className="flex items-center justify-center gap-2 py-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRatingStars(star)}
                            className={`text-2xl transition-transform ${star <= ratingStars ? 'scale-110 opacity-100' : 'opacity-30 scale-90'}`}>
                            ⭐
                          </button>
                        ))}
                      </div>
                      <textarea
                        className="input-soft text-[12px] min-h-[65px] resize-none"
                        placeholder={t.reviewPlaceholder}
                        value={ratingComment}
                        onChange={e => setRatingComment(e.target.value)}
                      />
                      <button type="submit" className="btn-primary w-full py-2.5 text-[12.5px] flex items-center justify-center gap-1.5">
                        <Send size={14} /> {t.sendReviewBtn}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Heading */}
          <div className="text-center py-2">
            <h2 className="font-display text-[26px] font-semibold text-[#0F0F0F] tracking-tight">{t.roomsCatalogTitle}</h2>
            <div className="mt-2 mx-auto w-10 h-[2px] rounded-full bg-[#0D6B60]" />
          </div>

          {/* Room Cards */}
          {rooms.map((r, i) => {
            const occupied = isRoomOccupied(r);
            const occupancy = occupied ? getRoomOccupancy(r) : null;
            const roomPhotos = (r.images && r.images.length > 0) ? r.images : (r.img ? [r.img] : []);
            const cardIdx = cardImgIndices[r.id] || 0;
            const currentCardPhoto = roomPhotos[cardIdx] || roomPhotos[0] || r.img;

            return (
            <div key={r.id}
              className={`room-card animate-up cursor-pointer active:scale-[0.98] transition-transform ${occupied ? 'opacity-90' : ''}`}
              style={{ animationDelay: `${i * 80}ms` }}
              onClick={() => {
                const freshRoom = rooms.find(rm => rm.id === r.id) || r;
                setViewRoom(freshRoom);
                setActiveImgIndex(cardIdx < roomPhotos.length ? cardIdx : 0);
              }}>
              <div className="relative h-[185px] overflow-hidden bg-[#F6F4F1] group">
                <img 
                  src={currentCardPhoto} 
                  alt={r.name} 
                  className={`w-full h-full object-cover transition-all duration-300 ${occupied ? 'brightness-75' : ''}`}
                />

                {/* Слайдер фото для карточки номера */}
                {roomPhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCardImgIndices(prev => ({
                          ...prev,
                          [r.id]: ((prev[r.id] || 0) === 0 ? roomPhotos.length - 1 : (prev[r.id] || 0) - 1)
                        }));
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-all z-10">
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCardImgIndices(prev => ({
                          ...prev,
                          [r.id]: (((prev[r.id] || 0) + 1) % roomPhotos.length)
                        }));
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-all z-10">
                      <ChevronRight size={20} />
                    </button>

                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm z-10">
                      {cardIdx + 1} / {roomPhotos.length}
                    </div>
                  </>
                )}

                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#0F0F0F] text-[12px] font-black px-3 py-1.5 rounded-full shadow-md z-10">
                  {r.price} <span className="font-normal text-[#6B7280]">{t.perNight}</span>
                </div>
                {r.id === 'suite' && !occupied && <div className="absolute top-3 left-3 badge-gold z-10"><Sparkles size={10} /> Премиум</div>}
                {/* Бейдж занятости */}
                {occupied ? (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-200 animate-pulse" /> {lang === 'en' ? 'Occupied' : lang === 'kg' ? 'Бош эмес' : 'Занято'}
                  </div>
                ) : (
                  <div className="absolute bottom-3 left-3 bg-green-500/90 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md backdrop-blur-sm z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-200 animate-pulse" /> {lang === 'en' ? 'Available' : lang === 'kg' ? 'Бош' : 'Свободно'}
                  </div>
                )}
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-[17px] font-semibold text-[#0F0F0F] leading-tight">{r.name}</h3>
                    <p className="text-[12px] text-[#6B7280] mt-0.5">{r.subtitle}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] text-[#6B7280] font-medium">{r.size}</p>
                    <p className="text-[11px] text-[#6B7280] font-medium">{r.cap}</p>
                  </div>
                </div>
                {occupied && occupancy && (
                  <div className="bg-red-50 border border-red-100 rounded-[10px] px-3 py-2 text-[11px] text-red-500 flex items-center gap-2">
                    <span>🔒</span>
                    <span>{t.roomOccupied} {fmtDate(occupancy.checkOut)}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {getPerksArray(r.perks).map(p => <span key={p} className="chip flex items-center gap-1">{getPerkIcon(p)}{p}</span>)}
                </div>
              </div>
            </div>
          );})}

          {/* ── ПУБЛИЧНЫЙ БЛОК: ОТЗЫВЫ НАШИХ ГОСТЕЙ ── */}
          {reviewsList && reviewsList.length > 0 && (
            <div className="pt-4 space-y-3 animate-up">
              <div className="text-center py-2">
                <span className="text-[11px] font-semibold text-[#B8963A] uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Star size={12} fill="#B8963A" className="text-[#B8963A]" />
                  {t.reviewsTitle} ({(reviewsList.reduce((a, r) => a + (parseInt(r?.stars) || 5), 0) / (reviewsList.length || 1)).toFixed(1)} / 5.0 ⭐)
                </span>
                <div className="mt-1.5 mx-auto w-10 h-[2px] rounded-full bg-[#B8963A]" />
              </div>

              <div className="space-y-3">
                {reviewsList.slice(0, 10).map(rev => (
                  <div key={rev.id || Math.random()} className="bg-white border border-[#EDE9E3] rounded-[18px] p-4 space-y-2 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-[13px] text-[#0F0F0F]">{rev.guest || t.guestNameDefault}</p>
                        {rev.roomNo && (
                          <p className="text-[10.5px] text-[#0D6B60] font-semibold">
                            {lang === 'en' ? `Stayed in room #${rev.roomNo}` : lang === 'kg' ? `№ ${rev.roomNo} бөлмөсүндө жашаган` : `Проживал(а) в номере № ${rev.roomNo}`}
                          </p>
                        )}
                      </div>
                      <div className="text-[12px] font-bold text-amber-500 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        {'⭐'.repeat(Math.max(1, Math.min(5, parseInt(rev?.stars) || 5)))} <span className="text-[10px] text-[#0F0F0F]">({parseInt(rev?.stars) || 5}/5)</span>
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-[12.5px] text-[#4B5563] bg-[#F6F4F1] p-3 rounded-[12px] leading-relaxed border border-[#E8E4DF]">
                        "{rev.comment}"
                      </p>
                    )}
                    <p className="text-[10px] text-[#A09A92] text-right">{rev.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>





      {/* ── SERVICE / REQUEST MODAL ── */}
      {modal === 'service' && activeRoom && (
        <div className="modal-backdrop animate-scale">
          <div className="modal-box space-y-4">
            <div className="space-y-1">
              <p className="text-[12px] font-semibold text-[#0D6B60] uppercase tracking-wider">
                {lang === 'en' ? `Service to Room #${activeRoom.roomNo}` : lang === 'kg' ? `№ ${activeRoom.roomNo} бөлмөгө кызмат көрсөтүү` : `Сервис в номер № ${activeRoom.roomNo}`}
              </p>
              <h3 className="font-display text-xl font-semibold text-[#0F0F0F]">{t.serviceTitle}</h3>
              <p className="text-[12px] text-[#6B7280]">{t.serviceDesc}</p>
            </div>

            {/* Быстрые запросы */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: t.orderFoodOption, action: () => { setModal(null); setShowMenuScreen(true); } },
                { label: t.extraBlanket, req: 'Дополнительное одеяло' },
                { label: t.cleaning, req: 'Уборка в номере' },
                { label: t.towels, req: 'Свежие полотенца и гигиена' },
                { label: t.kettle, req: 'Чайник и посуда в номер' },
                { label: t.callAdmin, req: 'Вызов администратора в номер' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (item.action) item.action();
                    else submitGuestRequest(item.req);
                  }}
                  className="bg-[#F6F4F1] hover:bg-[#E0F4F1] border border-[#EDE9E3] hover:border-[#C7EBE6] text-[#0F0F0F] hover:text-[#0D6B60] text-[12px] font-semibold p-3 rounded-[12px] text-left transition-all flex items-center justify-between group">
                  <span>{item.label}</span>
                  <span className="text-[#0D6B60] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
              ))}
            </div>

            <div className="divider" />

            {/* Произвольный запрос */}
            <form onSubmit={(e) => { e.preventDefault(); submitGuestRequest(customRequest); }} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">{t.customReqLabel}</label>
                <input
                  type="text"
                  className="input-soft mt-1 text-[13px]"
                  placeholder={t.customReqPlaceholder}
                  value={customRequest}
                  onChange={e => setCustomRequest(e.target.value)}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setModal(null)} className="btn-outline flex-1 py-2.5">{t.cancel}</button>
                <button type="submit" disabled={!customRequest.trim()} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-1.5">
                  <Bell size={14} /> {t.send}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FOOD MODAL ── */}
      {modal === 'food' && activeRoom && (
        <div className="modal-backdrop animate-scale">
          <div className="modal-box space-y-5">
            <div className="space-y-1">
              <p className="text-[12px] font-semibold text-[#0D6B60] uppercase tracking-wider">Доставка в номер</p>
              <h3 className="font-display text-xl font-semibold text-[#0F0F0F]">
                {viewDish ? viewDish.name : activeRoom.name}
              </h3>
              {viewDish && <p className="text-[13px] text-[#0D6B60] font-bold">{viewDish.price}</p>}
            </div>
            <div className="bg-[#F6F4F1] rounded-[14px] p-4 space-y-2.5 text-[13px]">
              <div className="flex justify-between"><span className="text-[#6B7280]">Гость</span><span className="font-bold">{guestName}</span></div>
              <div className="divider" />
              <div className="flex justify-between"><span className="text-[#6B7280]">Телефон</span><span className="font-bold text-[#0D6B60]">{guestPhone}</span></div>
              <div className="divider" />
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Номер комнаты</span>
                <span className="font-black text-[#0D6B60] text-[17px]">№ {activeRoom.roomNo}</span>
              </div>
              <div className="divider" />
              <div className="flex justify-between"><span className="text-[#6B7280]">Доставка</span><span className="font-bold">20–30 мин</span></div>
            </div>
            <div className="flex gap-2.5">
              <button onClick={() => { setModal(null); setViewDish(null); }} className="btn-outline flex-1 py-3">Отмена</button>
              <button onClick={orderFood} className="btn-primary flex-1 py-3 flex items-center justify-center gap-1.5">
                <CheckCircle2 size={16} /> Подтвердить заказ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EXTEND MODAL ── */}
      {modal === 'extend' && activeRoom && (
        <div className="modal-backdrop animate-scale">
          <div className="modal-box space-y-5">
            <div className="space-y-1">
              <p className="text-[12px] font-semibold text-[#0D6B60] uppercase tracking-wider">Продление проживания</p>
              <h3 className="font-display text-xl font-semibold text-[#0F0F0F]">{activeRoom.name}</h3>
            </div>
            <div className="bg-[#F6F4F1] rounded-[14px] p-4 space-y-2.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Текущий выезд</span>
                <span className="font-bold">{fmtDate(activeRoom.checkOut)}</span>
              </div>
              <div className="divider" />
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarPlus size={12} className="text-[#0D6B60]" /> Новая дата выезда
                </label>
                <input type="date" className="input-soft text-[14px]"
                  value={extendDate} min={activeRoom.checkOut}
                  onChange={e => setExtendDate(e.target.value)} />
              </div>
              <div className="divider" />
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#6B7280] font-semibold">Количество гостей</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setGuestsCount(g => Math.max(1, g - 1))}
                    className="w-7 h-7 rounded-full bg-[#E8E4DF] flex items-center justify-center text-[#0F0F0F] font-bold text-[16px] hover:bg-[#d9d4ce] transition-colors">−</button>
                  <span className="font-bold text-[#0F0F0F] min-w-[20px] text-center">{guestsCount}</span>
                  <button type="button" onClick={() => setGuestsCount(g => Math.min(20, g + 1))}
                    className="w-7 h-7 rounded-full bg-[#0D6B60] flex items-center justify-center text-white font-bold text-[16px] hover:bg-[#0a5a51] transition-colors">+</button>
                </div>
              </div>
              {extendDate && extendDate > activeRoom.checkOut && (
                <div className="bg-[#F0FAF8] border border-[#C7EBE6] rounded-[10px] px-3 py-2 flex justify-between text-[13px]">
                  <span className="text-[#6B7280]">Доп. ночей</span>
                  <span className="font-black text-[#0D6B60]">
                    +{nights(activeRoom.checkOut, extendDate)} ноч. = {(parseInt(activeRoom.price.replace(/\s/g,'')) * nights(activeRoom.checkOut, extendDate)).toLocaleString('ru-RU')} сом
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2.5">
              <button onClick={() => { setModal(null); setExtendDate(''); }} className="btn-outline flex-1 py-3">Отмена</button>
              <button onClick={extendBooking} disabled={!extendDate || extendDate <= activeRoom.checkOut}
                className="btn-primary flex-1 py-3 flex items-center justify-center gap-1.5">
                <CalendarPlus size={16} /> Продлить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HISTORY MODAL ── */}
      {modal === 'history' && (
        <div className="modal-backdrop animate-scale">
          <div className="modal-box space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#B8963A] uppercase tracking-wider">История</p>
                <h3 className="font-display text-lg font-semibold text-[#0F0F0F]">{guestName || 'Гость'}</h3>
                {guestPhone && <p className="text-[11px] text-[#6B7280]">{guestPhone}</p>}
              </div>
              <button onClick={() => setModal(null)} className="text-[13px] text-[#6B7280] font-semibold hover:text-[#0F0F0F] border border-[#E8E4DF] px-3 py-1.5 rounded-lg">Закрыть</button>
            </div>
            <div className="divider" />
            {(() => {
              const myHistory = history.filter(item =>
                (guestPhone && item.phone === guestPhone) ||
                (guestName && item.guest === guestName) ||
                (!guestPhone && !guestName)
              );

              if (myHistory.length === 0) {
                return (
                  <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-2 text-center">
                    <Clock size={32} className="text-[#D8D3CC]" strokeWidth={1.5} />
                    <p className="text-[13px] text-[#A09A92] font-medium">История пуста</p>
                  </div>
                );
              }

              return (
                <>
                  <div className="overflow-y-auto flex-1 space-y-2 -mx-1 px-1" style={{ scrollbarWidth:'none' }}>
                    {myHistory.map((item, i) => (
                      <div key={item.id || i} className="bg-[#F6F4F1] rounded-[14px] p-3.5 space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="text-[13px] font-bold text-[#0F0F0F] leading-tight">{item.title}</p>
                            {item.roomNo && (
                              <p className="text-[11px] text-[#0D6B60] font-bold mt-0.5 flex items-center gap-1">
                                <Hash size={10} strokeWidth={2.5} /> Комната № {item.roomNo}
                              </p>
                            )}
                          </div>
                          <StatusBadge status={item.status} />
                        </div>
                        {item.type === 'booking' && (item.checkIn || item.checkOut) && (
                          <div className="flex gap-3 text-[11px] text-[#6B7280]">
                            <span>📅 {fmtDate(item.checkIn)}</span>
                            <span>→</span>
                            <span>{fmtDate(item.checkOut)}</span>
                            {nights(item.checkIn,item.checkOut) > 0 && <span>({nights(item.checkIn,item.checkOut)} н.)</span>}
                          </div>
                        )}
                        <div className="flex justify-between text-[11px] text-[#6B7280]">
                          <span>{item.date}</span>
                          <span className="font-semibold text-[#0F0F0F]">{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="divider" />
                  <button onClick={async () => {
                    if (!confirm('Очистить вашу историю?')) return;
                    const myIds = myHistory.map(h => h.id);
                    const updated = history.filter(h => !myIds.includes(h.id));
                    setHistory(updated);
                    try { localStorage.setItem('ak_history', JSON.stringify(updated)); } catch(e){}
                    if (myIds.length > 0) {
                      try { await supabase.from('orders').delete().in('id', myIds); } catch(e){}
                    }
                  }}
                    className="flex items-center gap-1.5 text-[12px] text-red-400 hover:text-red-600 font-semibold">
                    <Trash2 size={14} /> Очистить историю
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── SHARE ACCESS / SECOND DEVICE MODAL ── */}
      {showShareModal && (
        <div className="modal-backdrop animate-scale">
          <div className="modal-box space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#E0F4F1] text-[#0D6B60] flex items-center justify-center mx-auto shadow-inner">
              <Smartphone size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-xl font-bold text-[#0F0F0F]">Доступ для 2-го устройства</h3>
              <p className="text-[12.5px] text-[#6B7280]">
                Чтобы открыть управление номером № {showShareModal.roomNo} на смартфоне или планшете:
              </p>
            </div>

            <div className="bg-[#F6F4F1] border border-[#EDE9E3] p-4 rounded-[18px] space-y-2.5">
              <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Ваш 4-значный ПИН-код:</p>
              <div className="text-3xl font-black tracking-[8px] text-[#0D6B60] bg-white py-2.5 px-5 rounded-[14px] border border-[#C7EBE6] inline-block shadow-sm">
                {showShareModal.pin || '1234'}
              </div>
              <p className="text-[11.5px] text-[#6B7280] leading-snug">
                Введите этот ПИН-код на втором устройстве при входе по номеру <span className="font-bold text-[#0F0F0F]">{guestPhone}</span>
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button onClick={() => setShowShareModal(null)} className="btn-primary py-2.5 px-8 text-[13px]">
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── WEATHER & LAKE TEMP MODAL ── */}
      {showWeatherModal && (
        <div className="modal-backdrop animate-scale" onClick={() => setShowWeatherModal(false)}>
          <div className="modal-box space-y-4 text-center max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-[#E0F4F1] text-[#0D6B60] flex items-center justify-center mx-auto shadow-inner text-3xl">
              {weatherData.icon}
            </div>
            
            <div className="space-y-1">
              <h3 className="font-display text-xl font-bold text-[#0F0F0F]">Погода в Балыкчы & Иссык-Куле</h3>
              <p className="text-[12px] text-[#6B7280]">
                Точный прогноз погоды и температура озерной воды
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#F0FAF8] border border-[#C7EBE6] p-3.5 rounded-[16px] text-center space-y-1">
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Воздух в Балыкчы</p>
                <p className="text-2xl font-black text-[#0D6B60]">
                  {weatherData.temp > 0 ? `+${weatherData.temp}` : weatherData.temp}°C
                </p>
                <p className="text-[11px] font-semibold text-[#0F0F0F]">{weatherData.condition}</p>
              </div>

              <div className="bg-[#F0FAF8] border border-[#C7EBE6] p-3.5 rounded-[16px] text-center space-y-1">
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Вода Иссык-Куля</p>
                <p className="text-2xl font-black text-[#0D6B60]">
                  +{weatherData.waterTemp}°C
                </p>
                <p className="text-[11px] font-semibold text-[#0F0F0F]">🌊 Озерная вода</p>
              </div>
            </div>

            <div className="bg-[#F6F4F1] border border-[#EDE9E3] p-3.5 rounded-[16px] text-left space-y-2 text-[12px]">
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280] flex items-center gap-1.5"><Wind size={14} className="text-[#0D6B60]" /> Скорость ветра:</span>
                <span className="font-bold text-[#0F0F0F]">{weatherData.wind} м/с</span>
              </div>
              <div className="divider" />
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280] flex items-center gap-1.5"><Waves size={14} className="text-[#0D6B60]" /> Статус для купания:</span>
                <span className="font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded text-[11px]">
                  {weatherData.waterTemp >= 19 ? '🏊 Отлично для пляжа' : '⛵ Освежающе'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button onClick={() => setShowWeatherModal(false)} className="btn-primary w-full py-3 text-[13px]">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
