export const getDonkeyQuote = (state: 'start' | 'playing' | 'correct' | 'wrong' | 'gameover', score: number) => {
  const quotes = {
    start: [
      "I'm watching you, rookie.",
      "Don't drop my Kixx Square.",
      "I bet you can't even cut a 2x4 straight.",
      "Ready to be schooled by a donkey?",
    ],
    playing: [
      "Focus. Precision is everything.",
      "The rafters are waiting...",
      "Do the math. Or just guess, I dare you.",
      "Tick tock. Wood warps while you wait.",
    ],
    correct: [
      "Not bad for a human.",
      "Finally, some competence.",
      "Correct. Don't let it go to your head.",
      "Acceptable.",
    ],
    wrong: [
      "My hooves could measure better.",
      "Wrong. Go back to kindergarten.",
      "Did you even read the manual?",
      "That wall is going to collapse.",
      "Pathetic display of carpentry.",
    ],
    gameover: [
      score >= 500 ? "Respect. You might actually be useful." : "Disappointing.",
      score >= 500 ? "Master Carpenter status? Maybe." : "Go sweep the sawdust.",
    ],
  };

  const list = quotes[state];
  return list[Math.floor(Math.random() * list.length)];
};
