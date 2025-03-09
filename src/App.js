import React, { useRef, useState } from 'react';
import SnackManager from './components/SnackManager';
import PhonePreview, { phoneModels } from './components/PhonePreview';
import CodeEditor from './components/CodeEditor';

// You can now use the url and show it as a QR code
// to open the Snack in the Expo client.

// Stop Snack when done

const App = () => {
  const webPreviewRef = useRef(null);
  const [webPreviewURL, setWebPreviewURL] = useState(null);
  const [phoneModel, setPhoneModel] = useState({
    name: 'iPhone 12',
    width: 340,
    height: 680,
    label: 'iPhone 12'
  });
  const [downloadURL, setDownloadURL] = useState(null);
  const [files, setFiles] = useState(null);

  // Fonction pour mettre à jour le contenu d'un fichier
  const handleFileChange = (fileName, newContent) => {
    if (window.updateFileContent) {
      window.updateFileContent(fileName, newContent);
    }
  };

  return (
    <div>
      <h1>Expo Snack Previewer</h1>
      
      {/* Gestionnaire de Snack (logique sans rendu visuel) */}
      <SnackManager 
        webPreviewRef={webPreviewRef}
        onWebPreviewURLChange={setWebPreviewURL}
        onDownloadURLChange={setDownloadURL}
        onFilesChange={setFiles}
        onError={(error) => {
          console.log("L'application a rencontré une erreur:", error);
          // Afficher une notification à l'utilisateur ou prendre d'autres mesures
        }}
      />
      
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', flexWrap: 'wrap' }}>
        {/* Éditeur de code */}
        <div style={{ flex: 1, minWidth: '400px' }}>
          <h2>Éditeur de Code</h2>
          {files && (
            <CodeEditor 
              files={files} 
              onFileChange={handleFileChange} 
            />
          )}
        </div>
        
        {/* Prévisualisation du téléphone */}
        <div style={{ flex: 1, minWidth: '400px' }}>
          <h2>Prévisualisation</h2>
          {webPreviewURL && (
            <PhonePreview
              webPreviewRef={webPreviewRef}
              webPreviewURL={webPreviewURL}
              phoneModel={phoneModel}
              setPhoneModel={setPhoneModel}
            />
          )}
        </div>
      </div>
      
      {/* Lien de téléchargement */}
      {downloadURL && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <a 
            href={downloadURL} 
            download 
            style={{
              padding: '10px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            Télécharger l'application
          </a>
        </div>
      )}
    </div>
  );
};

export default App;