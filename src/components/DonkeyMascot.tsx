import React, { useEffect, useState } from 'react';
import { getDonkeyQuote } from '../logic/donkeyBrain';

type DonkeyState = 'start' | 'playing' | 'correct' | 'wrong' | 'gameover';

interface MascotProps {
  state: DonkeyState;
  score: number;
}

const DonkeyMascot: React.FC<MascotProps> = ({ state, score }) => {

  const [animate, setAnimate] = useState(false);

  // Trigger new quote and animation when state changes or periodically
  // Derive quote directly from props (no effect needed)
  const quote = React.useMemo(() => getDonkeyQuote(state, score), [state, score]);

  // Trigger animation when quote changes
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [quote]);

  const getExpression = () => {
    switch (state) {
      case 'correct': return "😎"; 
      case 'wrong': return "🤨";   
      case 'gameover': return "👑"; 
      case 'playing': return "🧐"; 
      default: return "🐴";        
    }
  };

  return (
    <div className="absolute -top-24 -right-8 flex items-end z-20 pointer-events-none">
       {/* Speech Bubble */}
       <div className={`mr-4 mb-8 bg-black border-2 border-green-500 rounded-lg p-3 w-48 shadow-[4px_4px_0px_0px_rgba(0,255,0,0.3)] animate-in ${animate ? 'scale-105' : 'scale-100'} transition-transform`}>
            <p className="text-green-500 font-mono text-xs leading-relaxed typing-effect">
                &gt; {quote}
            </p>
       </div>

      {/* Mascot Avatar */}
      <div className={`w-24 h-24 bg-green-900/20 rounded-full border-4 border-green-500 flex items-center justify-center text-5xl shadow-[0_0_15px_rgba(0,255,0,0.5)] ${animate ? 'animate-bounce' : ''}`}>
        {getExpression()}
      </div>
    </div>
  );
};

export default DonkeyMascot;
