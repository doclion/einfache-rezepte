# RSS/IFTTT Automatisierungs-Konzept

## Warum RSS-Feed wichtig ist

Hugo generiert automatisch einen RSS-Feed unter:
- `https://doclion.github.io/einfache-rezepte/index.xml`
- `https://doclion.github.io/einfache-rezepte/posts/index.xml`

Dieser Feed kann von Diensten wie IFTTT, Zapier oder n8n verwendet werden.

## Automatisierungs-Pipeline (IFTTT)

### IFTTT Applets (kostenlos, 3 Applets erlaubt)

#### Applet 1: RSS → Twitter/X
- **Trigger:** RSS Feed (prüft alle 15 Min)
- **Feed URL:** `https://doclion.github.io/einfache-rezepte/posts/index.xml`
- **Action:** Twitter/X – neuen Tweet posten
- **Format:**
  ```
  🆕 Neues Rezept: {EntryTitle}
  {EntryUrl}
  #Rezepte #Kochen #NeuesRezept
  ```
- **Kostenlos?** Ja (IFTTT Free Plan = 3 Applets)

#### Applet 2: RSS → Pinterest
- **Trigger:** RSS Feed
- **Feed URL:** `https://doclion.github.io/einfache-rezepte/posts/index.xml`
- **Action:** Pinterest – neuen Pin erstellen
- **Board:** "Einfache Rezepte"
- **Hinweis:** Benötigt IFTTT Pro (ca. 3€/Monat) für Pinterest

#### Applet 3: RSS → E-Mail Benachrichtigung
- **Trigger:** RSS Feed
- **Action:** E-Mail an kontakt@einfache-rezepte.de
- **Zweck:** Leon informieren, wenn neuer Artikel live ist

### Alternative: n8n (Self-Hosted, kostenlos)

n8n läuft auf dem eigenen Server und hat KEINE Limitierungen:
- RSS → Twitter/X (kostenlos)
- RSS → LinkedIn (kostenlos)
- RSS → Discord (für Community)
- RSS → Telegram (für Newsletter)
- RSS → Webhook (für eigene Tools)

### Alternative: Zapier (Free = 100 Tasks/Monat)

- 1 Trigger, 1 Action im Free-Plan
- Empfohlen: RSS → Twitter/X
- Premium: RSS → Pinterest, RSS → LinkedIn

## Manuelle Alternative (Leon macht in 2 Min)

1. Nach neuem Artikel: `git push`
2. GitHub Actions baut die Seite
3. Leon postet manuell:
   - 1 Tweet auf X
   - 1 Pin auf Pinterest
   - (optional) 1 LinkedIn-Post

## Technische Umsetzung

### RSS-Feed prüfen
```bash
# Testen, ob RSS-Feed erreichbar ist
curl -s https://doclion.github.io/einfache-rezepte/index.xml | head -30
```

### WordPress-I-like Automation
Wenn der Blog auf WordPress umziehen würde:
- Jetpack → Automatisches Posten auf Facebook, X, Tumblr
- WP RSS Aggregator → Content von anderen Quellen
- Blog2Social → Multiplattform-Autoposting

## Empfehlung für Leon

**"Set & Forget" Setup (kostenlos):**
1. ✅ IFTTT Free Account erstellen
2. ✅ Applet 1: RSS → Twitter/X (kostenlos)
3. ✅ Bei neuem Artikel: nur `git push` – IFTTT macht den Rest
4. ❌ Pinterest & LinkedIn brauchen Paid-Plan oder manuelles Posten

**Falls Leon bereit ist, 3€/Monat zu zahlen:**
1. IFTTT Pro (3€/Monat)
2. RSS → Twitter/X
3. RSS → Pinterest (neuer Pin pro Artikel)
4. RSS → LinkedIn
