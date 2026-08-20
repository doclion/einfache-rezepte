#!/usr/bin/env python3
"""
Daily Recipe Blog Post Generator
=================================
Generates a new recipe, commits and pushes to GitHub.
GitHub Actions builds + deploys automatically.

Usage: python3 daily_recipe.py [--dry-run]
"""

import json, os, subprocess, sys, datetime, re
from pathlib import Path

PROJECT_DIR = Path("/data/projects/content-farm")
CONTENT_DIR = PROJECT_DIR / "content" / "posts"
BLOG_URL = "https://doclion.github.io/einfache-rezepte"

TOPICS = [
    ("Schnelle Feierabendgerichte", "Hauptgerichte"),
    ("Vegetarische Bowl-Ideen", "Hauptgerichte"),
    ("Suppen für kalte Tage", "Suppen & Eintöpfe"),
    ("Salate die satt machen", "Salate"),
    ("One-Pot Pasta Gerichte", "Hauptgerichte"),
    ("Kuchen ohne Backen", "Desserts"),
    ("Frühstücksideen fürs Wochenende", "Frühstück"),
    ("Snacks für Zwischendurch", "Snacks"),
    ("Rezepte mit 5 Zutaten", "Hauptgerichte"),
    ("Brotaufstriche selbst gemacht", "Frühstück"),
    ("Eintopfgerichte zum Vorkochen", "Suppen & Eintöpfe"),
    ("Asiatische Nudelgerichte", "Hauptgerichte"),
]

def log(msg):
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)

