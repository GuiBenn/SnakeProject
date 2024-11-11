# Snake - Projet Guillaume Benezech-Loustalot

Jeux Snake réalisée dans le cadre du cours IAs Réactives. Ce jeux comporte différents comportement demandés dans le cours.

## Contrôles

- **Souris** : En mode manuel, déplacez la souris pour contrôler la direction du serpent.
- **Clavier** :
  - `a` : Activer/Désactiver le mode automatique.
  - `v` : Activer/Désactiver le mode formation en V.
  - `m` : Activer/Désactiver le mode menu.
  - `d` : Activer/Désactiver le mode débogage.

## Modes de Jeu

### Mode Manuel

- **Description** : Vous contrôlez la tête du serpent en déplaçant votre souris. Le serpent suit la position du curseur.
- **NB** : Par défaut, le jeu démarre en mode manuel. Si vous êtes en mode automatique, appuyez sur la touche `a` pour revenir en mode manuel.

### Mode Automatique

- **Description** : Le serpent se déplace automatiquement vers la pomme normale la plus proche et évite les pommes empoisonnées.

### Mode Formation en V

- **Description** : Les véhicules (segments du serpent) se réorganisent pour former une formation en V derrière la tête du serpent.
- **NB** : Ce mode fonctionne aussi bien en mode manuel qu'en mode automatique. Les véhicules déjà présents se réarrangent automatiquement en formation V.

### Mode Menu

- **Description** : Affiche un menu animé où les véhicules forment le mot "Snake".
- **NB** : En mode menu, déplacez votre souris pour interagir avec les véhicules animés.

## Perdre la Partie

Vous perdez la partie si :

- **Collision avec une Pomme Empoisonnée** : La tête ou un véhicule de la queue touche une pomme empoisonnée.
- **Collision avec les Bords** : La tête du serpent touche les bords de l'écran.
- **Collision avec la Queue** : La tête du serpent touche l'un des véhicules de sa propre queue (à partir du troisième).

## Autheur
- BENEZECH-LOUSTALOT-FOREST Guillaume
- M2 MIAGE IA2
- IAs Réactives

