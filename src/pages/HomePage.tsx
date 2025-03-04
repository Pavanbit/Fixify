import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Hammer, Paintbrush, Zap, Droplet, Trash2, Search, Star, Shield, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, userType } = useAuth();

  const services = [
    { icon: <Wrench className="h-12 w-12 text-blue-500" />, name: 'Plumbing', description: 'Fix leaks, install fixtures, and solve all your plumbing issues.' },
    { icon: <Zap className="h-12 w-12 text-yellow-500" />, name: 'Electrical', description: 'Wiring, installations, repairs, and electrical maintenance.' },
    { icon: <Hammer className="h-12 w-12 text-brown-500" />, name: 'Carpentry', description: 'Custom furniture, repairs, installations, and woodworking.' },
    { icon: <Paintbrush className="h-12 w-12 text-green-500" />, name: 'Painting', description: 'Interior and exterior painting services for your home.' },
    { icon: <Droplet className="h-12 w-12 text-blue-300" />, name: 'Cleaning', description: 'Deep cleaning, regular maintenance, and specialized cleaning services.' },
    { icon: <Trash2 className="h-12 w-12 text-gray-500" />, name: 'Junk Removal', description: 'Get rid of unwanted items, furniture, and debris.' }
  ];

  const features = [
    { icon: <Search className="h-8 w-8 text-blue-500" />, title: 'Find Local Professionals', description: 'Connect with skilled workers in your area for any home service need.' },
    { icon: <Star className="h-8 w-8 text-yellow-500" />, title: 'Verified Reviews', description: 'Read authentic reviews from real customers before hiring.' },
    { icon: <Shield className="h-8 w-8 text-green-500" />, title: 'Secure Payments', description: 'Safe and secure payment processing for all services.' },
    { icon: <Clock className="h-8 w-8 text-purple-500" />, title: 'Save Time', description: 'Quickly find and book services without endless phone calls.' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Home Services, <br />Simplified
              </h1>
              <p className="text-xl mb-8">
                Connect with trusted professionals for all your home repair and improvement needs.
              </p>
              {isAuthenticated ? (
                <Link
                  to={userType === 'user' ? '/post-job' : '/worker-dashboard'}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
                >
                  {userType === 'user' ? 'Post a Job' : 'Find Jobs'}
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors inline-block"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Home repair professional" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From minor repairs to major renovations, find skilled professionals for any job.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fixify makes it easy to find and hire the right professional for your needs.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
                    <span className="text-blue-600 font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Post Your Job</h3>
                    <p className="text-gray-600">Describe what you need done, when you need it, and your budget.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
                    <span className="text-blue-600 font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Get Connected</h3>
                    <p className="text-gray-600">Nearby professionals will be notified and can accept your job.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
                    <span className="text-blue-600 font-bold text-xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Job Complete</h3>
                    <p className="text-gray-600">Once the work is done, review the service and make payment.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Home service professional at work" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Fixify</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make finding reliable home service professionals simple and stress-free.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of homeowners and service providers on Fixify today.
          </p>
          {isAuthenticated ? (
            <Link
              to={userType === 'user' ? '/post-job' : '/worker-dashboard'}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
            >
              {userType === 'user' ? 'Post a Job Now' : 'Find Jobs Now'}
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
              >
                Sign Up Now
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors inline-block"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;