# BIM4ALL Projects — website

Statische website. Publiceren via GitHub Pages:

1. Maak een nieuwe repository en upload alle bestanden uit deze map (inclusief de map `assets/`).
2. Ga naar **Settings → Pages** en kies **Deploy from a branch**, branch `main`, map `/ (root)`.
3. De site staat daarna op `https://<gebruikersnaam>.github.io/<repo>/`.

## Structuur
- `index.html` — homepage
- `engineering.html` / `projectregie.html` / `digital-twin.html` — oplossingen
- `diensten.html` — dienstenoverzicht (SEO-landingen op vaktermen)
- `projecten.html`, `case-robin-wood.html` — bewijs
- `organisatie.html`, `vacatures.html`, `contact.html`
- `support.js`, `image-slot.js`, `responsive.css` — runtime en opmaak
- `assets/` — beelden en logo's

## SEO bij livegang
Zet 301-redirects van de oude bim4all.com-URL's naar de best passende nieuwe pagina (zie het interne SEO-advies) en dien een nieuwe sitemap in via Google Search Console.
