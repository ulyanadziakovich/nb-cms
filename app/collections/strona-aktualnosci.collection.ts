// WYGENEROWANE z scripts/page-texts/spec.mjs — nie edytuj ręcznie.
// Zmiany: popraw spec.mjs i uruchom `node scripts/page-texts/generate.mjs`.
import { defineCollection } from '#pruvious'

export default defineCollection({
  name: "strona-aktualnosci",
  mode: 'single',
  label: { collection: { plural: "Strona: Aktualności", singular: "Strona: Aktualności" } },
  apiRoutes: { read: 'public' },
  dashboard: {
    icon: "News",
    additionalRecordOptionsVueComponent: './app/dashboard/ViewOnSite.vue',
    fieldLayout: [{"Nagłówek":["heroKicker","heroTitle","heroDescription","statPostsOne","statPostsFew","statPostsMany","statExtra","filterAll","pageTitle"],"Pojedynczy wpis":["galleryTitle","photosOne","photosFew","photosMany","backLink","notFound"],"Wygląd tej strony":["<./app/dashboard/ThemePreview.vue>","themeBackground","themeHero","themeTitle","themeLead","themeBody","themeAccent"]}],
  },
  fields: {
    heroKicker: { type: 'text', options: {"required":false,"label":"Napis nad tytułem","default":"Blog"} },
    heroTitle: { type: 'text', options: {"required":false,"label":"Tytuł","default":"Aktualności"} },
    heroDescription: { type: 'editor', options: {"required":false,"label":"Opis","toolbar":["heading2","heading3","paragraph","bold","italic","link","bulletList","orderedList","blockquote","clear","undo","redo"]} },
    statPostsOne: { type: 'text', options: {"required":false,"label":"Licznik: 1 wpis","description":"Strona sama wstawi liczbę w miejsce {liczba}.","default":"{liczba} opublikowany wpis"} },
    statPostsFew: { type: 'text', options: {"required":false,"label":"Licznik: 2–4 wpisy","description":"Strona sama wstawi liczbę w miejsce {liczba}.","default":"{liczba} opublikowane wpisy"} },
    statPostsMany: { type: 'text', options: {"required":false,"label":"Licznik: 5 i więcej wpisów","description":"Strona sama wstawi liczbę w miejsce {liczba}.","default":"{liczba} opublikowanych wpisów"} },
    statExtra: { type: 'text', options: {"required":false,"label":"Drugi napis pod tytułem","default":"Aktualizowane na bieżąco"} },
    filterAll: { type: 'text', options: {"required":false,"label":"Filtr kategorii: „wszystkie”","default":"Wszystkie"} },
    pageTitle: { type: 'text', options: {"required":false,"label":"Tytuł w karcie przeglądarki","default":"Aktualności"} },
    galleryTitle: { type: 'text', options: {"required":false,"label":"Nagłówek galerii","default":"Galeria"} },
    photosOne: { type: 'text', options: {"required":false,"label":"Licznik: 1 zdjęcie","description":"Strona sama wstawi liczbę w miejsce {liczba}.","default":"{liczba} zdjęcie"} },
    photosFew: { type: 'text', options: {"required":false,"label":"Licznik: 2–4 zdjęcia","description":"Strona sama wstawi liczbę w miejsce {liczba}.","default":"{liczba} zdjęcia"} },
    photosMany: { type: 'text', options: {"required":false,"label":"Licznik: 5 i więcej zdjęć","description":"Strona sama wstawi liczbę w miejsce {liczba}.","default":"{liczba} zdjęć"} },
    backLink: { type: 'text', options: {"required":false,"label":"Link powrotu","default":"← Wróć do aktualności"} },
    notFound: { type: 'text', options: {"required":false,"label":"Gdy wpisu nie ma","default":"Nie znaleziono wpisu"} },
    themeBackground: { type: 'color', options: {"required":false,"label":"Tło strony","description":"Tło całej treści tej podstrony.","default":""} },
    themeHero: { type: 'color', options: {"required":false,"label":"Tło nagłówka","description":"Tło górnej części z tytułem podstrony.","default":""} },
    themeTitle: { type: 'color', options: {"required":false,"label":"Tytuły i nagłówki","description":"Tytuł podstrony, tytuły sekcji i kart.","default":""} },
    themeLead: { type: 'color', options: {"required":false,"label":"Opisy wyróżnione (wstępy)","description":"Pierwszy akapit opisów i teksty pod tytułami sekcji.","default":""} },
    themeBody: { type: 'color', options: {"required":false,"label":"Zwykły tekst","description":"Akapity w opisach i na kartach.","default":""} },
    themeAccent: { type: 'color', options: {"required":false,"label":"Akcent: przyciski, linki, napisy nad tytułami","default":""} },
  },
})
