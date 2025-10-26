import React, { useState, useEffect } from 'react';
import { PlanItem, PlanCategory } from '../types';
import formatDueDate from '../utils/formatDate';

interface PlanCardProps {
  item: PlanItem;
  onDueDateChange?: (newDueDate: string) => void;
}

const CategoryStyles = {
  [PlanCategory.PRODUCTIVITY]: {
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    bgColor: 'bg-sky-100',
    textColor: 'text-sky-800',
    borderColor: 'border-sky-500',
  },
  [PlanCategory.PHYSICAL]: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-500',
  },
  [PlanCategory.MENTAL]: {
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-500',
  },
};

const PlanCard: React.FC<PlanCardProps> = ({ item, onDueDateChange }) => {
  const styles = CategoryStyles[item.category] || CategoryStyles[PlanCategory.PRODUCTIVITY];
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  // Check for scheduled tasks and send notifications
  useEffect(() => {
    if (!item.time || notificationPermission !== 'granted') return;

    const [hours, minutes] = item.time.split(':').map(Number);
    const now = new Date();
    
    // Check if current time matches the scheduled time (within 1 minute)
    if (now.getHours() === hours && 
        Math.abs(now.getMinutes() - minutes) <= 1) {
      new Notification(`Time for: ${item.task}`, {
        body: item.notificationText,
        icon: '/vite.svg',
        tag: `task-${item.task}-${item.time}-${now.toDateString()}` // Prevent duplicate notifications for today
      });
    }
  }, [currentTime, item.time, item.task, item.notificationText, notificationPermission]);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleNotificationClick = () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(`MOM Reminder ⏰ (${item.time})`, {
        body: item.notificationText,
        icon: '/vite.svg', // A simple icon for the notification
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
        if (permission === 'granted') {
          new Notification(`MOM Reminder ⏰ (${item.time})`, {
            body: item.notificationText,
            icon: '/vite.svg',
          });
        }
      });
    }
  };

  const getNotificationTooltip = () => {
    if (notificationPermission === 'denied') {
      return 'Notifications blocked. Please enable them in your browser settings.';
    }
    if (notificationPermission === 'default') {
      return 'Click to enable and send a test notification';
    }
    return 'Send a test notification';
  };

  const getDueStatus = () => {
    if (!item.dueDate) return null;
    
    const dueDate = new Date(item.dueDate);
    const today = new Date(currentTime);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate.getTime() === today.getTime()) {
      return { text: 'Due today', class: 'bg-yellow-100 text-yellow-800' };
    } else if (dueDate < today) {
      return { text: 'Overdue', class: 'bg-red-100 text-red-800' };
    } else {
      const diffTime = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { text: `Due in ${diffTime} days`, class: 'bg-green-100 text-green-800' };
    }
  };

  return (
    <div className={`flex items-start space-x-4 p-4 rounded-xl shadow-sm transition-all duration-300 bg-white border-l-4 ${styles.borderColor} hover:shadow-md`}>
      <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${styles.bgColor} ${styles.textColor}`}>
        {styles.icon}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <p className="font-bold text-lg text-slate-800 pr-4">{item.task}</p>
           <div className="flex-shrink-0 flex items-center gap-2">
            <span className={`text-xs sm:text-sm font-medium ${styles.textColor} ${styles.bgColor} px-2 py-1 rounded-full`}>
                {item.category}
            </span>
            <button
                onClick={handleNotificationClick}
                disabled={notificationPermission === 'denied'}
                title={getNotificationTooltip()}
                className="relative text-slate-400 hover:text-sky-500 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Send test notification"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            </button>
          </div>
        </div>
         <div className="mt-2 text-slate-600 bg-slate-50 border-l-2 border-slate-300 pl-3 py-2 rounded-r-md">
           <p className="text-sm italic">MOM says: "{item.notificationText}"</p>
        </div>
        <div className="flex items-center text-slate-500 mt-2 space-x-4">
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{item.time}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{item.duration} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {onDueDateChange ? (
              <div className="flex items-center space-x-2 group relative">
                {!item.dueDate && <span className="text-xs text-slate-500">TBD</span>}
                <div className="relative">
                  <div 
                    className="p-1 text-sm rounded border border-slate-300 hover:border-sky-500 cursor-pointer min-w-[110px]"
                    onClick={(e) => {
                      const input = e.currentTarget.nextElementSibling as HTMLInputElement;
                      input?.showPicker();
                    }}
                  >
                    {item.dueDate ? formatDueDate(item.dueDate) : 'Select date'}
                  </div>
                  <input
                    type="date"
                    value={item.dueDate || ''}
                    onChange={(e) => onDueDateChange(e.target.value)}
                    className="absolute opacity-0 -z-10"
                  />
                </div>
                {item.dueDate && getDueStatus() && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getDueStatus()?.class}`}>
                    {getDueStatus()?.text}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col">
                <span>{formatDueDate(item.dueDate) || 'TBD'}</span>
                {item.dueDate && getDueStatus() && (
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-1 ${getDueStatus()?.class}`}>
                    {getDueStatus()?.text}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;