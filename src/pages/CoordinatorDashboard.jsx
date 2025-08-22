import React, { useEffect, useState } from 'react';
import API from '../api';
import FileItem from '../components/FileItem';
import logo from '../assets/queensford-logo.png';
import { useNavigate } from 'react-router-dom';

const CoordinatorDashboard = () => {
  const [items, setItems] = useState([]);
  const [parent, setParent] = useState(null);
  const [currentFolderName, setCurrentFolderName] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => navigate('/'), 3000);

    setLoading(true);
    API.get('/list', { params: { parent } })
      .then(res => {
        clearTimeout(timeout);
        const data = Array.isArray(res.data) ? res.data : [];
        setItems(data);
        
        if (parent) {
          // Get folder name - FIXED: removed extra /api
          API.get('/folder-name', { params: { id: parent } })
            .then(r => {
              setCurrentFolderName(r.data.name);
            })
            .catch(() => setCurrentFolderName('Unknown Folder'));
        } else {
          setCurrentFolderName('');
        }
      })
      .catch((err) => {
        console.error('Failed to load files:', err);
        navigate('/');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [parent, refresh, navigate]);

  // Count different file types
  const getFileStats = () => {
    const stats = {
      folders: 0,
      videos: 0,
      images: 0,
      documents: 0,
      other: 0
    };

    items.forEach(item => {
      if (item.type === 'folder') {
        stats.folders++;
      } else {
        const ext = item.name.split('.').pop().toLowerCase();
        if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v'].includes(ext)) {
          stats.videos++;
        } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
          stats.images++;
        } else if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'ppt', 'pptx'].includes(ext)) {
          stats.documents++;
        } else {
          stats.other++;
        }
      }
    });

    return stats;
  };

  const stats = getFileStats();

  return (
    <>
      <div className="header">
        <img src={logo} alt="Queensford Logo" />
        <h1>Coordinator Dashboard</h1>
        <button className="logout-btn" onClick={() => window.location.href = '/'}>Logout</button>
      </div>

      <div className="container">
        <div style={{ marginBottom: '20px' }}>
          <h2>
            View Files in {currentFolderName || 'Queensford Vet For School DMS'}
          </h2>
          
          {/* File stats */}
          {items.length > 0 && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '15px',
              borderRadius: '10px',
              margin: '15px 0',
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              fontSize: '14px'
            }}>
              {stats.folders > 0 && <span>📁 {stats.folders} Folders</span>}
              {stats.videos > 0 && <span>🎥 {stats.videos} Videos</span>}
              {stats.images > 0 && <span>🖼️ {stats.images} Images</span>}
              {stats.documents > 0 && <span>📄 {stats.documents} Documents</span>}
              {stats.other > 0 && <span>📦 {stats.other} Other Files</span>}
            </div>
          )}
        </div>

        {loading ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#888'
          }}>
            <div className="uploading">Loading files...</div>
          </div>
        ) : (
          <ul className="file-list">
            {items.map((item) => (
              <FileItem
                key={item._id}
                item={item}
                onOpen={() => item.type === 'folder' && setParent(item._id)}
                readonly={true}
              />
            ))}
          </ul>
        )}

        {!loading && items.length === 0 && (
          <div style={{ 
            padding: '40px', 
            color: '#888', 
            textAlign: 'center',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            border: '2px dashed #555',
            margin: '20px 0'
          }}>
            <h3>📁 No files in this {parent ? 'folder' : 'location'}</h3>
            <p>This {parent ? 'folder is empty' : 'directory has no files yet'}.</p>
            {!parent && (
              <p style={{ fontSize: '14px', color: '#666' }}>
                Files uploaded by managers will appear here.
              </p>
            )}
          </div>
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

export default CoordinatorDashboard;