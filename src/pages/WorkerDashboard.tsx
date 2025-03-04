import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, MessageSquare, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useJobs, Job } from '../contexts/JobContext';
import { useChat } from '../contexts/ChatContext';
import { format } from 'date-fns';

const WorkerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { workerJobs, nearbyJobs, updateJobStatus } = useJobs();
  const { getUnreadCount } = useChat();
  const [activeTab, setActiveTab] = useState<'my-jobs' | 'available-jobs'>('my-jobs');
  const [isAccepting, setIsAccepting] = useState<string | null>(null);
  
  const handleAcceptJob = async (jobId: string) => {
    if (!currentUser) return;
    
    try {
      setIsAccepting(jobId);
      await updateJobStatus(
        jobId, 
        'assigned', 
        currentUser.id, 
        currentUser.name, 
        currentUser.profileImage
      );
    } catch (error) {
      console.error('Error accepting job:', error);
    } finally {
      setIsAccepting(null);
    }
  };

  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'open':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Open</span>;
      case 'assigned':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Assigned</span>;
      case 'in-progress':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">In Progress</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser?.name}</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('my-jobs')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'my-jobs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Jobs
            </button>
            <button
              onClick={() => setActiveTab('available-jobs')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'available-jobs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Available Jobs Nearby
            </button>
          </nav>
        </div>

        <div className="divide-y divide-gray-200">
          {activeTab === 'my-jobs' && workerJobs.length === 0 ? (
            <div className="p-6 text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">You haven't accepted any jobs yet.</p>
              <button
                onClick={() => setActiveTab('available-jobs')}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Available Jobs
              </button>
            </div>
          ) : activeTab === 'available-jobs' && nearbyJobs.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No available jobs in your area at the moment.</p>
              <p className="text-gray-500 mt-2">Check back later or update your location.</p>
            </div>
          ) : (
            (activeTab === 'my-jobs' ? workerJobs : nearbyJobs).map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900 mr-3">
                        <Link to={`/job/${job.id}`} className="hover:text-blue-600">
                          {job.title}
                        </Link>
                      </h3>
                      {getStatusBadge(job.status)}
                    </div>
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="font-medium text-gray-900">${job.budget}</span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        {job.category}
                      </div>
                      {job.distance !== undefined && (
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {job.distance} km away
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{job.description}</p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-col md:items-end space-y-2">
                    <Link
                      to={`/job/${job.id}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Details
                    </Link>
                    
                    {activeTab === 'available-jobs' ? (
                      <button
                        onClick={() => handleAcceptJob(job.id)}
                        disabled={isAccepting === job.id}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isAccepting === job.id ? 'Accepting...' : 'Accept Job'}
                      </button>
                    ) : (
                      <Link
                        to={`/chat/${job.id}/${job.userId}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                        {getUnreadCount(job.id) > 0 && (
                          <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {getUnreadCount(job.id)}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                </div>
                
                {activeTab === 'my-jobs' && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="flex items-center">
                      <img
                        src={job.userImage || `https://ui-avatars.com/api/?name=${job.userName}&background=random`}
                        alt={job.userName}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{job.userName}</p>
                        <p className="text-sm text-gray-500">Job Poster</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;