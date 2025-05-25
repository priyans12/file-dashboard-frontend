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
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => navigate('/'), 3000);

    API.get('/list', { params: { parent } })
      .then(res => {
        clearTimeout(timeout);
        const data = Array.isArray(res.data) ? res.data : [];
        setItems(data);
        if (parent) {
          API.get('/list', { params: { parent: null } }).then(all => {
            const folder = all.data.find((i) => i._id === parent);
            setCurrentFolderName(folder?.name || '');
          });
        } else {
          setCurrentFolderName('');
        }
      })
      .catch(() => navigate('/'));
  }, [parent, refresh]);

  return (
    <>
      <div className="header">
        <img src={logo} alt="Queensford Logo" />
        <h1>Coordinator Dashboard</h1>
        <button className="logout-btn" onClick={() => window.location.href = '/'}>Logout</button>
      </div>

      <div className="container">
        <h2>
          View Files in {currentFolderName || 'Queensford Vet For School DMS'}
        </h2>

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

export default CoordinatorDashboard;
