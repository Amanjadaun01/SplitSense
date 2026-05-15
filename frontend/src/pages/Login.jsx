import { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import API from '../api/axiosConfig';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const setLogin = useAuthStore((state) => state.setLogin);

  const onSubmit = async (data) => {
    try {
      setServerError(''); // Clear previous errors
      // Send the POST request to our backend
      const response = await API.post('/users/login', {
        email: data.email,
        password: data.password,
      });

      console.log('Login successful:', response.data);
      
      // If successful, save the user data to Zustand & LocalStorage
      setLogin(response.data);
      
      // Redirect to the Dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Failed to login';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request && !error.response) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message === 'timeout of 10000ms exceeded') {
        errorMessage = 'Request timed out. Please try again.';
      }
      
      setServerError(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">ExpenseAI</h1>
        
        {serverError && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-emerald-500 py-2 text-white font-semibold transition hover:bg-emerald-600"
          >
            Log In
          </button>
          <div className="mt-6 text-center text-sm text-gray-600">
  Don't have an account?{' '}
  <Link to="/register" className="font-semibold text-emerald-600 hover:underline">
    Sign up
  </Link>
</div>
        </form>
      </div>
    </div>
  );
}