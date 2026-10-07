// WYGENEROWANE z scripts/page-texts/spec.mjs — nie edytuj ręcznie.
// Zmiany: popraw spec.mjs i uruchom `node scripts/page-texts/generate.mjs`.
import { defineCollection } from '#pruvious'

export default defineCollection({
  name: "home",
  mode: 'single',
  label: { collection: { plural: "Strona: Główna", singular: "Strona: Główna" } },
  apiRoutes: { read: 'public' },
  dashboard: {
    icon: "Home",
    additionalRecordOptionsVueComponent: './app/dashboard/ViewOnSite.vue',
    fieldLayout: [{"Nagłówek ze zdjęciem":["heroImage","heroKicker","heroTitle","heroSubtitle","heroCta","heroCtaHref"],"Kafelki pod nagłówkiem":["tiles"],"Krótko o nas":["aboutKicker","aboutTitle","aboutParagraph1","aboutParagraph2","aboutTagline","aboutImage"],"Najnowsze aktualności":["newsKicker","newsTitle","newsAllLink"],"Wygląd tej strony":["<./app/dashboard/ThemePreview.vue>","themeBackground","themeHero","themeTitle","themeLead","themeBody","themeAccent"]}],
  },
  fields: {
    heroImage: { type: 'image', options: {"required":false,"label":"Zdjęcie tła","description":"Duże zdjęcie na samej górze strony głównej."} },
    heroKicker: { type: 'text', options: {"required":false,"label":"Napis nad tytułem","default":"Ustrzyki Dolne · Bieszczady"} },
    heroTitle: { type: 'text', options: {"required":false,"label":"Tytuł","default":"NOWOCZESNE BIESZCZADY"} },
    heroSubtitle: { type: 'text-area', options: {"required":false,"label":"Podtytuł","default":"Tworzymy wydarzenia, konkursy i inicjatywy, które budują tożsamość regionu.","rows":2} },
    heroCta: { type: 'text', options: {"required":false,"label":"Napis na przycisku","default":"Dowiedz się więcej"} },
    heroCtaHref: { type: 'text', options: {"required":false,"label":"Dokąd prowadzi przycisk","default":"/o-nas/misja","placeholder":"np. /aktualnosci albo https://…"} },
    tiles: { type: 'repeater', options: { ...{"required":false,"label":"Kafelki","description":"Trzy duże kafelki pod zdjęciem na stronie głównej. Kolejność zmienisz, przeciągając kafelki.","addLabel":"Dodaj kafelek"}, subfields: {"title":{"type":"text","options":{"required":true,"label":"Tytuł"}},"text":{"type":"text-area","options":{"required":false,"label":"Opis","rows":3}},"image":{"type":"image","options":{"required":false,"label":"Zdjęcie"}},"tags":{"type":"text-area","options":{"required":false,"label":"Etykiety","description":"Jedna etykieta w linii, np. „Pliki GPX”.","rows":2}},"ctaLabel":{"type":"text","options":{"required":false,"label":"Napis na przycisku","placeholder":"np. Zobacz trasy"}},"href":{"type":"text","options":{"required":false,"label":"Dokąd prowadzi kafelek","placeholder":"np. /szlaki"}}} } },
    aboutKicker: { type: 'text', options: {"required":false,"label":"Napis nad tytułem","default":"Stowarzyszenie"} },
    aboutTitle: { type: 'text', options: {"required":false,"label":"Tytuł","default":"Krótko o nas"} },
    aboutParagraph1: { type: 'text-area', options: {"required":false,"label":"Tekst — część 1","description":"Pytanie na końcu linii (?) = śródtytuł, linia od emoji = karta „filaru”, linia z wcięciem = punkt w karcie.","rows":10} },
    aboutParagraph2: { type: 'text-area', options: {"required":false,"label":"Tekst — część 2","rows":4} },
    aboutTagline: { type: 'text', options: {"required":false,"label":"Hasło na zdjęciu","default":"„SKUTECZNI DLA WAS”"} },
    aboutImage: { type: 'image', options: {"required":false,"label":"Zdjęcie","description":"Szeroka panorama w środku sekcji."} },
    newsKicker: { type: 'text', options: {"required":false,"label":"Napis nad tytułem","default":"Blog"} },
    newsTitle: { type: 'text', options: {"required":false,"label":"Tytuł","default":"Najnowsze aktualności"} },
    newsAllLink: { type: 'text', options: {"required":false,"label":"Link do wszystkich","default":"Zobacz wszystkie aktualności"} },
    themeBackground: { type: 'color', options: {"required":false,"label":"Tło strony","description":"Tło całej treści tej podstrony.","default":""} },
    themeHero: { type: 'color', options: {"required":false,"label":"Tło nagłówka","description":"Tło górnej części z tytułem podstrony.","default":""} },
    themeTitle: { type: 'color', options: {"required":false,"label":"Tytuły i nagłówki","description":"Tytuł podstrony, tytuły sekcji i kart.","default":""} },
    themeLead: { type: 'color', options: {"required":false,"label":"Opisy wyróżnione (wstępy)","description":"Pierwszy akapit opisów i teksty pod tytułami sekcji.","default":""} },
    themeBody: { type: 'color', options: {"required":false,"label":"Zwykły tekst","description":"Akapity w opisach i na kartach.","default":""} },
    themeAccent: { type: 'color', options: {"required":false,"label":"Akcent: przyciski, linki, napisy nad tytułami","default":""} },
  },
})
