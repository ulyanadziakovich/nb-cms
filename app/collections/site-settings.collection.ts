// WYGENEROWANE z scripts/page-texts/spec.mjs — nie edytuj ręcznie.
// Zmiany: popraw spec.mjs i uruchom `node scripts/page-texts/generate.mjs`.
import { defineCollection } from '#pruvious'

export default defineCollection({
  name: "site-settings",
  mode: 'single',
  label: { collection: { plural: "Elementy wspólne i kontakt", singular: "Elementy wspólne i kontakt" } },
  apiRoutes: { read: 'public' },
  dashboard: {
    icon: "Settings",
    fieldLayout: [{"Kontakt":["logo","email","phone","address","facebookUrl","facebookLabel"],"Stopka":["footerTitle","footerTagline","footerDownloads","footerCopyright"],"Karty i przyciski":["readMore","siteName"],"Galerie":["galleryShowAll","gallerySwipe","galleryExpand","galleryCollapse"],"Trasy — nazwy":["difficultyEasy","difficultyMedium","difficultyHard","bikeMtb","bikeGravel","bikeEbike","bikeRoad","cardElevation"]}],
  },
  fields: {
    logo: { type: 'image', options: {"required":false,"label":"Logo (ikona)","description":"W nagłówku i stopce."} },
    email: { type: 'text', options: {"required":false,"label":"Adres e-mail","default":"biuro@nowoczesnebieszczady.pl"} },
    phone: { type: 'text', options: {"required":false,"label":"Telefon","default":"507 068 728"} },
    address: { type: 'text', options: {"required":false,"label":"Adres","default":"Ustrzyki Dolne, woj. podkarpackie"} },
    facebookUrl: { type: 'text', options: {"required":false,"label":"Facebook (adres strony)","default":"https://www.facebook.com/nowoczesne.bieszczady/?locale=pl_PL","placeholder":"np. /aktualnosci albo https://…"} },
    facebookLabel: { type: 'text', options: {"required":false,"label":"Napis „Facebook”","default":"Facebook"} },
    footerTitle: { type: 'text', options: {"required":false,"label":"Nazwa w stopce","default":"NOWOCZESNE BIESZCZADY"} },
    footerTagline: { type: 'text', options: {"required":false,"label":"Opis pod nazwą","default":"Stowarzyszenie działające na rzecz rozwoju regionu"} },
    footerDownloads: { type: 'text', options: {"required":false,"label":"Nagłówek listy dokumentów","default":"Do pobrania"} },
    footerCopyright: { type: 'text', options: {"required":false,"label":"Prawa autorskie","description":"Strona sama wstawi bieżący rok w miejsce {rok}.","default":"© {rok} Nowoczesne Bieszczady. Wszystkie prawa zastrzeżone."} },
    readMore: { type: 'text', options: {"required":false,"label":"„Czytaj więcej” na kartach wpisów","default":"Czytaj więcej →"} },
    siteName: { type: 'text', options: {"required":false,"label":"Nazwa strony w karcie przeglądarki","description":"Dopisywana po tytule podstrony, np. „Aktualności — Nowoczesne Bieszczady”.","default":"Nowoczesne Bieszczady"} },
    galleryShowAll: { type: 'text', options: {"required":false,"label":"Na ostatnim kafelku mozaiki","default":"Zobacz wszystkie"} },
    gallerySwipe: { type: 'text', options: {"required":false,"label":"Podpowiedź na telefonie","default":"Przesuń, aby zobaczyć więcej →"} },
    galleryExpand: { type: 'text', options: {"required":false,"label":"Przycisk rozwijający galerię","description":"Strona sama wstawi liczbę w miejsce {liczba}.","default":"Pokaż wszystkie zdjęcia ({liczba})"} },
    galleryCollapse: { type: 'text', options: {"required":false,"label":"Przycisk zwijający galerię","default":"Zwiń galerię"} },
    difficultyEasy: { type: 'text', options: {"required":false,"label":"Trudność: łatwa","default":"Łatwa"} },
    difficultyMedium: { type: 'text', options: {"required":false,"label":"Trudność: średnia","default":"Średnia"} },
    difficultyHard: { type: 'text', options: {"required":false,"label":"Trudność: trudna","default":"Trudna"} },
    bikeMtb: { type: 'text', options: {"required":false,"label":"Rower: MTB","default":"MTB"} },
    bikeGravel: { type: 'text', options: {"required":false,"label":"Rower: gravel","default":"Gravel"} },
    bikeEbike: { type: 'text', options: {"required":false,"label":"Rower: e-bike","default":"E-bike"} },
    bikeRoad: { type: 'text', options: {"required":false,"label":"Rower: szosa","default":"Szosa"} },
    cardElevation: { type: 'text', options: {"required":false,"label":"Na karcie trasy: przewyższenia","description":"Strona sama wstawi liczbę w miejsce {liczba}.","default":"{liczba} m przewyższeń"} },
  },
})
