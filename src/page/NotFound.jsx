import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">The page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-500 hover:text-blue-700 text-lg">Go back to Home</Link>
      <Footer />
    </div>
  );
}

export default NotFound;
