
import React from 'react';
import { Job } from '../types';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  return (
    <div 
      onClick={() => onClick(job)}
      className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 active:scale-[0.98] transition-transform cursor-pointer mb-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{job.customerName}</h3>
          <div className="flex items-center text-slate-500 text-sm mt-1">
            <MapPin size={14} className="mr-1" />
            <span>{job.address}</span>
          </div>
          <div className="flex items-center text-slate-500 text-sm mt-1">
            <Calendar size={14} className="mr-1" />
            <span>{job.startDate}</span>
          </div>
        </div>
        <ChevronRight className="text-slate-400" />
      </div>
      <p className="mt-3 text-slate-600 text-sm line-clamp-2">
        {job.description}
      </p>
    </div>
  );
};
