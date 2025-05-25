import React, { useEffect, useState } from 'react';
import API from '../api';
import FileItem from '../components/FileItem';
import RenameModal from '../components/RenameModal';
import logo from '../assets/queensford-logo.png';

const ManagerDashboard = () => {
  const [items, setItems] = useState([]);
  const [parent, setParent] = useState(null);
  const [file, setFile] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [currentFolderName, setCurrentFolderName] = useState('');

  useEffect(() => {
    API.get('/list', { params: { parent } }).then(res => setItems(res.data));
    if (parent) {
      API.get('/folder-name', { params: { id: parent } })
        .then(res => setCurrentFolderName(res.data.name || ''));
    } else {
      setCurrentFolderName('');
    }
  }, [parent, refresh]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('parent', parent);
    await API.post('/upload', formData);
    setFile(null);
    setRefresh(!refresh);
  };

  const handleCreateFolder = async () => {
    if (!folderName) return;
    await API.post('/folders', { name: folderName, parent });
    setFolderName('');
    setRefresh(!refresh);
  };

  const handleRename = async (id, newName) => {
    await API.put(`/rename/${id}`, { newName });
    setRenameTarget(null);
    setRefresh(!refresh);
  };

  const handleDelete = async (id) => {
    await API.delete(`/delete/${id}`);
    setRefresh(!refresh);
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
              />
              <button onClick={handleCreateFolder}>Create Folder</button>
            </>
          )}
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleUpload}>Upload</button>
        </div>

        <h2>
          {parent
            ? `Manage Files in ${currentFolderName}`
            : 'Manage Files in Queensford Vet For School DMS'}
        </h2>

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

        {renameTarget && (
          <RenameModal
            item={renameTarget}
            onClose={() => setRenameTarget(null)}
            onSave={handleRename}
          />
        )}

        {parent && <button onClick={() => setParent(null)}>⬅ Back</button>}
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
