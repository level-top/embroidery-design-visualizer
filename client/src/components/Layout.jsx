import { Link, Outlet } from 'react-router-dom';
import { FaPalette, FaImage, FaProjectDiagram, FaHome } from 'react-icons/fa';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-4 text-xl font-bold text-primary">
                <FaPalette className="mr-2" />
                Embroidery Designer
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary"
                >
                  <FaHome className="mr-2" />
                  Home
                </Link>
                <Link
                  to="/designs"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-primary"
                >
                  <FaPalette className="mr-2" />
                  Designs
                </Link>
                <Link
                  to="/models"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-primary"
                >
                  <FaImage className="mr-2" />
                  Models
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-primary"
                >
                  <FaProjectDiagram className="mr-2" />
                  Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;