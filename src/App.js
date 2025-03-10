import React, { useRef, useState } from 'react';
import SnackManager from './components/SnackManager';
import PhonePreview, { phoneModels } from './components/PhonePreview';
import CodeEditor from './components/CodeEditor';
import './styles.css'; // Nous allons extraire les styles dans un fichier CSS

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
  
  // État pour suivre si l'utilisateur a soumis une image et un prompt
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewURL, setImagePreviewURL] = useState(null); // Nouvel état pour l'aperçu de l'image

  // Fonction pour mettre à jour le contenu d'un fichier
  const handleFileChange = (fileName, newContent) => {
    if (window.updateFileContent) {
      window.updateFileContent(fileName, newContent);
    }
  };

  // Fonction pour gérer la soumission de l'image et du prompt
  const handleAppSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && imageFile) {
      setAppSubmitted(true);
      // Ici, vous pourriez déclencher une action pour traiter l'image et le prompt
      // et les envoyer au SnackManager
    }
  };

  // Fonction pour gérer le téléchargement d'image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Créer une URL pour l'aperçu de l'image
      const previewURL = URL.createObjectURL(file);
      setImagePreviewURL(previewURL);
    }
  };

  // Fonction pour gérer le glisser-déposer d'image
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      
      // Créer une URL pour l'aperçu de l'image
      const previewURL = URL.createObjectURL(file);
      setImagePreviewURL(previewURL);
    }
  };

  // Fonction pour supprimer l'image téléversée
  const handleRemoveImage = () => {
    if (imagePreviewURL) {
      URL.revokeObjectURL(imagePreviewURL); // Libérer la mémoire
    }
    setImageFile(null);
    setImagePreviewURL(null);
  };

  return (
    <div className="app-container">
      {!appSubmitted ? (
        // Interface d'accueil et de soumission (inspirée de ui.html)
        <>
          <header>
            <div className="logo">NEXUS</div>
            <nav>
              <ul>
                <li><a href="#">Accueil</a></li>
                <li><a href="#">Fonctionnalités</a></li>
                <li><a href="#">Showcase</a></li>
                <li><a href="#">Tarifs</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </nav>
          </header>
          
          <section className="hero">
            <div className="floating-orbs">
              <div className="orb"></div>
              <div className="orb"></div>
              <div className="orb"></div>
            </div>
            
            <div className="hero-content">
              <h1>Transformez vos <span>idées</span> en applications en quelques secondes</h1>
              <p className="subtitle">NEXUS révolutionne la création d'applications. Une image, un prompt, et notre IA génère l'application dont vous avez toujours rêvé.</p>
              <a href="#upload-section" className="btn-primary">Essayer gratuitement</a>
            </div>
            
            <div className="hero-visual">
              <div className="app-demo">
                <img src="/api/placeholder/540/400" alt="Démonstration de l'application NEXUS" />
              </div>
            </div>
          </section>
          
          <section id="upload-section" className="upload-container">
            <h2>Créez votre application dès maintenant</h2>
            <div className="upload-grid">
              <div className="upload-section">
                <h3>1. Téléversez une image de référence</h3>
                {!imagePreviewURL ? (
                  <div 
                    className="upload-box"
                    onClick={() => document.getElementById('image-upload').click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input 
                      type="file" 
                      id="image-upload" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                    <div className="upload-icon">+</div>
                    <p>Glissez ou cliquez pour téléverser</p>
                  </div>
                ) : (
                  <div className="image-preview-container">
                    <div className="image-preview-wrapper">
                      <img 
                        src={imagePreviewURL} 
                        alt="Aperçu" 
                        className="image-preview" 
                      />
                      <button 
                        className="remove-image-btn"
                        onClick={handleRemoveImage}
                        title="Supprimer l'image"
                      >
                        ×
                      </button>
                    </div>
                    <p className="image-name">{imageFile.name}</p>
                  </div>
                )}
              </div>
              
              <div className="upload-section">
                <h3>2. Décrivez votre application</h3>
                <div className="input-group">
                  <label htmlFor="prompt">Votre prompt</label>
                  <textarea 
                    id="prompt" 
                    placeholder="Décrivez les fonctionnalités, le style et le but de votre application..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  ></textarea>
                </div>
                <button 
                  className="btn-primary"
                  onClick={handleAppSubmit}
                  disabled={!prompt.trim() || !imageFile}
                >
                  Générer mon application
                </button>
              </div>
            </div>
          </section>
          
          <section className="features">
            <div className="section-title">
              <h2>Une révolution technologique</h2>
              <p>Découvrez les fonctionnalités qui font de NEXUS la plateforme la plus innovante pour créer des applications.</p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Génération instantanée</h3>
                <p>Obtenez une application fonctionnelle en moins de 60 secondes, prête à être téléchargée ou publiée.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🧠</div>
                <h3>IA multimodale avancée</h3>
                <p>Notre IA comprend à la fois les images et le texte pour créer exactement ce que vous imaginez.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Multi-plateformes</h3>
                <p>Générez des applications pour iOS, Android, Web et desktop à partir d'une seule description.</p>
              </div>
            </div>
          </section>
          
          <footer>
            <div className="container">
              <div className="footer-grid">
                <div>
                  <div className="footer-logo">NEXUS</div>
                  <p className="footer-text">Révolutionnez la création d'applications avec l'IA la plus avancée du marché. Une image, un prompt, et votre application est prête.</p>
                </div>
                
                <div>
                  <h4 className="footer-title">Liens rapides</h4>
                  <ul className="footer-links">
                    <li><a href="#">Accueil</a></li>
                    <li><a href="#">Fonctionnalités</a></li>
                    <li><a href="#">Tarifs</a></li>
                    <li><a href="#">Blog</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </>
      ) : (
        // Interface d'édition et de prévisualisation (après soumission)
        <div className="editor-container">
          <h1>Expo Snack Previewer</h1>
          
          <SnackManager 
            webPreviewRef={webPreviewRef}
            onWebPreviewURLChange={setWebPreviewURL}
            onDownloadURLChange={setDownloadURL}
            onFilesChange={setFiles}
            onError={(error) => {
              console.log("L'application a rencontré une erreur:", error);
            }}
            imageFile={imageFile}  // Passer l'image au SnackManager
            prompt={prompt}       // Passer le prompt au SnackManager
          />
          
          {/* Indicateur de chargement */}
          {!files && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Génération de votre application en cours...</p>
              <p className="loading-subtext">Cela peut prendre quelques instants</p>
            </div>
          )}
          
          {files && (
            <>
              <div className="editor-preview-container">
                {/* Éditeur de code */}
                <div className="editor-section">
                  <h2>Éditeur de Code</h2>
                  <CodeEditor 
                    files={files} 
                    onFileChange={handleFileChange} 
                  />
                </div>
                
                {/* Prévisualisation du téléphone */}
                <div className="preview-section">
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
                <div className="download-section">
                  <a 
                    href={downloadURL} 
                    download 
                    className="download-button"
                  >
                    Télécharger l'application
                  </a>
                </div>
              )}
            </>
          )}
          
          <button 
            className="btn-secondary"
            onClick={() => setAppSubmitted(false)}
          >
            Retourner à l'accueil
          </button>
        </div>
      )}
    </div>
  );
};

export default App;