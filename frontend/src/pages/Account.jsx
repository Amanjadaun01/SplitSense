import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosConfig';
import { useAuthStore } from '../store/useAuthStore';
import { 
  User, Settings, Shield, MessageSquare, LogOut, 
  ArrowLeft, Edit2, Save, X, Heart, CheckCircle2 
} from 'lucide-react';

export default function Account() {
  const { user, setLogout, setLogin } = useAuthStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form States
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  // Password Form States
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleLogout = () => {
    setLogout();
    navigate('/login');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.put('/users/profile', {
        name: formData.name,
        email: formData.email
      });
      
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setLogin(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    // Frontend validation: Check if passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
    }

    // Frontend validation: Check password length
    if (passwordData.newPassword.length < 6) {
      return setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
    }

    setPasswordLoading(true);
    try {
      await API.put('/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordMessage({ type: 'success', text: 'Password secured and updated!' });
      // Clear the form fields on success
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update password' 
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  // A helper to generate the colorful Avatar
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] font-sans text-gray-900">
      
      {/* Top Navbar */}
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Account Settings</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto mt-8 flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 md:flex-row">
        
        {/* Sidebar Navigation */}
        <div className="w-full shrink-0 space-y-2 md:w-64">
          <button onClick={() => setActiveTab('profile')} className={`flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all ${activeTab === 'profile' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-gray-100' : 'text-gray-500 hover:bg-gray-100'}`}>
            <User size={18} /> Profile Details
          </button>
          {/* <button onClick={() => setActiveTab('preferences')} className={`flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all ${activeTab === 'preferences' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-gray-100' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Settings size={18} /> Preferences
          </button> */}
          <button onClick={() => setActiveTab('security')} className={`flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all ${activeTab === 'security' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-gray-100' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Shield size={18} /> Security
          </button>
          <button onClick={() => setActiveTab('feedback')} className={`flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all ${activeTab === 'feedback' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-gray-100' : 'text-gray-500 hover:bg-gray-100'}`}>
            <MessageSquare size={18} /> Feedback
          </button>
          
          <div className="my-4 h-px w-full bg-gray-200"></div>
          
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold text-rose-500 transition-all hover:bg-rose-50">
            <LogOut size={18} /> Log Out
          </button>
        </div>

        {/* Settings Panels */}
        <div className="flex-1 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Profile</h2>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-100">
                    <Edit2 size={16} /> Edit
                  </button>
                )}
              </div>

              {message && (
                <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                  <CheckCircle2 size={18} /> {message}
                </div>
              )}

              <div className="mb-8 flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 text-3xl font-bold text-white shadow-inner">
                  {getInitials(user.name)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-5 rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-100">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full rounded-xl border border-gray-200 p-3 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full rounded-xl border border-gray-200 p-3 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setIsEditing(false)} className="rounded-xl px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-200">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-white shadow-md hover:bg-emerald-600 disabled:opacity-50">
                      <Save size={18} /> Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Full Name</p>
                    <p className="mt-1 text-lg font-medium text-gray-800">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Email Address</p>
                    <p className="mt-1 text-lg font-medium text-gray-800">{user.email}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PREFERENCES TAB (UI Only) */}
          {/* {activeTab === 'preferences' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="mb-8 text-2xl font-bold">Email Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-5">
                  <div>
                    <p className="font-bold text-gray-800">New Group Invites</p>
                    <p className="text-sm text-gray-500">Email me when someone adds me to a group.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 accent-emerald-500" />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-5">
                  <div>
                    <p className="font-bold text-gray-800">Expense Added</p>
                    <p className="text-sm text-gray-500">Email me when I am involved in a new expense.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 accent-emerald-500" />
                </div>
              </div>
            </div>
          )} */}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="mb-8 text-2xl font-bold">Authentication</h2>
              
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <h3 className="mb-4 font-bold text-gray-800">Change Password</h3>
                
                {passwordMessage.text && (
                  <div className={`mb-4 rounded-xl p-4 text-sm font-medium ${passwordMessage.type === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'}`}>
                    {passwordMessage.text}
                  </div>
                )}

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <input 
                    type="password" 
                    required
                    placeholder="Current Password" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full rounded-xl border border-gray-200 p-3 focus:border-emerald-500 focus:outline-none" 
                  />
                  <input 
                    type="password" 
                    required
                    placeholder="New Password (min 6 characters)" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full rounded-xl border border-gray-200 p-3 focus:border-emerald-500 focus:outline-none" 
                  />
                  <input 
                    type="password" 
                    required
                    placeholder="Confirm New Password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full rounded-xl border border-gray-200 p-3 focus:border-emerald-500 focus:outline-none" 
                  />
                  <button 
                    type="submit" 
                    disabled={passwordLoading}
                    className="mt-2 rounded-xl bg-gray-900 px-6 py-2.5 font-bold text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* FEEDBACK TAB */}
          {activeTab === 'feedback' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="mb-2 text-2xl font-bold">Send Feedback</h2>
              <p className="mb-8 text-gray-500">Found a bug or have a feature request? Let us know!</p>
              <textarea 
                rows="5" 
                placeholder="Tell us what you think..." 
                className="w-full rounded-2xl border border-gray-200 p-4 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
              ></textarea>
              <button className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white shadow-md hover:bg-emerald-600">
                Submit Feedback
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Footer Element */}
      <footer className="mt-auto py-8 text-center text-sm font-medium text-gray-400">
        <p className="flex items-center justify-center gap-1.5">
          Made with <Heart size={16} className="fill-rose-500 text-rose-500 animate-pulse" /> by <span className="font-bold text-gray-600">Vishal Pal</span>
        </p>
        <p className="mt-1">© {new Date().getFullYear()} All rights reserved.</p>
      </footer>

    </div>
  );
}