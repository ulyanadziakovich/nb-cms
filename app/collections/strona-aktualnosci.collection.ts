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
    fieldLayout: [{"Nagłówek":["heroKicker","heroTitle","heroDescription","statPostsOne","statPostsFew","statPostsMany","statExtra","pageTitle"],"Pojedynczy wpis":["galleryTitle","photosOne","photosFew","photosMany","backLink","notFound"]}],
  },
  fields: {
    heroKicker: { type: 'text', options: {"required":false,"label":"Napis nad tytułem","default":"Blog"} },
    heroTitle: { type: 'text', options: {"required":false,"label":"Tytuł","default":"Aktualności"} },
    heroDescription: { type: 'editor', options: {"required":false,"label":"Opis","toolbar":["heading2","heading3","paragraph","bold","italic","link","bulletList","orderedList","blockquote","clear","undo","redo"]} },
    statPostsOne: { type: 'text', options: {"required":false,"label":"Licznik: 1 wpis","description":"Strona sama wstawi liczbę w miejsce {liczba}.","default":"{liczba} opublikowany wpis"} },
    statPostsFew: { type: 'text', options: {"required":false,"label":"Licznik: 2–4 wpisy","description":"Strona sama wstawi liczbę w miejsce {liczba}.","default":"{liczba} opublikowane wpisy"} },
    statPostsMany: { type: 'text', options: {"required":false,"label":"Licznik: 5 i więcej wpisów","description":"Strona sama wstawi liczbę w miejsce {liczba}.","default":"{liczba} opublikowanych wpisów"} },
    statExtra: { type: 'text', options: {"required":false,"label":"Drugi napis pod tytułem","default":"Aktualizowane na bieżąco"} },
    pageTitle: { type: 'text', options: {"required":false,"label":"Tytuł w karcie przeglądarki","default":"Aktualności"} },
    galleryTitle: { type: 'text', options: {"required":false,"label":"Nagłówek galerii","default":"Galeria"} },
    photosOne: { type: 'text', options: {"required":false,"label":"Licznik: 1 zdjęcie","description":"Strona sama wstawi liczbę w miejsce {liczba}.","default":"{liczba} zdjęcie"} },
    photosFew: { type: 'text', options: {"required":false,"label":"Licznik: 2–4 zdjęcia","description":"Strona sama wstawi liczbę w miejsce {liczba}.","default":"{liczba} zdjęcia"} },
    photosMany: { type: 'text', options: {"required":false,"label":"Licznik: 5 i więcej zdjęć","description":"Strona sama wstawi liczbę w miejsce {liczba}.","default":"{liczba} zdjęć"} },
    backLink: { type: 'text', options: {"required":false,"label":"Link powrotu","default":"← Wróć do aktualności"} },
    notFound: { type: 'text', options: {"required":false,"label":"Gdy wpisu nie ma","default":"Nie znaleziono wpisu"} },
  },
})
