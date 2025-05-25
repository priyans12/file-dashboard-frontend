// src/components/FileItem.jsx

import React from 'react';
const API_BASE = import.meta.env.VITE_API_BASE;

const FileItem = ({ item, onOpen, onDelete, onRename, readonly }) => {
  const isFolder = item.type === 'folder';

  const handleDownload = () => {
    if (!isFolder) {
      window.location.href = `${API_BASE}/download/${item._id}`;
    }
  };

  const handleView = () => {
    if (!isFolder) {
      const publicURL = API_BASE.replace('/api', '');
      window.open(`${publicURL}/${item.path}`, '_blank');
    }
  };

  return (
    <li className="file-item">
      <div className="file-name">
        <span>{isFolder ? '📁' : '📄'}</span> {item.name}
      </div>

      <div className="file-actions">
        {isFolder && <button onClick={onOpen}>Open</button>}

        {!readonly && !isFolder && (
          <>
            <button onClick={onDelete}>Delete</button>
            <button onClick={onRename}>Rename</button>
          </>
        )}

        {!isFolder && readonly && (
          <>
            <button onClick={handleView}>View</button>
            <button onClick={handleDownload}>Download</button>
          </>
        )}
      </div>
    </li>
  );
};

export default FileItem;
