export const CATEGORIES = [
  { id: 'motorisch',  label: 'Motorisch',  color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-400' },
  { id: 'sprachlich', label: 'Sprachlich', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
  { id: 'sozial',     label: 'Sozial',     color: 'bg-pink-100 text-pink-700',   dot: 'bg-pink-400' },
  { id: 'sonstiges',  label: 'Sonstiges',  color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))

export const MILESTONE_SUGGESTIONS = {
  motorisch: [
    'Erstes Lächeln',
    'Ersten Kopf angehoben',
    'Erste Rolle (Bauch→Rücken)',
    'Erste Rolle (Rücken→Bauch)',
    'Ersten Sitz ohne Stütze',
    'Erste Krabbelversuche',
    'Erste Schritte',
    'Erste freie Schritte',
    'Erste Treppe hoch',
    'Erste Treppe runter',
    'Erster Zahn',
    'Erste Pinzettengriff',
    'Erstes Selbst-Essen mit Löffel',
  ],
  sprachlich: [
    'Erstes Gurren',
    'Erstes Lallen (ba-ba, ma-ma)',
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
