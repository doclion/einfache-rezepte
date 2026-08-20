/* Einfache Rezepte — Navigation und Rezeptfilter. Ohne Abhängigkeiten. */
(function () {
  'use strict';

  /* ---------- Navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('hauptnav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var offen = nav.classList.toggle('offen');
      toggle.setAttribute('aria-expanded', String(offen));
      toggle.setAttribute('aria-label', offen ? 'Menü schließen' : 'Menü öffnen');
    });
  }

  /* ---------- Filter (nur Startseite) ---------- */
  var liste = document.getElementById('rezeptliste');
  if (!liste) return;

  var feld = document.getElementById('suche');
  var suchfeld = document.getElementById('suchfeld');
  var loeschen = document.getElementById('suche-loeschen');
  var trefferAnzeige = document.getElementById('treffer');
  var leer = document.getElementById('leer');
  var selKategorie = document.getElementById('f-kategorie');
  var selSchwierigkeit = document.getElementById('f-schwierigkeit');
  var zuruecksetzen = document.getElementById('f-zuruecksetzen');
  var leerZuruecksetzen = document.getElementById('leer-zuruecksetzen');
  var zeitChips = Array.prototype.slice.call(document.querySelectorAll('[data-zeit]'));
  var suchChips = Array.prototype.slice.call(document.querySelectorAll('[data-such]'));
  var karten = Array.prototype.slice.call(liste.querySelectorAll('.karte'));

  var zustand = { text: '', kategorie: '', schwierigkeit: '', maxZeit: 0 };

  /* Umlaute und Akzente vereinheitlichen, damit "puree" auch "Püree" findet. */
  function normal(s) {
    return (s || '')
      .toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Suchindex einmalig vorberechnen statt bei jedem Tastendruck. */
  karten.forEach(function (k) {
    k._index = normal(k.dataset.titel);
    k._minuten = parseInt(k.dataset.minuten, 10) || 0;
    k._kategorie = k.dataset.kategorie || '';
    k._schwierigkeit = k.dataset.schwierigkeit || '';
  });

  function passt(k) {
    if (zustand.kategorie && k._kategorie !== zustand.kategorie) return false;
    if (zustand.schwierigkeit && k._schwierigkeit !== zustand.schwierigkeit) return false;
    if (zustand.maxZeit && (k._minuten === 0 || k._minuten > zustand.maxZeit)) return false;
    if (zustand.text) {
      var woerter = zustand.text.split(' ');
      for (var i = 0; i < woerter.length; i++) {
        if (k._index.indexOf(woerter[i]) === -1) return false;
      }
    }
    return true;
  }

  function anwenden() {
    var n = 0;
    karten.forEach(function (k) {
      var sichtbar = passt(k);
      k.style.display = sichtbar ? '' : 'none';
      if (sichtbar) n++;
    });

    trefferAnzeige.innerHTML = '<b>' + n + '</b> ' + (n === 1 ? 'Rezept' : 'Rezepte');
    leer.hidden = n !== 0;

    var aktiv = zustand.text || zustand.kategorie || zustand.schwierigkeit || zustand.maxZeit;
    zuruecksetzen.hidden = !aktiv;
    if (suchfeld) suchfeld.classList.toggle('hat-text', !!(feld && feld.value));

    zeitChips.forEach(function (c) {
      c.setAttribute('aria-pressed', String(zustand.maxZeit === parseInt(c.dataset.zeit, 10)));
    });
    suchChips.forEach(function (c) {
      c.setAttribute('aria-pressed', String(zustand.text === normal(c.dataset.such)));
    });

    /* Suchbegriff in der URL halten, damit Treffer teilbar sind. */
    var url = new URL(window.location.href);
    if (feld && feld.value) { url.searchParams.set('q', feld.value); }
    else { url.searchParams.delete('q'); }
    window.history.replaceState(null, '', url.pathname + url.search);
  }

  var timer;
  function verzoegert() {
    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      zustand.text = normal(feld.value);
      anwenden();
    }, 120);
  }

  if (feld) {
    feld.addEventListener('input', verzoegert);
    feld.addEventListener('search', verzoegert);
  }
  if (loeschen) {
    loeschen.addEventListener('click', function () {
      feld.value = '';
      zustand.text = '';
      feld.focus();
      anwenden();
    });
  }
  if (selKategorie) {
    selKategorie.addEventListener('change', function () {
      zustand.kategorie = this.value;
      anwenden();
    });
  }
  if (selSchwierigkeit) {
    selSchwierigkeit.addEventListener('change', function () {
      zustand.schwierigkeit = this.value;
      anwenden();
    });
  }
  zeitChips.forEach(function (c) {
    c.addEventListener('click', function () {
      var wert = parseInt(c.dataset.zeit, 10);
      zustand.maxZeit = zustand.maxZeit === wert ? 0 : wert;
      anwenden();
    });
  });
  suchChips.forEach(function (c) {
    c.addEventListener('click', function () {
      var wert = normal(c.dataset.such);
      if (zustand.text === wert) { feld.value = ''; zustand.text = ''; }
      else { feld.value = c.dataset.such; zustand.text = wert; }
      anwenden();
    });
  });

  function allesZuruecksetzen() {
    zustand = { text: '', kategorie: '', schwierigkeit: '', maxZeit: 0 };
    if (feld) feld.value = '';
    if (selKategorie) selKategorie.value = '';
    if (selSchwierigkeit) selSchwierigkeit.value = '';
    anwenden();
  }
  if (zuruecksetzen) zuruecksetzen.addEventListener('click', allesZuruecksetzen);
  if (leerZuruecksetzen) leerZuruecksetzen.addEventListener('click', allesZuruecksetzen);

  /* Startzustand aus der URL übernehmen (?q=nudeln) */
  var q = new URL(window.location.href).searchParams.get('q');
  if (q && feld) {
    feld.value = q;
    zustand.text = normal(q);
  }
  anwenden();
})();
