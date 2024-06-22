import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { setCookie } from '../utils/cookieUtils'; // Pastikan ini diimpor

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      Cookies.remove('token');
      Cookies.set('token', token);

      // Fetch user data and save to cookie
      fetchUserData(token);

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 2000);
    }
  }, [navigate]);

  useEffect(() => {
    if (errorMessage || successMessage) {
      setTimeout(() => {
        setErrorMessage('');
        setSuccessMessage('');
      }, 3000);
    }
  }, [errorMessage, successMessage]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('https://dioparkapp-production.up.railway.app/api/profile/show', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const userData = await response.json();
      if (!response.ok) {
        throw new Error(userData.message || 'Failed to fetch user data');
      }

      setCookie('user', JSON.stringify(userData.pengguna), 7);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      setErrorMessage('Failed to fetch user data');
    }
  };

  const handleUsernameChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('https://dioparkapp-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [email.includes('@') ? 'email' : 'username']: email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      Cookies.remove('token');
      Cookies.set('token', data.token);

      // Fetch user data and save to cookie
      await fetchUserData(data.token);

      setSuccessMessage(data.message);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error during login:', error.message);
      setErrorMessage(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-500 to-gray-800 p-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Masuk</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                id="usernameOrEmail"
                placeholder="Email atau Nama Pengguna"
                className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={email}
                onChange={handleUsernameChange}
              />
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                <FontAwesomeIcon icon={email.includes('@') ? faEnvelope : faUser} />
              </span>
            </div>
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Kata Sandi"
              value={password}
              onChange={handlePasswordChange}
            />
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
              <FontAwesomeIcon icon={faKey} />
            </span>
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400"
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </button>
          </div>
          <div className="text-right mb-4">
            <a href="/forgetpassword" className="text-sm text-blue-500 hover:text-blue-700">Lupa Kata Sandi?</a>
          </div>
          {errorMessage && (
            <div className="flex text-center justify-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="flex text-center justify-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline text-center">{successMessage}</span>
            </div>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l-3-2.647zm14-9.238A7.965 7.965 0 0120 12h-4a8 8 0 01-3 6.291l3 2.647zM12 20c3.042 0 5.824-1.135 7.938-3h-4c-1.104 0-2.149-.225-3.109-.625l-2.647 3C9.176 22.332 10.961 23 12 23v-3zm-8-7c0-1.939.694-3.721 1.854-5.113l-2.647-3A7.963 7.963 0 004 12H0c0-1.277.291-2.491.805-3.59l2.648 3zM20 12a8 8 0 00-2.854-6.105l-3 2.647A7.965 7.965 0 0012 4v4c1.277 0 2.491.291 3.59.805l-2.647 2.648A7.962 7.962 0 0112 8V4a8 8 0 00-6.105 2.854l2.647 2.647A7.964 7.964 0 0112 12h8z"
                  ></path>
                </svg>
              ) : (
                'Masuk'
              )}
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center mt-6 mb-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500">Atau Masuk Dengan</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <div className="flex justify-center">
          <a href="https://dioparkapp-production.up.railway.app/api/auth/google"
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 flex items-center transition">
            <img src="https://accounts.google.com/favicon.ico" alt="" className="h-6 w-6 mr-2" />
            Google
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
