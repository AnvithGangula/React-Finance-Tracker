import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusCircle, Wallet, 
  Trash2, LayoutDashboard, ExternalLink, 
  BarChart3, Calendar, ShieldCheck, Mail, 
  Lock, User, ArrowRight, Eye, EyeOff, LogOut 
} from 'lucide-react';
import { 
  BarChart, Bar, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

// --- SECURE AUTHENTICATION PORTAL ---
const AuthPortal = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleAction = (e) => {
    e.preventDefault();
    setError('');
    
    // Get existing users from "database"
    const users = JSON.parse(localStorage.getItem('fos_users') || '[]');

    if (isLogin) {
      // LOGIN LOGIC
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        onAuthSuccess(user);
      } else {
        setError('Invalid enterprise credentials.');
      }
    } else {
      // SIGNUP LOGIC
      if (users.find(u => u.email === formData.email)) {
        setError('User already exists in system.');
        return;
      }
      const newUser = { ...formData, id: Date.now() };
      users.push(newUser);
      localStorage.setItem('fos_users', JSON.stringify(users));
      onAuthSuccess(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-6 relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px]"></div>

      <div className="relative w-full max-w-md scale-95 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-3xl shadow-2xl mb-4 rotate-3">
            <LayoutDashboard size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white italic">FINANCE<span className="text-indigo-500">.OS</span></h1>
          <div className="flex items-center gap-2 mt-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Military Grade Encryption</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Access Portal' : 'Initialize Mode'}</h2>
          <p className="text-slate-500 text-sm mb-8">{isLogin ? 'Provide keys to decrypt your dashboard.' : 'Register your identity on the secure ledger.'}</p>
          
          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold animate-bounce">{error}</div>}

          <form onSubmit={handleAction} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input required type="text" placeholder="Legal Name" className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500/50 transition-all" 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            )}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input required type="email" placeholder="Corporate Email" className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500/50 transition-all" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input required type={showPassword ? "text" : "password"} placeholder="Secret Key" className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white outline-none focus:border-indigo-500/50 transition-all" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 mt-6">
              {isLogin ? 'Decrypt & Enter' : 'Secure Registration'} <ArrowRight size={20} />
            </button>
          </form>
        </div>
        <p className="text-center mt-10 text-sm text-slate-500">
          {isLogin ? "Unauthorized user?" : "Existing operative?"} 
          <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-400 font-black hover:text-indigo-300 ml-2 uppercase tracking-tighter underline underline-offset-4">{isLogin ? 'Request Access' : 'Return to Login'}</button>
        </p>
      </div>
    </div>
  );
};

// --- SECURE DASHBOARD ---
const SecureDashboard = ({ user, onLogout }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(`fos_data_${user.email}`);
    return saved ? JSON.parse(saved) : [{ id: 1, text: 'System Grant', amount: 10000, date: 'Feb 16' }];
  });
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    localStorage.setItem(`fos_data_${user.email}`, JSON.stringify(transactions));
  }, [transactions, user.email]);

  const totals = useMemo(() => {
    const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { balance: income - expense, income, expense };
  }, [transactions]);

  const chartData = [
    { name: 'In', value: totals.income, color: '#6366f1' },
    { name: 'Out', value: totals.expense, color: '#ec4899' }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-12 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20"><LayoutDashboard size={28} className="text-white" /></div>
            <div>
              <h1 className="text-xl font-black text-white uppercase italic leading-none">Finance.OS</h1>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[.3em] mt-1">Terminal Active: {user.name}</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-5 py-2.5 rounded-2xl text-xs font-black text-red-400 uppercase hover:bg-red-500 hover:text-white transition-all"><LogOut size={16}/> Terminate Session</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 bg-white/10 w-40 h-40 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <p className="text-indigo-100/60 text-xs font-bold uppercase tracking-widest mb-2">Vault Balance</p>
              <h2 className="text-6xl font-black text-white tracking-tighter mb-10">${totals.balance.toLocaleString()}</h2>
              <div className="flex justify-between items-center opacity-30 font-mono text-[10px] tracking-[0.5em]">
                <span>SECURE NODE</span>
                <Wallet size={32} />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] backdrop-blur-md">
              <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2"><PlusCircle size={22} className="text-indigo-400" /> New Operation</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                if(!text || !amount) return;
                setTransactions([{ id: Date.now(), text, amount: parseFloat(amount), date: 'Feb 16' }, ...transactions]);
                setText(''); setAmount('');
              }} className="space-y-4">
                <input required value={text} onChange={(e) => setText(e.target.value)} placeholder="Operation Name" className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-indigo-500 transition-all shadow-inner" />
                <input required type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Credit/Debit Amount" className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-indigo-500 transition-all shadow-inner" />
                <button className="w-full py-5 bg-white text-indigo-950 font-black rounded-2xl shadow-xl hover:bg-indigo-50 active:scale-95 transition-all text-lg tracking-tight">Commit to Ledger</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="p-7 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/20 rounded-xl"><ExternalLink size={20} className="text-pink-400" /></div>
                  <h3 className="font-bold text-white uppercase tracking-tight">Sisense Mainframe</h3>
                </div>
              </div>
              <div className="h-[500px] bg-slate-950/50">
                <iframe src="https://www.sisense.com/dashboard-examples/" className="w-full h-full border-none opacity-90" title="Sisense Portal" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] shadow-lg">
                <h3 className="font-bold text-white mb-8 flex items-center gap-2 uppercase text-xs tracking-[0.2em] opacity-50"><Calendar size={18} className="text-indigo-400" /> Audit Trail</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scroll">
                  {transactions.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all border-l-4 border-l-transparent hover:border-l-indigo-500">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${t.amount > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-pink-500/10 text-pink-400'}`}><BarChart3 size={20} /></div>
                        <div>
                          <p className="text-sm font-bold text-white">{t.text}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-black">{t.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-mono font-bold text-lg ${t.amount > 0 ? 'text-emerald-400' : 'text-pink-400'}`}>{t.amount > 0 ? '+' : ''}{t.amount}</span>
                        <button onClick={() => setTransactions(transactions.filter(i => i.id !== t.id))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-500 transition-all p-2"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] shadow-lg flex flex-col justify-center text-center">
                <h3 className="font-bold text-white mb-10 uppercase text-xs tracking-[0.2em] opacity-50 text-left">Liquidity Metrics</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <Tooltip contentStyle={{backgroundColor: '#020617', border: 'none', borderRadius: '16px', fontWeight: 'bold'}} cursor={false} />
                      <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={60}>
                        {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-around mt-8">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Inflow</p>
                  <p className="text-xs font-bold text-pink-400 uppercase tracking-widest">Outflow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`.custom-scroll::-webkit-scrollbar { width: 4px; } .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }`}</style>
    </div>
  );
};

// --- APP CONTROLLER ---
export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedSession = localStorage.getItem('fos_session');
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const handleLogin = (user) => {
    localStorage.setItem('fos_session', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('fos_session');
    setCurrentUser(null);
  };

  return (
    <>
      {currentUser ? (
        <SecureDashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <AuthPortal onAuthSuccess={handleLogin} />
      )}
    </>
  );
}
