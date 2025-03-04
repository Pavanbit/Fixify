import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useJobs, Job } from '../contexts/JobContext';
import { useChat } from '../contexts/ChatContext';
import { format } from 'date-fns';

const UserDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { userJobs } = useJobs();
  const { getUnreadCount } = useChat();
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'in-progress' | 'completed'>('all');
  
  const filteredJobs = userJobs.filter(job => {
    if (activeTab === 'all') return true;
    if (activeTab === 'open') return job.status === 'open';
    if (activeTab === 'in-progress') return job.status === 'assigned' || job.status === 'in-progress';
    if (activeTab === 'completed') return job.status === 'completed';
    return true;
  });

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser?.name}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/post-job"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Post a New Job
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => setActiveTab('open')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'open'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setActiveTab('in-progress')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'in-progress'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed
            </button>
          </nav>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredJobs.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No jobs found.</p>
              <Link
                to="/post-job"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Post Your First Job
              </Link>
            </div>
          ) : (
            filteredJobs.map((job) => (
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
                    
                    {job.workerId && (
                      <Link
                        to={`/chat/${job.id}/${job.workerId}`}
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
                
                {job.workerId && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="flex items-center">
                      <img
                        src={job.workerImage || `https://ui-avatars.com/api/?name=${job.workerName}&background=random`}
                        alt={job.workerName}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{job.workerName}</p>
                        <p className="text-sm text-gray-500">Service Provider</p>
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

export default UserDashboard;