import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, Play, CheckCircle, XCircle, AlertTriangle, ExternalLink, RotateCcw, X } from 'lucide-react';
import { Job } from '../../types/job';
import { jobService } from '../../services/jobService';
import { JobProgressModal } from './JobProgressModal';

export const JobsList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
    // Set up polling for active jobs
    const interval = setInterval(() => {
      if (jobs.some(job => job.status === 'processing' || job.status === 'pending')) {
        loadJobs();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [jobs]);

  const loadJobs = async () => {
    try {
      const jobsList = await jobService.getAllJobs();
      setJobs(jobsList);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelJob = async (jobId: string) => {
    setActionLoading(jobId);
    try {
      await jobService.cancelJob(jobId);
      await loadJobs();
    } catch (error) {
      console.error('Failed to cancel job:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetryJob = async (jobId: string) => {
    setActionLoading(jobId);
    try {
      await jobService.retryJob(jobId);
      await loadJobs();
    } catch (error) {
      console.error('Failed to retry job:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'processing':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: Job['status']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'processing':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getJobTypeLabel = (type: Job['type']) => {
    switch (type) {
      case 'document_processing':
        return 'Document Processing';
      case 'document_chunking':
        return 'Document Chunking';
      case 'test_creation':
        return 'Test Creation';
      default:
        return type;
    }
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
    
    if (duration < 60) return `${duration}s`;
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`;
    return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F8AF00]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Jobs</h1>
          <p className="text-[#5D5D5D]">Track asynchronous operations and their progress</p>
        </div>
        <button
          onClick={loadJobs}
          disabled={loading}
          className="flex items-center gap-2 border border-gray-300 text-[#5D5D5D] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Jobs Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-black">Job</th>
                <th className="text-left py-3 px-4 font-medium text-black">Status</th>
                <th className="text-left py-3 px-4 font-medium text-black">Progress</th>
                <th className="text-left py-3 px-4 font-medium text-black">Duration</th>
                <th className="text-left py-3 px-4 font-medium text-black">Associated</th>
                <th className="text-right py-3 px-4 font-medium text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-black">{job.title}</div>
                      <div className="text-sm text-[#5D5D5D]">{getJobTypeLabel(job.type)}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <span className={getStatusBadge(job.status)}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                    {job.status === 'processing' && (
                      <div className="text-xs text-[#5D5D5D] mt-1">{job.currentStage}</div>
                    )}
                    {job.error && (
                      <div className="text-xs text-red-600 mt-1" title={job.error}>
                        {job.error.length > 30 ? `${job.error.substring(0, 30)}...` : job.error}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          job.status === 'completed' ? 'bg-green-500' :
                          job.status === 'failed' ? 'bg-red-500' :
                          job.status === 'processing' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-[#5D5D5D] mt-1">{job.progress}%</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-[#5D5D5D]">
                      {formatDuration(job.createdAt, job.completedAt)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {job.associatedName && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-black">{job.associatedName}</span>
                        <ExternalLink className="w-3 h-3 text-[#5D5D5D]" />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedJobId(job.id)}
                        className="px-3 py-1 text-sm text-[#5D5D5D] hover:text-[#F8AF00] hover:bg-[#F8AF00] hover:bg-opacity-10 rounded transition-colors"
                      >
                        View Details
                      </button>
                      {job.status === 'processing' && (
                        <button
                          onClick={() => handleCancelJob(job.id)}
                          disabled={actionLoading === job.id}
                          className="p-2 text-[#5D5D5D] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Cancel job"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      {job.status === 'failed' && (
                        <button
                          onClick={() => handleRetryJob(job.id)}
                          disabled={actionLoading === job.id}
                          className="p-2 text-[#5D5D5D] hover:text-[#F8AF00] hover:bg-[#F8AF00] hover:bg-opacity-10 rounded-lg transition-colors disabled:opacity-50"
                          title="Retry job"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {jobs.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-black mb-2">No jobs found</h3>
          <p className="text-[#5D5D5D]">
            Jobs will appear here when you start processing documents or creating tests
          </p>
        </div>
      )}

      {/* Job Progress Modal */}
      {selectedJobId && (
        <JobProgressModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
        />
      )}
    </div>
  );
};