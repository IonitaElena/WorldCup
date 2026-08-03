# Smart Digital World Cup

Aplicatia web Smart Digital World Cup este o solutie interactiva pentru urmarirea competitiei FIFA World Cup 2026, construita cu Angular 22. Scopul proiectului este de a centraliza informatiile despre turneu intr-o interfata moderna, usor de folosit si orientata catre experienta utilizatorului.

## Ce ofera aplicatia

Aplicatia include mai multe module principale:

- Pagina principala cu meciurile si informatii despre turneu
- Clasamentul grupelor pentru fiecare serie de echipe
- Faza eliminatorie cu structura de tip bracket
- Istoricul meciurilor si rezultatelor
- Harta echipelor calificate
- Sectiunea Fantasy League pentru crearea unei echipe si filtrarea jucatorilor

## Cerinte proiectului

Proiectul a fost gandit ca o platforma digitala pentru suportul urmaririi Campionatului Mondial, cu accent pe:

- prezentarea clara a meciurilor si rezultatelor
- navigare usoara intre sectiuni
- experienta interactiva pe desktop si dispozitive mobile
- integrarea unor componente vizuale moderne, precum harta, bracket si liste de jucatori
- suport pentru o experienta de tip „fan engagement” prin sectiunea Fantasy League

# Functionalitati principale

Aplicatia este impartita in mai multe module, fiecare avand un rol bine definit:

## Acasa (Home)

Pagina principala ofera o imagine de ansamblu asupra competitiei si contine:

- rezultatele celor mai recente meciuri;
- lista meciurilor programate;
- informatii generale despre turneu;
- carduri interactive pentru fiecare meci.

## Faza eliminatorie

Modul dedicat fazei eliminatorii afiseaza competitia sub forma unui **bracket**.

Acesta include:

- optimi;
- sferturi de finala;
- semifinale;
- finala.

Pentru fiecare meci sunt afisate:

- echipele participante;
- scorul (daca meciul este incheiat);
- data si ora disputarii.

Prin selectarea unui meci se deschide o fereastra cu informatii suplimentare cum ar fi:

- scorul, data.ora;
- jucatorii care au dat gol;
- jucatorii care au batut penalty;
- detalii despre stadionul pe care s-a jucat.

## Clasamentul grupelor

Aplicatia afiseaza clasamentul fiecarei grupe participante la Campionatul Mondial.

Pentru fiecare echipa sunt prezentate:

- pozitia in grupa;
- numarul de meciuri jucate;
- victorii;
- egaluri;
- infrangeri;
- goluri marcate si primite;
- punctajul acumulat.

## Istoric meciuri

Aceasta sectiune permite consultarea tuturor meciurilor disputate.

Meciurile sunt organizate:

- dupa faza grupelor;
- dupa faza eliminatorie.

Pentru fiecare meci sunt afisate:

- echipele;
- scorul final;
- data la care s-a jucat.

## Harta echipelor participante

Aplicatia include o harta interactiva realizata cu **MapLibre/Mapbox**.

Functionalitati:

- afisarea echipelor participante prin markere;
- tooltip la pozitionarea cursorului peste marker;
- fereastra cu informatii detaliate la selectarea unei echipe.

In cadrul ferestrei sunt prezentate:

- numele tarii;
- steagul;
- antrenorul;
- lotul de jucatori;
- informatii suplimentare despre echipa.

## Fantasy League

Utilizatorul isi poate crea propria echipa Fantasy.

Functionalitatile disponibile includ:

- alegerea numelui echipei;
- incarcarea unei sigle personalizate;
- selectarea intervalului de meciuri;
- alegerea jucatorilor;
- organizarea echipei prin mecanism de **Drag & Drop**.

## Structura principala a proiectului

```
src/app/
  pages/          # pagini ale aplicatiei
  shared/         # componente reutilizabile
  services/       # servicii pentru date si logica aplicatiei
  models/         # modele TypeScript
```

# Componente principale

## Home

- Match Section
- Match Card

## Faza eliminatorie

- Bracket
- Knockout Bracket
- Knockout Column
- Knockout Match Card
- Match Details Dialog
- Organization Bracket

## Clasamentul grupelor

- Group Table
- Last Five
- Legend

## Istoric meciuri

- Matches History Section
- Match Card

## Harta

- Map Component
- Team Marker
- Team Tooltip
- Team Details
- Player Details

## Fantasy League

- Team Form
- Player List
- Selected Team

## Tehnologii utilizate

- Angular 22
- TypeScript
- Angular Material
- PrimeNG
- RxJS
- MapLibre / Mapbox pentru harti
- Brackets viewer pentru arborele competitiei
- HTML
- CSS

## Cerinte de sistem

- Node.js 20+
- npm 10+

## Instalare

```bash
npm install
```

## Rulare in dezvoltare

```bash
npm start

ng serve -o
```

Dupa pornirea serverului, deschideti browserul la adresa:

```text
http://localhost:4200/
```

## Build pentru productie

```bash
npm run build
```

## Testare

```bash
npm test
```
