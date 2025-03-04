import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="h-8 w-8" />
              <span className="text-xl font-bold">Fixify</span>
            </div>
            <p className="text-gray-300 mb-4">
              Connecting homeowners with skilled service providers for all your home repair and improvement needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white">Sign Up</Link>
              </li>
              <li>
                <Link to="/post-job" className="text-gray-300 hover:text-white">Post a Job</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Plumbing</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Electrical</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Carpentry</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Painting</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Cleaning</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span className="text-gray-300">support@fixify.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span className="text-gray-300">+91 9321881748</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <p className="text-center text-gray-300">
            &copy; {new Date().getFullYear()} Fixify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;