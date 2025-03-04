import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, MapPin, Star, PenTool as Tool } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { currentUser, userType, updateProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.location?.address || '');
  const [skills, setSkills] = useState<string[]>(currentUser?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const availableSkills = [
    'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning', 
    'Junk Removal', 'Flooring', 'Roofing', 'Landscaping', 'HVAC'
  ];

  const handleSave = async () => {
    if (!name || !email) {
      setError('Name and email are required');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      await updateProfile({
        name,
        email,
        ...(userType === 'worker' && { skills }),
        ...(address && currentUser?.location && { 
          location: {
            ...currentUser.location,
            address,
            lat: currentUser.location.lat,
            lng: currentUser.location.lng
          }
        })
      });
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
              <div className="relative">
                <img
                  src={currentUser?.profileImage || `https://ui-avatars.com/api/?name=${currentUser?.name}&background=random&size=128`}
                  alt={currentUser?.name}
                  className="h-32 w-32 rounded-full object-cover"
                />
                {userType === 'worker' && currentUser?.rating && (
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white rounded-full px-2 py-1 text-xs font-bold flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {currentUser.rating}
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {userType === 'user' ? 'Service Seeker' : 'Service Provider'}
                </span>
              </div>
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {userType === 'worker' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skills
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {skills.map((skill) => (
                          <span 
                            key={skill} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                            >
                              <span className="sr-only">Remove</span>
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex">
                        <select
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select a skill</option>
                          {availableSkills
                            .filter(skill => !skills.includes(skill))
                            .map(skill => (
                              <option key={skill} value={skill}>{skill}</option>
                            ))
                          }
                        </select>
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          disabled={!newSkill}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setName(currentUser?.name || '');
                        setEmail(currentUser?.email || '');
                        setAddress(currentUser?.location?.address || '');
                        setSkills(currentUser?.skills || []);
                        setError('');
                        setSuccess('');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{currentUser?.name}</h2>
                    <div className="flex items-center text-gray-500 mb-2">
                      <User className="h-4 w-4 mr-2" />
                      {currentUser?.email}
                    </div>
                    {currentUser?.location?.address && (
                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {currentUser.location.address}
                      </div>
                    )}
                  </div>
                  
                  {userType === 'worker' && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                        <Tool className="h-5 w-5 mr-2" />
                        Skills
                      </h3>
                      {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <span 
                              key={skill} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No skills added yet</p>
                      )}
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;