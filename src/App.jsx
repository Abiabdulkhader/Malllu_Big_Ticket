import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Circle,
  Ticket,
  Users,
  X,
  Award,
  History,
  Home,
  Hash,
  CalendarDays,
  CalendarCheck,
  Lock,
  Unlock,
  MessageCircle,
  Bell,
  Globe,
  CheckCircle2,
} from "lucide-react";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Your exact Firebase keys
const firebaseConfig = {
  apiKey: "AIzaSyABFB2sfHwoaw4qiTNoqtOq5oWTvZPw32k",
  authDomain: "big-ticket-b0a81.firebaseapp.com",
  databaseURL: "https://big-ticket-b0a81-default-rtdb.firebaseio.com",
  projectId: "big-ticket-b0a81",
  storageBucket: "big-ticket-b0a81.firebasestorage.app",
  messagingSenderId: "669211062312",
  appId: "1:669211062312:web:45569b707aee6a628b451d",
};

let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

// Added English names
const defaultMembers = [
  { id: "1", name: "അബി", enName: "Abi" },
  { id: "2", name: "ദിലു", enName: "Dilu" },
  { id: "3", name: "ഖാദർ", enName: "Khader" },
  { id: "4", name: "ഷാനു", enName: "Shanu" },
  { id: "5", name: "അൽത്താഫ്", enName: "Althaf" },
  { id: "6", name: "ബർകത്ത്", enName: "Barkath" },
  { id: "7", name: "അജ്ഞാതൻ", enName: "Secret Guy" },
  { id: "8", name: "റഹ്മാൻ", enName: "Rahman" },
  { id: "9", name: "സപ്പി", enName: "Sappi" },
  { id: "10", name: "മക്കു", enName: "Makku" },
];

