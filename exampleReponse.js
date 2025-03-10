"```json
{
  "files": [
    {
      "filePath": "App.js",
      "filePrompt": "Créez un point d'entrée pour l'application Expo en utilisant React Native. Assurez-vous d'inclure la navigation de base et de gérer l'état global avec des providers appropriés.",
      "description": "Le point d'entrée principal de l'application gérant la structure et la navigation globales.",
      "dependencies": ["react-navigation", "react-native"]
    },
    {
      "filePath": "components/FoodCard.js",
      "filePrompt": "Implémentez un composant de carte d'aliment affichant une image, un titre, une description courte, une évaluation par étoiles, et un bouton. Utilisez des pratiques de style appropriées pour une interface utilisateur attrayante.",
      "description": "Affiche les détails d'un plat spécifique avec une image et une évaluation.",
      "dependencies": ["react-native", "expo-image-picker"]
    },
    {
      "filePath": "components/IngredientList.js",
      "filePrompt": "Créez un composant pour afficher une liste horizontale d'ingrédients avec des images et noms. Assurez une scrollabilité fluide et un design attractif.",
      "description": "Liste les ingrédients associés à un plat sous forme de galerie d'images défilante.",
      "dependencies": ["react-native"]
    },
    {
      "filePath": "screens/HomeScreen.js",
      "filePrompt": "Développez l'écran principal de l'application, intégrant le composant FoodCard et gérant la navigation vers des détails plus précis sur un aliment.",
      "description": "Écran d'accueil affichant des cartes de plats populaires et permettant la navigation vers des écrans de détails.",
      "dependencies": ["react-navigation"]
    },
    {
      "filePath": "navigation/AppNavigator.js",
      "filePrompt": "Configurez la navigation de l'application avec 'react-navigation', définissant les routes principales et les écrans de l'app.",
      "description": "Gère la navigation entre les différents écrans de l'application.",
      "dependencies": ["react-navigation"]
    },
    {
      "filePath": "utils/api.js",
      "filePrompt": "Écrivez des fonctions d'appel à une API pour récupérer des informations sur les aliments et ingrédients. Gérez les requêtes HTTP avec fetch ou axios.",
      "description": "Fournit des fonctions pour interagir avec une API externe de données alimentaires.",
      "dependencies": ["axios"]
    },
    {
      "filePath": "styles/globalStyles.js",
      "filePrompt": "Créez un fichier de styles globaux en utilisant le module StyleSheet de React Native pour maintenir une cohérence à travers l'application.",
      "description": "Contient les styles réutilisables à travers l'application pour standardiser l'apparence.",
      "dependencies": ["react-native"]
    }
  ]
}
```"