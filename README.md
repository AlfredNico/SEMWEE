# SEMWEE - Frontend
> Application **frontend** de Semwee.app, ci-dessous des informations sur la stack avec un lien vers des docs

- **[Metronic](https://keenthemes.com/metronic/?page=docs)** (7.x)
- **[Angular](https://v11.angular.io/docs)** (11.x)
- **[Angular Material UI](https://v11.material.angular.io/)** (11.x)
- **[Bootstrap](https://getbootstrap.com/docs/4.6/getting-started/introduction/)** (4.6.x)

## Installation

### Pré-requis
- Une version de **Node LTS** *(14 recommandé)*
- **Angular CLI** installé de manière globale : `npm install -g @angular/cli`

### Clonage du repository
- `git clone --single-branch --branch semwee https://github.com/AlfredNico/SEMWEE.git`

### Installation des packages
- `npm install`

## Configuration

Si vous souhaitez développer avec un serveur backend de développement en local, il faudra configurer dans le fichier `src/environments/environment.ts` les clés `baseUrl` et `baseUrlImg` avec des valeurs correspondant à votre serveur backend de développement :

```
baseUrl: 'http://localhost:3000/api',
baseUrlImg: 'http://localhost:3000',
```

## Utilisation

### Démarrer en mode développement

- Utilisez la commande `ng serve`
- Le site est désormais lancé en local à l'adresse http://localhost:4200

## Conventions de code

Le projet tournant sous Angular, nous nous devons de respecter les guidelines d'Angular qui sont disponibles à cette adresse : https://angular.io/guide/styleguide

Veillez à commenter un maximum votre code un maximum une fois celui ci dans une version stable afin de faciliter le travail du prochain développeur qui vous lira.

Nous utilisons la norme EditorConfig afin que tous nos outils de développement respectent le même encodage, la même indentation et les mêmes terminaisons de ligne. Référez vous à la partie "Extensions d'éditeur" de ce README.

Une fois le projet migré sous Angular 12, un guideline + strict sera proposé ainsi que l'instauration de ESLint correctement configuré.

Si vous voulez un peu de background sur pourquoi nous utilisons des conventions de code : https://fr.wikipedia.org/wiki/R%C3%A8gles_de_codage

## Extensions d'éditeur

### **Visual Studio Code**

Quand vous ouvrirez pour la première fois ce projet, Visual Studio Code vous proposera d'installer les extensions recommandées pour ce projet, vous êtes priés d'accepter afin d'activer le support d'EditorConfig.

*Dans le futur, cette pop-up nous permettera également d'installer des outils relatifs à ESLint pour les guidelines.*

### **WebStorm**

Si vous développez sur WebStorm, le support d'EditorConfig est inclus et activé par défaut, il n'y a rien à faire.
