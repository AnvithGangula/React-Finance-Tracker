import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Trash2, 
  LayoutDashboard,
  ExternalLink,
  BarChart3,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
} from 'recharts';

const FinanceTracker = () => {
  // --- PERSISTENT STATE ---
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('pro_finance_data');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Q1 Bonus', amount: 5000, type: 'income', date: '2026-02-01' },
      { id: 2, text: 'Cloud Server', amount: -200, type: 'expense', date: '2026-02-05' }
    ];
  });

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('pro_finance_data', JSON.stringify(transactions));
  }, [transactions]);

  // --- LOGIC ---
  const totals = useMemo(() => {
    const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { balance: income - expense, income, expense };
  }, [transactions]);

  const chartData = [
    { name: 'Incoming', value: totals.income, color: '#818cf8' }, 
    { name: 'Outgoing', value: totals.expense, color: '#f472b6' }, 
  ];

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!text || !amount) return;
    const newTransaction = {
      id: Date.now(),
      text,
      amount: parseFloat(amount),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
    setTransactions([newTransaction, ...transactions]);
    setText('');
    setAmount('');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px]"></div>

      <div className="relative max-w-7xl mx-auto p-4 md:p-10">
        
        {/* TOP NAV BAR */}
        <nav className="flex items-center justify-between mb-12 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/40">
              <LayoutDashboard size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                FINANCE.OS
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Enterprise Analytics</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button className="hover:text-white transition-colors">Overview</button>
            <button className="hover:text-white transition-colors">Reports</button>
            <button className="hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-xl bg-white/5">
              Sisense Hub
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase">Secure</span>
            </div>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR: Stats & Add */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Main Wallet Card */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Wallet size={120} />
              </div>
              <p className="text-indigo-100/70 text-sm font-medium mb-1">Available Balance</p>
              <h2 className="text-5xl font-black text-white mb-8 tracking-tighter">
                ${totals.balance.toLocaleString()}
              </h2>
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] text-indigo-200/50 uppercase font-black tracking-widest">Active Account</p>
                  <p className="text-white font-mono tracking-widest text-sm">**** **** 2026</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                  <TrendingUp className="text-white" size={24} />
                </div>
              </div>
            </div>

            {/* Quick Add Section */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem]">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <PlusCircle size={18} className="text-indigo-400" /> New Transaction
              </h3>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <input 
                  type="text" 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Expense name"
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                />
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount (+/-)"
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                />
                <button className="w-full py-4 bg-white text-indigo-900 font-black rounded-2xl hover:bg-indigo-50 transition-all active:scale-95 shadow-xl">
                  Process Entry
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT CONTENT: Sisense & History */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* SISENSE BOX - The "Hero" of the dashboard */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/20 rounded-xl">
                    <ExternalLink size={18} className="text-pink-400" />
                  </div>
                  <h3 className="font-bold text-lg text-white">Sisense Intelligence Portal</h3>
                </div>
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
              </div>
              <div className="h-[450px] w-full bg-slate-900/40 relative">
                {/* Sisense Iframe */}
                <iframe
                  src='https://dvk.sisense.com/app/main/dashboards/698079e9af3ed9fbefdba277?embed=true'
                  className="w-full h-full border-none opacity-100"
                  title="Sisense Dashboard"
                />
                {/* Decorative overlay for "Good looks" */}
                <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-b-[2.5rem]"></div>
              </div>
            </div>

            {/* Bottom Row: History and Small Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Transaction List */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2.5rem] max-h-[400px] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Calendar size={18} className="text-indigo-400" /> Recent
                  </h3>
                  <span className="text-[10px] font-black text-slate-500 uppercase">Live Feed</span>
                </div>
                <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-indigo-500/20">
                  {transactions.map(t => (
                    <div key={t.id} className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.amount > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-pink-500/20 text-pink-400'}`}>
                          {t.amount > 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{t.text}</p>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{t.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-mono font-bold ${t.amount > 0 ? 'text-emerald-400' : 'text-pink-400'}`}>
                          {t.amount > 0 ? '+' : '-'}${Math.abs(t.amount)}
                        </span>
                        <button onClick={() => deleteTransaction(t.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Chart Analytics */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2.5rem]">
                 <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-white">Flow Ratio</h3>
                  <BarChart3 size={18} className="text-indigo-400" />
                </div>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" hide />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '15px', color: '#fff'}}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      />
                      <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={50}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-between px-2">
                   <div className="text-center">
                      <p className="text-[10px] text-slate-500 font-black uppercase">Incoming</p>
                      <p className="text-lg font-bold text-indigo-400">${totals.income}</p>
                   </div>
                   <div className="text-center">
                      <p className="text-[10px] text-slate-500 font-black uppercase">Outgoing</p>
                      <p className="text-lg font-bold text-pink-400">${totals.expense}</p>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Styles for Scrollbar */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default FinanceTracker;