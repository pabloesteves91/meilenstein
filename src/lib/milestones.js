export const CATEGORIES = [
  {
    id: 'motorisch',
    label: 'Motorik',
    icon: 'directions_walk',
    nodeBg: 'bg-primary-container',
    nodeText: 'text-on-primary-container',
    titleColor: 'text-primary',
  },
  {
    id: 'sprachlich',
    label: 'Sprache',
    icon: 'record_voice_over',
    nodeBg: 'bg-secondary-container',
    nodeText: 'text-on-secondary-container',
    titleColor: 'text-secondary',
  },
  {
    id: 'sozial',
    label: 'Sozial',
    icon: 'favorite',
    nodeBg: 'bg-surface-container-high',
    nodeText: 'text-on-surface-variant',
    titleColor: 'text-on-surface',
  },
  {
    id: 'sonstiges',
    label: 'Anderes',
    icon: 'star',
    nodeBg: 'bg-surface-variant',
    nodeText: 'text-on-surface-variant',
    titleColor: 'text-on-surface',
  },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))

export const MILESTONE_SUGGESTIONS = {
  motorisch: [
    'Erstes Lächeln',
    'Ersten Kopf angehoben',
    'Erste Rolle',
    'Ersten Sitz ohne Stütze',
    'Erste Krabbelversuche',
    'Erste Schritte',
    'Erste freie Schritte',
    'Erste Treppe hoch',
    'Erster Zahn',
    'Erster Pinzettengriff',
    'Erstes Selbst-Essen mit Löffel',
  ],
  sprachlich: [
    'Erstes Gurren',
    'Erstes Lallen',
    'Erstes Wort',
    'Erstes "Mama"',
    'Erstes "Papa"',
    'Erste Zwei-Wort-Kombination',
    'Erste kurze Sätze',
    'Erstes Lied mitgesungen',
    'Eigener Name erkannt',
    'Erste Tierlaute',
  ],
  sozial: [
    'Erstes Soziales Lächeln',
    'Fremdeln begonnen',
    'Erste Winke-Winke',
    'Erste Umarmung',
    'Erster Kuss',
    'Erstes Spiel mit anderen Kindern',
    'Erste Empathie gezeigt',
    'Erster Witz erzählt',
    'Erste Freundschaft',
  ],
  sonstiges: [
    'Erster Haarschnitt',
    'Erstes Bad',
    'Erste Nacht im eigenen Bett',
    'Erstes Mal ohne Windel',
    'Erste Buchseite umgeblättert',
    'Erster Ausflug in den Zoo',
    'Erste Geburtstagsfeier',
    'Erstes Fahrrad',
    'Erster Kindergartentag',
    'Erster Schultag',
  ],
}

export function getCategoryInfo(id) {
  return CATEGORY_MAP[id] || CATEGORIES[3]
}
