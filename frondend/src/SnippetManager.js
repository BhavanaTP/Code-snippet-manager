import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import './App.css';

export default function SnippetManager() {
  const { user, logout } = useContext(AuthContext);
  const [snippets, setSnippets] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', code: '', language: 'javascript' });
  const [editingId, setEditingId] = useState(null);

  const fetchSnippets = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/snippets', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSnippets(res.data);
    } catch (err) {
      console.error('Failed to fetch snippets:', err);
    }
  }, [user.token]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/snippets/${editingId}`, form, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/snippets', form, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      }
      setForm({ title: '', description: '', code: '', language: 'javascript' });
      setEditingId(null);
      fetchSnippets();
    } catch (err) {
      console.error('Failed to save snippet:', err);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Your Snippets</h1>
        <div>
          <span>Welcome, {user.username}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <section className="form-section">
        <h2>{editingId ? 'Edit Snippet' : 'Add New Snippet'}</h2>
        <form onSubmit={handleSubmit} className="snippet-form">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <select
            name="language"
            value={form.language}
            onChange={e => setForm({ ...form, language: e.target.value })}
            required
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
          <textarea
            name="code"
            placeholder="Code"
            rows={6}
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value })}
          />
          <div className="button-group">
            <button type="submit" className="submit-btn">
              {editingId ? 'Update' : 'Add'} Snippet
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: '', description: '', code: '', language: 'javascript' });
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="snippets-grid">
        {snippets.map(sn => (
          <div key={sn._id} className="snippet-card">
            <h3>{sn.title}</h3>
            <p><strong>Language:</strong> {sn.language}</p>
            <p>{sn.description}</p>
            <pre>{sn.code}</pre>
            <div className="card-actions">
              <button onClick={() => {
                setEditingId(sn._id);
                setForm({ title: sn.title, description: sn.description, code: sn.code, language: sn.language });
              }}>Edit</button>
              <button onClick={async () => {
                try {
                  await axios.delete(`http://localhost:5000/api/snippets/${sn._id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                  });
                  fetchSnippets();
                } catch (err) {
                  console.error('Failed to delete snippet:', err);
                }
              }}>Delete</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
