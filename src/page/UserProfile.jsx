import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/img/main_bg.jpg';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getCookie, setCookie } from '../utils/cookieUtils'; // Sesuaikan path impor sesuai dengan struktur proyek Anda

function UserProfile() {
  const [user, setUser] = useState({
    nama: '',
    username: '',
    email: '',
    nomor_telp: '',
    nomor_polisi: '',
    detail_kendaraan: ''
  });

  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie('token');
        const response = await fetch('https://dioparkapp-production.up.railway.app/api/profile/show', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const { pengguna } = await response.json();
        setUser(pengguna);
        setUpdatedUser(pengguna);
        console.log('Data Pengguna:', pengguna);
        setCookie('user', JSON.stringify(pengguna), 7);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowAlert(true);
    try {
      const token = getCookie('token');
      const response = await fetch('https://dioparkapp-production.up.railway.app/api/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Save to cookies
      setCookie('user', JSON.stringify(updatedUser), 7);

      setShowAlert(true);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleLogout = () => {
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    navigate('/');
  };

  useEffect(() => {
    let timeout;
    if (showAlert) {
      timeout = setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [showAlert]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <h1 className="text-4xl font-bold text-gray-800 mb-5">Data Diri</h1>
      <div className="max-w-md w-full py-6 px-6 bg-white shadow-md rounded-md" style={{ maxWidth: 'calc(55vw - -85px)', borderRadius: '10px' }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              className="mt-1 p-2 w-full border rounded-md"
              value={updatedUser.nama || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Nama pengguna
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="mt-1 p-2 w-full border rounded-md"
              value={updatedUser.username || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 p-2 w-full border rounded-md"
              value={updatedUser.email || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="nomor_telp" className="block text-sm font-medium text-gray-700">
              No Telepon
            </label>
            <input
              type="text"
              id="nomor_telp"
              name="nomor_telp"
              className="mt-1 p-2 w-full border rounded-md"
              value={updatedUser.nomor_telp || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="nomor_polisi" className="block text-sm font-medium text-gray-700">
              Nomor Polisi
            </label>
            <input
              type="text"
              id="nomor_polisi"
              name="nomor_polisi"
              className="mt-1 p-2 w-full border rounded-md"
              value={updatedUser.nomor_polisi || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-1">
            <label htmlFor="detail_kendaraan" className="block text-sm font-medium text-gray-700">
              Detail Kendaraan
            </label>
            <input
              type="text"
              id="detail_kendaraan"
              name="detail_kendaraan"
              className="mt-1 p-2 w-full border rounded-md"
              value={updatedUser.detail_kendaraan || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center justify-center space-x-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-3 mb-3 rounded-md hover:bg-blue-600">
              Simpan Perubahan
            </button>
            <button type="button" onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 mt-3 mb-3 rounded-md hover:bg-red-600">
              Keluar
            </button>
          </div>
        </form>
      </div>
      <Modal
        open={showAlert}
        onClose={() => setShowAlert(false)}
        aria-labelledby="alert-modal-title"
        aria-describedby="alert-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: {
            background: 'rgba(0, 0, 0, 0.8)',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")',
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 200,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <Alert severity="success" icon={false}>
            <CheckCircleIcon sx={{ fontSize: 50, color: 'green', mt: 2, mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box>Perubahan berhasil disimpan!</Box>
            </Box>
          </Alert>
        </Box>
      </Modal>
    </div>
  );
}

export default UserProfile;
