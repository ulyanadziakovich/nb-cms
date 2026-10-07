// WYGENEROWANE z scripts/page-texts/spec.mjs — nie edytuj ręcznie.
// Zmiany: popraw spec.mjs i uruchom `node scripts/page-texts/generate.mjs`.
import { defineCollection } from '#pruvious'

export default defineCollection({
  name: "strona-kontakt",
  mode: 'single',
  label: { collection: { plural: "Strona: Kontakt", singular: "Strona: Kontakt" } },
  apiRoutes: { read: 'public' },
  dashboard: {
    icon: "Mail",
    additionalRecordOptionsVueComponent: './app/dashboard/ViewOnSite.vue',
    fieldLayout: [{"Nagłówek":["heroKicker","heroTitle","heroDescription","stats","pageTitle"],"Formularz":["formTitle","formSuccess","formName","formNamePlaceholder","formEmail","formEmailPlaceholder","formMessage","formMessagePlaceholder","formSubmit"],"Dane kontaktowe":["infoTitle","socialTitle","infoText","labelEmail","labelPhone","labelAddress","formNote"],"Wygląd tej strony":["<./app/dashboard/ThemePreview.vue>","themeBackground","themeHero","themeTitle","themeLead","themeBody","themeAccent"]}],
  },
  fields: {
    heroKicker: { type: 'text', options: {"required":false,"label":"Napis nad tytułem","default":"Kontakt"} },
    heroTitle: { type: 'text', options: {"required":false,"label":"Tytuł","default":"Skontaktuj się z nami"} },
    heroDescription: { type: 'editor', options: {"required":false,"label":"Opis","default":"<p>Masz pytanie, pomysł na współpracę albo chcesz dołączyć do stowarzyszenia? Napisz do nas.</p>","toolbar":["heading2","heading3","paragraph","bold","italic","link","bulletList","orderedList","blockquote","clear","undo","redo"]} },
    stats: { type: 'text-area', options: {"required":false,"label":"Napisy pod tytułem","description":"Jeden napis w linii.","default":"Odpowiadamy do 48h\nUstrzyki Dolne\nOtwarci na współpracę","rows":3} },
    pageTitle: { type: 'text', options: {"required":false,"label":"Tytuł w karcie przeglądarki","default":"Kontakt"} },
    formTitle: { type: 'text', options: {"required":false,"label":"Tytuł formularza","default":"Formularz kontaktowy"} },
    formSuccess: { type: 'text-area', options: {"required":false,"label":"Po wysłaniu","default":"Dziękujemy! Twoja wiadomość została zapisana — odpowiemy najszybciej, jak to możliwe.","rows":2} },
    formName: { type: 'text', options: {"required":false,"label":"Pole: imię i nazwisko","default":"Imię i nazwisko"} },
    formNamePlaceholder: { type: 'text', options: {"required":false,"label":"Podpowiedź w polu imienia","default":"Jan Kowalski"} },
    formEmail: { type: 'text', options: {"required":false,"label":"Pole: e-mail","default":"Adres e-mail"} },
    formEmailPlaceholder: { type: 'text', options: {"required":false,"label":"Podpowiedź w polu e-mail","default":"jan@przyklad.pl"} },
    formMessage: { type: 'text', options: {"required":false,"label":"Pole: wiadomość","default":"Wiadomość"} },
    formMessagePlaceholder: { type: 'text', options: {"required":false,"label":"Podpowiedź w polu wiadomości","default":"W czym możemy pomóc?"} },
    formSubmit: { type: 'text', options: {"required":false,"label":"Przycisk wysyłania","default":"Wyślij wiadomość"} },
    infoTitle: { type: 'text', options: {"required":false,"label":"Nagłówek danych","default":"Stowarzyszenie Nowoczesne Bieszczady"} },
    socialTitle: { type: 'text', options: {"required":false,"label":"Nagłówek mediów społecznościowych","default":"Social media"} },
    infoText: { type: 'text-area', options: {"required":false,"label":"Tekst pod nagłówkiem","default":"Najszybciej skontaktujesz się z nami mailowo lub telefonicznie. Chętnie porozmawiamy o współpracy, projektach i wydarzeniach.","rows":2} },
    labelEmail: { type: 'text', options: {"required":false,"label":"Podpis: e-mail","default":"E-mail"} },
    labelPhone: { type: 'text', options: {"required":false,"label":"Podpis: telefon","default":"Telefon"} },
    labelAddress: { type: 'text', options: {"required":false,"label":"Podpis: adres","default":"Adres"} },
    formNote: { type: 'text', options: {"required":false,"label":"Notka pod przyciskiem formularza","default":"Odpowiadamy zwykle w ciągu 48 godzin."} },
    themeBackground: { type: 'color', options: {"required":false,"label":"Tło strony","description":"Tło całej treści tej podstrony.","default":""} },
    themeHero: { type: 'color', options: {"required":false,"label":"Tło nagłówka","description":"Tło górnej części z tytułem podstrony.","default":""} },
    themeTitle: { type: 'color', options: {"required":false,"label":"Tytuły i nagłówki","description":"Tytuł podstrony, tytuły sekcji i kart.","default":""} },
    themeLead: { type: 'color', options: {"required":false,"label":"Opisy wyróżnione (wstępy)","description":"Pierwszy akapit opisów i teksty pod tytułami sekcji.","default":""} },
    themeBody: { type: 'color', options: {"required":false,"label":"Zwykły tekst","description":"Akapity w opisach i na kartach.","default":""} },
    themeAccent: { type: 'color', options: {"required":false,"label":"Akcent: przyciski, linki, napisy nad tytułami","default":""} },
  },
})