const monthNames = {
  ML: [
    "ജനുവരി",
    "ഫെബ്രുവരി",
    "മാർച്ച്",
    "ഏപ്രിൽ",
    "മെയ്",
    "ജൂൺ",
    "ജൂലൈ",
    "ഓഗസ്റ്റ്",
    "സെപ്റ്റംബർ",
    "ഒക്ടോബർ",
    "നവംബർ",
    "ഡിസംബർ",
  ],
  EN: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

// TRANSLATION DICTIONARY
const T = {
  ML: {
    appTitle: "കോടീശ്വരൻ പ്ലാൻ 💰",
    subtitle: "മാസപ്പടി പിരിവ്",
    bossMode: "മുതലാളി മോഡ് 🕶️",
    viewerMode: "കാഴ്ചക്കാരൻ 👁️",
    collected: "AED കിട്ടി",
    paidText: (c) => (c === 1 ? "ഒരാൾ കാശ് തന്നു" : `${c} പേർ കാശ് തന്നു`),
    unpaidText: (c) =>
      c === 1 ? "ഒരുത്തൻ മുങ്ങി നടക്കുന്നു" : `${c} പേർ മുങ്ങി നടക്കുന്നു`,
    goalReached: "കാശ് സെറ്റ്! വേഗം ടിക്കറ്റ് എടുക്കെടാ! 🏃‍♂️",
    ticketBuyer: "ഇത്തവണ ടിക്കറ്റ് എടുക്കുന്നത് 🎯",
    buyerPlaceholder: "ആരാ ?",
    lotteryNumber: "ലോട്ടറി നമ്പർ",
    numberPlaceholderAdmin: "നമ്പർ അടിക്ക് ബ്രോ...",
    numberPlaceholderViewer: "കൈ വെക്കരുത്! ലോക്കാണ് 🔒",
    whoPaidTitle: "ആരൊക്കെ കാശ് തന്നു? 🧐",
    peopleCount: (c) => `${c}/10 പേർ`,
    shareStatus: "സ്റ്റാറ്റസ് ഇടുക 📲",
    sendReminder: "ഓർമ്മിപ്പിക്കുക 📢",
    modalTitle: "ആരാടാ നീ? 🤨",
    modalDesc: "മുതലാളി ആണെങ്കിൽ രഹസ്യ നമ്പർ അടിക്ക്.",
    pinPlaceholder: "••••",
    pinError: "അളിയാ.. നമ്പർ തെറ്റി! കള്ളനാണോ? 🚨",
    unlockBtn: "തുറക്കടാ കുട്ടാ🚪",
    navHome: "തറവാട്",
    navHistory: "ചരിത്രം",
    emptyHistoryTitle: "ശൂന്യം... മഹാ ശൂന്യം! 🤷‍♂️",
    emptyHistoryDesc: "ആദ്യം വല്ലതും പിരിവിട്, എന്നിട്ട് ചരിത്രം അന്വേഷിക്കാം.",
    historyTitle: "പഴയ കഥകൾ 📜",
    historyCollectedTitle: "പിരിച്ചത്:",
    historyMonthTaken: "എടുത്ത മാസം:",
    historyBuyer: "എടുത്തവൻ :",
    historyLotteryNum: "ഭാഗ്യ നമ്പർ:",
    noOne: "ആരുമില്ല",
    notTaken: "എടുത്തിട്ടില്ല",
    nobodyPaid: "ആരും തന്നിട്ടില്ല",
    everybodyPaid: "ആരുമില്ല, എല്ലാവരും സെറ്റ്!",
    waShareLine1: "കോടീശ്വരൻ പ്ലാൻ:",
    waShareLine2: "പിരിവ്:",
    waShareLine3: "ടിക്കറ്റ് എടുക്കുന്നത്:",
    waShareLine4: "ലോട്ടറി നമ്പർ:",
    waShareLine5: "കാശ് തന്നവർ:",
    waShareLine6: "മുങ്ങി നടക്കുന്നവർ:",
    waRemLine1: "കോടീശ്വരൻ പ്ലാൻ",
    waRemLine2: "ഈ മാസത്തെ പിരിവിനുള്ള സമയം ആയതായി അറിയിക്കുന്നു",
    saved: "സെറ്റ്'സെറ്റ്.. !",
  },
  EN: {
    appTitle: "Millionaire Plan 💰",
    subtitle: "Monthly Collection",
    bossMode: "Boss Mode 🕶️",
    viewerMode: "Viewer Mode 👁️",
    collected: "AED Collected",
    paidText: (c) => (c === 1 ? "1 Person Paid" : `${c} People Paid`),
    unpaidText: (c) =>
      c === 1 ? "1 Person Absconding" : `${c} People Absconding`,
    goalReached: "Cash Ready! Go buy the ticket! 🏃‍♂️",
    ticketBuyer: "Buying ticket this month 🎯",
    buyerPlaceholder: "Select someone...",
    lotteryNumber: "Lottery Number",
    numberPlaceholderAdmin: "Enter number bro...",
    numberPlaceholderViewer: "Don't touch! Locked 🔒",
    whoPaidTitle: "Who all paid? 🧐",
    peopleCount: (c) => `${c}/10 People`,
    shareStatus: "Share Status 📲",
    sendReminder: "Send Reminder 📢",
    modalTitle: "Who are you? 🤨",
    modalDesc: "Enter the secret PIN if you are the boss.",
    pinPlaceholder: "••••",
    pinError: "Bro.. Wrong PIN! Are you a thief? 🚨",
    unlockBtn: "Open Sesame 🚪",
    navHome: "Home",
    navHistory: "History",
    emptyHistoryTitle: "Empty... completely empty! 🤷‍♂️",
    emptyHistoryDesc: "Collect some funds first, then look for history.",
    historyTitle: "Past Stories 📜",
    historyCollectedTitle: "Collected:",
    historyMonthTaken: "Month Taken:",
    historyBuyer: "Buyer :",
    historyLotteryNum: "Lucky Number:",
    noOne: "No one",
    notTaken: "Not updated",
    nobodyPaid: "Nobody paid yet",
    everybodyPaid: "No one, everyone is set!",
    waShareLine1: "Millionaire Plan:",
    waShareLine2: "Collection:",
    waShareLine3: "Ticket Buyer:",
    waShareLine4: "Lottery Number:",
    waShareLine5: "Paid Members:",
    waShareLine6: "Absconding:",
    waRemLine1: "Millionaire Plan",
    waRemLine2: "Time for this month's collection has arrived",
    saved: "Saved Successfully!",
  },
};

const EMOJI = {
  moneyBag: String.fromCodePoint(0x1f4b0),
  cash: String.fromCodePoint(0x1f4b5),
  user: String.fromCodePoint(0x1f464),
  ticket: String.fromCodePoint(0x1f3ab),
  check: String.fromCodePoint(0x2705),
  alert: String.fromCodePoint(0x1f6a8),
  party: String.fromCodePoint(0x1f389),
  speaker: String.fromCodePoint(0x1f4e2),
  flyingMoney: String.fromCodePoint(0x1f4b8),
  runner: String.fromCodePoint(0x1f3c3),
};

export default function App() {
  const [lang, setLang] = useState("ML");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [payments, setPayments] = useState({});
  const [purchasers, setPurchasers] = useState({});
  const [ticketNumbers, setTicketNumbers] = useState({});

  // Animation states
  const [activeView, setActiveView] = useState("dashboard");
  const [isViewFading, setIsViewFading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const [isAdmin, setIsAdmin] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinError, setPinError] = useState(false);

  const ADMIN_PIN = "6866";

  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  const currentMonthName = monthNames[lang][currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const monthPayments = payments[monthKey] || {};
  const paidCount = Object.values(monthPayments).filter(Boolean).length;
  const unpaidCount = 10 - paidCount;
  const totalCollected = paidCount * 50;
  const targetAmount = 500;
  const progressPercent = (totalCollected / targetAmount) * 100;
  const isGoalReached = totalCollected === targetAmount;

  const progressHue = Math.max(0, (progressPercent / 100) * 120);

  const currentPurchaserId = purchasers[monthKey] || "";
  const currentTicketNumber = ticketNumbers[monthKey] || "";

  const getMemberName = (member) =>
    lang === "ML" ? member.name : member.enName;

  useEffect(() => {
    if (!db) return;

    const paymentsRef = ref(db, "payments");
    onValue(paymentsRef, (snapshot) => {
      if (snapshot.exists()) setPayments(snapshot.val());
    });

    const purchasersRef = ref(db, "purchasers");
    onValue(purchasersRef, (snapshot) => {
      if (snapshot.exists()) setPurchasers(snapshot.val());
    });

    const ticketsRef = ref(db, "ticketNumbers");
    onValue(ticketsRef, (snapshot) => {
      if (snapshot.exists()) setTicketNumbers(snapshot.val());
    });
  }, []);

  // TOAST NOTIFICATION FUNCTION
  const showToast = (message) => {
    setToast({ show: true, msg: message });
    setTimeout(() => {
      setToast({ show: false, msg: "" });
    }, 2500);
  };

  const saveToFirebase = (path, data, triggerToast = false) => {
    if (db) {
      set(ref(db, path), data).then(() => {
        if (triggerToast) showToast(T[lang].saved);
      });
    }
  };

  // SMOOTH VIEW TRANSITION FUNCTION
  const changeView = (newView) => {
    if (newView === activeView) return;
    setIsViewFading(true);
    setTimeout(() => {
      setActiveView(newView);
      setIsViewFading(false);
    }, 200); // 200ms fade out
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const togglePayment = (memberId) => {
    if (!isAdmin) {
      setShowPinModal(true);
      return;
    }
    const updatedMonthPayments = {
      ...monthPayments,
      [memberId]: !monthPayments[memberId],
    };
    const updatedPayments = { ...payments, [monthKey]: updatedMonthPayments };
    setPayments(updatedPayments);
    // Don't trigger toast for every click as it gets annoying, but we save it.
    saveToFirebase("payments", updatedPayments, true);
  };

  const handlePurchaserChange = (e) => {
    if (!isAdmin) {
      setShowPinModal(true);
      return;
    }
    const updatedPurchasers = { ...purchasers, [monthKey]: e.target.value };
    setPurchasers(updatedPurchasers);
    saveToFirebase("purchasers", updatedPurchasers, true);
  };

  const handleTicketNumberChange = (e) => {
    if (!isAdmin) {
      setShowPinModal(true);
      return;
    }
    const updatedTickets = { ...ticketNumbers, [monthKey]: e.target.value };
    setTicketNumbers(updatedTickets);
    // Notice we don't trigger toast on every keystroke here to avoid spamming
    saveToFirebase("ticketNumbers", updatedTickets);
  };

  // Trigger toast on blur for text input (when they finish typing)
  const handleTicketNumberBlur = () => {
    if (isAdmin) showToast(T[lang].saved);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAdmin(true);
      setShowPinModal(false);
      setPinInput("");
      setPinError(false);
      showToast(lang === "ML" ? "മുതലാളി എത്തി! 🕶️" : "Boss Unlocked! 🕶️");
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const handleWhatsAppShare = () => {
    const paidNames = defaultMembers
      .filter((m) => monthPayments[m.id])
      .map((m) => getMemberName(m))
      .join(", ");
    const unpaidNames = defaultMembers
      .filter((m) => !monthPayments[m.id])
      .map((m) => getMemberName(m))
      .join(", ");
    const purchaser = defaultMembers.find((m) => m.id === currentPurchaserId);
    const purchaserName = purchaser ? getMemberName(purchaser) : T[lang].noOne;
    const tNumber = currentTicketNumber || T[lang].notTaken;

    const t1 = encodeURIComponent(
      `*${T[lang].waShareLine1} ${currentMonthName} ${currentYear}*`
    );
    const t2 = encodeURIComponent(
      `*${T[lang].waShareLine2}* ${totalCollected}/500 AED`
    );
    const t3 = encodeURIComponent(`*${T[lang].waShareLine3}* ${purchaserName}`);
    const t4 = encodeURIComponent(`*${T[lang].waShareLine4}* ${tNumber}`);
    const t5 = encodeURIComponent(
      `*${T[lang].waShareLine5}*\n${paidNames || T[lang].nobodyPaid} `
    );
    const t6 = encodeURIComponent(
      `*${T[lang].waShareLine6}*\n${
        unpaidNames || `${T[lang].everybodyPaid} `
      } `
    );

    const finalMessage =
      `${EMOJI.moneyBag} ${t1} ${EMOJI.moneyBag}%0A%0A` +
      `${EMOJI.cash} ${t2}%0A` +
      `${EMOJI.user} ${t3}%0A` +
      `${EMOJI.ticket} ${t4}%0A%0A` +
      `${EMOJI.check} ${t5}${paidNames ? "" : EMOJI.tearSmile}%0A%0A` +
      `${EMOJI.alert} ${t6}${unpaidNames ? "" : EMOJI.party}`;

    window.open(`https://wa.me/?text=${finalMessage}`, "_blank");
  };

  const handleWhatsAppReminder = () => {
    const t1 = encodeURIComponent(`*${T[lang].waRemLine1}*`);
    const t2 = encodeURIComponent(`${T[lang].waRemLine2} `);

    const finalMessage =
      `${EMOJI.speaker} ${t1} ${EMOJI.moneyBag}%0A%0A` +
      `${t2}${EMOJI.flyingMoney}${EMOJI.runner}`;

    window.open(`https://wa.me/?text=${finalMessage}`, "_blank");
  };

  const renderHistory = () => {
    const allKeys = new Set([
      ...Object.keys(payments),
      ...Object.keys(purchasers),
      ...Object.keys(ticketNumbers),
    ]);

    const sortedKeys = Array.from(allKeys).sort((a, b) => {
      const [yA, mA] = a.split("-").map(Number);
      const [yB, mB] = b.split("-").map(Number);
      return new Date(yB, mB) - new Date(yA, mA);
    });

    if (sortedKeys.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center text-slate-500 animate-in fade-in duration-500">
          <CalendarDays className="w-16 h-16 mb-4 text-slate-300 animate-pulse" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">
            {T[lang].emptyHistoryTitle}
          </h2>
          <p className="text-sm">{T[lang].emptyHistoryDesc}</p>
        </div>
      );
    }

    return (
      <div className="px-6 py-6 pb-24">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
          {T[lang].historyTitle}
        </h2>
        <div className="space-y-4">
          {sortedKeys.map((key, index) => {
            const [year, month] = key.split("-").map(Number);
            const pCount = Object.values(payments[key] || {}).filter(
              Boolean
            ).length;
            const collected = pCount * 50;
            const purchaserInfo = defaultMembers.find(
              (m) => m.id === purchasers[key]
            );
            const purchaser = purchaserInfo
              ? getMemberName(purchaserInfo)
              : T[lang].noOne;
            const tNumber = ticketNumbers[key] || T[lang].notTaken;
            const purchaseMonthDisplay = `${monthNames[lang][month]} ${year}`;

            return (
              <div
                key={key}
                onClick={() => {
                  setCurrentDate(new Date(year, month, 1));
                  changeView("dashboard");
                }}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-emerald-300 hover:shadow-md animate-in slide-in-from-bottom-4 fade-in"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-slate-800">
                    {T[lang].historyCollectedTitle} {monthNames[lang][month]}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      collected === targetAmount
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {collected} / {targetAmount} AED
                  </span>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarCheck className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-slate-700">
                        {T[lang].historyMonthTaken}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded">
                      {purchaseMonthDisplay}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-700">
                        {T[lang].historyBuyer}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-800">
                      {purchaser}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Hash className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-700">
                        {T[lang].historyLotteryNum}
                      </span>
                    </div>
                    <span
                      className={
                        tNumber === T[lang].notTaken
                          ? "text-xs text-slate-400 italic"
                          : "text-sm text-slate-800 font-mono font-bold"
                      }
                    >
                      {tNumber}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans sm:py-8 selection:bg-emerald-200">
      <div className="w-full sm:max-w-md mx-auto bg-slate-50 sm:bg-white sm:shadow-2xl sm:shadow-emerald-900/5 sm:border border-slate-100 sm:rounded-[2.5rem] overflow-hidden relative min-h-screen sm:min-h-0">
        {/* MODERN HEADER SECTION */}
        {activeView === "dashboard" && (
          <div className="px-6 pt-8 pb-6 flex items-start justify-between relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-100/50 to-transparent -z-10"></div>

            <div className="flex flex-col gap-2 relative z-10 w-full">
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 tracking-tight drop-shadow-sm pb-1">
                {T[lang].appTitle}
              </h1>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-sm text-xs font-bold text-slate-600 flex items-center gap-1.5 hover:scale-105 transition-transform">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />{" "}
                    {T[lang].subtitle}
                  </span>

                  {/* LANGUAGE SWITCH BUTTON */}
                  <button
                    onClick={() => setLang(lang === "ML" ? "EN" : "ML")}
                    className="bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-sm text-xs font-bold text-emerald-600 flex items-center gap-1.5 hover:bg-emerald-50 active:scale-95 transition-all"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-500" />{" "}
                    {lang === "ML" ? "EN" : "ML"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN TOGGLE SECTION */}
        {activeView === "dashboard" && (
          <div className="px-6 pb-4 animate-in fade-in duration-500">
            <button
              onClick={() =>
                isAdmin ? setIsAdmin(false) : setShowPinModal(true)
              }
              className={`px-4 py-2.5 rounded-2xl flex items-center gap-1.5 text-xs font-extrabold transition-all duration-300 shadow-sm active:scale-95 relative z-10 ${
                isAdmin
                  ? "bg-gradient-to-br from-amber-100 to-orange-100 text-amber-800 border border-amber-200/60 shadow-amber-500/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-md"
              }`}
            >
              {isAdmin ? (
                <Unlock className="w-4 h-4 animate-in zoom-in spin-in-12 duration-300" />
              ) : (
                <Lock className="w-4 h-4 text-slate-400" />
              )}
              {isAdmin ? T[lang].bossMode : T[lang].viewerMode}
            </button>
          </div>
        )}

        {/* MAIN CONTENT AREA WITH SMOOTH FADE TRANSITION */}
        <div
          className={`transition-opacity duration-200 ${
            isViewFading ? "opacity-0" : "opacity-100"
          }`}
        >
          {activeView === "history" ? (
            renderHistory()
          ) : (
            <div className="pb-32">
              {/* DYNAMIC DASHBOARD CARD WITH HOVER EFFECT */}
              <div className="px-6 mb-6">
                <div
                  className="rounded-3xl p-6 text-white shadow-xl relative overflow-hidden transition-all duration-700 ease-out border border-white/20 hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, hsl(${progressHue}, 75%, 45%), hsl(${progressHue}, 90%, 25%))`,
                    boxShadow: `0 20px 25px -5px hsla(${progressHue}, 80%, 30%, 0.4)`,
                  }}
                >
                  <Award className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 rotate-12 transition-transform duration-700 hover:rotate-[24deg] hover:scale-110" />

                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <button
                      onClick={handlePrevMonth}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm active:scale-90"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <h2 className="text-lg font-bold tracking-wide drop-shadow-md text-white animate-in slide-in-from-top-2 fade-in">
                      {currentMonthName} {currentYear}
                    </h2>
                    <button
                      onClick={handleNextMonth}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm active:scale-90"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  <div className="relative z-10 text-center mb-6">
                    <div className="text-5xl font-black mb-1 flex items-baseline justify-center gap-1 drop-shadow-lg text-white">
                      <span className="animate-in zoom-in duration-500 delay-150 fill-mode-both">
                        {totalCollected}
                      </span>
                      <span className="text-xl font-medium text-white/80">
                        / 500
                      </span>
                    </div>
                    <p className="text-white/80 text-sm font-bold uppercase tracking-wider">
                      {T[lang].collected}
                    </p>
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between text-xs font-semibold mb-2 text-white/90 drop-shadow-sm">
                      <span>{T[lang].paidText(paidCount)}</span>
                      <span>{T[lang].unpaidText(unpaidCount)}</span>
                    </div>

                    <div className="h-3 w-full bg-black/25 rounded-full overflow-hidden backdrop-blur-md shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-amber-300 to-amber-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {isGoalReached && (
                    <div className="mt-5 bg-white/20 backdrop-blur-md border border-white/40 rounded-2xl p-3 flex items-center justify-center gap-2 animate-bounce text-white font-black text-sm shadow-lg">
                      <Ticket className="w-5 h-5" /> {T[lang].goalReached}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 mb-6 space-y-3 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-100 fill-mode-both">
                <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4 transition-all hover:shadow-md hover:border-emerald-100 group">
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 flex items-center justify-center shadow-inner border border-amber-200/50 group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-slate-800">
                        {T[lang].ticketBuyer}
                      </p>
                    </div>
                  </div>
                  <select
                    disabled={!isAdmin}
                    value={currentPurchaserId}
                    onChange={handlePurchaserChange}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[140px] disabled:opacity-60 cursor-pointer shadow-sm transition-all"
                  >
                    <option value="">{T[lang].buyerPlaceholder}</option>
                    {defaultMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {getMemberName(m)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4 transition-all hover:shadow-md hover:border-blue-100 group">
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 flex items-center justify-center shadow-inner border border-blue-200/50 group-hover:scale-110 transition-transform">
                      <Hash className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-slate-800">
                        {T[lang].lotteryNumber}
                      </p>
                    </div>
                  </div>
                  <input
                    type="text"
                    disabled={!isAdmin}
                    placeholder={
                      isAdmin
                        ? T[lang].numberPlaceholderAdmin
                        : T[lang].numberPlaceholderViewer
                    }
                    value={currentTicketNumber}
                    onChange={handleTicketNumberChange}
                    onBlur={handleTicketNumberBlur}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 w-[140px] disabled:opacity-60 text-right shadow-sm transition-all"
                  />
                </div>
              </div>

              <div className="px-6 mb-6 animate-in slide-in-from-bottom-8 fade-in duration-500 delay-200 fill-mode-both">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-slate-800">
                    {T[lang].whoPaidTitle}
                  </h3>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/50 px-2 py-1 rounded-lg">
                    {T[lang].peopleCount(paidCount)}
                  </span>
                </div>
                <div className="space-y-3">
                  {defaultMembers.map((member, idx) => {
                    const isPaid = monthPayments[member.id] || false;
                    const isPurchaser = currentPurchaserId === member.id;

                    return (
                      <button
                        key={member.id}
                        onClick={() => togglePayment(member.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-3xl transition-all duration-300 active:scale-95 hover:scale-[1.01] ${
                          isPaid
                            ? "bg-gradient-to-r from-emerald-50 to-white border border-emerald-200/70 shadow-sm"
                            : "bg-white border border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black transition-all duration-500 ${
                                isPaid
                                  ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105"
                                  : "bg-slate-100 text-slate-400 scale-100"
                              }`}
                            >
                              {Array.from(getMemberName(member))[0]}
                            </div>
                            {isPurchaser && (
                              <div className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-br from-amber-300 to-amber-500 p-1.5 rounded-xl border-2 border-white shadow-sm transform rotate-12 animate-in zoom-in duration-300">
                                <Ticket className="w-3.5 h-3.5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="text-left">
                            <p
                              className={`text-base font-extrabold transition-colors duration-300 ${
                                isPaid ? "text-emerald-950" : "text-slate-700"
                              }`}
                            >
                              {getMemberName(member)}
                            </p>
                            <p
                              className={`text-sm font-bold transition-colors duration-300 ${
                                isPaid ? "text-emerald-600" : "text-slate-400"
                              }`}
                            >
                              50 AED
                            </p>
                          </div>
                        </div>

                        {/* ANIMATED CHECKMARK */}
                        <div className="flex-shrink-0">
                          {isPaid ? (
                            <CircleCheck className="w-8 h-8 text-emerald-500 drop-shadow-sm animate-in zoom-in spin-in-12 duration-300" />
                          ) : (
                            <Circle className="w-8 h-8 text-slate-200 transition-colors" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* WHATSAPP ACTION BUTTONS - SIDE BY SIDE */}
              <div className="px-6 mb-8 flex flex-row gap-3 animate-in slide-in-from-bottom-10 fade-in duration-500 delay-300 fill-mode-both">
                <button
                  onClick={handleWhatsAppShare}
                  className="flex-1 bg-[#25D366] text-white font-extrabold py-3 px-2 rounded-[1.25rem] hover:bg-[#128C7E] transition-all duration-200 shadow-lg shadow-[#25D366]/30 active:scale-90 hover:-translate-y-1 flex flex-col items-center justify-center gap-1.5 text-[11px] sm:text-xs text-center leading-tight group"
                >
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {T[lang].shareStatus}
                </button>

                <button
                  onClick={handleWhatsAppReminder}
                  className="flex-1 bg-amber-500 text-white font-extrabold py-3 px-2 rounded-[1.25rem] hover:bg-amber-600 transition-all duration-200 shadow-lg shadow-amber-500/30 active:scale-90 hover:-translate-y-1 flex flex-col items-center justify-center gap-1.5 text-[11px] sm:text-xs text-center leading-tight group"
                >
                  <Bell className="w-5 h-5 group-hover:scale-110 transition-transform group-hover:rotate-12" />
                  {T[lang].sendReminder}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SLIDE-UP TOAST NOTIFICATION */}
        <div
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
            toast.show
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95 pointer-events-none"
          }`}
        >
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm tracking-wide">{toast.msg}</span>
          </div>
        </div>

        {showPinModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2rem] p-7 w-full max-w-xs shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-black text-xl text-slate-900">
                  {T[lang].modalTitle}
                </h3>
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setPinError(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-6">
                {T[lang].modalDesc}
              </p>
              <form onSubmit={handlePinSubmit} className="space-y-5">
                <div>
                  <input
                    type="password"
                    maxLength="4"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder={T[lang].pinPlaceholder}
                    className="w-full text-center tracking-[0.5em] text-3xl p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-inner"
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-xs font-bold text-red-500 text-center mt-3 bg-red-50 py-1.5 rounded-lg border border-red-100 animate-in slide-in-from-top-2">
                      {T[lang].pinError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black py-4 rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/30 active:scale-95 text-sm"
                >
                  {T[lang].unlockBtn}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION BAR */}
        <div className="fixed sm:absolute bottom-0 w-full sm:max-w-md bg-white/80 backdrop-blur-xl border-t border-slate-100 flex justify-around p-3 pb-safe shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] z-40">
          <button
            onClick={() => changeView("dashboard")}
            className={`flex flex-col items-center p-2 rounded-2xl w-24 transition-all duration-300 ${
              activeView === "dashboard"
                ? "text-emerald-600 bg-emerald-50 scale-110"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Home
              className={`w-6 h-6 mb-1 transition-all ${
                activeView === "dashboard"
                  ? "stroke-[2.5px] scale-110"
                  : "stroke-2"
              }`}
            />
            <span className="text-[10px] font-extrabold uppercase tracking-widest">
              {T[lang].navHome}
            </span>
          </button>

          <button
            onClick={() => changeView("history")}
            className={`flex flex-col items-center p-2 rounded-2xl w-24 transition-all duration-300 ${
              activeView === "history"
                ? "text-emerald-600 bg-emerald-50 scale-110"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            <History
              className={`w-6 h-6 mb-1 transition-all ${
                activeView === "history"
                  ? "stroke-[2.5px] scale-110"
                  : "stroke-2"
              }`}
            />
            <span className="text-[10px] font-extrabold uppercase tracking-widest">
              {T[lang].navHistory}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
