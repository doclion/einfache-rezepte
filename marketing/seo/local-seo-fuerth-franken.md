# Lokale SEO-Optimierung für Einfache Rezepte
# Standort: Fürth, Franken, Deutschland

## Keywords (Deutschland-Fokus)

### Short-Tail (hohes Volumen)
- Rezepte Deutschland
- einfache Rezepte
- deutsche Küche Rezepte
- Kochen für Anfänger
- schnelle Gerichte

### Mid-Tail (Zielgruppe)
- einfache Rezepte für Fürth
- fränkische Rezepte
- deutsche Hausmannskost Rezepte
- was koche ich heute einfach
- Rezepte mit wenigen Zutaten

### Long-Tail (Conversion)
- einfache Rezepte für Anfänger Schritt für Schritt
- deutsches Gulasch Rezept für Anfänger
- schnelle Nudelgerichte für den Feierabend Fürth
- gesunde Bowls zum Mittagessen vorbereiten
- Kuchen ohne Backen für heiße Sommertage

## Geo-Targeting (Fürth, Franken)

### Fürth-spezifische Keywords
- Rezepte aus Fürth
- Kochen in Fürth
- fränkische Küche Rezepte
- Mittelfranken Rezepte
- Nürnberger Küche (benachbarte Großstadt)

### Schema.org LocalBusiness (für About-Seite)
```json
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Einfache Rezepte",
  "description": "Einfache Rezepte für jeden Tag - Von schnellen Gerichten über gesunde Optionen bis zu Backrezepten.",
  "url": "https://doclion.github.io/einfache-rezepte",
  "inLanguage": "de-DE",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Fürth",
    "addressRegion": "Bayern",
    "addressCountry": "DE"
  }
}
```

## Artikel-Optimierung (pro Artikel)

Jeder Artikel sollte enthalten:
1. ✅ Meta-Description (120-155 Zeichen, mit Keyword)
2. ✅ H1-Tag (der Titel)
3. ✅ H2/H3-Struktur (für Readability)
4. ✅ Interne Links (2-3 pro Artikel)
5. ✅ Alt-Texte bei Bildern (falls vorhanden)
6. ✅ Schema.org Recipe Markup

### Schema.org Recipe JSON-LD Template
Ersetze Platzhalter pro Rezept:
```json
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "REZEPT_TITEL",
  "author": {
    "@type": "Person",
    "name": "KüchenRat"
  },
  "datePublished": "DATUM",
  "description": "META_DESCRIPTION",
  "prepTime": "PT15M",
  "cookTime": "PT20M",
  "totalTime": "PT35M",
  "keywords": "SCHLÜSSELWÖRTER",
  "recipeCategory": "KATEGORIE",
  "recipeCuisine": "Deutsch",
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "XX Kalorien"
  },
  "url": "https://doclion.github.io/einfache-rezepte/SLUG/"
}
```

## Hugo-Konfiguration für SEO

Folgende Einstellungen in `hugo.yaml` prüfen (bereits gesetzt):
```yaml
enableRobotsTXT: true
canonifyURLs: true
```

**Zusätzlich einfügen:**
```yaml
# Erweiterte SEO
[params.seo]
  googleVerification = ""  # Google Search Console Code
  bingVerification = ""    # Bing Webmaster Code
  pinterestVerification = "" # Pinterest Anspruchs-Code
```

## Performance-SEO
- Hugo generiert bereits statisches HTML (sehr schnell)
- Image-Optimierung: Unsplash-Bilder sind bereits optimiert
- Lazy Loading für Bilder aktivieren (im Theme)
- Minifizierung: `hugo --minify`

## Content-Strategie (SEO)
1. **Konsistenz:** Mindestens 2 neue Artikel pro Monat
2. **Keyword-Cluster:** Themen in Gruppen veröffentlichen
3. **Evergreen:** Rezepte sind ideal (saisonale Updates)
4. **Interne Verlinkung:** Jeder Artikel verlinkt auf 2-3 andere
5. **Bild-Optimierung:** Dateinamen sollten das Keyword enthalten
6. **Datenstruktur:** Schema.org Recipe Markup einbetten
