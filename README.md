# 🍳 Einfache Rezepte – KI-Content-Farm

**Statischer Hugo-Blog** mit 10 Evergreen-Artikeln über einfache Rezepte.
Nische: Deutsche & internationale Rezepte für den Alltag (schnell, gesund, backen, vegetarisch).

## 🚀 Schnellstart

### Lokal ausführen

```bash
cd /data/projects/content-farm
/data/bin/hugo server --buildDrafts
```

Dann im Browser öffnen: **http://localhost:1313**

### Ohne Drafts (für die echte Produktion)

```bash
/data/bin/hugo server
```

## 🏗️ Projektstruktur

```
content/
├── posts/          # 10 Artikel (Markdown)
│   ├── schnelle-tomatensosse-nudeln.md
│   ├── herzhafte-kartoffelsuppe.md
│   ├── one-pan-haehnchen-paprika.md
│   ├── klassisches-ungarisches-gulasch.md
│   ├── bunte-veggie-bowl.md
│   ├── klassischer-apfelstrudel.md
│   ├── huehnersuppe-wie-vom-kochen.md
│   ├── dicke-pfannkuchen-american-pancakes.md
│   ├── kaesekuchen-ohne-backen.md
│   └── selbstgemachte-salatdressings.md
├── impressum.md    # Impressum (rechtlich nötig)
├── datenschutz.md  # Datenschutz (DSGVO-konform)
└── ueber-uns.md    # Über uns Seite
themes/
└── einfache-rezepte/   # Eigenes Theme (dark, clean)
    ├── layouts/         # HTML-Templates
    ├── static/css/      # Stylesheet
    └── theme.yaml       # Theme-Konfiguration
hugo.yaml               # Hauptkonfiguration
```

## 📝 Neuen Artikel hinzufügen

### Variante A: Neue Markdown-Datei (empfohlen)

```bash
# 1. Datei erstellen:
cat > content/posts/mein-neues-rezept.md << 'EOF'
---
title: "Mein neues Rezept"
date: 2026-04-15
description: "Kurze, SEO-optimierte Beschreibung (max 160 Zeichen)"
slug: "mein-neues-rezept"
tags: ["kochen", "schnell"]
categories: ["Hauptgerichte"]
image: "https://images.unsplash.com/photo-XXX?w=800&q=80"
draft: false
---

Hier kommt der Artikel-Text in Markdown.
- Mindestens 500 Wörter für SEO
- Interne Links zu anderen Artikeln einbauen
- Affiliate-Keywords natürlich einfließen lassen
EOF

# 2. Seite neu bauen:
/data/bin/hugo server --buildDrafts
```

### Variante B: Hugo Archetype

```bash
/data/bin/hugo new content posts/mein-rezept.md
```

Dann die `draft: true` auf `false` ändern und den Inhalt schreiben.

## 🔧 Wartung & Konfiguration

### Wichtige Dateien

- **hugo.yaml**: Titel, Beschreibung, SEO-Meta-Tags, Amazon-Affiliate-Tag
- **themes/einfache-rezepte/static/css/style.css**: Dark Theme, Farben, Layouts
- **content/posts/**: Alle Artikel als Markdown

### Amazon Affiliate-Tag ändern

In `hugo.yaml` `amazonTag: "dein-tag-21"` ändern.
In den Artikeln Links zu Amazon-Produkten mit `?tag=einfach-rezepte-21` einbauen.

### Theme anpassen

Farben im CSS in der `:root`-Sektion ändern:
```css
--accent: #e07c3c;        /* Akzentfarbe */
--bg-primary: #0f0f1a;    /* Hintergrund */
--text-primary: #e8e8f0;  /* Textfarbe */
```

## 🌐 Deployment

### Option 1: GitHub Pages (kostenlos) ⭐ empfohlen

1. **Repository erstellen**:
```bash
cd /data/projects/content-farm
git init
git add .
git commit -m "Initial commit"
gh repo create einfache-rezepte --public
git push origin main
```

2. **GitHub Actions** für automatischen Build (`.github/workflows/hugo.yaml`):
```yaml
name: Deploy Hugo
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: peaceiris/actions-hugo@v3
      - run: hugo --minify
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

3. In den Repository-Settings: Pages → Source → **GitHub Actions**

Die Seite ist dann live unter `https://<dein-username>.github.io/einfache-rezepte/`

### Option 2: Netlify (kostenlos)

1. Auf [netlify.com](https://netlify.com) anmelden
2. "Import from Git" wählen
3. Build-Kommando: `hugo --minify`
4. Publish-Verzeichnis: `public/`

### Option 3: Cloudflare Pages

1. Auf [pages.cloudflare.com](https://pages.cloudflare.com) anmelden
2. Repo verbinden
3. Build-Kommando: `hugo --minify`
4. Output-Verzeichnis: `public/`

## ✅ Leon's Checkliste (15–30 Min / Woche)

- [ ] **Neue Artikel** anschauen: Inhalt okay? Bilder da? Links funktionieren?
- [ ] **Impressum & Datenschutz** auf Aktualität prüfen
- [ ] **SEO-Check**: Sind die Meta-Beschreibungen gut? Passen die Keywords?
- [ ] **Neuen Artikel** schreiben oder KI-generieren lassen
- [ ] `git push` nach Änderungen

## ⚙️ Technik-Stack

| Komponente | Technologie |
|------------|-------------|
| Static Site Generator | Hugo (v0.128) |
| Theme | Eigenentwicklung (dark/clean, deutsch) |
| Sprache | Deutsch (de-DE) |
| SEO | Open Graph, Schema.org, Sitemap, Robots.txt |
| Content | Markdown (10 Evergreen-Artikel) |
| Deployment | GitHub Pages / Netlify / Cloudflare (kostenlos) |
| Affiliate | Amazon Partnerprogramm (Platzhalter) |

## 📊 SEO-Optimierungen

- ✅ Sitemap.xml (automatisch generiert)
- ✅ Robots.txt
- ✅ Canonical URLs
- ✅ Open Graph & Twitter Cards
- ✅ Schema.org JSON-LD
- ✅ Breadcrumbs
- ✅ Deutsche Sprachauszeichnung
- ✅ Interne Verlinkung zwischen Artikeln
- ✅ SEO-optimierte Titel & Meta-Beschreibungen

---

**Erstellt für Leon von Jarvis (Hermes Agent).**  
Nische: Einfache Rezepte | Domain-Idee: `einfache-rezepte.de`  
Letzte Aktualisierung: August 2026