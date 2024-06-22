import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

import Footer from '../components/Footer';
import backgroundImage from '../assets/img/main_bg.jpg';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-md w-full py-10 px-6 bg-white shadow-md lg:max-w-lg lg:mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', maxWidth: 'calc(55vw - -85px)', borderRadius: '20px', margin: '0 10px' }}>
        <h2 className="text-2xl text-center font-semibold mb-4">Welcome to DioPark</h2>
        <p className="text-gray-700 text-center">One Think, One Solution</p>
        <div className="flex justify-center mt-4">

          <div className="flex justify-center mt-4 px-1">
            <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center">
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />Masuk
            </Link>
          </div>
          <div className="flex justify-center mt-4 px-1">
            <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center">
              <FontAwesomeIcon icon={faUserPlus} className="mr-2" />Daftar
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
