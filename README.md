# Siguranța la Negru

Platformă educațională statică, în limba română, pregătită pentru GitHub Pages.

## Structură

- `index.html` — pagina principală
- `pages/` — paginile tematice și, pe viitor, paginile articolelor
- `assets/css/main.css` — sistemul vizual comun, variabilele și stilurile responsive
- `assets/js/site.js` — navigația, subsolul și comportamentul meniului mobil
- `assets/images/` — identitatea vizuală SLN

## Adăugarea articolelor

Pentru o bibliotecă mare, articolele se pot grupa pe categorii:

```text
pages/
  educatie/
    numele-articolului.html
  siguranta/
    numele-articolului.html
```

Fiecare articol trebuie să folosească `main.css`, `site.js`, un element semantic `<article>` și căi relative potrivite pentru nivelul său. Cardurile de pe pagina principală pot fi apoi legate direct către noile fișiere.

## Publicare

Nu există proces de compilare sau dependențe. Conținutul poate fi publicat direct din ramura principală prin GitHub Pages.
