import React, { useState, useEffect } from 'react';
import { Trophy, Hammer, AlertTriangle, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import DonkeyMascot from './DonkeyMascot';
import { playSound } from '../utils/soundEngine';

// --- GAME DATA ---
const gameLevels = [
  {
    id: 1,
    title: "Wall Layout Speed-Run",
    scenario: "You are framing a standard wall with 2x4 studs. You need to mark the high-visibility notch for the stud width.",
    mechanic: "Wall Layout Speed-Marking",
    options: [
      { text: "Mark at 5-1/2 inches", correct: false, feedback: "Incorrect. 5-1/2\" is for 2x6 material." },
      { text: "Mark at 3-1/2 inches", correct: true, feedback: "Correct! The Kixx Square has a high-vis notch at 3-1/2\" specifically for standard 2x4s." },
      { text: "Use the v Groove at 4-1/2 inches", correct: false, feedback: "Incorrect. That groove is for partition intersections, not the stud width." }
    ]
  },
  {
    id: 2,
    title: "The Anchor Bolt Challenge",
    scenario: "You're at the foundation. There's a bolt sticking up. How do you find the exact drill center for a 2x6 bottom plate?",
    mechanic: "Anchor Bolt Jig",
    options: [
      { text: "Guess and check.", correct: false, feedback: "Come on, we are precision engineers here!" },
      { text: "Stand tool on spine, select the 3-1/2\" hole.", correct: false, feedback: "Close, but that hole is for 2x4s. You are using 2x6." },
      { text: "Stand tool on coped spine, select the 5-1/2\" hole.", correct: true, feedback: "Boom. The coped spine hugs the bolt, and the 5-1/2\" hole centers it perfectly for 2x6." }
    ]
  },
  {
    id: 3,
    title: "Rafter Wizardry",
    scenario: "Roof time. You need to mark a standard Seat Cut for a Common Rafter.",
    mechanic: "The Rafter Challenge",
    options: [
      { text: "Pivot on Seat Cut, align 'Hip & Val' marks.", correct: false, feedback: "Wrong scale! 'Hip & Val' is for hip or valley rafters only." },
      { text: "Pivot on Seat Cut, align 'Large Marks 1-12'.", correct: true, feedback: "Spot on. Align the Common marks with the top edge and trace the hypotenuse." },
      { text: "Use the 22.5 degree pin.", correct: false, feedback: "That's a specific angle shortcut, not for standard common rafter pitches." }
    ]
  },
  {
    id: 4,
    title: "The 22.5° Shortcut (Speed Round)",
    scenario: "You need a 5/12 roof pitch angle FAST. No time to pivot and look at numbers.",
    mechanic: "The 22.5° Shortcut",
    options: [
      { text: "Insert the 1/4\" pin and rotate until it locks.", correct: true, feedback: "Click! The pin hits the edge and locks you instantly at 22.5 degrees (approx 5/12 pitch)." },
      { text: "Use the spine table.", correct: false, feedback: "Too slow for this round. Use the hardware!" },
      { text: "Use the degree marks.", correct: false, feedback: "The pin lock is faster and hands-free!" }
    ]
  },
  {
    id: 5,
    title: "The Zero Point Calibration",
    scenario: "You are dealing with a 5/12 pitch. You need the precise Rafter Length adjustment for 24\" O.C. Where do you look?",
    mechanic: "Level 99 Math Table",
    options: [
      { text: "Google it.", correct: false, feedback: "No signal on the job site! Use the tool!" },
      { text: "Check the '48 inch Sheathing' column.", correct: false, feedback: "That helps with plywood cuts, not rafter length adjustment." },
      { text: "Reference the '24' column on the Spine.", correct: true, feedback: "Master Carpenter status achieved. The spine data has the exact adjustment." }
    ]
  },
  {
    id: 6,
    title: "Stair Gauge: Rise & Run",
    scenario: "You have a 7-1/2\" rise. Where do you set your stair gauges on the square?",
    mechanic: "Stair Layout",
    options: [
      { text: "Clamp on the inside edge.", correct: false, feedback: "That won't hold the angle correctly." },
      { text: "Clamp gauges on the outer edge, one at 7-1/2\" and one at the Run dimension.", correct: true, feedback: "Precision work. That gives you your repeating stair triangle." },
      { text: "Use the degree marks.", correct: false, feedback: "Too mathy. Use the rise/run scales directly with gauges." }
    ]
  },
  {
    id: 7,
    title: "Scribing with Notches",
    scenario: "You need to rip a board exactly 3-1/2\" wide along its entire length. No table saw.",
    mechanic: "Scribing Mode",
    options: [
      { text: "Freehand it.", correct: false, feedback: "Amateur hour. It will be wavy." },
      { text: "Lock your pencil in the 3-1/2\" scribe notch and slide the square.", correct: true, feedback: "Smooth operator. The square acts as a fence for a perfect rip line." },
      { text: "Mark it every foot and connect the dots.", correct: false, feedback: "Too slow. Use the continuous scribing notches." }
    ]
  },
  {
    id: 8,
    title: "Hip & Valley Angles",
    scenario: "You are framing a complex Hip Rafter. The Common pitch is 6/12. Which scale do you use?",
    mechanic: "Advanced Roofing",
    options: [
      { text: "The Common Scale at 6.", correct: false, feedback: "That's for the main roof, not the hip." },
      { text: "The Hip/Val scale at 6.", correct: true, feedback: "Correct. The geometry changes for the hip, so you must use the Hip/Val scale." },
      { text: "The Degree scale at 45.", correct: false, feedback: "Nope, hip rafter angles aren't just 45 degrees." }
    ]
  },
  {
    id: 9,
    title: "Finding Degrees",
    scenario: "Blueprint says 'Cut at 30 degrees'. You don't have a pitch, just an angle.",
    mechanic: "Degree Finder",
    options: [
      { text: "Convert 30 degrees to pitch.", correct: false, feedback: "Why do math? The tool has degrees." },
      { text: "Pivot to the 30 on the 'Common' scale.", correct: false, feedback: "That's a pitch number, not degrees." },
      { text: "Pivot to align the edge with 30 on the inner Degree Scale.", correct: true, feedback: "Simple. Read the degree marks on the inner arc." }
    ]
  },
  {
    id: 10,
    title: "The Impossible Board",
    scenario: "Final Exam: 12/12 Pitch, Hip Rafter, needs a Drill Hole for a 2x6 anchor. GO.",
    mechanic: "Master Carpenter Final",
    options: [
      { text: "Panic.", correct: false, feedback: "Deep breaths. Break it down." },
      { text: "Hip Scale 12, then Coped Spine 5-1/2 hole.", correct: true, feedback: "LEGENDARY. You combined roofing and foundation skills perfectly." },
      { text: "Common Scale 12, then 3-1/2 hole.", correct: false, feedback: "Wrong scale, wrong hole. You failed the final." }
    ]
  }
];

type GameState = 'start' | 'playing' | 'result' | 'gameover';

const KixxGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [timer, setTimer] = useState(30);
  const [clickCount, setClickCount] = useState(0); // For Easter Egg
  const [partyMode, setPartyMode] = useState(false); // Easter Egg State

  const currentLevel = gameLevels[currentLevelIndex];

  // Easter Egg Trigger: Click the title text 5 times
  const handleTitleClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount + 1 === 5) {
        setPartyMode(prev => !prev);
        playSound('mascot');
        setClickCount(0);
    }
  };

  // Timer Effect
  useEffect(() => {
    if (gameState === 'playing' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (gameState === 'playing' && timer === 0) {
      setFeedback("Time's up! The donkey laughs at your slowness.");
      setIsCorrect(false);
      playSound('wrong');
      setGameState('result');
    }
  }, [gameState, timer]);

  // Reset Timer on Level Change
  useEffect(() => {
    if (gameState === 'playing') {
      setTimer(30); 
    }
  }, [currentLevelIndex, gameState]);

  const getMascotState = () => {
      if (gameState === 'gameover') return 'gameover';
      if (gameState === 'result') return isCorrect ? 'correct' : 'wrong';
      return 'playing';
  };

  const handleStart = () => {
    playSound('start');
    setGameState('playing');
    setScore(0);
    setCurrentLevelIndex(0);
    setTimer(30);
  };

  const handleRestart = () => {
    playSound('start');
    setGameState('start');
    setScore(0);
    setCurrentLevelIndex(0);
    setTimer(30);
  };

  const handleAnswer = (option: { correct: boolean; feedback: React.SetStateAction<string>; }) => {
    setIsCorrect(option.correct);
    setFeedback(option.feedback);
    setGameState('result');
    if (option.correct) {
      playSound('correct');
      // Bonus points for speed
      setScore(prev => prev + 100 + (timer * 10));
    } else {
      playSound('wrong');
    }
  };

  const nextLevel = () => {
    playSound('click');
    if (currentLevelIndex + 1 < gameLevels.length) {
      setCurrentLevelIndex(currentLevelIndex + 1);
      setGameState('playing');
    } else {
      setGameState('gameover');
      playSound('mascot'); // Fanfare
    }
  };

  const partyStyle = {
    background: 'linear-gradient(45deg, #4c1d95, #be185d, #7f1d1d)',
    backgroundSize: '400% 400%',
    animation: 'gradient 15s ease infinite',
  };

  return (
    <div 
      className={`min-h-screen text-green-500 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all duration-1000 ${!partyMode ? 'bg-black' : ''}`}
      style={partyMode ? partyStyle : {}}
    >
      
      {/* SCANLINE OVERLAY */}
      <div className="scanlines fixed inset-0 pointer-events-none z-50 opacity-10"></div>

      {/* HEADER / HUD (Visible during gameplay) */}
      {gameState !== 'start' && (
        <div className="w-full max-w-2xl flex justify-between items-center mb-8 p-4 border-b-2 border-green-600 bg-gray-900/80 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.2)] z-10">
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={handleTitleClick}>
            <Hammer className={`text-green-500 ${partyMode ? 'animate-spin' : 'animate-pulse'}`} />
            <h1 className="text-xl font-bold tracking-wider text-green-400 drop-shadow-[0_0_5px_rgba(0,255,0,0.8)]">
                KIXX SQUARE <span className="text-white">DOJO</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-2xl font-bold ${timer < 10 ? 'text-red-500 animate-ping' : 'text-green-500'}`}>
              00:{timer < 10 ? `0${timer}` : timer}
            </div>
            <div className="flex items-center gap-2 text-yellow-500">
                <Trophy className="w-5 h-5" />
                <span className="text-lg font-bold">{score}</span>
            </div>
            <button
                onClick={handleRestart}
                onMouseEnter={() => playSound('hover')}
                title="Restart Game"
                className="text-green-600 hover:text-white transition-colors flex items-center gap-1"
            >
                <RotateCcw size={18} />
            </button>
          </div>
        </div>
      )}

      {/* HEADER (Start Screen Only) */}
      {gameState === 'start' && (
         <div className="text-center z-10 animate-in fade-in zoom-in duration-700">
             <div onClick={handleTitleClick} className="cursor-pointer select-none inline-block">
                <h1 className={`text-6xl font-bold mb-6 ${partyMode ? 'text-purple-400 animate-bounce' : 'text-green-400'} drop-shadow-[0_0_10px_rgba(0,255,0,0.8)] tracking-tighter`}>
                    KIXX SQUARE DOJO
                </h1>
             </div>
             <p className="text-xl mb-12 text-green-600 animate-pulse">Initialize Training Module v3.0...</p>
             
             <button 
                onClick={handleStart}
                onMouseEnter={() => playSound('hover')}
                className="group relative px-8 py-4 bg-black border-2 border-green-500 text-green-500 font-bold hover:bg-green-500 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:shadow-[0_0_40px_rgba(0,255,0,0.6)]"
             >
                <span className="flex items-center gap-2">
                <Hammer className="w-6 h-6 group-hover:rotate-45 transition-transform" />
                START SIMULATION
                </span>
             </button>
        </div>
      )}

      {/* MASCOT INTEGRATION */}
      {/* Show in all states except start main menu if desired, or keep it always. Based on prev design, it shows when game logic is active. */}
      {gameState !== 'start' && (
        <DonkeyMascot state={getMascotState()} score={score} />
      )}


      {/* PLAYING STATE */}
      {gameState === 'playing' && (
        <div className="max-w-2xl w-full z-10 animate-in slide-in-from-bottom-4 duration-500">
          
          <div className="flex justify-between text-xs font-mono text-green-700 uppercase tracking-widest border-b border-green-900 pb-2 mb-4">
              <span>Level {currentLevel.id}/{gameLevels.length}</span>
              <span>Protocol: {currentLevel.mechanic}</span>
          </div>

          <div className="bg-black/80 border border-green-800 p-8 rounded-lg shadow-[0_0_30px_rgba(0,100,0,0.2)] relative">
            {/* Countdown Bar */}
             <div className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-1000 ease-linear" style={{ width: `${(timer/30)*100}%` }}></div>
             
            <h2 className="text-3xl font-bold mb-4 text-green-400">{currentLevel.title}</h2>
            <p className="text-lg mb-8 leading-relaxed text-green-300">
              {currentLevel.scenario}
            </p>

            <div className="grid gap-4">
              {currentLevel.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  onMouseEnter={() => playSound('hover')}
                  className="p-4 text-left border border-green-700 hover:bg-green-900/30 hover:border-green-400 transition-all rounded group flex items-start"
                >
                  <span className="mr-4 text-green-600 group-hover:text-green-400 font-mono mt-1">[{idx+1}]</span>
                  <span>{option.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESULT STATE */}
      {gameState === 'result' && (
        <div className="max-w-xl w-full text-center z-10 animate-in zoom-in duration-300">
          <div className="mb-8 flex justify-center">
            {isCorrect ? (
              <CheckCircle className="w-24 h-24 text-green-400 animate-bounce" />
            ) : (
              <AlertTriangle className="w-24 h-24 text-red-500 animate-shake" />
            )}
          </div>
          
          <h2 className={`text-4xl font-bold mb-4 ${isCorrect ? 'text-green-400' : 'text-red-500'}`}>
            {isCorrect ? 'CORRECT' : 'ERROR'}
          </h2>
          
          <p className="text-xl mb-8 text-green-300 border-l-4 border-green-500 pl-4 text-left bg-black/50 p-4 rounded">
            {feedback}
          </p>

          <button
            onClick={nextLevel}
            onMouseEnter={() => playSound('hover')}
            className="px-8 py-3 bg-green-900/40 border border-green-500 text-green-400 hover:bg-green-500 hover:text-black transition-all flex items-center gap-2 mx-auto"
          >
            {currentLevelIndex + 1 < gameLevels.length ? "NEXT MODULE" : "FINISH EXAM"} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* GAMEOVER STATE */}
      {gameState === 'gameover' && (
        <div className="text-center z-10 animate-in fade-in duration-1000">
          <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-5xl font-bold mb-2 text-green-400">SIMULATION COMPLETE</h2>
          <p className="text-2xl mb-8 text-green-600">FINAL SCORE: <span className="text-white">{score}</span></p>
          
          <div className="mb-12 text-green-300 bg-black/50 p-4 rounded border border-green-800 inline-block">
            {score > 1500 ? "Hardware Status: MASTER CARPENTER (LEGEND)" : 
             score > 800 ? "Hardware Status: JOURNEYMAN" : 
             "Hardware Status: APPRENTICE"}
          </div>

          <div className="flex justify-center">
             <button
                onClick={handleRestart}
                onMouseEnter={() => playSound('hover')}
                className="px-8 py-3 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-all flex items-center gap-2"
            >
                <RotateCcw className="w-5 h-5" /> RESTART TRAINING
            </button>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 text-green-900/50 text-xs font-mono">
        v3.0.0 // KIXX SQUARE CORP // DO NOT DISTRIBUTE
      </div>
    </div>
  );
};

export default KixxGame;
