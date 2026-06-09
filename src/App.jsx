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

const defaultMembers = [
  { id: "1", name: "അബി" },
  { id: "2", name: "ദിലു" },
  { id: "3", name: "ഖാദർ" },
  { id: "4", name: "ഷാനു" },
  { id: "5", name: "അൽത്താഫ്" },
  { id: "6", name: "ബർകത്ത്" },
  { id: "7", name: "അജ്ഞാതൻ" },
  { id: "8", name: "റഹ്മാൻ" },
  { id: "9", name: "സപ്പി" },
  { id: "10", name: "മക്കു" },
];

const monthNames = [
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
];

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [payments, setPayments] = useState({});
  const [purchasers, setPurchasers] = useState({});
  const [ticketNumbers, setTicketNumbers] = useState({});
  const [activeView, setActiveView] = useState("dashboard");

  const [isAdmin, setIsAdmin] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinError, setPinError] = useState(false);

  // YOUR SECRET PIN TO EDIT THE APP
  const ADMIN_PIN = "6866";

  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const monthPayments = payments[monthKey] || {};
  const paidCount = Object.values(monthPayments).filter(Boolean).length;
  const totalCollected = paidCount * 50;
  const targetAmount = 500;
  const progressPercent = (totalCollected / targetAmount) * 100;
  const isGoalReached = totalCollected === targetAmount;

  const currentPurchaserId = purchasers[monthKey] || "";
  const currentTicketNumber = ticketNumbers[monthKey] || "";

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

  const saveToFirebase = (path, data) => {
    if (db) {
      set(ref(db, path), data);
    }
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
    saveToFirebase("payments", updatedPayments);
  };

  const handlePurchaserChange = (e) => {
    if (!isAdmin) {
      setShowPinModal(true);
      return;
    }
    const updatedPurchasers = { ...purchasers, [monthKey]: e.target.value };
    setPurchasers(updatedPurchasers);
    saveToFirebase("purchasers", updatedPurchasers);
  };

  const handleTicketNumberChange = (e) => {
    if (!isAdmin) {
      setShowPinModal(true);
      return;
    }
    const updatedTickets = { ...ticketNumbers, [monthKey]: e.target.value };
    setTicketNumbers(updatedTickets);
    saveToFirebase("ticketNumbers", updatedTickets);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAdmin(true);
      setShowPinModal(false);
      setPinInput("");
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
    }
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
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center text-slate-500">
          <CalendarDays className="w-16 h-16 mb-4 text-slate-300" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">
            ശൂന്യം... മഹാ ശൂന്യം! 🤷‍♂️
          </h2>
          <p className="text-sm">
            ആദ്യം വല്ലതും പിരിവിട്, എന്നിട്ട് ചരിത്രം അന്വേഷിക്കാം.
          </p>
        </div>
      );
    }

    return (
      <div className="px-6 py-6 pb-24">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
          പഴയ കഥകൾ 📜
        </h2>
        <div className="space-y-4">
          {sortedKeys.map((key) => {
            const [year, month] = key.split("-").map(Number);
            const pCount = Object.values(payments[key] || {}).filter(
              Boolean
            ).length;
            const collected = pCount * 50;
            const purchaser =
              defaultMembers.find((m) => m.id === purchasers[key])?.name ||
              "ആളില്ല";
            const tNumber = ticketNumbers[key] || "തന്നിട്ടില്ല";
            const purchaseMonthDisplay = `${monthNames[month]} ${year}`;

            return (
              <div
                key={key}
                onClick={() => {
                  setCurrentDate(new Date(year, month, 1));
                  setActiveView("dashboard");
                }}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-slate-800">
                    പിരിച്ചത്: {monthNames[month]}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
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
                        എടുത്ത മാസം:
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
                        എടുത്തവൻ :
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
                        ഭാഗ്യ നമ്പർ:
                      </span>
                    </div>
                    <span
                      className={
                        tNumber === "നൽകിയിട്ടില്ല"
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans sm:py-8">
      <div className="max-w-md mx-auto bg-slate-50 sm:bg-white sm:shadow-xl sm:border border-slate-100 sm:rounded-[2.5rem] overflow-hidden relative min-h-screen sm:min-h-0">
        {activeView === "dashboard" && (
          <div className="px-6 pt-8 pb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                കോടീശ്വരൻ പ്ലാൻ 💰
              </h1>
              <p className="text-emerald-600 font-semibold text-sm flex items-center gap-1 mt-1">
                <Users className="w-4 h-4" /> മാസപ്പടി പിരിവ്
              </p>
            </div>

            <button
              onClick={() =>
                isAdmin ? setIsAdmin(false) : setShowPinModal(true)
              }
              className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-bold transition-all ${
                isAdmin
                  ? "bg-amber-100 text-amber-700 border border-amber-300"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {isAdmin ? (
                <Unlock className="w-3 h-3" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
              {isAdmin ? "മുതലാളി മോഡ് 🕶️" : "കാഴ്ചക്കാരൻ 👁️"}
            </button>
          </div>
        )}

        {activeView === "history" ? (
          renderHistory()
        ) : (
          <div className="pb-24">
            <div className="px-6 mb-6">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-6 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden">
                <Award className="absolute -right-6 -bottom-6 w-32 h-32 text-emerald-500/20 rotate-12" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-lg font-bold tracking-wide">
                    {currentMonthName} {currentYear}
                  </h2>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative z-10 text-center mb-6">
                  <div className="text-5xl font-black mb-1 flex items-baseline justify-center gap-1">
                    {totalCollected}{" "}
                    <span className="text-xl font-medium text-emerald-200">
                      / 500
                    </span>
                  </div>
                  <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">
                    AED പോക്കറ്റിൽ എത്തി
                  </p>
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between text-xs font-semibold mb-2 text-emerald-100">
                    <span>{paidCount} അവന്മാർ കാശ് തന്നു</span>
                    <span>{10 - paidCount} പേർ മുങ്ങി നടക്കുന്നു</span>
                  </div>
                  <div className="h-3 w-full bg-emerald-900/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {isGoalReached && (
                  <div className="mt-5 bg-emerald-500/30 backdrop-blur-md border border-emerald-400/50 rounded-xl p-3 flex items-center justify-center gap-2 animate-pulse text-amber-300 font-bold text-sm">
                    <Ticket className="w-5 h-5" /> കാശ് സെറ്റ്! പോയി ടിക്കറ്റ്
                    എടുക്കെടാ! 🏃‍♂️
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 mb-6 space-y-3">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      ഇത്തവണത്തെ നീ എടുക്ക്🎯
                    </p>
                  </div>
                </div>
                <select
                  disabled={!isAdmin}
                  value={currentPurchaserId}
                  onChange={handlePurchaserChange}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[140px] disabled:opacity-60"
                >
                  <option value="">ഒരുത്തനെ പിടിക്ക്...</option>
                  {defaultMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      ലോട്ടറി നമ്പർ
                    </p>
                  </div>
                </div>
                <input
                  type="text"
                  disabled={!isAdmin}
                  placeholder={
                    isAdmin
                      ? "നമ്പർ അടിക്ക് ബ്രോ..."
                      : "കൈ വെക്കരുത്! ലോക്കാണ് 🔒"
                  }
                  value={currentTicketNumber}
                  onChange={handleTicketNumberChange}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-[140px] disabled:opacity-60 text-right"
                />
              </div>
            </div>

            <div className="px-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                ആരൊക്കെ കാശ് തന്നു? 🧐
              </h3>
              <div className="space-y-3">
                {defaultMembers.map((member) => {
                  const isPaid = monthPayments[member.id] || false;
                  const isPurchaser = currentPurchaserId === member.id;

                  return (
                    <button
                      key={member.id}
                      onClick={() => togglePayment(member.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 ${
                        isPaid
                          ? "bg-emerald-50 border border-emerald-200/50 shadow-sm"
                          : "bg-white border border-slate-100 shadow-sm hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-colors ${
                              isPaid
                                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {Array.from(member.name)[0]}
                          </div>
                          {isPurchaser && (
                            <div className="absolute -bottom-1 -right-1 bg-amber-400 p-1 rounded-full border-2 border-white shadow-sm">
                              <Ticket className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <p
                            className={`font-bold ${
                              isPaid ? "text-emerald-900" : "text-slate-700"
                            }`}
                          >
                            {member.name}
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              isPaid ? "text-emerald-600" : "text-slate-400"
                            }`}
                          >
                            50 AED
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {isPaid ? (
                          <CircleCheck className="w-8 h-8 text-emerald-500" />
                        ) : (
                          <Circle className="w-8 h-8 text-slate-300" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {showPinModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-900">
                  ആരാടാ നീ? 🤨
                </h3>
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setPinError(false);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                മുതലാളി ആണെങ്കിൽ രഹസ്യ നമ്പർ അടിക്ക്.
              </p>
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <input
                  type="password"
                  maxLength="4"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center tracking-widest text-2xl p-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs font-bold text-red-500 text-center">
                    അളിയാ.. നമ്പർ തെറ്റി! കള്ളനാണോ? 🚨
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white font-bold py-3 rounded-2xl hover:bg-emerald-700 transition-colors"
                >
                  തുറക്കടാ കുട്ടാ🚪
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="fixed sm:absolute bottom-0 w-full max-w-md bg-white border-t border-slate-200 flex justify-around p-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`flex flex-col items-center p-2 rounded-xl w-20 transition-colors ${
              activeView === "dashboard"
                ? "text-emerald-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              തറവാട്
            </span>
          </button>

          <button
            onClick={() => setActiveView("history")}
            className={`flex flex-col items-center p-2 rounded-xl w-20 transition-colors ${
              activeView === "history"
                ? "text-emerald-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <History className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              ചരിത്രം
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
