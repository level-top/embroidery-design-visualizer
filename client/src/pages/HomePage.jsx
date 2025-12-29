import { Link } from 'react-router-dom';
import { FaPalette, FaImage, FaProjectDiagram, FaArrowRight } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
          Embroidery Design Visualizer
        </h2>
        <p className="text-base text-gray-700 md:text-lg">
          Create stunning embroidery designs on traditional dress models. Upload your designs, choose a model, and visualize how they look before production.
        </p>
      </div>
      
      <div className="grid gap-8 row-gap-8 lg:grid-cols-3">
        <div className="sm:text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary sm:mx-auto sm:w-24 sm:h-24">
            <FaPalette className="w-8 h-8 text-white sm:w-12 sm:h-12" />
          </div>
          <h6 className="mb-2 font-semibold leading-5">Upload Designs</h6>
          <p className="max-w-md mb-3 text-sm text-gray-900 sm:mx-auto">
            Upload your embroidery patterns, motifs, and designs to our library.
          </p>
          <Link to="/designs" className="inline-flex items-center font-semibold text-primary transition-colors duration-200 hover:text-secondary">
            Manage Designs
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
        
        <div className="sm:text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary sm:mx-auto sm:w-24 sm:h-24">
            <FaImage className="w-8 h-8 text-white sm:w-12 sm:h-12" />
          </div>
          <h6 className="mb-2 font-semibold leading-5">Choose Models</h6>
          <p className="max-w-md mb-3 text-sm text-gray-900 sm:mx-auto">
            Select from our collection of traditional dress models including lehengas, sarees, and more.
          </p>
          <Link to="/models" className="inline-flex items-center font-semibold text-primary transition-colors duration-200 hover:text-secondary">
            Browse Models
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
        
        <div className="sm:text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary sm:mx-auto sm:w-24 sm:h-24">
            <FaProjectDiagram className="w-8 h-8 text-white sm:w-12 sm:h-12" />
          </div>
          <h6 className="mb-2 font-semibold leading-5">Create Projects</h6>
          <p className="max-w-md mb-3 text-sm text-gray-900 sm:mx-auto">
            Place designs on models, customize colors, and create beautiful visualizations.
          </p>
          <Link to="/editor" className="inline-flex items-center font-semibold text-primary transition-colors duration-200 hover:text-secondary">
            Start Designing
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <Link 
          to="/editor"
          className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-primary hover:bg-secondary focus:shadow-outline focus:outline-none"
        >
          Get Started
        </Link>
        <Link
          to="/projects"
          className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-gray-700 transition duration-200 rounded shadow-md bg-white hover:bg-gray-100 focus:shadow-outline focus:outline-none"
        >
          View Projects
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
