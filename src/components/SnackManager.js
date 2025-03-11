import { Snack } from 'snack-sdk';
import { useState, useEffect } from 'react';
import { generateAppStructure, generateFileContent, generateFileContentWithImage, generateDetailedScreen } from '../services/openai';

const SnackManager = ({ 
  webPreviewRef, 
  onWebPreviewURLChange, 
  onDownloadURLChange, 
  onFilesChange, 
  onError,
  imageFile, // Nouvelle prop pour l'image
  prompt     // Nouvelle prop pour le prompt
}) => {
  const [snackInstance, setSnackInstance] = useState(null);
  const [files, setFiles] = useState({});
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Utiliser useEffect pour réagir aux changements d'image et de prompt

  // Fonction pour générer l'application à partir de l'image et du prompt
  const generateAppFromImageAndPrompt = async (image, promptText,snack) => {
    try {
      setIsGenerating(true);

      const detailedScreen = await generateDetailedScreen(image, promptText);
      console.log(detailedScreen);
      
//       // 1. Appeler l'API OpenAI pour obtenir la structure de l'application
//       const appStructure = await generateAppStructure(image, promptText);
      
//       // 2. Générer le contenu de chaque fichier (sauf App.js)
//       const generatedFiles = {};
      
//       // Pour simuler un chargement progressif, on peut utiliser Promise.all
//       await Promise.all(appStructure["files"]
//         .filter(fileInfo => fileInfo.filePath !== 'App.js') // Exclure App.js de la génération initiale
//         .map(async (fileInfo) => {
//           try {
//             // Générer le contenu du fichier
//             const fileContent = await generateFileContent(fileInfo.filePrompt);
            
//             // Ajouter le fichier à notre objet de fichiers
//             generatedFiles[fileInfo.filePath] = {
//               type: 'CODE',
//               contents: fileContent
//             };
//             snack.updateFiles(
//               {
//                 [fileInfo.filePath]: {
//                   type: 'CODE',
//                   contents: fileContent
//                 }
//               }
//             );
//             console.log(`Fichier généré: ${fileInfo.filePath}`);
//           } catch (err) {
//             console.error(`Erreur lors de la génération du fichier ${fileInfo.filePath}:`, err);
//           }
//         }));

//       // 3. Générer App.js en utilisant les informations des fichiers déjà générés
//       try {
//         // Créer un prompt qui décrit les fichiers déjà générés pour aider à créer un App.js cohérent
//         const filesInfo = Object.entries(generatedFiles).map(([path, file]) => {
//           return `${path}:\n${file.contents.slice(0, 300)}${file.contents.length > 300 ? '...' : ''}`;
//         }).join('\n\n');
        
//         // Créer un prompt plus détaillé qui fait référence à l'image mais sans l'envoyer directement
//         const appJsPrompt = `Crée un fichier App.js complet pour une application React Native/Expo basée sur les fichiers suivants:
// ${filesInfo}

// Utilise le même design que celui demandé dans le prompt initial: "${promptText}"

// Le fichier App.js doit:
// - Importer correctement tous les composants nécessaires des fichiers listés ci-dessus
// - Intégrer les composants créés dans les autres fichiers
// - Structurer l'application de manière cohérente
// - Utiliser les couleurs, styles et mises en page cohérents avec le reste de l'application
// - Servir de point d'entrée principal de l'application en organisant tous les composants`;
        
//         // Utiliser la fonction existante
//         const appJsContent = await generateFileContentWithImage(appJsPrompt,image);
        
//         // Ajouter App.js aux fichiers générés
//         generatedFiles['App.js'] = {
//           type: 'CODE',
//           contents: appJsContent
//         };
        
//         // Mettre à jour Snack avec App.js
//         snack.updateFiles({
//           'App.js': {
//             type: 'CODE',
//             contents: appJsContent
//           }
//         });
        
//         console.log('Fichier principal App.js généré');
//       } catch (err) {
//         console.error('Erreur lors de la génération du fichier App.js:', err);
        
//         // Fallback en cas d'échec de génération de App.js
//         generatedFiles['App.js'] = {
//           type: 'CODE',
//           contents: `
// import * as React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Application générée à partir de l'image et du prompt</Text>
//       <Text style={styles.subtitle}>Les composants sont disponibles dans les autres fichiers</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#120d30',
//     padding: 20,
//   },
//   text: {
//     fontSize: 20,
//     color: '#0cffe1',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: 'rgba(240, 245, 255, 0.8)',
//     textAlign: 'center',
//   },
// });
//           `
//         };
//       }
      
//       // Si aucun fichier n'a été généré, utiliser une app par défaut
//       if (Object.keys(generatedFiles).length === 0) {
//         generatedFiles['App.js'] = {
//           type: 'CODE',
//           contents: `
// import * as React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Application générée à partir de l'image et du prompt</Text>
//       <Text style={styles.subtitle}>Une erreur s'est produite lors de la génération complète</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#120d30',
//     padding: 20,
//   },
//   text: {
//     fontSize: 20,
//     color: '#0cffe1',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: 'rgba(240, 245, 255, 0.8)',
//     textAlign: 'center',
//   },
// });
//           `
//         };
        
//         generatedFiles['package.json'] = {
//           type: 'CODE',
//           contents: `{
//   "dependencies": {
//     "react": "18.2.0",
//     "react-native": "0.72.6",
//     "expo": "~49.0.0",
//     "expo-status-bar": "~1.6.0"
//   }
// }`
//         };
//       }

      
//       // 3. Mettre à jour l'état des fichiers

//       setFiles(generatedFiles);
//       if (onFilesChange) {
//         onFilesChange(generatedFiles);
//       }
//       console.log("tentative de mettre à jour l'instance Snack avec les nouveaux fichiers")
//       // 4. Mettre à jour l'instance Snack avec les nouveaux fichiers
//       if (snack) {
//         snack.updateFiles(generatedFiles);
//         // Mettre à jour l'URL de prévisualisation
//         const { webPreviewURL } = snack.getState();
//         onWebPreviewURLChange(webPreviewURL);
//         console.log("l'URL de prévisualisation a été mise à jour")
        
//         // Mettre à jour l'URL de téléchargement
//         const downloadURL = await snack.getDownloadURLAsync();
//         onDownloadURLChange(downloadURL);
//         console.log("l'URL de téléchargement a été mise à jour")
//       }else{
//         console.log("l'instance Snack n'est pas initialisée")
//       }
      
      
      setIsGenerating(false);
    } catch (err) {
      console.error("Erreur lors de la génération de l'application:", err);
      setError(err);
      setIsGenerating(false);
      
      if (onError) {
        onError(err);
      }
    }
  };

  useEffect(() => {
    const initializeSnack = async () => {
      const initialFiles = {
        'App.js': {
          type: 'CODE',
          contents: `
            import * as React from 'react';
            import { View, Text } from 'react-native';

            const App = () => (
            <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{fontSize: 20, textAlign: 'center', color: 'red'}}>
             Hello Snack!
      </Text>
    </View>
  );

            export default App;
`
        }
      };

      // Mettre à jour l'état des fichiers et les exposer via callback
      setFiles(initialFiles);
      if (onFilesChange) {
        onFilesChange(initialFiles);
      }

      const snack = new Snack({
        online: true,
        files: initialFiles,
        webPreviewRef,
        sdkVersion: "49.0.0",  // Version Expo spécifiée
        name: "My Expo App",
        description: "A standard Expo app with tabs navigation",
        onDownloadURLChange: (downloadURL) => {
          console.log("l'URL de téléchargement a été mise à jour")
        },
        
      });

      setSnackInstance(snack);

      // Ajouter un écouteur d'événements pour les logs et détecter les erreurs
      snack.addLogListener((log) => {
        // Filtrer uniquement les erreurs
        console.log(log);
        if (log.level === 'error') {
          console.error('Erreur de rendu Snack:', log);
          if (onError) {
            onError(log);
          }
        }
      });

      snack.setOnline(true);
      const { url } = await snack.getStateAsync();
      console.log(url);
      snack.setOnline(false);
      const urls = await snack.getDownloadURLAsync();
      onDownloadURLChange(urls);
      const { webPreviewURL } = snack.getState();
      onWebPreviewURLChange(webPreviewURL);
      const connectedClients = await snack.getPreviewAsync();
      console.log(connectedClients);

      return snack;
    };
     
    // Initialiser Snack et générer l'application si nécessaire
    const init = async () => {
      const snack = await initializeSnack();
      
      // Si l'image et le prompt sont déjà disponibles lors de l'initialisation, générer l'application
      if (imageFile && prompt) {
        generateAppFromImageAndPrompt(imageFile, prompt, snack);
      }
    };
    
    init();

  }, []);  // Pas de dépendances pour éviter des ré-initialisations multiples
  
  // useEffect séparé pour réagir aux changements d'image et de prompt
  useEffect(() => {
    if (snackInstance && imageFile && prompt) {
      generateAppFromImageAndPrompt(imageFile, prompt, snackInstance);
    }
  }, [imageFile, prompt]); // Ne se déclenche que quand imageFile ou prompt changent

  // Fonction pour mettre à jour le contenu d'un fichier
  const updateFileContent = async (fileName, newContent) => {
    if (!snackInstance) return;

    // Mettre à jour le fichier dans l'instance Snack
    snackInstance.updateFiles({
      [fileName]: {
        type: 'CODE',
        contents: newContent
      }
    });

    // Mettre à jour l'état local des fichiers
    const updatedFiles = {
      ...files,
      [fileName]: {
        ...files[fileName],
        contents: newContent
      }
    };
    setFiles(updatedFiles);

    // Mettre à jour l'URL de prévisualisation
    const { webPreviewURL } = snackInstance.getState();
    onWebPreviewURLChange(webPreviewURL);

    // Mettre à jour les fichiers dans le parent
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  // Exposer la fonction updateFileContent
  if (typeof window !== 'undefined') {
    window.updateFileContent = updateFileContent;
  }

  return null; // Ce composant ne rend rien visuellement
};

export default SnackManager;