
### **Nouveau Prompt pour Agent IA : Création d'un Template E-commerce de Luxe pour Montres Intelligentes**

**Objectif du Projet :**
Créer un **template de base (boilerplate)** robuste, responsive et scalable en **Next.js** pour un site e-commerce de niche spécialisé dans la vente de montres intelligentes de luxe. Le design doit fusionner l'esthétique épurée, sombre et animée d'Apple avec la structure claire et fonctionnelle des meilleurs thèmes Shopify. L'accent est mis sur la création d'une expérience visuelle premium et intuitive.

**Mots-clés pour le design :** Premium, Minimaliste, Sombre, Luxe, Technologique, Fluide, Cinématique.

---

**Partie 1 : Structure Globale et Barre de Navigation (Header)**

**1.1. Barre de Navigation Fixe (Sticky Header) :**
*   **Comportement :** La barre de navigation doit rester fixée en haut de l'écran (position: `sticky` ou `fixed`) lors du défilement de la page.
*   **Design :**
    *   **Arrière-plan :** Un verre dépoli translucide avec un léger flou (effet "frost" ou "blur"), similaire à l'interface de macOS/iOS. Lorsque l'utilisateur fait défiler la page, l'arrière-plan devient légèrement plus opaque pour une meilleure lisibilité.
    *   **Bordure :** Une fine ligne de séparation (1px) de couleur gris clair doit apparaître sous le header au défilement pour le détacher du contenu.
*   **Structure et Contenu (Layout) :**
    *   **Section Gauche :** Liens textes "S'inscrire" et "Se connecter". Au survol, le texte doit être subtilement mis en évidence (par exemple, en passant d'un gris moyen à un blanc pur).
    *   **Section Centrale :** Le **logo de la marque "Waltech"**. Il doit être l'élément dominant du header.
    *   **Section Droite :** Deux icônes :
        *   Une icône pour la **liste de souhaits (cœur)**.
        *   Une icône pour le **panier (sac de shopping)**.
        *   Un petit compteur numérique doit apparaître sur l'icône du panier si des articles y sont présents. Les icônes doivent être minimalistes et fines.

---

**Partie 2 : Page d'Accueil - Section des Produits**

**2.1. Grille de Produits avec Défilement Horizontal Intelligent :**
*   **Objectif :** Présenter une sélection de produits phares dès la page d'accueil de manière engageante et peu encombrante.
*   **Layout :**
    *   Un titre de section clair et élégant, par exemple : **"Notre Sélection"** ou **"Les Incontournables"**.
    *   En dessous, implémenter une grille de produits qui défile **horizontalement**. Le défilement doit être fluide et naturel au "swipe" sur mobile/tablette et au trackpad/molette de la souris sur ordinateur.
    *   Prévoir des flèches de navigation discrètes de chaque côté de la grille sur la version bureau pour indiquer la possibilité de défilement.
*   **Design de la Carte Produit (Product Card) :**
    *   **Conteneur :** Coins légèrement arrondis. Un fond gris très foncé, presque noir.
    *   **Image :** L'image du produit doit occuper environ 60% de la carte. Elle doit être parfaitement centrée et de très haute qualité. Au survol de la carte, l'image doit effectuer un très léger zoom avant (effet `transform: scale(1.05)` avec une transition douce).
    *   **Contenu sous l'image :**
        *   **Nom du produit :** En blanc, police de caractères audacieuse mais épurée.
        *   **Prix :** Juste en dessous du nom, dans une police légèrement plus petite et moins grasse.
        *   **Variantes :** Afficher les 3 premières variantes disponibles sous forme de petits cercles de couleur cliquables.
        *   **Bouton "Ajouter au Panier" :** Un bouton pleine largeur en bas de la carte. Le design doit être minimaliste (par exemple, fond noir, texte blanc, bordure grise). Au survol, le fond peut devenir blanc et le texte noir pour un contraste fort.

---

**Partie 3 : Exigences Techniques et de Style**

**3.1. Framework et Langage :**
*   Utiliser **Next.js** avec **React**.
*   Le code doit être écrit en **TypeScript** pour la robustesse et la scalabilité.

**3.2. Styling :**
*   Utiliser **Tailwind CSS** pour un développement rapide et un design système cohérent. La configuration de Tailwind doit inclure la palette de couleurs (noir, gris foncés, blanc) et la typographie (police "Inter" ou similaire) inspirées d'Apple.

**3.3. Responsivité (Responsive Design) :**
*   Le design doit être **mobile-first**.
*   **Header :** Sur mobile, les liens textes "S'inscrire/Se connecter" peuvent être remplacés par une icône "utilisateur" pour économiser de l'espace.
*   **Grille de produits :** Sur mobile, les cartes produits doivent être légèrement plus petites pour qu'on puisse en voir au moins une et demie à l'écran, incitant l'utilisateur à "swiper".

**3.4. Animations et Transitions (Motion Design) :**
*   Toutes les transitions (survol, clics) doivent être fluides et rapides (`transition-duration: 300ms`, `ease-in-out`).
*   Utiliser une bibliothèque comme **Framer Motion** pour implémenter des animations d'entrée subtiles (fade-in, slide-up) lorsque les éléments apparaissent à l'écran au premier chargement de la page.

**Résumé des Instructions pour l'IA :**

"Développe un template de base pour un site e-commerce en **Next.js** et **Tailwind CSS**, destiné à une marque de montres intelligentes de luxe. Le template doit inclure :
1.  Un **header fixe et translucide (effet verre dépoli)** avec le logo au centre, les liens utilisateur à gauche et les icônes panier/souhaits à droite.
2.  Sur la page d'accueil, une **grille de produits à défilement horizontal** fluide.
3.  Des **cartes produits au design premium** affichant l'image, le nom, le prix, les variantes de couleur et un bouton d'ajout au panier, avec une animation de zoom subtile au survol.
Le design doit être sombre, minimaliste, entièrement responsive et s'inspirer de l'esthétique d'Apple tout en ayant la structure fonctionnelle d'un site Shopify."