import { History } from 'lucide-react';

interface PastLocationProps {
  location: string;
  timeSince: number;
}

export function PastLocation({ location, timeSince }: PastLocationProps) {
  const cities = location.split(/,\s*/).map(city => city.trim());
  
  return (
    <div className="w-full mt-6 p-4 bg-white/5 rounded-xl">
      <div className="flex items-center gap-4">
        <History className="w-4 h-4 text-purple-300 shrink-0" />
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(city)}`, '_blank')}
              className="text-sm text-purple-200 hover:text-white hover:underline transition-colors duration-200"
            >
              {city}
            </button>
          ))}
        </div>
        <p className="text-sm text-purple-300 ml-auto">
          {Math.floor(timeSince / 60000)} minutes ago
        </p>
      </div>
    </div>
  );
}