import React, { useState, useEffect } from 'react';

const RenameModal = ({ item, onClose, onSave }) => {
  const [baseName, setBaseName] = useState('');
  const [extension, setExtension] = useState('');

  useEffect(() => {
    if (item) {
      if (item.type === 'file') {
        const dotIndex = item.name.lastIndexOf('.');
        if (dotIndex !== -1) {
          setBaseName(item.name.substring(0, dotIndex));
          setExtension(item.name.substring(dotIndex)); // includes dot
        } else {
          setBaseName(item.name);
          setExtension('');
        }
      } else {
        setBaseName(item.name);
        setExtension('');
      }
    }
  }, [item]);

  const handleSave = () => {
    if (!baseName.trim()) {
      alert('Please enter a name');
      return;
    }
    
    const fullName = baseName.trim() + extension;
    if (fullName !== item.name) {
      onSave(item._id, fullName);
    } else {
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!item) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Rename {item.type === 'file' ? 'File' : 'Folder'}</h3>
        
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <input
            type="text"
            value={baseName}
            onChange={(e) => setBaseName(e.target.value)}
            placeholder="Enter new name"
            onKeyPress={handleKeyPress}
            autoFocus
            style={{
              padding: '12px',
              flex: 1,
              borderRadius: '8px',
              border: '1px solid #00c2cb',
              background: '#222',
              color: '#fff',
              fontSize: '14px'
            }}
          />
          {extension && (
            <div style={{
              backgroundColor: '#00c2cb',
              color: 'white',
              padding: '12px 15px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
              minWidth: '60px',
              textAlign: 'center'
            }}>
              {extension}
            </div>
          )}
        </div>
        
        <div className="button-group" style={{ marginTop: '20px' }}>
          <button 
            className="save" 
            onClick={handleSave}
            disabled={!baseName.trim()}
          >
            Save
          </button>
          <button 
            className="cancel" 
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameModal;