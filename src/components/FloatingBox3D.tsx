import { motion } from 'motion/react';

export function FloatingBox3D() {
  const colorWheel = ['#EF4444', '#F97316', '#FBBF24', '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <div className="relative w-full min-h-[380px] sm:min-h-[460px] flex items-center justify-center select-none overflow-visible py-8">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-violet-500/15 blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-pink-400/10 blur-[60px] pointer-events-none" />

      {/* Sparkles */}
      <motion.span animate={{ y: [0,-12,0], opacity:[0.4,1,0.4] }} transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut' }} className="absolute top-[18%] left-[18%] text-violet-400 text-xl pointer-events-none">✦</motion.span>
      <motion.span animate={{ y: [0,-10,0], opacity:[0.3,0.8,0.3] }} transition={{ duration:4.2, repeat:Infinity, ease:'easeInOut', delay:1.2 }} className="absolute bottom-[22%] right-[16%] text-indigo-400 text-sm pointer-events-none">✦</motion.span>
      <motion.div animate={{ scale:[0.8,1.3,0.8], opacity:[0.4,0.8,0.4] }} transition={{ duration:3, repeat:Infinity, ease:'easeInOut', delay:0.5 }} className="absolute top-[42%] right-[24%] w-2.5 h-2.5 rounded-full bg-blue-400 pointer-events-none" />

      {/* Main canvas — scaled to fit all screen sizes */}
      <div className="relative w-[520px] h-[400px] scale-[0.60] xs:scale-[0.72] sm:scale-[0.86] md:scale-[1.0] lg:scale-[1.08] origin-center z-10">

        {/* ── BOX ── */}
        <div className="absolute inset-0 z-[10] pointer-events-none">
          <svg viewBox="0 0 520 420" className="w-full h-full" overflow="visible">
            <defs>
              <radialGradient id="ig" cx="50%" cy="50%" r="50%">
                <stop offset="0%"  stopColor="#ffffff" stopOpacity="1" />
                <stop offset="20%" stopColor="#fbcfe8" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="wl" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b0f8c"/><stop offset="100%" stopColor="#5418c0"/></linearGradient>
              <linearGradient id="wr" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5b21b6"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient>
              <linearGradient id="fl" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#4c1d95"/></linearGradient>
              <linearGradient id="fr" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#9061f9"/><stop offset="100%" stopColor="#5b21b6"/></linearGradient>
              <radialGradient id="sh" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.45"/><stop offset="100%" stopColor="#1e1b4b" stopOpacity="0"/></radialGradient>
            </defs>
            {/* shadow */}
            <ellipse cx="260" cy="358" rx="145" ry="18" fill="url(#sh)" />
            {/* back flaps */}
            <polygon points="155,228 260,192 244,146 148,182" fill="url(#fl)" opacity="0.9" />
            <polygon points="260,192 365,228 372,182 268,146" fill="url(#fr)" opacity="0.9" />
            {/* inner walls */}
            <polygon points="155,228 260,192 260,258 155,228" fill="#18073a" />
            <polygon points="260,192 365,228 260,258 260,192" fill="#20093e" />
            {/* glow */}
            <circle cx="260" cy="222" r="92" fill="url(#ig)" style={{mixBlendMode:'screen'}} />
            {/* front walls */}
            <polygon points="155,228 260,260 260,318 155,278" fill="url(#wl)" />
            <polygon points="260,260 365,228 365,278 260,318" fill="url(#wr)" />
            {/* rim */}
            <polyline points="155,228 260,260 365,228" fill="none" stroke="#c4b5fd" strokeWidth="1.5" opacity="0.7" />
            {/* front flaps */}
            <polygon points="155,228 260,260 218,293 118,265" fill="url(#fl)" opacity="0.88" />
            <polygon points="260,260 365,228 402,265 302,293" fill="url(#fr)" opacity="0.88" />
          </svg>
        </div>

        {/* ── AI NEST CARD (floats from box) ── */}
        <motion.div
          animate={{ y:['-52%','-67%','-52%'], rotate:[-8,-13,-8] }}
          transition={{ duration:4.8, repeat:Infinity, ease:'easeInOut' }}
          style={{ left:'260px', top:'212px', width:'92px', height:'110px' }}
          className="absolute z-[20] -translate-x-1/2 rounded-[22px]
            bg-gradient-to-b from-white/25 via-violet-500/20 to-indigo-700/10
            backdrop-blur-md border border-white/55
            shadow-[0_18px_42px_rgba(139,92,246,0.6),inset_0_2px_4px_rgba(255,255,255,0.35)]
            flex flex-col items-center justify-center"
        >
          <div className="absolute inset-0 rounded-[22px] bg-gradient-to-tr from-pink-500/25 via-violet-500/35 to-blue-500/25 blur-lg -z-10 scale-90 pointer-events-none" />
          <span className="text-4xl font-black italic text-transparent bg-gradient-to-b from-white via-white to-pink-100 bg-clip-text drop-shadow-lg select-none">AI</span>
          <span className="text-[9px] font-black tracking-[0.28em] text-white/90 uppercase mt-1.5 ml-[0.3em] select-none">NEST</span>
        </motion.div>

        {/* ── CLAUDE (top-left orange) ── */}
        <motion.div
          animate={{ y:[-5,-19,-5], rotate:[0,3,0] }}
          transition={{ duration:4.2, repeat:Infinity, ease:'easeInOut' }}
          style={{ left:'82px', top:'24px' }}
          className="absolute z-[22] w-[72px] h-[72px] rounded-2xl
            bg-gradient-to-b from-[#f07a4a] via-[#e8622e] to-[#c83e10]
            flex flex-col items-center justify-center
            shadow-xl shadow-orange-600/25 border border-orange-400/30 cursor-pointer hover:scale-105 transition-transform"
        >
          <svg viewBox="0 0 100 100" className="w-9 h-9">
            <circle cx="50" cy="50" r="13" fill="white"/>
            {Array.from({length:8}).map((_,i)=>(
              <path key={i} d="M50,23 Q54,32 50,37 Q46,32 50,23" fill="white" transform={`rotate(${i*45} 50 50)`}/>
            ))}
          </svg>
          <span className="text-[9px] font-extrabold tracking-widest text-orange-50/90 uppercase mt-0.5 select-none">Claude</span>
        </motion.div>

        {/* ── GEMINI (top-center white pill) ── */}
        <motion.div
          animate={{ y:[-11,-4,-11], rotate:[-1,2,-1] }}
          transition={{ duration:5.3, repeat:Infinity, ease:'easeInOut', delay:0.4 }}
          style={{ left:'192px', top:'10px' }}
          className="absolute z-[21] w-[150px] h-[44px] rounded-2xl bg-white
            flex items-center gap-2.5 px-3.5
            shadow-xl shadow-blue-400/10 border border-neutral-100 cursor-pointer hover:scale-105 transition-transform"
        >
          <svg viewBox="0 0 100 100" className="w-7 h-7 flex-shrink-0">
            <defs>
              <linearGradient id="gG1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1e3a8a"/><stop offset="100%" stopColor="#93c5fd"/></linearGradient>
              <linearGradient id="gG2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#fef08a"/></linearGradient>
            </defs>
            <path d="M45 10 C45 29 61 45 80 45 C61 45 45 61 45 80 C45 61 29 45 10 45 C29 45 45 29 45 10 Z" fill="url(#gG1)"/>
            <path d="M75 14 C75 21 82 24 85 24 C82 24 75 27 75 34 C75 27 68 24 65 24 C68 24 75 21 75 14 Z" fill="url(#gG2)"/>
          </svg>
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-neutral-900 leading-none">Gemini</span>
            <span className="text-[7px] font-extrabold text-blue-500 uppercase tracking-widest mt-0.5 leading-none">by Google</span>
          </div>
        </motion.div>

        {/* ── CHATGPT (top-right white square) ── */}
        <motion.div
          animate={{ y:[-3,-16,-3], rotate:[0,-3,0] }}
          transition={{ duration:4.6, repeat:Infinity, ease:'easeInOut', delay:0.9 }}
          style={{ left:'356px', top:'30px' }}
          className="absolute z-[23] w-[66px] h-[66px] rounded-2xl bg-white
            flex items-center justify-center
            shadow-xl shadow-emerald-400/10 border border-neutral-100 cursor-pointer hover:scale-105 transition-transform"
        >
          <svg viewBox="0 0 100 100" className="w-10 h-10 text-[#10A37F]" fill="currentColor">
            <path d="M78.5,41.5C77.4,32.4 69.7,25.4 60.4,25.4C57.8,25.4 55.3,26.1 53.1,27.3C49.9,23.3 44.9,20.8 39.4,20.8C29.4,20.8 21.2,28.2 19.9,37.9C15.5,39.9 12.5,44.3 12.5,49.4C12.5,56.7 17.8,62.8 24.8,64.1C25.9,73.2 33.6,80.2 42.9,80.2C45.5,80.2 48,79.5 50.2,78.3C53.4,82.3 58.4,84.8 63.9,84.8C73.9,84.8 82.1,77.4 83.4,67.7C87.8,65.7 90.8,61.3 90.8,56.2C90.8,48.9 85.5,42.8 78.5,41.5Z"/>
          </svg>
        </motion.div>

        {/* ── MIDJOURNEY (mid-left white square) ── */}
        <motion.div
          animate={{ y:[-13,-3,-13], rotate:[2,-2,2] }}
          transition={{ duration:5.1, repeat:Infinity, ease:'easeInOut', delay:0.15 }}
          style={{ left:'38px', top:'116px' }}
          className="absolute z-[24] w-[66px] h-[66px] rounded-2xl bg-white
            flex items-center justify-center
            shadow-xl border border-neutral-100 cursor-pointer hover:scale-105 transition-transform"
        >
          <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22,66 C50,71 78,66 78,66 L78,56 L22,56 Z"/>
            <line x1="48" y1="18" x2="48" y2="56"/>
            <path d="M48,21 C48,21 26,37 48,51"/>
            <path d="M52,24 C52,24 74,40 52,51"/>
          </svg>
        </motion.div>

        {/* ── CURSOR (mid-right dark pill) ── */}
        <motion.div
          animate={{ y:[-4,-17,-4], rotate:[-2,2,-2] }}
          transition={{ duration:4.4, repeat:Infinity, ease:'easeInOut', delay:0.7 }}
          style={{ left:'357px', top:'116px' }}
          className="absolute z-[25] w-[145px] h-[44px] rounded-2xl
            bg-gradient-to-r from-neutral-900 to-neutral-800
            flex items-center gap-2.5 px-3.5
            shadow-xl shadow-black/35 border border-neutral-700/50 cursor-pointer hover:scale-105 transition-transform"
        >
          <svg viewBox="0 0 100 100" className="w-6 h-6 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M50 15 L85 35 L85 65 L50 85 L15 65 L15 35 Z"/>
            <path d="M50 15 L50 85" opacity="0.4"/>
            <path d="M15 35 L50 50 L85 35"/>
          </svg>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-neutral-100 leading-none">Cursor</span>
            <span className="text-[7px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5 leading-none">AI Code Editor</span>
          </div>
        </motion.div>

        {/* ── DALL-E color wheel (far right) ── */}
        <motion.div
          animate={{ y:[-10,-3,-10], rotate:[4,0,4] }}
          transition={{ duration:5.6, repeat:Infinity, ease:'easeInOut', delay:1.1 }}
          style={{ left:'443px', top:'148px' }}
          className="absolute z-[26] w-[50px] h-[50px] rounded-2xl bg-white p-1.5
            shadow-xl border border-neutral-100 cursor-pointer hover:scale-105 transition-transform"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {colorWheel.map((color,i)=>(
              <path key={i} d="M50,54 L50,22 A32,32 0 0,1 72.6,31.4 Z" fill={color} transform={`rotate(${i*45} 50 54)`}/>
            ))}
            <circle cx="50" cy="54" r="9" fill="white"/>
          </svg>
        </motion.div>

        {/* ── 30+ BADGE ── */}
        <motion.div
          animate={{ y:[-1,-9,-1], rotate:[2,-2,2] }}
          transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
          style={{ left:'426px', top:'-10px' }}
          className="absolute z-[30] w-[80px] h-[80px]"
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_4px_14px_rgba(109,40,217,0.5)]">
            <defs>
              <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#5b21b6"/></linearGradient>
            </defs>
            {Array.from({length:16}).map((_,i)=>{
              const a=(i*22.5*Math.PI)/180;
              return <line key={i} x1={(50+38*Math.cos(a)).toFixed(2)} y1={(50+38*Math.sin(a)).toFixed(2)} x2={(50+47*Math.cos(a)).toFixed(2)} y2={(50+47*Math.sin(a)).toFixed(2)} stroke="#7c3aed" strokeWidth="4" strokeLinecap="round"/>;
            })}
            <circle cx="50" cy="50" r="36" fill="url(#bg2)"/>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white leading-none">
            <span className="text-[16px] font-black">30+</span>
            <span className="text-[6.5px] font-extrabold uppercase tracking-wider text-violet-100 text-center mt-0.5">Premium<br/>AI Tools</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
