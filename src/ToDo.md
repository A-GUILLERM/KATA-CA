## Les raccourcis

Manque de la dernière question avec le tableau d'historique à cause du temps.
J'avoue que je questionne aussi le terme "dernières demandes" puisqu'il y a une mise à jour en temps réel.
Comme solution, j'aurais utilisé le composant table d'Angular material pour le côté UX.
Sinon un rapide ngFor sur la liste des demandes aurais pu faire l'affaire.
[{rate: rateVal, forceRate: forceRateVal, startCurrency: val, targetCurrency: val}]

Si j'ai bien suivi le seuil de 2% n'est pas atteignable. 1.1 + 0.05 = 1.15.
Et il est bien dit dans l'énoncé d'utiliser la valeur initiale et non la dernière valeur courante du taux. (J'ai changé après avoir relu)

J'ai utilisé des inputs de type nombre pour les taux.
En pratique c'est inutilisable pour notre cas puisque cela permet la saisie de beaucoup de caractères à interdire (e^).
L'idéal ce serait de faire un pattern regexp sur les champs pour n'autoriser uniquement la saisie de chiffres.
Mais j'ai pensé que ce n'était pas ce qui était évalué ici. Donc il est facile de casser le convertisseur en l'état.

J'ai essayé de mettre un minimum de design, mais ça reste très limité... On peu imaginé que la barre latéral pourrait être un menu de navigation.
