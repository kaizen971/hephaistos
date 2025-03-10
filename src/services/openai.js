import OpenAI from "openai";

// Initialiser le client OpenAI avec la clé API
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Les variables d'environnement React commencent par REACT_APP_
  dangerouslyAllowBrowser: true // Active l'utilisation dans un environnement navigateur
});
const systemPrompt = "You are a developer, and your task is to generate only what is requested, without adding any introductory sentences or superfluous elements, ensuring the output aligns seamlessly with the site's style.TU NE DOIS PAS UTILISER DE LIBRAIRIES REACT NATIVE NAVIGATION que des composant react-native pur. Il ne doit pas avoir react-navigation ou autre librairie de navigation.Ajoute de la couleurs et des polices de caractères. Faut que ce soit jolies.";

/**
 * Génère un JSON décrivant les fichiers à créer pour une application Expo basée sur une image et un prompt
 * @param {File} imageFile - Le fichier image téléversé
 * @param {string} prompt - Le prompt décrivant l'application
 * @returns {Promise<Object>} - Un objet JSON contenant les informations sur les fichiers à créer
 */
export const generateAppStructure = async (imageFile, prompt) => {
  try {
    // Convertir l'image en base64
    const base64Image = await fileToBase64(imageFile);
    
    // Préparer le prompt complet
    
    const userPrompt = `En vous basant sur l'image fournie et sur le prompt global suivant : [${prompt}] veuillez générer un objet JSON décrivant l'ensemble des fichiers à créer pour le premier écran de l'application Expo de base. Cet objet doit contenir une clé "files" associée à un tableau d'objets. Chaque objet devra respecter le format suivant : { "filePath": "chemin/du/fichier.ext", // chemin relatif (exemple: "App.js" ou "components/Header.js") "filePrompt": "Prompt détaillé pour générer le contenu de ce fichier en respectant les bonnes pratiques pour une app Expo React Native, attention le prompt doit être très détaillé et indiquer le contexte de l'application", "description": "Brève description du rôle et des fonctionnalités attendues pour ce fichier.", "dependencies": [ "liste", "de", "dépendances" ] // (optionnel) } Veuillez fournir uniquement cet objet JSON en réponse. Utilise que des librairies natives à expo, pas de librairies externes, N'utilise pas de Navigation, et tu dois indiqué les imports dans le fichier App.js. TU NE DOIS PAS UTILISER DE LIBRAIRIES REACT NATIVE NAVIGATION que des composant react-native pur.`;

    // Appeler l'API OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": systemPrompt
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": userPrompt
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "image_url",
              "image_url": {
                "url": `data:image/png;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: {
        "type": "text"
      },
      temperature: 0.5,
      max_completion_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });
    // Utiliser la nouvelle fonction de conversion
    const jsonResponse = convertMarkdownToJson(response.choices[0].message.content);
    return jsonResponse;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API OpenAI:", error);
    throw error;
  }
};

/**
 * Génère le contenu d'un fichier spécifique en utilisant l'API OpenAI
 * @param {string} filePrompt - Le prompt spécifique pour ce fichier
 * @returns {Promise<string>} - Le contenu du fichier généré
 */
export const generateFileContent = async (filePrompt) => {
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          "role": "system",
          "content": systemPrompt
        },
        {
          "role": "user",
          "content": `${filePrompt} , tu ne dois fournir que le code jsx, rien d'autre, applique toi pour le fichier App.js il ne doit pas contenir de commentaires,ni d'erreurs, juste le code jsx`
        }
      ],
      temperature: 0.7,
      max_tokens: 2048
    });

    // Si la réponse est supposée être du JSON, utilisez la fonction de conversion
    const content = response.choices[0].message.content;
    
    // Vérifier si la réponse semble être du JSON avec des marqueurs Markdown
    if (content.includes('```jsx')) {
      return convertMarkdownToJsx(content);
    }
    
    // Sinon retourner le contenu tel quel
    return content;
  } catch (error) {
    console.error("Erreur lors de la génération du contenu du fichier:", error);
    throw error;
  }
};

/**
 * Convertit un fichier en chaîne base64
 * @param {File} file - Le fichier à convertir
 * @returns {Promise<string>} - La chaîne base64
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Convertit une réponse contenant des marqueurs Markdown en objet JSON
 * @param {string} markdownResponse - La réponse avec les marqueurs Markdown
 * @returns {Object} - L'objet JSON parsé
 */
const convertMarkdownToJson = (markdownResponse) => {
  try {
    // Nettoyer la chaîne en retirant les marqueurs Markdown
    let cleanedContent = markdownResponse;
    
    // Retirer les guillemets externes si présents
    if (cleanedContent.startsWith('"') && cleanedContent.endsWith('"')) {
      cleanedContent = cleanedContent.slice(1, -1);
    }
    
    // Retirer les marqueurs de code Markdown
    cleanedContent = cleanedContent
      .replace(/^```json\s*/, '')  // Retire ```json au début
      .replace(/```\s*$/, '')      // Retire ``` à la fin
      .trim();                     // Retire les espaces superflus

    // Parser le JSON nettoyé
    const jsonObject = JSON.parse(cleanedContent);
    return jsonObject;
  } catch (error) {
    console.error("Erreur lors de la conversion Markdown vers JSON:", error);
    console.error("Contenu problématique:", markdownResponse);
    throw new Error("Impossible de convertir la réponse Markdown en JSON");
  }
}; 

const convertMarkdownToJsx = (markdownResponse) => {
  try {
    // Nettoyer la chaîne en retirant les marqueurs Markdown
    let cleanedContent = markdownResponse;
    
    // Retirer les marqueurs de code Markdown
    cleanedContent = cleanedContent
      .replace(/^```jsx\s*/, '')  // Retire ```jsx au début
      .replace(/```\s*$/, '')      // Retire ``` à la fin
      .trim();                     // Retire les espaces superflus

    return cleanedContent;
  } catch (error) {
    console.error("Erreur lors de la conversion Markdown vers JSX:", error);
    console.error("Contenu problématique:", markdownResponse);
    throw new Error("Impossible de convertir la réponse Markdown en JSX");
  }
};  
