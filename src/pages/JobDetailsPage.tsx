import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, MessageSquare, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useJobs } from '../contexts/JobContext';
import { format } from 'date-fns';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, userType } = useAuth();
  const { getJobById, updateJobStatus } = useJobs();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(id ? getJobById(id) : undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (id) {
      const jobData = getJobById(id);
      setJob(jobData);
      
      if (!jobData) {
        setError('Job not found');
      }
    }
  }, [id, getJobById]);

  const handleAcceptJob = async () => {
    if (!currentUser || !job || !id) return;
    
    try {
      setIsUpdating(true);
      await updateJobStatus(
        id, 
        'assigned', 
        currentUser.id, 
        currentUser.name, 
        currentUser.profileImage
      );
      
      setJob(getJobById(id));
    } catch (err) {
      setError('Failed to accept job. Please try again.');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async (status: 'in-progress' | 'completed') => {
    if (!job || !id) return;
    
    try {
      setIsUpdating(true);
      await updateJobStatus(id, status);
      setJob(getJobById(id));
    } catch (err) {
      setError(`Failed to update job status. Please try again.`);
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500 mb-4">Loading job details...</p>
        </div>
      </div>
    );
  }

  const isJobPoster = currentUser?.id === job.userId;
  const isWorker = currentUser?.id === job.workerId;
  const canAcceptJob = userType === 'worker' && job.status === 'open' && !isJobPoster;
  const canUpdateStatus = isWorker && (job.status === 'assigned' || job.status === 'in-progress');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to={userType === 'user' ? '/user-dashboard' : '/worker-dashboard'}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  job.status === 'open' ? 'bg-blue-100 text-blue-800' :
                  job.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                  job.status === 'in-progress' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace('-', ' ')}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                  Budget: ${job.budget}
                </div>
                <div>{job.category}</div>
              </div>
              
              <div className="flex items-start mb-6">
                <MapPin className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>{job.location.address}</span>
              </div>
              
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>
            </div>
          </div>
          
          {/* Job poster info */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Posted by</h2>
            <div className="flex items-center">
              <img
                src={job.userImage || `https://ui-avatars.com/api/?name=${job.userName}&background=random`}
                alt={job.userName}
                className="h-12 w-12 rounded-full"
              />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">{job.userName}</p>
                <p className="text-sm text-gray-500">Job Poster</p>
              </div>
            </div>
          </div>
          
          {/* Worker info (if assigned) */}
          {job.workerId && (
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Assigned to</h2>
              <div className="flex items-center">
                <img
                  src={job.workerImage || `https://ui-avatars.com/api/?name=${job.workerName}&background=random`}
                  alt={job.workerName}
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{job.workerName}</p>
                  <p className="text-sm text-gray-500">Service Provider</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-4">
            {canAcceptJob && (
              <button
                onClick={handleAcceptJob}
                disabled={isUpdating}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isUpdating ? 'Accepting...' : 'Accept Job'}
              </button>
            )}
            
            {canUpdateStatus && job.status === 'assigned' && (
              <button
                onClick={() => handleUpdateStatus('in-progress')}
                disabled={isUpdating}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Mark as In Progress'}
              </button>
            )}
            
            {canUpdateStatus && job.status === 'in-progress' && (
              <button
                onClick={() => handleUpdateStatus('completed')}
                disabled={isUpdating}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Mark as Completed'}
              </button>
            )}
            
            {(isJobPoster || isWorker) && job.workerId && (
              <Link
                to={`/chat/${job.id}/${isJobPoster ? job.workerId : job.userId}`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Message {isJobPoster ? 'Worker' : 'Client'}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;