def generate_recipe_llm(topic_name, topic_cat):
    """Generate a recipe via LLM"""
    import requests
    api_key = os.environ.get("OPENAI_API_KEY") or os.environ.get("HERMES_API_KEY", "")
    if not api_key:
        return None

    prompt = f"""Generiere ein deutsches Rezept als JSON.

Thema: {topic_name}
Kategorie: {topic_cat}

JSON Format (NUR JSON, nichts sonst):
{{
  "title": "Titel (max 60 Zeichen)",
  "slug": "url-slug-deutsch",
  "desc": "Meta-Beschreibung (max 160 Zeichen)",
  "intro": "Einleitung (2-3 Sätze)",
  "ingredients": [["Menge", "Zutat"], ...],
  "instructions": "Schritt-für-Schritt mit Emojis, 5-8 Schritte",
  "tip": "Praxistipp (1 Satz)",
  "calories": 123,
  "protein": 12,
  "fat": 12,
  "carbs": 34,
  "keywords": ["Keyword1", "Keyword2", "Keyword3", "Keyword4"],
  "tags": ["tag1", "tag2"]
}}

Das Rezept muss echt und machbar sein. 8-12 Zutaten."""
    try:
        resp = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            json={
                "model": "deepseek/deepseek-v4-flash",
                "messages": [
                    {"role": "system", "content": "Du generierst deutsche Rezepte als JSON. Nur JSON."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7, "max_tokens": 2000,
            },
            headers={"Authorization": f"Bearer {api_key}"}, timeout=120,
        )
        if resp.status_code == 200:
            text = resp.json()["choices"][0]["message"]["content"]
            text = re.sub(r"^```(?:json)?\s*", "", text)
            text = re.sub(r"\s*```$", "", text)
            return json.loads(text)
    except Exception as e:
        log(f"⚠️ LLM Fehler: {e}")
    return None

def build_post(recipe, category):
    """Build Hugo markdown from recipe dict"""
    today = datetime.datetime.now()
    date_str = today.strftime("%Y-%m-%dT%H:%M:%S+02:00")
    tags = ", ".join(recipe.get("tags", ["einfach", "kochen"]))
    keywords = ", ".join(recipe.get("keywords", ["Rezept", "Kochen"]))
    ingredients = "\n".join(f"| {q} | {i} |" for q, i in recipe["ingredients"])

    return f"""---
title: "{recipe['title']}"
date: {date_str}
draft: false
tags: [{tags}]
categories: "{category}"
description: "{recipe['desc']}"
image: ""
slug: {recipe['slug']}
keywords: [{keywords}]
---

## {recipe['title']}

{recipe['intro']}

### 📝 Zutaten

| Menge | Zutat |
|-------|-------|
{ingredients}

### 👨‍🍳 Zubereitung

{recipe['instructions']}

### 💡 Tipp

{recipe['tip']}

### 📊 Nährwerte (pro Portion)

| Nährwert | Menge |
|----------|-------|
| Kalorien | {recipe['calories']} kcal |
| Protein | {recipe['protein']} g |
| Fett | {recipe['fat']} g |
| Kohlenhydrate | {recipe['carbs']} g |

---

*Mehr Rezepte auf [{BLOG_URL}]({BLOG_URL})* 🍳
"""

def main():
    dry_run = "--dry-run" in sys.argv
    day_of_year = datetime.datetime.now().timetuple().tm_yday
    topic_name, topic_cat = TOPICS[day_of_year % len(TOPICS)]
    log(f"📝 Thema: {topic_name} ({topic_cat})")

    today_slug = datetime.datetime.now().strftime("%Y-%m-%d")
    existing = list(CONTENT_DIR.glob(f"daily-{today_slug}*.md"))
    if existing and not dry_run:
        log(f"⏭️ Heute schon generiert: {existing[0].name}")
        print(f"\n✅ Bereits erstellt: {existing[0].name}")
        return 0

    log("🤖 Generiere Rezept...")
    recipe = generate_recipe_llm(topic_name, topic_cat)

    if not recipe:
        log("⚠️ Fallback-Template")
        slug = f"daily-{today_slug}"
        recipe = {
            "title": f"Schnelles Gericht vom {datetime.datetime.now().strftime('%d.%m.%Y')}",
            "slug": slug,
            "desc": "Ein einfaches, schnelles Rezept für jeden Tag.",
            "intro": "Dieses Gericht ist in 30 Minuten fertig und schmeckt der ganzen Familie.",
            "ingredients": [
                ["500 g", "Nudeln"], ["2", "Zwiebeln"], ["3", "Knoblauchzehen"],
                ["400 g", "Passierte Tomaten"], ["200 ml", "Sahne"],
                ["1 EL", "Olivenöl"], ["1 TL", "Salz"], ["1 Prise", "Pfeffer"],
                ["1 Bund", "Basilikum"],
            ],
            "instructions": "1. Nudeln kochen.\n2. Zwiebeln+Knoblauch anbraten.\n3. Tomaten+Sahne dazu, 10 Min köcheln.\n4. Würzen, Basilikum drüber.\n\nFertig! 🍝",
            "tip": "Frischer Parmesan macht den Unterschied!",
            "calories": 520, "protein": 18, "fat": 22, "carbs": 65,
            "keywords": ["schnelles Rezept", "Nudeln", "Feierabend"],
            "tags": ["schnell", "nudeln", "hauptgericht"],
        }

    post = build_post(recipe, topic_cat)
    filepath = CONTENT_DIR / f"{recipe['slug']}.md"

    if dry_run:
        print(f"\n📄 DRY RUN: {filepath}")
        print(post[:500])
        return 0

    filepath.write_text(post.strip(), encoding="utf-8")
    log(f"✅ {filepath.name}")

    try:
        subprocess.run(["git", "-C", str(PROJECT_DIR), "add", str(filepath)], check=True, timeout=15)
        subprocess.run(["git", "-C", str(PROJECT_DIR), "commit", "-m", f"📝 Neues Rezept: {recipe['title']}"], check=True, timeout=15)
        subprocess.run(["git", "-C", str(PROJECT_DIR), "push"], check=True, timeout=30)
        log("✅ GitHub Push OK – Blog deployt automatisch 🚀")
    except Exception as e:
        log(f"⚠️ Git Fehler: {e}")

    print(f"\n📄 {recipe['title']}")
    print(f"   {filepath}")
    print(f"   {BLOG_URL}/{recipe['slug']}/")
    return 0

if __name__ == "__main__":
    sys.exit(main())