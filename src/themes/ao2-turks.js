const base = {
  id: 'ao2-turks',
  name: 'Age of Empires 2: Turks',
  soundDir: 'ageof2/turks',
  statusLine: { label: '💰', ctxLabel: '🏰' },
  events: {
    stop: ['Turks_Yaparim.mp3', 'Turks_Evet.mp3'],
    sessionstart: ['Turks_Hazir.mp3'],
    sessionend: ['Turks_Oduncu.mp3'],
    question: ['Turks_Emrin.mp3'],
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

export const ao2Turks = base;
