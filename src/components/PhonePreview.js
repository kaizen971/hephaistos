import React from 'react';

const phoneModels = [
  { name: 'iPhone SE', width: 300, height: 580, label: 'iPhone SE' },
  { name: 'iPhone 12', width: 340, height: 680, label: 'iPhone 12' },
  { name: 'iPhone 12 Pro Max', width: 380, height: 750, label: 'iPhone 12 Pro Max' },
  { name: 'Galaxy S21', width: 350, height: 700, label: 'Galaxy S21' },
  { name: 'Pixel 5', width: 330, height: 660, label: 'Pixel 5' },
];

const PhonePreview = ({ webPreviewRef, webPreviewURL, phoneModel, setPhoneModel }) => {
  return (
    <div className="phone-container">
      <style>{`
        .phone-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 20px 0;
        }
        
        .phone-frame {
          position: relative;
          width: ${phoneModel.width}px;
          height: ${phoneModel.height}px;
          background-color: #111;
          border-radius: 36px;
          padding: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          border: 1px solid #444;
          transition: width 0.3s, height 0.3s;
        }
        
        .phone-frame:before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 25px;
          background-color: #111;
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          z-index: 2;
        }
        
        .phone-screen {
          width: 100%;
          height: 100%;
          background-color: white;
          border-radius: 24px;
          overflow: hidden;
        }
        
        .model-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .model-button {
          padding: 8px 16px;
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .model-button:hover {
          background-color: #e0e0e0;
        }
        
        .model-button.active {
          background-color: #007bff;
          color: white;
          border-color: #0069d9;
        }
        
        .phone-name {
          margin-top: 10px;
          font-weight: bold;
          font-size: 14px;
          color: #555;
        }
      `}</style>

      <div className="model-buttons">
        {phoneModels.map((model) => (
          <button
            key={model.name}
            className={`model-button ${phoneModel.name === model.name ? 'active' : ''}`}
            onClick={() => setPhoneModel(model)}
          >
            {model.label}
          </button>
        ))}
      </div>
      
      <div className="phone-frame">
        <div className="phone-screen">
          <iframe
            ref={(c) => (webPreviewRef.current = c?.contentWindow ?? null)}
            src={webPreviewURL}
            allow="geolocation; camera; microphone"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
      
      <div className="phone-name">
        Modèle actuel : {phoneModel.label} ({phoneModel.width}x{phoneModel.height})
      </div>
    </div>
  );
};

export { phoneModels, PhonePreview };
export default PhonePreview; 