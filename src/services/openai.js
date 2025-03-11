import OpenAI from "openai";

// Initialiser le client OpenAI avec la clé API
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Les variables d'environnement React commencent par REACT_APP_
  dangerouslyAllowBrowser: true // Active l'utilisation dans un environnement navigateur
});

// Définition des paramètres globaux pour l'API
const OPENAI_MODEL = "gpt-4o-mini";
const ENABLE_IMAGES = false; // Variable permettant d'activer/désactiver l'utilisation des images
const USE_OLLAMA = true; // Variable pour activer ou désactiver l'utilisation d'Ollama
const OLLAMA_URL = "http://localhost:11434"; // URL du serveur Ollama
const OLLAMA_MODEL = "deepseek-r1:8b"; // Modèle Ollama à utiliser
const systemPrompt = "You are a developer, and your task is to generate only what is requested, without adding any introductory sentences or superfluous elements, ensuring the output aligns seamlessly with the site's style.TU NE DOIS PAS UTILISER DE LIBRAIRIES REACT NATIVE NAVIGATION que des composant react-native pur. Il ne doit pas avoir react-navigation ou autre librairie de navigation.Ajoute de la couleurs et des polices de caractères. Faut que ce soit jolies.";

/**
 * Nettoie la réponse d'Ollama en retirant les balises <think></think>
 * @param {string} response - La réponse à nettoyer
 * @returns {string} - La réponse nettoyée
 */
const cleanOllamaResponse = (response) => {
  if (!response) return "";
  
  // Retirer toutes les balises <think> et leur contenu
  const cleaned = response.replace(/<think>([\s\S]*?)<\/think>/g, '');
  
  // Retirer les balises qui peuvent rester
  return cleaned
    .replace(/<think>/g, '')
    .replace(/<\/think>/g, '')
    .trim();
};

/**
 * Fonction pour générer du texte via l'API Ollama
 * @param {Array} messages - Les messages à envoyer au modèle
 * @returns {Promise<string>} - Le texte généré
 */
const generateWithOllama = async (messages) => {
  try {
    // Convertir les messages au format compatible avec Ollama
    let prompt = "";
    
    // Ajouter le système
    const systemMessage = messages.find(msg => msg.role === "system");
    if (systemMessage && systemMessage.content) {
      // Si le contenu est un tableau (pour les messages avec images), extraire le texte
      const content = Array.isArray(systemMessage.content) 
        ? systemMessage.content.find(c => c.type === "text")?.text || ""
        : systemMessage.content;
      prompt += `Système: ${content}\n\n`;
    }
    
    // Ajouter les messages utilisateur
    for (const msg of messages) {
      if (msg.role === "user") {
        // Si le contenu est un tableau (pour les messages avec images), extraire le texte
        if (Array.isArray(msg.content)) {
          const textContent = msg.content.find(c => c.type === "text")?.text;
          if (textContent) {
            prompt += `Utilisateur: ${textContent}\n\n`;
          }
          
          // Pour les images, on indique simplement qu'une image a été fournie
          const hasImage = msg.content.some(c => c.type === "image_url");
          if (hasImage && ENABLE_IMAGES) {
            prompt += "Note: Une image a été fournie mais ne peut pas être traitée par Ollama.\n\n";
          }
        } else {
          prompt += `Utilisateur: ${msg.content}\n\n`;
        }
      }
    }
    
    console.log("Envoi de la requête à Ollama avec prompt:", prompt);
    
    // Appel à l'API Ollama
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur lors de l'appel à Ollama: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Réponse d'Ollama:", data);
    
    if (!data.response) {
      console.error("La réponse d'Ollama ne contient pas de champ 'response':", data);
      return "Erreur: Réponse inattendue d'Ollama";
    }
    
    // Nettoyer la réponse pour retirer les balises <think></think>
    const cleanedResponse = cleanOllamaResponse(data.response);
    console.log("Réponse nettoyée:", cleanedResponse);
    
    return cleanedResponse;
  } catch (error) {
    console.error("Erreur lors de l'appel à Ollama:", error);
    throw error;
  }
};

/**
 * Génère un JSON décrivant les fichiers à créer pour une application Expo basée sur une image et un prompt
 * @param {File} imageFile - Le fichier image téléversé
 * @param {string} prompt - Le prompt décrivant l'application
 * @returns {Promise<Object>} - Un objet JSON contenant les informations sur les fichiers à créer
 */
