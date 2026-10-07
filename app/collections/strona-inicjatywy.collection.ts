// WYGENEROWANE z scripts/page-texts/spec.mjs — nie edytuj ręcznie.
// Zmiany: popraw spec.mjs i uruchom `node scripts/page-texts/generate.mjs`.
import { defineCollection } from '#pruvious'

export default defineCollection({
  name: "strona-inicjatywy",
  mode: 'single',
  label: { collection: { plural: "Strona: Inicjatywy", singular: "Strona: Inicjatywy" } },
  apiRoutes: { read: 'public' },
  dashboard: {
    icon: "Bulb",
    additionalRecordOptionsVueComponent: './app/dashboard/ViewOnSite.vue',
    fieldLayout: [{"Nagłówek":["heroKicker","heroTitle","heroDescription","stats","pageTitle"],"Bieszczady w eterze":["eterKicker","eterTitle","eterText","eterImage"],"Burza Mózgów":["burzaKicker","burzaTitle","burzaText","burzaImage"],"Ramka na dole":["noteKicker","noteTitle","noteText","noteButton"],"Wygląd tej strony":["<./app/dashboard/ThemePreview.vue>","themeBackground","themeHero","themeTitle","themeLead","themeBody","themeAccent"]}],
  },
  fields: {
    heroKicker: { type: 'text', options: {"required":false,"label":"Napis nad tytułem","default":"Edukacja i społeczność"} },
    heroTitle: { type: 'text', options: {"required":false,"label":"Tytuł","default":"Inicjatywy społeczne i edukacja"} },
    heroDescription: { type: 'editor', options: {"required":false,"label":"Opis","default":"<p>Warsztaty, debaty i projekty budujące kompetencje i głos lokalnej społeczności.</p>","toolbar":["heading2","heading3","paragraph","bold","italic","link","bulletList","orderedList","blockquote","clear","undo","redo"]} },
    stats: { type: 'text-area', options: {"required":false,"label":"Napisy pod tytułem","description":"Jeden napis w linii.","default":"Warsztaty podcastowe\nCykliczne debaty\nOtwarte dla mieszkańców","rows":3} },
    pageTitle: { type: 'text', options: {"required":false,"label":"Tytuł w karcie przeglądarki","default":"Inicjatywy społeczne i edukacja"} },
    eterKicker: { type: 'text', options: {"required":false,"label":"Napis nad tytułem","default":"Projekt warsztatowy"} },
    eterTitle: { type: 'text', options: {"required":false,"label":"Tytuł","default":"Bieszczady w eterze"} },
    eterText: { type: 'editor', options: {"required":false,"label":"Tekst","default":"<p>Cykl warsztatów podcastowych dla lokalnych liderów i liderek. Uczymy planowania odcinków, nagrywania i montażu dźwięku oraz budowania narracji o swojej okolicy — tak, żeby dotrzeć do słuchaczy spoza regionu.</p><p>Efektem warsztatów są realne odcinki podcastu nagrane i wyemitowane przez uczestników projektu.</p>","toolbar":["heading2","heading3","paragraph","bold","italic","link","bulletList","orderedList","blockquote","clear","undo","redo"]} },
    eterImage: { type: 'image', options: {"required":false,"label":"Zdjęcie"} },
    burzaKicker: { type: 'text', options: {"required":false,"label":"Napis nad tytułem","default":"Debaty społeczne"} },
    burzaTitle: { type: 'text', options: {"required":false,"label":"Tytuł","default":"Bieszczadzka Burza Mózgów 2026– wspólnie o przyszłości turystyki w Bieszczadach"} },
    burzaText: { type: 'editor', options: {"required":false,"label":"Tekst","default":"<p>Jednym z ważnych celów Stowarzyszenia Nowoczesne Bieszczady jest rozwój turystyki. W naszych działaniach koncentrujemy się przede wszystkim na Ustrzykach Dolnych i powiecie bieszczadzkim, ale od początku zależy nam również na współpracy ponad lokalnymi granicami i budowaniu wspólnej, silnej marki całych Bieszczad.</p><p>Właśnie taką ideę ma Bieszczadzka Burza Mózgów – cykl spotkań łączących branżę turystyczną, przedsiębiorców, samorządowców oraz instytucje odpowiedzialne za rozwój i promocję regionu.</p><p>20 kwietnia 2026 roku mieliśmy przyjemność być współorganizatorami i gospodarzami kolejnej edycji wydarzenia, która odbyła się w Niedźwiadku pod Holicą. W spotkaniu uczestniczyło blisko 90 osób związanych z turystyką i rozwojem Bieszczad.</p><p>To właśnie takich rozmów potrzebujemy. Przy jednym stole spotykają się osoby, które na co dzień prowadzą obiekty turystyczne, gastronomiczne i inne firmy, przedstawiciele samorządów oraz instytucji regionalnych. Możemy wspólnie mówić zarówno o problemach – w tym o obserwowanym spadku ruchu turystycznego – jak również o nowych pomysłach, inwestycjach i atrakcjach, które mogą zwiększyć zainteresowanie naszym regionem.</p><p>W tegorocznym spotkaniu uczestniczył m.in. Piotr Pilch – Wicemarszałek Województwa Podkarpackiego, Pani Wioletta Rejman - Dyrektor Departamentu Promocji i Turystyki  Urzędu Marszałkowskiego, Podkarpackiej Regionalnej Organizacji Turystycznej, samorządów z terenu Bieszczad, powiatów bieszczadzkiego i leskiego, Lasów Państwowych oraz liczna reprezentacja branży turystycznej.</p><p>Jednym z najważniejszych tematów tegorocznej edycji była turystyka rowerowa w Bieszczadach. Nasz region ma ogromny potencjał – piękne krajobrazy, zróżnicowany teren i miejsca, które wręcz zachęcają do poznawania ich z perspektywy roweru. Jednocześnie wciąż brakuje nam spójnej i dobrze oznakowanej sieci tras rowerowych.</p><p>Podczas spotkania dużo miejsca poświęcono właśnie temu problemowi oraz planom rozwoju nowych tras i stworzenia bardziej kompleksowej oferty dla rowerzystów.</p><p>Ważne są jednak nie tylko same trasy, ale również usługi, które powstają wokół nich. Zbigniew Prasoł zaprezentował podczas spotkania nowoczesny pomysł na wypożyczalnię rowerów elektrycznych w Ustrzykach Dolnych – system, w którym turysta będzie mógł zamówić odpowiednio dobrany rower wraz z dostawą bezpośrednio do miejsca swojego pobytu.</p><p>Takie przedsięwzięcia pokazują, że rozwój turystyki to nie tylko duże inwestycje infrastrukturalne. To również pomysłowość lokalnych przedsiębiorców, nowe produkty turystyczne i współpraca wielu środowisk.</p><p>Bieszczadzka Burza Mózgów ma być właśnie miejscem takiej współpracy. Chcemy inicjować rozmowę, łączyć ludzi i zachęcać branżę turystyczną oraz samorządy do wspólnego działania.</p><p>Bo Bieszczady możemy skutecznie promować i rozwijać tylko razem.</p>","toolbar":["heading2","heading3","paragraph","bold","italic","link","bulletList","orderedList","blockquote","clear","undo","redo"]} },
    burzaImage: { type: 'image', options: {"required":false,"label":"Zdjęcie"} },
    noteKicker: { type: 'text', options: {"required":false,"label":"Napis nad tytułem","default":"Bądź na bieżąco"} },
    noteTitle: { type: 'text', options: {"required":false,"label":"Tytuł","default":"Relacje ze spotkań i warsztatów"} },
    noteText: { type: 'text-area', options: {"required":false,"label":"Tekst","default":"Zdjęcia, podsumowania i najświeższe wieści z „Bieszczad w eterze”, „Bieszczadzkiej Burzy Mózgów” i innych naszych inicjatyw publikujemy na bieżąco w Aktualnościach.","rows":3} },
    noteButton: { type: 'text', options: {"required":false,"label":"Przycisk","default":"Zobacz aktualności"} },
    themeBackground: { type: 'color', options: {"required":false,"label":"Tło strony","description":"Tło całej treści tej podstrony.","default":""} },
    themeHero: { type: 'color', options: {"required":false,"label":"Tło nagłówka","description":"Tło górnej części z tytułem podstrony.","default":""} },
    themeTitle: { type: 'color', options: {"required":false,"label":"Tytuły i nagłówki","description":"Tytuł podstrony, tytuły sekcji i kart.","default":""} },
    themeLead: { type: 'color', options: {"required":false,"label":"Opisy wyróżnione (wstępy)","description":"Pierwszy akapit opisów i teksty pod tytułami sekcji.","default":""} },
    themeBody: { type: 'color', options: {"required":false,"label":"Zwykły tekst","description":"Akapity w opisach i na kartach.","default":""} },
    themeAccent: { type: 'color', options: {"required":false,"label":"Akcent: przyciski, linki, napisy nad tytułami","default":""} },
  },
})
