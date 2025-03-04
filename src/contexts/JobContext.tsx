import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'open' | 'assigned' | 'in-progress' | 'completed';
  createdAt: string;
  userId: string;
  userName: string;
  userImage?: string;
  workerId?: string;
  workerName?: string;
  workerImage?: string;
  distance?: number;
}

interface JobContextType {
  jobs: Job[];
  userJobs: Job[];
  workerJobs: Job[];
  nearbyJobs: Job[];
  createJob: (jobData: Omit<Job, 'id' | 'status' | 'createdAt' | 'userId' | 'userName' | 'userImage'>) => Promise<Job>;
  getJobById: (id: string) => Job | undefined;
  updateJobStatus: (jobId: string, status: Job['status'], workerId?: string, workerName?: string, workerImage?: string) => Promise<void>;
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

// Mock data for jobs
const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Fix leaking bathroom sink',
    description: 'The bathroom sink has been leaking for a few days. Need someone to fix it as soon as possible.',
    category: 'Plumbing',
    budget: 100,
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Main St, New York, NY'
    },
    status: 'open',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    userId: 'user-1',
    userName: 'John Doe',
    userImage: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
  },
  {
    id: 'job-2',
    title: 'Install new ceiling fan',
    description: 'Need to replace old ceiling fan with a new one in the living room.',
    category: 'Electrical',
    budget: 150,
    location: {
      lat: 40.7328,
      lng: -73.9860,
      address: '456 Park Ave, New York, NY'
    },
    status: 'open',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    userId: 'user-2',
    userName: 'Jane Smith',
    userImage: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random'
  },
  {
    id: 'job-3',
    title: 'Build custom bookshelf',
    description: 'Looking for a carpenter to build a custom bookshelf for my living room.',
    category: 'Carpentry',
    budget: 300,
    location: {
      lat: 40.7428,
      lng: -73.9960,
      address: '789 Broadway, New York, NY'
    },
    status: 'assigned',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    userId: 'user-3',
    userName: 'Bob Johnson',
    userImage: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=random',
    workerId: 'worker-1',
    workerName: 'Mike Wilson',
    workerImage: 'https://ui-avatars.com/api/?name=Mike+Wilson&background=random'
  }
];

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [workerJobs, setWorkerJobs] = useState<Job[]>([]);
  const [nearbyJobs, setNearbyJobs] = useState<Job[]>([]);

  // Load mock jobs on initial load
  useEffect(() => {
    const savedJobs = localStorage.getItem('fixify_jobs');
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    } else {
      setJobs(mockJobs);
      localStorage.setItem('fixify_jobs', JSON.stringify(mockJobs));
    }
  }, []);

  // Filter jobs based on current user
  useEffect(() => {
    if (currentUser) {
      if (currentUser.userType === 'user') {
        setUserJobs(jobs.filter(job => job.userId === currentUser.id));
      } else if (currentUser.userType === 'worker') {
        setWorkerJobs(jobs.filter(job => job.workerId === currentUser.id));
        
        // Calculate nearby jobs for workers
        if (currentUser.location) {
          const nearby = jobs
            .filter(job => job.status === 'open')
            .map(job => {
              const distance = calculateDistance(
                currentUser.location!.lat,
                currentUser.location!.lng,
                job.location.lat,
                job.location.lng
              );
              return { ...job, distance };
            })
            .sort((a, b) => (a.distance || 0) - (b.distance || 0));
          
          setNearbyJobs(nearby);
        }
      }
    } else {
      setUserJobs([]);
      setWorkerJobs([]);
      setNearbyJobs([]);
    }
  }, [currentUser, jobs]);

  const createJob = async (jobData: Omit<Job, 'id' | 'status' | 'createdAt' | 'userId' | 'userName' | 'userImage'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!currentUser) throw new Error('User must be logged in to create a job');
    
    const newJob: Job = {
      id: `job-${Date.now()}`,
      ...jobData,
      status: 'open',
      createdAt: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userImage: currentUser.profileImage
    };
    
    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    localStorage.setItem('fixify_jobs', JSON.stringify(updatedJobs));
    
    return newJob;
  };

  const getJobById = (id: string) => {
    return jobs.find(job => job.id === id);
  };

  const updateJobStatus = async (
    jobId: string, 
    status: Job['status'], 
    workerId?: string, 
    workerName?: string, 
    workerImage?: string
  ) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status,
          ...(workerId && { workerId }),
          ...(workerName && { workerName }),
          ...(workerImage && { workerImage })
        };
      }
      return job;
    });
    
    setJobs(updatedJobs);
    localStorage.setItem('fixify_jobs', JSON.stringify(updatedJobs));
  };

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return parseFloat(d.toFixed(1));
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const value = {
    jobs,
    userJobs,
    workerJobs,
    nearbyJobs,
    createJob,
    getJobById,
    updateJobStatus,
    calculateDistance
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};