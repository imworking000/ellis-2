import React, { useState, useEffect } from 'react';
import { X, Clock, Play, CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { Job, JobLog } from '../../types/job';
import { jobService } from '../../services/jobService';

interface JobProgressModalProps {
  jobId: string;
  onClose: () => void;
}

export const JobProgressModal: React.FC<JobProgressModalProps> = ({
  jobId,
  onClose
}) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJob();
    
    // Set up polling for active jobs
    const interval = setInterval(() => {
      if (job && (job.status === 'processing' || job.status === 'pending')) {
        loadJob();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, job?.status]);

  const loadJob = async () => {
    try {
      const jobData = await jobService.getJob(jobId);
      setJob(jobData);
    } catch (error) {
      console.error('Failed to load job:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-500" />;
      case 'processing':
        return <Play className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getLogIcon = (level: JobLog['level']) => {
    switch (level) {
      case 'info':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case 'warning':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      case 'success':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F8AF00]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-black mb-2">Job not found</h2>
            <button
              onClick={onClose}
              className="text-[#F8AF00] hover:text-[#E69F00] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {getStatusIcon(job.status)}
            <div>
              <h2 className="text-xl font-bold text-black">{job.title}</h2>
              <p className="text-sm text-[#5D5D5D]">Job ID: {job.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#5D5D5D] hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-black">Current Stage</h3>
              <p className="text-[#5D5D5D]">{job.currentStage}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-black">{job.progress}%</div>
              <div className="text-sm text-[#5D5D5D] capitalize">{job.status}</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                job.status === 'completed' ? 'bg-green-500' :
                job.status === 'failed' ? 'bg-red-500' :
                job.status === 'processing' ? 'bg-blue-500' :
                'bg-gray-400'
              }`}
              style={{ width: `${job.progress}%` }}
            />
          </div>

          {/* Associated Document/Test */}
          {job.associatedName && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-[#5D5D5D]">Associated {job.associatedType}:</span>
                  <span className="ml-2 font-medium text-black">{job.associatedName}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#5D5D5D]" />
              </div>
            </div>
          )}

          {/* Error Message */}
          {job.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-red-800">Error</div>
                  <div className="text-sm text-red-700">{job.error}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logs Section */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 pb-4">
            <h3 className="font-semibold text-black mb-4">Job Logs</h3>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-3">
              {job.logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-2">
                    {getLogIcon(log.level)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[#5D5D5D] font-mono">
                        {formatTimestamp(log.timestamp)}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                        log.level === 'error' ? 'bg-red-100 text-red-800' :
                        log.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        log.level === 'success' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {log.level.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-black">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-[#5D5D5D]">
            <div>
              Created: {new Date(job.createdAt).toLocaleString()}
            </div>
            <div>
              Last updated: {new Date(job.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};