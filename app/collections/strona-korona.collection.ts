// WYGENEROWANE z scripts/page-texts/spec.mjs — nie edytuj ręcznie.
// Zmiany: popraw spec.mjs i uruchom `node scripts/page-texts/generate.mjs`.
import { defineCollection } from '#pruvious'

export default defineCollection({
  name: "strona-korona",
  mode: 'single',
  label: { collection: { plural: "Strona: Korona Ustrzyckich Gór", singular: "Strona: Korona Ustrzyckich Gór" } },
  apiRoutes: { read: 'public' },
  dashboard: {
    icon: "Mountain",
    additionalRecordOptionsVueComponent: './app/dashboard/ViewOnSite.vue',
    fieldLayout: [{"Nagłówek":["heroKicker","heroTitle","heroDescription","statPeaks","pageTitle"],"Pasek z liczbami":["barPeaksLabel","stats"],"Szczyty":["peaksKicker","peaksTitle","peaksLead","peakElevation","peakTower"],"Wydarzenia sportowe":["eventsKicker","eventsTitle","eventFree","eventMore","eventTickets"]}],
  },
  fields: {
    heroKicker: { type: 'text', options: {"required":false,"label":"Napis nad tytułem","default":"Turystyka górska"} },
    heroTitle: { type: 'text', options: {"required":false,"label":"Tytuł","default":"Zdobądź Koronę Ustrzyckich Gór!"} },
    heroDescription: { type: 'editor', options: {"required":false,"label":"Opis","default":"<p>Jeżeli lubicie aktywnie spędzać czas i chcecie poznać Ustrzyki Dolne z zupełnie innej perspektywy, mamy dla Was wyjątkową propozycję – Koronę Ustrzyckich Gór.</p><p>To pięć szczytów otaczających Ustrzyki Dolne, które można zdobyć podczas jednej dłuższej wyprawy albo podzielić trasę na kilka krótszych etapów.</p><p>Nasza propozycja rozpoczyna się w Parku Pod Dębami. Stąd ruszamy w kierunku Orlika, następnie przez Gromadzyń i Żuków na Małego Króla, a później na Lawortę, skąd wracamy do Ustrzyk Dolnych i Parku Pod Dębami.</p><p>🥾 Pieszo – przejście całej Korony to już konkretne górskie wyzwanie. W zależności od kondycji i tempa warto zarezerwować na nie około 6–9 godzin.</p><p>🚴‍♂️ Rowerem – trasę można również pokonać na dwóch kółkach. W tym przypadku wyprawa zajmuje zazwyczaj około 3–5 godzin.</p><p>Na naszej stronie, w zakładce Trasy rowerowe – Korona Ustrzyckich Gór, przygotowaliśmy dokładny przebieg trasy. Możecie pobrać ślad GPX, sprawdzić profil i przewyższenia oraz obejrzeć zdjęcia z poszczególnych odcinków. Dzięki temu łatwo zaplanujecie swoją wyprawę i będziecie mogli poruszać się przygotowanym przez nas śladem.</p><p>Nie musicie też zdobywać całej Korony jednego dnia. Trasę podzieliliśmy na mniejsze odcinki, dlatego jeśli macie mniej czasu, możecie poznawać kolejne szczyty podczas kilku osobnych wycieczek.</p><p>📸 A na szczytach czeka dodatkowa motywacja!</p><p>Na każdym z pięciu szczytów znajduje się charakterystyczna figura. Zróbcie przy niej zdjęcie potwierdzające zdobycie szczytu, a po skompletowaniu całej Korony możecie zgłosić się do Centrum Informacji i Promocji w Ustrzykach Dolnych, gdzie czeka nagroda za ukończenie wyzwania.</p><p>Przede wszystkim jednak warto zrobić to dla samej przyjemności wędrowania. Korona Ustrzyckich Gór prowadzi przez miejsca oferujące przepiękne krajobrazy, panoramy Ustrzyk Dolnych i widoki, dla których naprawdę warto zatrzymać się na chwilę.</p><p>Przyjeżdżajcie do Ustrzyk Dolnych, ruszajcie na szlak i zdobywajcie Koronę Ustrzyckich Gór – całą za jednym razem albo szczyt po szczycie.</p><p>Bo Ustrzyki najlepiej poznaje się właśnie z góry. ⛰️</p>","toolbar":["heading2","heading3","paragraph","bold","italic","link","bulletList","orderedList","blockquote","clear","undo","redo"]} },
    statPeaks: { type: 'text', options: {"required":false,"label":"Licznik szczytów (pod tytułem)","description":"Strona sama wstawi liczbę w miejsce {liczba}.","default":"{liczba} szczytów w pętli"} },
    pageTitle: { type: 'text', options: {"required":false,"label":"Tytuł w karcie przeglądarki","default":"Korona Ustrzyckich Gór"} },
    barPeaksLabel: { type: 'text', options: {"required":false,"label":"Podpis liczby szczytów","default":"Szczytów w pętli"} },
    stats: { type: 'text-area', options: {"required":false,"label":"Pozostałe liczby","description":"Jedna pozycja w linii, w formie „Podpis: wartość”, np. „Długość trasy: 30,9 km”. Wartości pokazują się też pod tytułem strony.","default":"Długość trasy: 30,9 km\nCzas przejścia: 10–11 godz.\nSuma przewyższeń: 1187 m","rows":4} },
    peaksKicker: { type: 'text', options: {"required":false,"label":"Napis nad tytułem","default":"Pięć szczytów, jedna pętla"} },
    peaksTitle: { type: 'text', options: {"required":false,"label":"Tytuł","default":"Szczyty do zdobycia"} },
    peaksLead: { type: 'text-area', options: {"required":false,"label":"Opis","default":"Trasa prowadzi kolejno przez pięć wzniesień — zdobycie wszystkich w ramach jednej pętli można potwierdzić pieczątką w Punkcie Informacji Turystycznej w Ustrzykach Dolnych.","rows":3} },
    peakElevation: { type: 'text', options: {"required":false,"label":"Wysokość szczytu","description":"Strona sama wstawi wysokość w miejsce {liczba}.","default":"{liczba} m n.p.m."} },
    peakTower: { type: 'text', options: {"required":false,"label":"Oznaczenie wieży","default":"Wieża widokowa"} },
    eventsKicker: { type: 'text', options: {"required":false,"label":"Napis nad tytułem","default":"Wydarzenia sportowe"} },
    eventsTitle: { type: 'text', options: {"required":false,"label":"Tytuł","default":"Rajdy i mecze terenowe"} },
    eventFree: { type: 'text', options: {"required":false,"label":"Oznaczenie bezpłatnego wydarzenia","default":"Wstęp wolny"} },
    eventMore: { type: 'text', options: {"required":false,"label":"Przycisk „Więcej”","default":"Więcej"} },
    eventTickets: { type: 'text', options: {"required":false,"label":"Przycisk biletów","default":"Bilety"} },
  },
})
