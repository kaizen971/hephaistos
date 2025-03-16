import { Snack } from 'snack-sdk';
import { useState, useEffect } from 'react';
import { generateAppStructure, generateFileContent, generateFileContentWithImage, generateDetailedScreen ,generateImprovedFilesObject } from '../services/openai';
import {mockDetailScreenDescription,mockFilesObject} from '../mockConstant.js';

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
  const mockData = true;

  // Utiliser useEffect pour réagir aux changements d'image et de prompt

  // Fonction pour générer l'application à partir de l'image et du prompt
  const generateAppFromImageAndPrompt = async (image, promptText,snack) => {
    try {
      setIsGenerating(true);

      const detailedScreen = mockData ? mockDetailScreenDescription : await generateDetailedScreen(image, promptText);

      const detailedArchitecture = mockData ? mockFilesObject : await generateImprovedFilesObject(detailedScreen);
      console.log(detailedArchitecture);


      

      // Générer le contenu pour chaque fichier
      const generatedFiles = {};
      
      // Fonction pour générer et améliorer le contenu d'un fichier
      const generateAndImproveFileContent = async (fileInfo, detailedScreen) => {
        try {
          // 1. Génération initiale du contenu
          console.log(`Génération du contenu pour: ${fileInfo.filePath}`);
          
          // Créer un prompt enrichi pour la génération du fichier
          const enrichedPrompt = `
          En te basant sur cette description détaillée d'écran:
          ${detailedScreen.description}
          
          Et sur cette description de fichier:
          ${fileInfo.description}
          
          Génère le contenu complet du fichier '${fileInfo.filePath}' selon les spécifications suivantes:
          ${fileInfo.filePrompt}
          
          N'utilise PAS de bibliothèques externes comme react-navigation ou d'autres libs de navigation.
          Utilise uniquement les composants natifs de React Native.
          Ajoute des styles attrayants en utilisant StyleSheet.
          `;
          
          // Générer le contenu initial
          const initialContent = await generateFileContent(enrichedPrompt);
          
          // 2. Amélioration du contenu et vérification des imports
          console.log(`Amélioration du contenu pour: ${fileInfo.filePath}`);
          
          const improvementPrompt = `
          Voici le contenu actuel du fichier '${fileInfo.filePath}':
          
          ${initialContent}
          
          Améliore ce code en:
          1. Vérifiant qu'il n'y a PAS d'imports de bibliothèques externes (comme react-navigation, polices externes, etc.)
          2. Optimisant les styles pour qu'ils soient plus attrayants et responsifs
          3. Assurant que le code respecte les meilleures pratiques React Native
          4. Corrigeant toute erreur potentielle
          
          Le code doit être prêt à l'emploi, sans erreurs et visuellement attractif.
          `;
          
          const improvedContent = await generateFileContent(improvementPrompt);
          
          return improvedContent;
        } catch (error) {
          console.error(`Erreur lors de la génération du fichier ${fileInfo.filePath}:`, error);
          
          // Retourner un contenu par défaut en cas d'erreur
          return `
// Erreur lors de la génération du contenu pour ${fileInfo.filePath}
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ErrorComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Erreur de génération du composant</Text>
      <Text style={styles.path}>${fileInfo.filePath}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffeded',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ff5252',
  },
  text: {
    fontSize: 16,
    color: '#ff0000',
    fontWeight: 'bold',
  },
  path: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
});
          `;
        }
      };
      
      // Traiter chaque fichier dans l'architecture
      for (const fileInfo of detailedArchitecture.files) {
        console.log(`Traitement du fichier: ${fileInfo.filePath}`);
        
        // Générer et améliorer le contenu du fichier
        const fileContent = await generateAndImproveFileContent(fileInfo, detailedScreen);
        
        // Ajouter le fichier généré à notre collection
        generatedFiles[fileInfo.filePath] = {
          type: 'CODE',
          contents: fileContent
        };
        
        // Mettre à jour l'instance Snack en temps réel
        if (snack) {
          snack.updateFiles({
            [fileInfo.filePath]: {
              type: 'CODE',
              contents: fileContent
            }
          });
          console.log(`Fichier ${fileInfo.filePath} ajouté à Snack`);
        }
      }
      
      // Vérifier et améliorer les imports dans App.js
      const verifyAndImproveAppJs = async (generatedFiles) => {
        try {
          console.log("Vérification des imports dans App.js...");
          
          // Vérifier si App.js existe
          if (!generatedFiles['App.js']) {
            console.log("App.js n'existe pas, impossible de vérifier les imports");
            return;
          }
          
          // Obtenir le contenu actuel de App.js
          const appJsContent = generatedFiles['App.js'].contents;
          
          // Identifier les fichiers de composants (exclus App.js, les utils et les styles)
          const componentFiles = Object.keys(generatedFiles)
            .filter(path => path !== 'App.js' && path !== 'package.json')
            .filter(path => path.startsWith('components/') || path.includes('Component'));
          
          console.log("Composants disponibles:", componentFiles);
          
          // Créer un aperçu du contenu de chaque fichier de composant
          const componentsInfo = componentFiles.map(path => {
            const content = generatedFiles[path].contents;
            // Extraire le nom du composant à partir du contenu
            const exportMatch = content.match(/export\s+default\s+(?:function\s+)?(\w+)/);
            const exportConstMatch = content.match(/export\s+default\s+(\w+)/);
            const componentName = exportMatch ? exportMatch[1] : (exportConstMatch ? exportConstMatch[1] : path.split('/').pop().replace('.js', ''));
            
            return {
              path,
              name: componentName,
              excerpt: content.slice(0, 200) + '...'
            };
          });
          
          // Vérifier quels composants sont déjà importés dans App.js
          const importedComponents = [];
          componentFiles.forEach(path => {
            const componentName = path.split('/').pop().replace('.js', '');
            if (appJsContent.includes(`import ${componentName}`) || 
                appJsContent.includes(`import { ${componentName} }`)) {
              importedComponents.push(path);
            }
          });
          
          console.log("Composants déjà importés:", importedComponents);
          
          // Si tous les composants sont importés, pas besoin d'amélioration
          if (importedComponents.length === componentFiles.length) {
            console.log("Tous les composants sont déjà importés dans App.js");
            return;
          }
          
          console.log("Certains composants ne sont pas importés, amélioration d'App.js...");
          
          // Générer une version améliorée d'App.js qui importe tous les composants
          const improvementPrompt = `
          Voici le contenu actuel de App.js:
          
          ${appJsContent}
          
          J'ai identifié que les composants suivants ne sont pas tous importés et utilisés:
          ${componentsInfo.map(comp => `- ${comp.name} (${comp.path})`).join('\n')}
          
          Chaque composant est défini comme:
          ${componentsInfo.map(comp => `- ${comp.name}: ${comp.excerpt}`).join('\n\n')}
          
          Améliore App.js pour:
          1. Importer correctement TOUS les composants listés ci-dessus
          2. Utiliser ces composants de manière logique dans l'interface
          3. Maintenir une structure cohérente et esthétique
          4. Éviter les imports de bibliothèques externes (comme react-navigation)
          
          Le nouveau App.js doit fonctionner sans erreurs et présenter une interface complète.
          `;
          
          console.log("Génération d'un App.js amélioré...");
          const improvedAppJs = await generateFileContent(improvementPrompt);
          
          // Mise à jour du fichier App.js
          generatedFiles['App.js'] = {
            type: 'CODE',
            contents: improvedAppJs
          };
          
          // Mettre à jour Snack avec le nouveau App.js
          if (snack) {
            snack.updateFiles({
              'App.js': {
                type: 'CODE',
                contents: improvedAppJs
              }
            });
            console.log("App.js a été amélioré avec tous les imports nécessaires");
          }
          
          // Vérifier une deuxième fois pour s'assurer que tous les composants sont maintenant importés
          const secondCheckPrompt = `
          Voici le contenu actuel de App.js:
          
          ${improvedAppJs}
          
          Et voici la liste des composants qui doivent être importés:
          ${componentsInfo.map(comp => `- ${comp.name} (${comp.path})`).join('\n')}
          
          Vérifie si tous les composants sont correctement importés et utilisés.
          Si certains ne le sont pas, améliore le code pour les inclure tous.
          Assure-toi également que le code est bien structuré, sans erreurs, et visuellement cohérent.
          `;
          
          console.log("Vérification finale des imports...");
          const finalAppJs = await generateFileContent(secondCheckPrompt);
          
          // Mise à jour finale du fichier App.js
          generatedFiles['App.js'] = {
            type: 'CODE',
            contents: finalAppJs
          };
          
          // Mettre à jour Snack avec la version finale de App.js
          if (snack) {
            snack.updateFiles({
              'App.js': {
                type: 'CODE',
                contents: finalAppJs
              }
            });
            console.log("Vérification finale d'App.js terminée");
          }
          
        } catch (error) {
          console.error("Erreur lors de la vérification/amélioration d'App.js:", error);
        }
      };
      
      // Exécuter la vérification et l'amélioration d'App.js
      await verifyAndImproveAppJs(generatedFiles);
      
      // Mettre à jour l'état des fichiers
      setFiles(generatedFiles);
      if (onFilesChange) {
        onFilesChange(generatedFiles);
      }
      
      // Mettre à jour les URLs
      if (snack) {
        const { webPreviewURL } = snack.getState();
        onWebPreviewURLChange(webPreviewURL);
        console.log("L'URL de prévisualisation a été mise à jour");
        
        const downloadURL = await snack.getDownloadURLAsync();
        onDownloadURLChange(downloadURL);
        console.log("L'URL de téléchargement a été mise à jour");
      } else {
        console.log("L'instance Snack n'est pas initialisée");
      }
      
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