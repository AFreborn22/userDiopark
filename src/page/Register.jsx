import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faKey, faPhone, faCar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../utils/cookieUtils';

function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [carDetails, setCarDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  const isFormValid = () => {
    return (
      name !== '' &&
      username !== '' &&
      email !== '' &&
      password !== '' &&
      phoneNumber !== '' &&
      carNumber !== '' &&
      carDetails !== ''
    );
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setError(null);

    if (!isFormValid()) {
      setError('Lengkapi form dulu dong.');
      setIsLoading(false);
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }

    const data = {
      nama: name,
      nomor_telp: phoneNumber,
      nomor_polisi: carNumber,
      detail_kendaraan: carDetails,
      email: email,
      username: username,
      password: password,
    };

    try {
      const response = await fetch('https://dioparkapp-production.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Gagal mendaftar');
      }

      setNotification(responseData.message || 'Registrasi berhasil! Anda dapat login sekarang.');
      console.log(responseData);

      // Set cookie menggunakan fungsi setCookie dari utils
      setCookie('user', JSON.stringify(responseData.pengguna), 365); // Perhatikan ini

      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Gagal mendaftar');

      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setNotification(null);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [notification]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-500 to-gray-800 p-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl text-center font-semibold mb-1 text-gray-800">Daftar</h2>
        <form>
          {/* Form input fields */}
          <div className="mb-1 relative">
            <input
              type="text"
              id="name"
              className="mt-1 p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              value={name}
              placeholder="Nama"
              onChange={(e) => setName(e.target.value)}
            />
            <span className="absolute inset-y-0 left-4 flex items-center mt-1 text-gray-400">
              <FontAwesomeIcon icon={faUser} />
            </span>
          </div>
          <div className="mb-1 relative">
            <input
              type="text"
              id="username"
              className="mt-1 p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              value={username}
              placeholder="Nama Pengguna"
              onChange={(e) => setUsername(e.target.value)}
            />
            <span className="absolute inset-y-0 left-4 flex items-center mt-1 text-gray-400">
              <FontAwesomeIcon icon={faUser} />
            </span>
          </div>
          <div className="mb-1 relative">
            <input
              type="email"
              id="email"
              className="mt-1 p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="absolute inset-y-0 left-4 flex items-center mt-1 text-gray-400">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
          </div>
          <div className="mb-1 relative">
            <input
              type="tel"
              id="phone"
              className="mt-1 p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              value={phoneNumber}
              placeholder="Nomor Telepon"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <span className="absolute inset-y-0 left-4 flex items-center mt-1 text-gray-400">
              <FontAwesomeIcon icon={faPhone} />
            </span>
          </div>
          <div className="mb-1 relative">
            <input
              type="password"
              id="password"
              className="mt-1 p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              value={password}
              placeholder="Kata Sandi"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="absolute inset-y-0 left-4 flex items-center mt-1 text-gray-400">
              <FontAwesomeIcon icon={faKey} />
            </span>
          </div>
          <div className="mb-1 relative">
            <input
              type="text"
              id="carNumber"
              className="mt-1 p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              value={carNumber}
              placeholder="Nomor Polisi"
              onChange={(e) => setCarNumber(e.target.value)}
            />
            <span className="absolute inset-y-0 left-4 flex items-center mt-1 text-gray-400">
              <FontAwesomeIcon icon={faCar} />
            </span>
          </div>
          <div className="mb-3 relative">
            <input
              type="text"
              id="carDetails"
              className="mt-1 p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              value={carDetails}
              placeholder="Detail Kendaraan"
              onChange={(e) => setCarDetails(e.target.value)}
            />
            <span className="absolute inset-y-0 left-4 flex items-center mt-1 text-gray-400">
              <FontAwesomeIcon icon={faCar} />
            </span>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 px-4 py-3 rounded relative" role="alert">
              <div className="flex justify-center items-center"></div>
              <p className="text-sm text-red-700 text-center">{error}</p>
            </div>
          )}
          {notification && (
            <div className="bg-green-100 border border-green-400 px-4 py-3 rounded relative" role="alert">
              <div className="flex items-center">
                <div className="w-4 mr-2">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-sm text-green-700">{notification}</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-center">
            <button
              type="button"
              className={`bg-blue-500 text-white mt-5 px-4 py-2 rounded-md hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zm14-9.238A7.965 7.965 0 0120 12h-4a8 8 0 01-3 6.291l3 2.647zM12 20c3.042 0 5.824-1.135 7.938-3h-4c-1.104 0-2.149-.225-3.109-.625l-2.647 3C9.176 22.332 10.961 23 12 23v-3zm-8-7c0-1.939.694-3.721 1.854-5.113l-2.647-3A7.963 7.963 0 004 12H0c0-1.277.291-2.491.805-3.59l2.648 3zM20 12a8 8 0 00-2.854-6.105l-3 2.647A7.965 7.965 0 0012 4v4c1.277 0 2.491.291 3.59.805l-2.647 2.648A7.962 7.962 0 0112 8V4a8 8 0 00-6.105 2.854l2.647 2.647A7.964 7.964 0 0112 12h8z"
                  ></path>
                </svg>
              ) : (
                'Daftar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
