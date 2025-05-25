// src/components/FileItem.jsx

import React from 'react';
const API_BASE = import.meta.env.VITE_API_BASE;

const FileItem = ({ item, onOpen, onDelete, onRename, readonly }) => {
  const isFolder = item.type === 'folder';

  const handleDownload = () => {
    window.location.href = `${API_BASE}/download/${item._id}`;
  };

  const handleView = () => {
    window.open(`${API_BASE}/${item.path}`, '_blank');
  };

  return (
    <li className="file-item">
      <div className="file-name">
        <span>{isFolder ? '📁' : '📄'}</span> {item.name}
      </div>

      <div className="file-actions">
        {isFolder && <button onClick={onOpen}>Open</button>}

        {!isFolder && readonly && (
          <>
            <button onClick={handleView}>View</button>
            <button onClick={handleDownload}>Download</button>
          </>
        )}

        {!readonly && !isFolder && (
          <>
            <button onClick={onDelete}>Delete</button>
            <button onClick={onRename}>Rename</button>
          </>
        )}
      </div>
    </li>
  );
};

export default FileItem;
