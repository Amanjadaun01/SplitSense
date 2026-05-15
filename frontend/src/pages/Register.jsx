import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosConfig';
import { useAuthStore } from '../store/useAuthStore';

export default function Register() {
  const navigate = useNavigate();
  const setLogin = useAuthStore((state) => state.setLogin);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '', // NEW
  });
  
  const [agreeToTerms, setAgreeToTerms] = useState(false); // NEW
  const [showPassword, setShowPassword] = useState(false); // NEW
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match. Please try again.');
    }

    // 2. Validation: Check password length
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    // 3. Validation: Check terms
    if (!agreeToTerms) {
      return setError('You must agree to the Terms of Service to create an account.');
    }

    setLoading(true);

    try {
      // We ONLY send the required data to the backend, not the confirmPassword
      const response = await API.post('/users', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      console.log('Registration successful:', response.data);
      setLogin(response.data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      
      // Provide specific error messages based on error type
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.request && !err.response) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message === 'timeout of 10000ms exceeded') {
        errorMessage = 'Request timed out. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
          <p className="mt-2 text-sm text-gray-500">Join to start splitting expense with friends.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g., John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Create Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 p-2.5 pr-12 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              required
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the <span className="cursor-pointer text-emerald-600 hover:underline">Terms of Service</span> and <span className="cursor-pointer text-emerald-600 hover:underline">Privacy Policy</span>.
            </label>
          </div>

          {error && (
            <div className="rounded bg-red-50 p-3 text-sm font-medium text-red-500 border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-emerald-500 py-3 font-bold text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}