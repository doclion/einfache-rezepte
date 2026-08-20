# Google Indexierung – Automatischer Guide

## 1. Blog bei Google einreichen (Ping-Service)

### Automatischer Ping (wird jetzt ausgeführt)
```bash
curl -s "https://www.google.com/ping?sitemap=https://doclion.github.io/einfache-rezepte/sitemap.xml"
curl -s "https://blogsearch.google.com/ping?name=Einfache Rezepte&url=https://doclion.github.io/einfache-rezepte"
```

### Manuelle Einreichung
1. Gehe zu https://search.google.com/search-console
2. Melde dich mit deinem Google-Konto an (kontakt@einfache-rezepte.de)
3. Klicke auf "Property hinzufügen" → "URL prefix"
4. Gib ein: `https://doclion.github.io/einfache-rezepte`
5. **Verifizierung:** Wähle "HTML-Tag" und füge das Meta-Tag in die Hugo-Seite ein
6. Nach Verifizierung: URL Inspection → gib die Startseite ein → "Indexierung anfordern"

**Oder automatisch über GitHub Pages:**
GitHub Pages wird automatisch von Google indexiert! Die Seite sollte innerhalb von 1-2 Wochen in den Suchergebnissen auftauchen.

## 2. Google Search Console Setup

### Schritt 1: Anmelden
1. Gehe zu https://search.google.com/search-console
2. Mit deinem Google-Konto anmelden

### Schritt 2: Eigentum bestätigen
```
URL-Prefix: https://doclion.github.io/einfache-rezepte
```
**Einfachste Methode:**
- Wähle "HTML-Tag" als Bestätigungsmethode
- Kopiere das Meta-Tag:
```html
<meta name="google-site-verification" content="DEIN_CODE" />
```
- Füge es in `hugo.yaml` unter `params:` oder direkt im Theme `<head>` ein

### Schritt 3: Sitemap einreichen
```
Sitemaps → Neue Sitemap hinzufügen
→ sitemap.xml
```

### Schritt 4: Indexierungs-Status prüfen
- **URL Inspection:** Einzelne URLs prüfen
- **Index-Bericht:** Wie viele Seiten sind indexiert?
- **Core Web Vitals:** Ladezeit (Hugo ist schnell, sollte gut sein)

## 3. Warum die Indexierung nicht sofort funktioniert

- Neue Domains brauchen 1-4 Wochen für erste Indexierung
- GitHub Pages hat ".github.io" Domain → kann länger dauern
- **Lösung:** Eigene Domain kaufen (einfache-rezepte.de) für besseres SEO

## 4. Zusätzliche Suchmaschinen

### Bing Webmaster Tools
1. https://www.bing.com/webmasters/
2. Property hinzufügen: `https://doclion.github.io/einfache-rezepte`
3. Meta-Tag-Verifizierung (gleicher Code wie Google)
4. Sitemap einreichen

### Yandex Webmaster
(optional, für DE eher unwichtig)
- https://webmaster.yandex.com/

## 5. Monitoring (monatlich)

Tools für Traffic-Tracking:
- **Google Search Console:** Kostenlos, zeigt Suchanfragen + Klicks
- **Google Analytics 4:** Optional, für detaillierte Analysen
- **GitHub Pages Insights:** Zeigt Traffic aus GitHub-Statistiken
