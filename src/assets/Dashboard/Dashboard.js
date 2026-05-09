import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, Upload, Trash2, Plus, Eye, Edit, Settings, Bell, BarChart3, FileText, Home } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('portfolio');
  const [showMenu, setShowMenu] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'video',
    thumbnail: '',
    media: { url: '', type: 'image' },
    tags: ''
  });
  const [stats, setStats] = useState({
    totalWorks: 0,
    totalRequests: 0,
    newRequests: 0,
    viewCount: 0
  });

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        loadDashboardData(token);
      } else {
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Token verification failed:', err);
      localStorage.removeItem('token');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setEmail('');
        setPassword('');
        loadDashboardData(data.token);
      } else {
        alert('❌ ' + data.message);
      }
    } catch (err) {
      alert('❌ Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setPortfolioItems([]);
    setRequests([]);
  };

  const loadDashboardData = async (token) => {
    try {
      setLoading(true);
      
      // Load portfolio items
      const portfolioRes = await fetch(`${API_URL}/portfolio?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (portfolioRes.ok) {
        const pData = await portfolioRes.json();
        setPortfolioItems(pData.portfolios);
      }

      // Load requests
      const requestsRes = await fetch(`${API_URL}/requests?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (requestsRes.ok) {
        const rData = await requestsRes.json();
        setRequests(rData.requests);
        
        // Calculate stats
        const newReqs = rData.requests.filter(r => r.status === 'new').length;
        const totalViews = pData.portfolios.reduce((sum, item) => sum + item.viewCount, 0);
        
        setStats({
          totalWorks: pData.portfolios.length,
          totalRequests: rData.requests.length,
          newRequests: newReqs,
          viewCount: totalViews
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPortfolioItem = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()),
          media: {
            url: formData.media.url,
            type: formData.media.type
          }
        })
      });

      if (response.ok) {
        alert('✅ Portfolio item added successfully!');
        setFormData({
          title: '',
          description: '',
          category: 'video',
          thumbnail: '',
          media: { url: '', type: 'image' },
          tags: ''
        });
        loadDashboardData(token);
      } else {
        const error = await response.json();
        alert('❌ Error: ' + error.message);
      }
    } catch (err) {
      alert('❌ Failed to add portfolio item: ' + err.message);
    }
  };

  const handleDeletePortfolioItem = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/portfolio/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Portfolio item deleted successfully!');
        loadDashboardData(token);
      } else {
        alert('❌ Failed to delete item');
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  const handleUpdateRequestStatus = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert('✅ Request status updated!');
        loadDashboardData(token);
      } else {
        alert('❌ Failed to update status');
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/requests/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Request deleted successfully!');
        loadDashboardData(token);
      } else {
        alert('❌ Failed to delete request');
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  // Login Page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Dashboard
              </h1>
              <p className="text-slate-400">Portfolio Management System</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
                  placeholder="admin@portfolio.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '🔄 Logging in...' : '🔐 Login'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-400 text-center">
                📝 Default credentials are in .env file
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center font-bold">
              📊
            </div>
            <h1 className="text-2xl font-bold">Portfolio Admin</h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <span className="text-slate-300">Welcome, <span className="font-semibold text-blue-400">{currentUser?.name}</span></span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden p-2 hover:bg-slate-700 rounded-lg"
          >
            {showMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {showMenu && (
          <div className="md:hidden bg-slate-700/50 border-t border-slate-700 p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Works</p>
                <p className="text-3xl font-bold text-blue-400">{stats.totalWorks}</p>
              </div>
              <Home size={32} className="text-blue-400/30" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Requests</p>
                <p className="text-3xl font-bold text-cyan-400">{stats.totalRequests}</p>
              </div>
              <FileText size={32} className="text-cyan-400/30" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">New Requests</p>
                <p className="text-3xl font-bold text-purple-400">{stats.newRequests}</p>
              </div>
              <Bell size={32} className="text-purple-400/30" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Views</p>
                <p className="text-3xl font-bold text-green-400">{stats.viewCount}</p>
              </div>
              <BarChart3 size={32} className="text-green-400/30" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'portfolio'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📸 Portfolio Items
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'requests'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💼 Client Requests
          </button>
        </div>

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div>
            {/* Add New Portfolio Item Form */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Plus size={24} /> Add New Portfolio Item
              </h2>

              <form onSubmit={handleAddPortfolioItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-400 transition"
                      placeholder="Project title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-400 transition"
                    >
                      <option value="video">Video</option>
                      <option value="photo">Photo</option>
                      <option value="design">Design</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-400 transition"
                    placeholder="Project description"
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Thumbnail URL</label>
                    <input
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-400 transition"
                      placeholder="https://..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-400 transition"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Media URL</label>
                    <input
                      type="url"
                      value={formData.media.url}
                      onChange={(e) => setFormData({ ...formData, media: { ...formData.media, url: e.target.value } })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-400 transition"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Media Type</label>
                    <select
                      value={formData.media.type}
                      onChange={(e) => setFormData({ ...formData, media: { ...formData.media, type: e.target.value } })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-400 transition"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition flex items-center justify-center gap-2"
                >
                  <Upload size={20} /> Add Portfolio Item
                </button>
              </form>
            </div>

            {/* Portfolio Items List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Your Portfolio Items</h2>
              {portfolioItems.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 text-center">
                  <p className="text-slate-400">No portfolio items yet. Add one above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolioItems.map((item) => (
                    <div key={item._id} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition group">
                      <div className="relative aspect-video overflow-hidden bg-slate-700">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDeletePortfolioItem(item._id)}
                            className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1 truncate">{item.title}</h3>
                        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{item.description}</p>

                        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                          <span className="bg-slate-700 px-2 py-1 rounded">{item.category}</span>
                          <span className="flex items-center gap-1">
                            <Eye size={14} /> {item.viewCount}
                          </span>
                        </div>

                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags.slice(0, 2).map((tag, i) => (
                              <span key={i} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Client Requests</h2>
            {requests.length === 0 ? (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 text-center">
                <p className="text-slate-400">No requests yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request._id} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{request.clientName}</h3>
                        <p className="text-slate-400 text-sm">{request.clientEmail}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status === 'new' ? 'bg-green-500/20 text-green-300' :
                          request.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' :
                          request.status === 'completed' ? 'bg-purple-500/20 text-purple-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {request.status.toUpperCase()}
                        </span>

                        <button
                          onClick={() => handleDeleteRequest(request._id)}
                          className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4 p-4 bg-slate-700/30 rounded-lg">
                      <p className="text-white">{request.description}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Project Type</p>
                        <p className="font-semibold">{request.projectType}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Budget</p>
                        <p className="font-semibold">{request.budget}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Priority</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          request.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                          request.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {request.priority.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Submitted</p>
                        <p className="font-semibold">{new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {request.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateRequestStatus(request._id, 'in-progress')}
                          className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded text-sm transition"
                        >
                          In Progress
                        </button>
                      )}
                      {request.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateRequestStatus(request._id, 'completed')}
                          className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded text-sm transition"
                        >
                          Complete
                        </button>
                      )}
                      {request.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateRequestStatus(request._id, 'rejected')}
                          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-sm transition"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}