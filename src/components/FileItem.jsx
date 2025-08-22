// src/components/FileItem.jsx

import React from 'react';
const API_BASE = import.meta.env.VITE_API_BASE;

const FileItem = ({ item, onOpen, onDelete, onRename, readonly }) => {
  const isFolder = item.type === 'folder';

  // Get file icon based on type
  const getFileIcon = (fileName) => {
    if (!fileName) return '📄';
    
    const ext = fileName.split('.').pop().toLowerCase();
    
    // Video files
    if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v', 'mpg', 'mpeg', '3gp'].includes(ext)) {
      return '🎥';
    }
    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff'].includes(ext)) {
      return '🖼️';
    }
    // Audio files
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'].includes(ext)) {
      return '🎵';
    }
    // Document files
    if (['pdf'].includes(ext)) return '📕';
    if (['doc', 'docx'].includes(ext)) return '📘';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return '📊';
    if (['ppt', 'pptx'].includes(ext)) return '📙';
    if (['txt', 'rtf'].includes(ext)) return '📝';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return '📦';
    
    return '📄'; // Default file icon
  };

  // Check if file is video
  const isVideo = (fileName) => {
    if (!fileName) return false;
    const ext = fileName.split('.').pop().toLowerCase();
    return ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v', 'mpg', 'mpeg', '3gp'].includes(ext);
  };

  // Check if file is image
  const isImage = (fileName) => {
    if (!fileName) return false;
    const ext = fileName.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff'].includes(ext);
  };

  const handleDownload = () => {
    if (!isFolder) {
      window.location.href = `${API_BASE}/download/${item._id}`;
    }
  };

  const handleView = () => {
    if (!isFolder) {
      const publicURL = API_BASE.replace('/api', '');
      
      if (isVideo(item.name)) {
        // Use stream endpoint for videos
        window.open(`${API_BASE}/stream/${item._id}`, '_blank');
      } else {
        // Use direct path for other files
        window.open(`${publicURL}/${item.path}`, '_blank');
      }
    }
  };

  // Video preview function
  const handlePreview = () => {
    if (!isFolder && (isVideo(item.name) || isImage(item.name))) {
      const videoWindow = window.open('', '_blank', 'width=900,height=700');
      
      if (isVideo(item.name)) {
        videoWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Video Preview - ${item.name}</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  background: #000; 
                  display: flex; 
                  flex-direction: column;
                  justify-content: center; 
                  align-items: center; 
                  min-height: 100vh;
                  font-family: Arial, sans-serif;
                }
                video { 
                  max-width: 90%; 
                  max-height: 70vh; 
                  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                  border-radius: 8px;
                }
                .controls {
                  margin-top: 20px;
                  display: flex;
                  gap: 10px;
                }
                .controls button {
                  background: #007bff;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 14px;
                }
                .controls button:hover {
                  background: #0056b3;
                }
                .info {
                  color: white;
                  text-align: center;
                  margin-bottom: 20px;
                  background: rgba(255,255,255,0.1);
                  padding: 10px 20px;
                  border-radius: 5px;
                }
              </style>
            </head>
            <body>
              <div class="info">
                <h3>${item.name}</h3>
                <p>Video Preview</p>
              </div>
              <video controls autoplay>
                <source src="${API_BASE}/stream/${item._id}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
              <div class="controls">
                <button onclick="document.querySelector('video').requestFullscreen()">Fullscreen</button>
                <button onclick="window.close()">Close</button>
              </div>
            </body>
          </html>
        `);
      } else if (isImage(item.name)) {
        const publicURL = API_BASE.replace('/api', '');
        videoWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Image Preview - ${item.name}</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  background: #000; 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  min-height: 100vh;
                  cursor: pointer;
                }
                img { 
                  max-width: 90%; 
                  max-height: 90vh; 
                  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                  border-radius: 8px;
                }
              </style>
            </head>
            <body onclick="window.close()">
              <img src="${publicURL}/${item.path}" alt="${item.name}" />
            </body>
          </html>
        `);
      }
    }
  };

  return (
    <li className="file-item">
      <div className="file-name">
        <span style={{ fontSize: '20px', marginRight: '10px' }}>
          {isFolder ? '📁' : getFileIcon(item.name)}
        </span>
        <span>{item.name}</span>
      </div>

      <div className="file-actions">
        {isFolder && (
          <button onClick={onOpen} style={{ backgroundColor: '#28a745' }}>
            Open
          </button>
        )}

        {!readonly && !isFolder && (
          <>
            <button onClick={onDelete} style={{ backgroundColor: '#dc3545' }}>
              Delete
            </button>
            <button onClick={onRename} style={{ backgroundColor: '#ffc107', color: '#000' }}>
              Rename
            </button>
          </>
        )}

        {!isFolder && readonly && (
          <>
            {(isVideo(item.name) || isImage(item.name)) && (
              <button onClick={handlePreview} style={{ backgroundColor: '#17a2b8' }}>
                Preview
              </button>
            )}
            <button onClick={handleView} style={{ backgroundColor: '#6c757d' }}>
              View
            </button>
            <button onClick={handleDownload} style={{ backgroundColor: '#007bff' }}>
              Download
            </button>
          </>
        )}
      </div>
    </li>
  );
};

export default FileItem;