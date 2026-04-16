import { ShieldAlert } from 'lucide-react';

interface SOSButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export function SOSButton({ onPress, disabled }: SOSButtonProps) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute w-52 h-52 rounded-full border-2 border-red-500/20 animate-pulse-ring" />
      <div className="absolute w-44 h-44 rounded-full border-2 border-red-500/30 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
      <button
        onClick={onPress}
        disabled={disabled}
        className="relative w-36 h-36 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30 dark:shadow-red-500/20 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform duration-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-red-500/40"
        aria-label="Activate SOS"
      >
        <ShieldAlert className="w-10 h-10 text-white" />
        <span className="text-white font-bold text-lg tracking-wider">SOS</span>
        <span className="text-white/70 text-[10px] font-medium">HOLD TO ACTIVATE</span>
      </button>
    </div>
  );
}
