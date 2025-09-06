import { AlertCircle, XCircle, Info } from 'lucide-react';

const variants = {
  error: {
    bg: 'bg-red-500/20',
    text: 'text-red-300',
    Icon: XCircle,
  },
  warn: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-300',
    Icon: AlertCircle,
  },
  info: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-300',
    Icon: Info,
  },
};

export default function ErrorBanner({ message, variant = 'error', className = '' }) {
  const v = variants[variant] ?? variants.error;
  const Icon = v.Icon;
  return (
    <div className={`${v.bg} ${v.text} p-4 rounded-lg flex items-center space-x-3 ${className}`}>
      <Icon className="h-5 w-5" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
