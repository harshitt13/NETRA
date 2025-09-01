import React from 'react';
import { ShieldAlert, User, Clock, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

const AlertCard = ({ alert }) => {
  const { person_name, risk_score, summary, timestamp, person_id } = alert;

  const getRiskColor = (score) => {
    if (score > 85) return 'red';
    if (score > 60) return 'orange';
    return 'yellow';
  };

  const riskColor = getRiskColor(risk_score);

  const riskStyles = {
    red: {
      gradient: 'from-red-500/80 to-red-800/80',
      text: 'text-red-300',
      border: 'border-red-500/50',
      shadow: 'shadow-red-500/30',
      glowRing: 'ring-red-500',
    },
    orange: {
      gradient: 'from-orange-500/80 to-orange-700/80',
      text: 'text-orange-300',
      border: 'border-orange-500/50',
      shadow: 'shadow-orange-500/30',
      glowRing: 'ring-orange-500',
    },
    yellow: {
      gradient: 'from-yellow-500/80 to-yellow-700/80',
      text: 'text-yellow-300',
      border: 'border-yellow-500/50',
      shadow: 'shadow-yellow-500/30',
      glowRing: 'ring-yellow-500',
    },
  };

  const currentRiskStyle = riskStyles[riskColor];

  return (
    <div
      className={`
        relative overflow-hidden w-full bg-gray-900/60 backdrop-blur-md rounded-xl 
        border ${currentRiskStyle.border} p-5 flex flex-col justify-between 
        transition-all duration-300 ease-in-out group hover:shadow-2xl 
        hover:${currentRiskStyle.shadow} hover:-translate-y-1
      `}
    >
      {/* Glow effect on hover */}
      <div className={`absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-cyan-500/10 to-transparent transition-opacity duration-500 opacity-0 group-hover:opacity-100`}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <User className={`${currentRiskStyle.text} h-6 w-6`} />
            <h3 className="text-xl font-bold text-gray-100">{person_name}</h3>
          </div>
          <div
            className={`flex items-center justify-center h-16 w-16 rounded-full bg-gray-800/50 border-2 ${currentRiskStyle.border}`}
          >
            <span className={`text-3xl font-bold ${currentRiskStyle.text}`}>
              {risk_score}
            </span>
          </div>
        </div>

        {/* AI Summary */}
        <div className="mb-5">
            <p className="text-gray-300 italic">"{summary}"</p>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
           <div className="flex items-center text-sm text-gray-400">
             <Clock size={16} className="mr-2" />
             <span>{new Date(timestamp).toLocaleDateString()}</span>
           </div>
           
           <a href={`/triage/${person_id}`}>
            <Button variant="secondary" className="h-10 px-4">
                Triage Case
                <ArrowRight size={16} className="ml-2" />
            </Button>
           </a>
        </div>
      </div>
    </div>
  );
};

// Example usage with placeholder data
const AlertCardWrapper = () => (
    <div className="p-10 bg-gray-900 min-h-screen">
         <AlertCard alert={{
            person_id: 'PER-001',
            person_name: 'Arjun Verma',
            risk_score: 92,
            summary: 'High-value property purchase inconsistent with declared income and links to shell companies.',
            timestamp: '2025-08-31T12:34:56Z'
        }}/>
    </div>
);


export default AlertCard;

