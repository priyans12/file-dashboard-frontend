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
    const fullName = baseName.trim() + extension;
    if (baseName.trim() && fullName !== item.name) {
      onSave(fullName);
    }
  };

  if (!item) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3 style={{ marginBottom: '10px' }}>Rename {item.type === 'file' ? 'File' : 'Folder'}</h3>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            type="text"
            value={baseName}
            onChange={(e) => setBaseName(e.target.value)}
            placeholder="Enter new name"
            style={{
              padding: '10px',
              flex: 1,
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />
          {extension && (
            <div style={{
              backgroundColor: '#eee',
              padding: '10px 12px',
              borderRadius: '6px',
              fontWeight: 'bold',
              color: '#555',
              minWidth: '60px'
            }}>
              {extension}
            </div>
          )}
        </div>
        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={handleSave} style={{ padding: '8px 16px' }}>Save</button>
          <button onClick={onClose} style={{ padding: '8px 16px', backgroundColor: '#888' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RenameModal;
