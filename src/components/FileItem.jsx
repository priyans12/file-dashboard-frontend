import React from 'react';

const FileItem = ({ item, onOpen, onDelete, onRename, readonly }) => {
  const isFolder = item.type === 'folder';

  const handleDownload = () => {
    if (!isFolder) {
      window.location.href = `http://localhost:5000/api/download/${item._id}`;
    }
  };

  const handleView = () => {
    if (!isFolder) {
      window.open(`http://localhost:5000/${item.path}`, '_blank');
    }
  };

  return (
    <li className="file-item">
      <div className="file-name">
        <span>{isFolder ? '📁' : '📄'}</span>
        {item.name}
      </div>

      <div className="file-actions">
        {isFolder && (
          <button onClick={onOpen}>Open</button>
        )}

        {!readonly && (
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
