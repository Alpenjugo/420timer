import { Globe } from 'lucide-react';

interface NextLocationProps {
  location: string;
  localTime: Date;
  timeUntil: number;
  isNext: boolean;
}

export function NextLocation({ location, localTime, timeUntil, isNext }: NextLocationProps) {
  const cities = location.split(/,\s*/).map(city => city.trim());
  
  const handleBoxClick = () => {
    // Open search for the first city when clicking the box
    window.open(`https://www.google.com/search?q=${encodeURIComponent(cities[0])}`, '_blank');
  };
  
  return (
    <button 
      onClick={handleBoxClick}
      className={`w-full text-left ${isNext ? '' : 'opacity-80'} bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors duration-200 cursor-pointer`}
    >
      <div className="flex items-center gap-4 mb-3">
        <Globe className="w-5 h-5 text-purple-300 shrink-0" />
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <span 
              key={city}
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://www.google.com/search?q=${encodeURIComponent(city)}`, '_blank');
              }}
              className="text-lg text-purple-200 hover:text-white hover:underline transition-colors duration-200 cursor-pointer"
            >
              {city}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <p className={`font-bold ${isNext ? 'text-4xl' : 'text-2xl'} ml-9`}>
          4:20
        </p>
        <p className="text-purple-200">
          in {Math.ceil(timeUntil / 60000)} minutes
        </p>
      </div>
    </button>
  );
}