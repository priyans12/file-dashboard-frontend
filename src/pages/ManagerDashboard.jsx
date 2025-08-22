import React, { useEffect, useState } from 'react';
import API from '../api';
import FileItem from '../components/FileItem';
import RenameModal from '../components/RenameModal';
import logo from '../assets/queensford-logo.png';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const [items, setItems] = useState([]);
  const [parent, setParent] = useState(null);
  const [file, setFile] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [folderLabel, setFolderLabel] = useState('');
  const [showUploadInfo, setShowUploadInfo] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => navigate('/'), 3000);

    API.get('/list', { params: { parent } })
      .then(res => {
        clearTimeout(timeout);
        const data = Array.isArray(res.data) ? res.data : [];
        setItems(data);
        if (parent) {
          API.get('/folder-name', { params: { id: parent } }).then(r => {
            setFolderLabel(r.data.name);
          });
        } else {
          setFolderLabel('');
        }
      })
      .catch(() => navigate('/'));
  }, [parent, refresh]);

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('parent', parent);
      
      await API.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes timeout for large files
      });
      
      setFile(null);
      setRefresh(!refresh);
      
      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      alert('File uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName) {
      alert('Please enter a folder name!');
      return;
    }
    
    try {
      await API.post('/folders', { name: folderName, parent });
      setFolderName('');
      setRefresh(!refresh);
    } catch (err) {
      alert('Failed to create folder: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleRename = async (id, name) => {
    try {
      await API.put(`/rename/${id}`, { newName: name });
      setRenameTarget(null);
      setRefresh(!refresh);
    } catch (err) {
      alert('Rename failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await API.delete(`/delete/${id}`);
        setRefresh(!refresh);
      } catch (err) {
        alert('Delete failed: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <div className="header">
        <img src={logo} alt="Queensford Logo" />
        <h1>Manager Dashboard</h1>
        <button className="logout-btn" onClick={() => window.location.href = '/'}>Logout</button>
      </div>

      <div className="container">
        <div className="controls">
          {!parent && (
            <>
              <input
                type="text"
                placeholder="New folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <button onClick={handleCreateFolder} disabled={!folderName}>
                Create Folder
              </button>
            </>
          )}
          
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])}
            disabled={uploading}
          />
          
          <button 
            onClick={handleUpload} 
            disabled={!file || uploading}
            style={{ 
              backgroundColor: uploading ? '#6c757d' : '#007bff',
              cursor: uploading ? 'not-allowed' : 'pointer'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          
          <button 
            onClick={() => setShowUploadInfo(!showUploadInfo)}
            style={{ backgroundColor: '#6c757d' }}
          >
            📋 {showUploadInfo ? 'Hide' : 'Show'} Info
          </button>
        </div>

        {/* Upload Info Panel */}
        {showUploadInfo && (
          <div className="upload-info">
            <h4 style={{ margin: '0 0 15px 0', color: '#00c2cb' }}>
              📁 File Upload Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', fontSize: '13px' }}>
              <div>
                <strong>🎥 Videos (Max 500MB):</strong><br />
                MP4, AVI, MOV, MKV, WMV, FLV, WEBM, M4V, MPG, MPEG, 3GP
              </div>
              <div>
                <strong>🖼️ Images:</strong><br />
                JPG, JPEG, PNG, GIF, BMP, WEBP, SVG, ICO, TIFF
              </div>
              <div>
                <strong>🎵 Audio:</strong><br />
                MP3, WAV, FLAC, AAC, OGG, M4A, WMA
              </div>
              <div>
                <strong>📄 Documents:</strong><br />
                PDF, DOC, DOCX, TXT, RTF, PPT, PPTX, XLS, XLSX, CSV
              </div>
              <div>
                <strong>📦 Archives:</strong><br />
                ZIP, RAR, 7Z, TAR, GZ
              </div>
            </div>
            <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(0,123,255,0.1)', borderRadius: '5px' }}>
              <strong>💡 Tips:</strong> Large video files may take a few minutes to upload. 
              The page will show "Uploading..." during the process.
            </div>
          </div>
        )}

        {/* File upload status */}
        {file && (
          <div style={{ 
            background: 'rgba(0, 194, 203, 0.1)', 
            border: '1px solid #00c2cb', 
            borderRadius: '8px', 
            padding: '10px', 
            margin: '10px 0',
            textAlign: 'left'
          }}>
            <strong>Selected File:</strong> {file.name}<br />
            <strong>Size:</strong> {formatFileSize(file.size)}<br />
            <strong>Type:</strong> {file.type || 'Unknown'}
          </div>
        )}

        <h2>Manage Files in {folderLabel || 'Queensford Vet For School DMS'}</h2>

        <ul className="file-list">
          {items.map((item) => (
            <FileItem
              key={item._id}
              item={item}
              onOpen={() => item.type === 'folder' && setParent(item._id)}
              onDelete={() => handleDelete(item._id)}
              onRename={() => setRenameTarget(item)}
              readonly={false}
            />
          ))}
        </ul>

        {items.length === 0 && (
          <div style={{ 
            padding: '40px', 
            color: '#888', 
            textAlign: 'center',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            border: '2px dashed #555',
            margin: '20px 0'
          }}>
            <h3>📁 No files yet</h3>
            <p>Upload your first file or create a folder to get started!</p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Supported: Videos, Images, Documents, Audio files up to 500MB
            </p>
          </div>
        )}

        {renameTarget && (
          <RenameModal
            item={renameTarget}
            onClose={() => setRenameTarget(null)}
            onSave={handleRename}
          />
        )}

        {parent && (
          <button 
            onClick={() => setParent(null)}
            style={{ 
              marginTop: '20px',
              background: '#6c757d',
              padding: '10px 20px'
            }}
          >
            ⬅ Back to Root
          </button>
        )}
      </div>

      <div className="footer">
        <p><strong>Queensland – Brisbane Campus (Head Office)</strong><br />
          Level 2, 359 Queen Street, Brisbane, QLD 4000<br />
          +61 73221 1626 · info@queensford.edu.au</p>
        <p><strong>South Australia – Adelaide Campus</strong><br />
          Level 11, 90 King William Street, Adelaide SA 5000<br />
          +61 8 8410 4605 · sa@queensford.edu.au</p>
        <p><strong>New South Wales – Parramatta Campus</strong><br />
          Level 4, 16–18 Wentworth Street, Parramatta NSW 2150<br />
          +61 2 8660 0040 · syd@queensford.edu.au</p>
        <p>© 2025 Queensford College | CRICOS No: 03010G | RTO: 31736</p>
      </div>
    </>
  );
};

export default ManagerDashboard;