// Grupy w menu panelu — według stron witryny. Pozycje, których tu nie ma
// (np. Media, Użytkownicy), pokazują się na dole bez grupy.
export interface MenuGroup {
  label: string
  items: { collection: string; label: string }[]
}

export const MENU_GROUPS: MenuGroup[] = [
  { label: 'Strona główna', items: [{ collection: 'home', label: 'Teksty, zdjęcia i kafelki' }] },
  {
    label: 'Szlaki rowerowe',
    items: [
      { collection: 'strona-szlaki', label: 'Teksty strony' },
      { collection: 'trails', label: 'Trasy' },
      { collection: 'strona-trasa', label: 'Teksty na stronie trasy' },
    ],
  },
  {
    label: 'Ustrzyki 2036',
    items: [
      { collection: 'dream-map-settings', label: 'Teksty i zdjęcia strony' },
      { collection: 'dream-map-points', label: 'Postulaty' },
      { collection: 'dream-map-categories', label: 'Kategorie' },
      { collection: 'dream-map-ideas', label: 'Zgłoszone pomysły' },
    ],
  },
  {
    label: 'Korona Ustrzyckich Gór',
    items: [
      { collection: 'strona-korona', label: 'Teksty strony' },
      { collection: 'peaks', label: 'Szczyty' },
    ],
  },
  {
    label: 'Kultura',
    items: [
      { collection: 'strona-kultura', label: 'Teksty strony' },
      { collection: 'contests', label: 'Konkursy' },
      { collection: 'festival-editions', label: 'Edycje festiwalu' },
    ],
  },
  { label: 'Inicjatywy', items: [{ collection: 'strona-inicjatywy', label: 'Teksty i zdjęcia strony' }] },
  {
    label: 'Aktualności',
    items: [
      { collection: 'strona-aktualnosci', label: 'Teksty strony' },
      { collection: 'news', label: 'Wpisy' },
    ],
  },
  {
    label: 'O nas',
    items: [
      { collection: 'strona-o-nas', label: 'Teksty, osoby, partnerzy, cele, wolontariat' },
      { collection: 'reports', label: 'Sprawozdania' },
    ],
  },
  { label: 'Kontakt', items: [{ collection: 'strona-kontakt', label: 'Teksty strony' }] },
  {
    label: 'Ustawienia strony',
    items: [
      { collection: 'site-settings', label: 'Elementy wspólne, kontakt i wygląd' },
      { collection: 'navigation', label: 'Menu strony' },
      { collection: 'documents', label: 'Dokumenty w stopce' },
    ],
  },
]
