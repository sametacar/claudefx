const base = {
  id: 'ao2-britons',
  name: 'Age of Empires 2: Britons',
  soundDir: 'ageof2/britons',
  statusLine: { label: '💰', ctxLabel: '🏰' },
  events: {
    stop: ['Britons_Yes.mp3', 'Britons_Yea.mp3', 'Britons_Correctus.mp3', "Britons_Chopper.mp3", "Britons_Ready.mp3", "Britons_Hunter.mp3", "Britons_Presto.mp3"],
    sessionstart: ['Britons_Greetin.mp3', 'Britons_Ready.mp3'],
    sessionend: ['Britons_Chopper.mp3'],
    question: ['Britons_Impero.mp3'],
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

export const ao2Britons = base;
