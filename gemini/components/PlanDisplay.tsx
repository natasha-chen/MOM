import React, { useState } from 'react';
import { PlanItem, TaskStatus } from '../types';
import PlanCard from './PlanCard';

interface PlanDisplayProps {
  plan: PlanItem[];
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan }) => {
  const [localPlan, setLocalPlan] = useState<PlanItem[]>(plan);

  const handleDueDateChange = (index: number, newDueDate: string) => {
    const updatedPlan = [...localPlan];
    updatedPlan[index] = { ...updatedPlan[index], dueDate: newDueDate };
    setLocalPlan(updatedPlan);
  };

  const handleStatusChange = (index: number, newStatus: TaskStatus) => {
    const updatedPlan = [...localPlan];
    updatedPlan[index] = { ...updatedPlan[index], status: newStatus };
    setLocalPlan(updatedPlan);
  };

  if (plan.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-lg border border-slate-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-4 text-xl font-semibold text-slate-600">Your Plan Will Appear Here</h3>
        <p className="mt-1 text-slate-500">Let MOM know what you need to do, and she'll organize your day!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Here is your personalized plan for today:</h2>
       <div className="mb-6 p-3 bg-sky-50 border border-sky-200 text-sky-700 rounded-lg flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">You can click the <strong className="font-bold">🔔</strong> on any task to get a sample browser notification!</p>
      </div>
      <div className="space-y-4">
        {localPlan.map((item, index) => (
          <PlanCard
            key={index}
            item={item}
            onDueDateChange={(newDate) => handleDueDateChange(index, newDate)}
            onStatusChange={(newStatus) => handleStatusChange(index, newStatus)}
          />
        ))}
      </div>
    </div>
  );
};

export default PlanDisplay;