export const generateAppStructure = async (imageFile, prompt) => {
  try {
    // Messages pour l'API
    const messages = [
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
            "text": `En vous basant sur ${ENABLE_IMAGES ? "l'image fournie et sur " : ""}le prompt global suivant : [${prompt}] veuillez générer un objet JSON décrivant l'ensemble des fichiers à créer pour le premier écran de l'application Expo de base. Cet objet doit contenir une clé "files" associée à un tableau d'objets. Chaque objet devra respecter le format suivant : { "filePath": "chemin/du/fichier.ext", // chemin relatif (exemple: "App.js" ou "components/Header.js") "filePrompt": "Prompt détaillé pour générer le contenu de ce fichier en respectant les bonnes pratiques pour une app Expo React Native, attention le prompt doit être très détaillé et indiquer le contexte de l'application", "description": "Brève description du rôle et des fonctionnalités attendues pour ce fichier.", "dependencies": [ "liste", "de", "dépendances" ] // (optionnel) } Veuillez fournir uniquement cet objet JSON en réponse. Utilise que des librairies natives à expo, pas de librairies externes, N'utilise pas de Navigation, et tu dois indiqué les imports dans le fichier App.js. TU NE DOIS PAS UTILISER DE LIBRAIRIES REACT NATIVE NAVIGATION que des composant react-native pur.`
          }
        ]
      }
    ];
    
    // Ajouter l'image au message si activée
    if (ENABLE_IMAGES && imageFile && !USE_OLLAMA) {
      // Convertir l'image en base64
      const base64Image = await fileToBase64(imageFile);
      
      messages.push({
        "role": "user",
        "content": [
          {
            "type": "image_url",
            "image_url": {
              "url": `data:image/png;base64,${base64Image}`
            }
          }
        ]
      });
    }
    
    let content;
    
    // Utiliser Ollama ou OpenAI selon la configuration
    if (USE_OLLAMA) {
      content = await generateWithOllama(messages);
    } else {
      // Appeler l'API OpenAI
      const response = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: messages,
        response_format: {
          "type": "text"
        },
        temperature: 0.5,
        max_completion_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });
      content = response.choices[0].message.content;
    }
    
    // Utiliser la fonction de conversion
    const jsonResponse = convertMarkdownToJson(content);
    return jsonResponse;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error);
    throw error;
  }
};

/**
 * Génère le contenu d'un fichier basé sur un prompt textuel et une image
 * @param {string} prompt - Le prompt décrivant le fichier à générer
 * @param {File|Blob} image - L'image à analyser pour la génération du contenu
 * @returns {Promise<string>} Le contenu du fichier généré
 */

/**
 * Convertit une image en chaîne base64
 * @param {File|Blob} image - L'image à convertir
 * @returns {Promise<string>} L'image convertie en base64
 */
const convertImageToBase64 = (image) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

/**
 * Génère le contenu d'un fichier spécifique en utilisant l'API OpenAI
 * @param {string} filePrompt - Le prompt spécifique pour ce fichier
 * @returns {Promise<string>} - Le contenu du fichier généré
 */
export const generateFileContent = async (filePrompt) => {
  try {
    const messages = [
      {
        "role": "system",
        "content": systemPrompt
      },
      {
        "role": "user",
        "content": `${filePrompt} , tu ne dois fournir que le code jsx, rien d'autre, il ne doit pas contenir de commentaires,ni d'erreurs, juste le code jsx. Applique toi sur la responsivité et les dimensions il faut qu'il prenne toute la largeur de l'écran. Respecte les règles d'ui/ux`
      }
    ];

    let content;
    
    // Utiliser Ollama ou OpenAI selon la configuration
    if (USE_OLLAMA) {
      content = await generateWithOllama(messages);
    } else {
      const response = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048
      });
      content = response.choices[0].message.content;
    }
    
    // Vérifier si la réponse semble être du JSX avec des marqueurs Markdown
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

export const generateFileContentWithImage = async (filePrompt, imageFile) => {
  // Messages pour l'API
  const messages = [
    {
      "role": "system",
      "content": systemPrompt
    },
    {
      "role": "user",
      "content": `${filePrompt} , tu ne dois fournir que le code jsx, rien d'autre, applique toi pour le fichier App.js il ne doit pas contenir de commentaires,ni d'erreurs, juste le code jsx`
    }
  ];

  // Ajouter l'image au message si activée et si on n'utilise pas Ollama
  if (ENABLE_IMAGES && imageFile && !USE_OLLAMA) {
    const base64Image = await fileToBase64(imageFile);
    
    messages.push({
      "role": "user",
      "content": [
        {
          "type": "image_url",
          "image_url": {
            "url": `data:image/png;base64,${base64Image}`
          }
        }
      ]
    });
  }

  try {
    let content;
    
    // Utiliser Ollama ou OpenAI selon la configuration
    if (USE_OLLAMA) {
      content = await generateWithOllama(messages);
    } else {
      const response = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048
      });
      content = response.choices[0].message.content;
    }
    
    // Vérifier si la réponse semble être du JSX avec des marqueurs Markdown
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
