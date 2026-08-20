/* Einfache Rezepte — Portionsrechner und Kochmodus. */
(function () {
  'use strict';

  /* ==================================================================
     Portionsrechner
     Rechnet immer aus dem unveraenderten Basiswert im data-Attribut.
     Dadurch entsteht kein Rundungsdrift beim Hoch- und Runterzaehlen.
     ================================================================== */
  var anzeige = document.getElementById('portion-anzeige');
  if (anzeige) {
    var basis = parseFloat(anzeige.dataset.basis) || 4;
    var aktuell = basis;
    var minus = document.getElementById('portion-minus');
    var plus = document.getElementById('portion-plus');
    var mengen = Array.prototype.slice.call(document.querySelectorAll('.zutaten .menge'));

    mengen.forEach(function (el) {
      el.dataset.einheit = el.textContent.replace(/^[\d.,\s]+/, '').trim();
    });

    function formatiere(zahl) {
      /* Kaufmaennisch auf sinnvolle Genauigkeit runden, nie auf 0. */
      var gerundet;
      if (zahl >= 100) gerundet = Math.round(zahl);
      else if (zahl >= 10) gerundet = Math.round(zahl * 2) / 2;
      else gerundet = Math.round(zahl * 4) / 4;
      if (gerundet === 0) gerundet = Math.round(zahl * 100) / 100;
      return String(gerundet).replace('.', ',');
    }

    function aktualisiere() {
      anzeige.textContent = aktuell;
      var faktor = aktuell / basis;
      mengen.forEach(function (el) {
        var b = parseFloat(el.dataset.basismenge);
        if (isNaN(b)) return;
        var einheit = el.dataset.einheit;
        el.textContent = formatiere(b * faktor) + (einheit ? ' ' + einheit : '');
      });
      minus.disabled = aktuell <= 1;
      plus.disabled = aktuell >= 24;
    }

    minus.addEventListener('click', function () { if (aktuell > 1) { aktuell--; aktualisiere(); } });
    plus.addEventListener('click', function () { if (aktuell < 24) { aktuell++; aktualisiere(); } });
    aktualisiere();
  }

  /* ==================================================================
     Kochmodus
     ================================================================== */
  var daten = document.getElementById('kochmodus-daten');
  var overlay = document.getElementById('kochmodus');
  var start = document.getElementById('kochmodus-start');
  if (!daten || !overlay || !start) return;

  var schritte;
  try { schritte = JSON.parse(daten.textContent).schritte || []; }
  catch (e) { return; }
  if (!schritte.length) return;

  var idx = 0;
  var wakeLock = null;
  var timerId = null;
  var elText = document.getElementById('km-text');
  var elZaehler = document.getElementById('km-zaehler');
  var elBalken = document.getElementById('km-balken');
  var btnTimer = document.getElementById('km-timer');
  var btnZurueck = document.getElementById('km-zurueck');
  var btnWeiter = document.getElementById('km-weiter');
  var btnSchliessen = document.getElementById('km-schliessen');
  var vorherFokus = null;

  /* Erste Zeitangabe im Schritt finden, z. B. "15 Minuten" oder "1 Std". */
  function minutenAus(text) {
    var m = text.match(/(\d+)\s*(?:bis\s*\d+\s*)?(min|minute|minuten)\b/i);
    if (m) return parseInt(m[1], 10);
    var h = text.match(/(\d+)\s*(?:std|stunde|stunden)\b/i);
    if (h) return parseInt(h[1], 10) * 60;
    return 0;
  }

  function stoppeTimer() {
    if (timerId) { window.clearInterval(timerId); timerId = null; }
  }

  function starteTimer(minuten) {
    stoppeTimer();
    var rest = minuten * 60;
    btnTimer.disabled = false;
    function tick() {
      var m = Math.floor(rest / 60), s = rest % 60;
      btnTimer.textContent = m + ':' + (s < 10 ? '0' : '') + s;
      if (rest <= 0) {
        stoppeTimer();
        btnTimer.textContent = 'Zeit ist um';
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        return;
      }
      rest--;
    }
    tick();
    timerId = window.setInterval(tick, 1000);
  }

  function zeige() {
    var text = schritte[idx];
    elText.textContent = text;
    elZaehler.textContent = 'Schritt ' + (idx + 1) + ' von ' + schritte.length;
    elBalken.style.width = ((idx + 1) / schritte.length * 100) + '%';
    btnZurueck.disabled = idx === 0;
    btnWeiter.textContent = idx === schritte.length - 1 ? 'Fertig' : 'Weiter';

    stoppeTimer();
    var min = minutenAus(text);
    if (min > 0) {
      btnTimer.hidden = false;
      btnTimer.textContent = min + ' Min. Timer starten';
      btnTimer.onclick = function () { starteTimer(min); };
    } else {
      btnTimer.hidden = true;
      btnTimer.onclick = null;
    }
  }

  function oeffne() {
    vorherFokus = document.activeElement;
    idx = 0;
    overlay.hidden = false;
    overlay.classList.add('aktiv');
    document.body.style.overflow = 'hidden';
    zeige();
    btnWeiter.focus();
    document.addEventListener('keydown', taste);
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then(function (w) { wakeLock = w; }).catch(function () {});
    }
  }

  function schliesse() {
    stoppeTimer();
    overlay.classList.remove('aktiv');
    overlay.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', taste);
    if (wakeLock) { wakeLock.release().catch(function () {}); wakeLock = null; }
    if (vorherFokus) vorherFokus.focus();
  }

  function weiter() {
    if (idx === schritte.length - 1) { schliesse(); return; }
    idx++;
    zeige();
  }
  function zurueck() { if (idx > 0) { idx--; zeige(); } }

  function taste(e) {
    if (e.key === 'Escape') schliesse();
    else if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); weiter(); }
    else if (e.key === 'ArrowLeft') zurueck();
  }

  start.addEventListener('click', oeffne);
  btnSchliessen.addEventListener('click', schliesse);
  btnWeiter.addEventListener('click', weiter);
  btnZurueck.addEventListener('click', zurueck);

  /* Bildschirmsperre nach Tab-Wechsel wieder anfordern. */
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && overlay.classList.contains('aktiv') && 'wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then(function (w) { wakeLock = w; }).catch(function () {});
    }
  });
})();
