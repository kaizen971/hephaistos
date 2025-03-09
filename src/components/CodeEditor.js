import React, { useState } from 'react';

const CodeEditor = ({ files, onFileChange }) => {
  const [selectedFile, setSelectedFile] = useState(Object.keys(files)[0]);
  const [fileContent, setFileContent] = useState(files[Object.keys(files)[0]].contents);

  const handleFileSelect = (fileName) => {
    setSelectedFile(fileName);
    setFileContent(files[fileName].contents);
  };

  const handleCodeChange = (e) => {
    const newContent = e.target.value;
    setFileContent(newContent);
    
    // Mettre à jour le contenu du fichier dans la structure principale
    onFileChange(selectedFile, newContent);
  };

  return (
    <div className="code-editor">
      <style>{`
        .code-editor {
          display: flex;
          flex-direction: column;
          border: 1px solid #ccc;
          border-radius: 4px;
          overflow: hidden;
          height: 400px;
          margin-bottom: 20px;
        }
        
        .file-tabs {
          display: flex;
          background-color: #f0f0f0;
          border-bottom: 1px solid #ddd;
          overflow-x: auto;
        }
        
        .file-tab {
          padding: 8px 16px;
          cursor: pointer;
          border-right: 1px solid #ddd;
          white-space: nowrap;
        }
        
        .file-tab.active {
          background-color: #007bff;
          color: white;
        }
        
        .editor-area {
          flex: 1;
          display: flex;
        }
        
        .code-textarea {
          width: 100%;
          height: 100%;
          font-family: monospace;
          font-size: 14px;
          padding: 10px;
          border: none;
          resize: none;
          outline: none;
          line-height: 1.5;
          tab-size: 2;
        }
      `}</style>

      <div className="file-tabs">
        {Object.keys(files).map((fileName) => (
          <div
            key={fileName}
            className={`file-tab ${selectedFile === fileName ? 'active' : ''}`}
            onClick={() => handleFileSelect(fileName)}
          >
            {fileName}
          </div>
        ))}
      </div>
      
      <div className="editor-area">
        <textarea
          className="code-textarea"
          value={fileContent}
          onChange={handleCodeChange}
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default CodeEditor; 