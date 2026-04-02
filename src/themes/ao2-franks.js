const base = {
  id: 'ao2-franks',
  name: 'Age of Empires 2: Franks',
  soundDir: 'ageof2/franks',
  statusLine: { label: '💰', ctxLabel: '🏰' },
  events: {
    stop: ['Franks_Oil.mp3', 'Franks_Oe.mp3', 'Franks_Certes.mp3', "Franks_Bucheron.mp3", "Franks_Chasseur.mp3", "Franks_Oil.mp3", "Franks_Oe.mp3", "Franks_Verax.mp3", "Franks_Maraud.mp3", "Franks_Quevalie.mp3", "Franks_Bastiosr.mp3", "Franks_Pret.mp3"],
    sessionstart: ['Franks_Pret.mp3'],
    sessionend: ['Franks_Bucheron.mp3'],
    question: ['Franks_Quefais.mp3'],
    submit: [],
  },
  verbs: [
    '⚒️ Building barracks',
    '💰 Gold please',
    '🧑‍🌾 Training villagers',
    '🪵 Gathering wood',
    '👷 Mining gold',
    '📜 Researching',
    '🧙‍♂️ Monk! I need a monk',
    "🏰 Nice town, I'll take it",
    '🏹 Raiding party!',
    '😎 You should see the other guy',
    'Wololoo',
    '⏳ What age are you in?',
  ],
};

export const ao2Franks = base;
