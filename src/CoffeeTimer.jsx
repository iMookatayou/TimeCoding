import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Code, Sun, Moon, Plus, Minus, Check } from 'lucide-react';

const CoffeeTimer = () => {
  // State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [task, setTask] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Custom Time Input
  const [isEditing, setIsEditing] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);

  const [showConfetti, setShowConfetti] = useState(false);

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  // Helpers
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (timeLeft === 0) resetTimer();
    else setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalTime);
    setShowConfetti(false);
  };

  const adjustTime = (minutes) => {
    const newTime = Math.max(60, timeLeft + minutes * 60);
    setTimeLeft(newTime);
    setTotalTime(newTime);
    setCustomMinutes(Math.floor(newTime / 60));
  };

  const handleCustomTimeSubmit = (e) => {
    e.preventDefault();
    const newSeconds = Math.max(1, Math.min(180, parseInt(customMinutes))) * 60;
    setTimeLeft(newSeconds);
    setTotalTime(newSeconds);
    setIsEditing(false);
  };

  // Visual Logic
  const percentage = Math.min((timeLeft / Math.max(totalTime, 1)) * 100, 100);
  
  // Steam shows if Timer is Active OR Task is typed
  const showSteam = isActive || task.trim().length > 0;

  // Theme Styles
  const theme = isDarkMode ? {
    bg: 'bg-slate-950',
    text: 'text-slate-200',
    card: 'bg-slate-900/60 border-slate-800',
    input: 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-600 focus:bg-slate-800 focus:border-amber-500/50',
    accent: 'text-amber-500',
    liquid: 'from-amber-900 via-amber-700 to-amber-600',
    foam: 'bg-amber-100/80',
    timerText: 'text-amber-100',
    steamColor: '#fcd34d',
    steamOpacity: 'opacity-40',
  } : {
    bg: 'bg-stone-100',
    text: 'text-stone-800',
    card: 'bg-white border-stone-200 shadow-xl',
    input: 'bg-white border-stone-300 text-stone-700 placeholder-stone-400 focus:bg-stone-50',
    accent: 'text-amber-700',
    liquid: 'from-amber-800 via-amber-600 to-amber-500',
    foam: 'bg-stone-100/90',
    timerText: 'text-stone-800',
    steamColor: '#a8a29e',
    steamOpacity: 'opacity-40',
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 selection:bg-amber-500/30`}>
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
           {[...Array(50)].map((_, i) => (
             <div 
               key={i}
               className="absolute w-2 h-2 bg-amber-400 rounded-sm animate-confetti"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `-10px`,
                 backgroundColor: ['#fbbf24', '#34d399', '#f472b6', '#60a5fa'][Math.floor(Math.random() * 4)],
                 animationDelay: `${Math.random() * 2}s`,
                 animationDuration: `${2 + Math.random() * 3}s`
               }}
             />
           ))}
        </div>
      )}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-6 p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors z-50 cursor-pointer"
      >
        {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
      </button>
      <div className="z-10 w-full max-w-md flex flex-col items-center mb-10 animate-fade-in-down">
        <div className="flex items-center gap-3 mb-6">
          <Code size={32} className={`${theme.accent} stroke-[3]`} />
          <h1 className={`text-2xl font-black tracking-wider ${theme.accent}`}>DEVELOPER FOCUSING</h1>
        </div>
        <div className="w-full relative group px-4">
          <input 
            type="text" 
            placeholder="What are you building?" 
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className={`w-full rounded-xl py-4 px-6 text-center text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all border ${theme.input} placeholder-opacity-50`}
          />
        </div>
      </div>
      <div className={`z-10 w-full max-w-xs backdrop-blur-xl border rounded-[3rem] p-8 shadow-2xl flex flex-col items-center transition-all duration-500 relative ${theme.card}`}>
        <div className="relative w-44 h-36 mb-12 group select-none mt-8">
          <div className={`absolute -top-24 left-0 w-full h-28 z-0 transition-all duration-1000 ease-in-out pointer-events-none ${showSteam ? theme.steamOpacity : 'opacity-0 translate-y-4'}`}>
             <svg width="100%" height="100%" viewBox="0 0 100 80" fill="none" className="overflow-visible filter blur-[5px]">
               <path d="M30 80 Q 15 60 30 40 T 30 0" stroke={theme.steamColor} strokeWidth="8" strokeLinecap="round" className="animate-steam-rise" style={{animationDelay: '0s'}} />
               <path d="M50 80 Q 65 60 50 40 T 50 0" stroke={theme.steamColor} strokeWidth="8" strokeLinecap="round" className="animate-steam-rise" style={{animationDelay: '1.5s'}} />
               <path d="M70 80 Q 85 60 70 40 T 70 0" stroke={theme.steamColor} strokeWidth="8" strokeLinecap="round" className="animate-steam-rise" style={{animationDelay: '3s'}} />
             </svg>
          </div>
          <div className="absolute top-4 -right-12 w-16 h-24 border-[10px] border-l-0 border-white/20 rounded-r-[2.5rem] z-0 shadow-sm"></div>
          <div className="absolute inset-0 border-[6px] border-white/20 rounded-b-[2.5rem] rounded-t-xl backdrop-blur-[2px] overflow-hidden bg-gradient-to-br from-white/5 to-transparent shadow-xl z-20 pointer-events-none">
            <div className="absolute top-2 right-3 w-4 h-2/3 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-full blur-[3px]"></div>
          </div>
          <div className="absolute bottom-[6px] left-[6px] right-[6px] rounded-b-[2.1rem] rounded-t-md overflow-hidden z-10 flex items-end h-[calc(100%-12px)]">
            <div 
              className={`w-full bg-gradient-to-t ${theme.liquid} relative transition-all duration-1000 ease-in-out shadow-[0_0_20px_rgba(245,158,11,0.2)]`}
              style={{ height: `${percentage}%` }}
            >
              <div className="absolute top-[-5px] left-0 w-[200%] h-3 bg-white/20 rounded-[50%] animate-wave"></div>
              <div className={`absolute top-0 left-0 w-full h-1 blur-[1px] ${theme.foam}`}></div>

              {isActive && (
                <>
                  <div className="absolute bottom-4 left-1/4 w-1.5 h-1.5 bg-white/30 rounded-full animate-bubble delay-100"></div>
                  <div className="absolute bottom-8 right-1/3 w-2 h-2 bg-white/20 rounded-full animate-bubble delay-300"></div>
                  <div className="absolute bottom-2 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-bubble delay-700"></div>
                </>
              )}
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-30">
            {isEditing ? (
               <form onSubmit={handleCustomTimeSubmit} className="flex items-center gap-1 bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10">
                 <input 
                   type="number" 
                   value={customMinutes} 
                   onChange={(e) => setCustomMinutes(e.target.value)}
                   className="w-16 bg-transparent text-white text-3xl font-bold text-center focus:outline-none appearance-none"
                   autoFocus
                   onBlur={() => handleCustomTimeSubmit({ preventDefault: () => {} })}
                 />
                 <button type="submit" className="text-green-400 hover:text-green-300"><Check size={20}/></button>
               </form>
            ) : (
              <div 
                className="group/timer flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
                onClick={() => !isActive && setIsEditing(true)}
              >
                <span className={`text-5xl font-black drop-shadow-2xl ${percentage > 60 ? 'text-white' : theme.timerText} tracking-tight`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6 relative z-30">
           <button 
            onClick={() => adjustTime(-5)}
            disabled={isActive}
            className={`p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors group disabled:opacity-30 cursor-pointer`}
          >
            <Minus size={24} className="opacity-40 group-hover:opacity-100 transition-opacity" />
          </button>

          <button 
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-[2rem] transition-all duration-300 shadow-xl flex items-center justify-center border-4 cursor-pointer ${
              isActive 
                ? 'bg-slate-800 border-slate-700 text-red-400 hover:bg-slate-700 hover:scale-95' 
                : 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400/30 text-white hover:scale-105 hover:shadow-amber-500/50 hover:-translate-y-1'
            }`}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          
           <button 
            onClick={() => adjustTime(5)}
            disabled={isActive}
            className={`p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors group disabled:opacity-30 cursor-pointer`}
          >
            <Plus size={24} className="opacity-40 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
        <button 
          type="button"
          onClick={resetTimer}
          className="mt-8 text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-amber-400 transition-all flex items-center gap-1 cursor-pointer relative z-50 p-2"
        >
          <RotateCcw size={12} /> Reset
        </button>

      </div>

      <style>{`
        @keyframes wave {
          0% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          50% { transform: translateX(0%) translateY(-2px) rotate(2deg); }
          100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
        }
        .animate-wave { animation: wave 5s infinite linear; }
        
        @keyframes bubble {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-80px) scale(1.2); opacity: 0; }
        }
        .animate-bubble { animation: bubble 3s infinite ease-in; }

        @keyframes steam-rise {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          20% { opacity: 0.6; }
          50% { transform: translateY(-30px) translateX(-5px) scaleX(1.1); }
          80% { opacity: 0; }
          100% { transform: translateY(-60px) translateX(5px) scaleX(1.3); opacity: 0; }
        }
        .animate-steam-rise { animation: steam-rise 4s infinite ease-out; }

        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti { animation: confetti 4s ease-out forwards; }
        
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out; }

        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; margin: 0; 
        }
      `}</style>
    </div>
  );
};

export default CoffeeTimer;