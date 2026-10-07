## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Projet Soroclub — contexte et règles de travail

Site de Soroclub : école de soroban + soutien scolaire en ligne pour enfants, fondée par Esma (le site mentionne « Ibtissama » comme fondatrice : **à garder tel quel**, choix validé). Stack : Astro 7 + Vercel + GitHub (`Zish91/soroclub`, branche `master`). **Chaque `git push` sur `master` déploie en production** (https://soroclub.vercel.app). Paiements via Stripe Payment Links.

Palette : bleu `#1B3A5C`, jaune `#F5A623`, corail `#E8644A`, crème `#F7F4EF`, texte `#2D2D2D` (+ teal `#1A6B5C` utilisé dans les dégradés). Police : Poppins.

**Règles de travail (importantes) :**
- Tutoiement, réponses en français. Termes techniques anglais OK avec une courte explication entre parenthèses.
- On avance **étape par étape**, jamais un gros bloc sans explication.
- **Ne modifier aucun fichier sans validation** : on discute la direction, l'utilisateur dit OK, on montre le diff, puis on applique.
- Préparer les changements dans le scratchpad, vérifier le rendu (build de prévisualisation + captures Chrome headless) **avant** de proposer le diff.
- Commits en anglais. Commit / push seulement quand l'utilisateur le demande.

## Où on en est (mise à jour : 7 octobre 2026)

### Fait et en ligne
1. **Tarifs** (`/tarifs`) : nouvelle grille Soroban (1 / 3 / 6 mois / année d'octobre à juin, individuel et groupe), badge « ⭐ Le plus choisi » sur 6 mois, « Meilleur prix » sur l'année. Soutien scolaire en abonnement mensuel (29€ = 1 cours/semaine, 52€ = 2 cours/semaine, séances de 30 min). Onglets Soroban / Soutien (`/tarifs#soutien` ouvre l'onglet Soutien), pastilles « 1 cours d'1h par semaine », lignes de prix en 3 colonnes, cartes de réassurance + bandeau d'essai en bas.
2. **Programme → Règlement** : `/programme` supprimée (redirection vers `/tarifs` dans `astro.config.mjs`), nouvelle page `/reglement` (annulation 48h sinon cours dû et reporté si annulé à temps, aucune tolérance de retard, vacances zone C sans cours ni rattrapage, aucun remboursement hors rétractation légale de 14 jours, été sans cours et abonnements suspendus, enregistrement des cours interdit).
3. **Accueil** : fond animé supprimé ; roue interactive « Pourquoi le soroban ? » (version claire, pastel) ; barre « La méthode qui fait la différence » (style bandeau compteur, pilule qui glisse) ; cartes Soroban / Soutien + bandeau « Cours d'essai à 5€ ». Plus aucune tranche d'âge sur le site, « suivi personnalisé » mis en avant.
4. **Fluidité** : View Transitions Astro (fondu simple ; header et barre mobile en `transition:persist`). La transition « perle / cercle » façon cipher-it a été **testée puis refusée**. Animations : un seul fondu doux `.fade-in` (16px, 0,7 s) ; plus de glissements latéraux ni de `pageEnter` ; seule animation en boucle : le bouton « Cours d'essai · 5€ » du hero. Pas d'animations au scroll sur mobile (choix volontaire). `prefers-reduced-motion` respecté.
5. **Finitions** : flèches SVG unifiées (style dans `global.css`), composants communs, nettoyage des `z-index` devenus inutiles.

### Architecture à connaître
- `src/layouts/Base.astro` : layout unique (head, header, menu, footer, barre mobile 4 icônes, scripts communs).
- `src/data/stripe.ts` : **les 10 liens Stripe, à un seul endroit** (placeholders `'#'` pour l'instant).
- `src/components/CarteSoutien.astro` : carte tarifs Soutien (utilisée sur `/tarifs` et `/soutien-scolaire`, prop `niveau` h2/h3).
- `src/components/BandeauEssai.astro` : bandeau « Cours d'essai à 5€ » (accueil + tarifs).
- **Scripts et View Transitions** : chaque script de page démarre sur `document.addEventListener('astro:page-load', …)` et nettoie ses minuteurs / observateurs sur `astro:before-swap` (`{ once: true }`), sinon ils s'accumulent à chaque navigation.
- Icônes : SVG Lucide inline, **trait 2** (validé, préféré au trait 1,5). `lucide-static` est installé mais pas encore utilisé.

## Reste à faire
1. **Liens Stripe (prioritaire)** : les boutons de paiement mènent à `#` en production. L'utilisateur doit créer 10 Payment Links (8 soroban en paiement unique, 2 soutien en abonnement mensuel), idéalement avec l'option « accepter les conditions » pointant vers `/reglement`. Les coller dans `src/data/stripe.ts`. Ensuite seulement : désactiver les 12 anciens liens dans Stripe.
2. **Icônes** :
   - Composant `<Icone nom="…" />` basé sur `lucide-static` pour remplacer les SVG inline (trait 2), et remplacer les emojis ☰ / ✕ (menu burger, piloté par `textContent` dans `Base.astro`), 🧮 (boutique), ⭐ (badges).
   - Icônes animées Lottie (comme sur cipher-it, dont les animations viennent de **LottieFiles**) à 11 emplacements : `eleves.json`, `experience.json`, `niveaux.json`, `essai.json` (4 compteurs de l'accueil, fond foncé), `suivi.json`, `en-ligne.json`, `soroban.json` (réassurance Tarifs), `annulation.json`, `ponctualite.json`, `vacances.json`, `remboursement.json` (« L'essentiel » du Règlement). L'utilisateur hésite entre LottieFiles et **Lordicon** (style cohérent, couleurs personnalisables, animation au survol / à l'apparition). Il fournira les fichiers plus tard.
3. Optionnel : passer l'accordéon « L'approche Soroclub » de `/soutien-scolaire` en barre ; supprimer la branche GitHub `refonte-tarifs` (inutile).
4. Rappels pour l'utilisateur : faire relire les sections 7 et 8 du règlement (remboursement / rétractation) ; fin juin, mettre en pause les abonnements soutien dans Stripe.

### Référence
- Site cipher-it (autre site de l'utilisateur, même stack) : `~/malsi-it` (`Zish91/malsi-it`) — sert de modèle (ClientRouter, roue « Approach », Lottie avec `dotlottie-player`).
