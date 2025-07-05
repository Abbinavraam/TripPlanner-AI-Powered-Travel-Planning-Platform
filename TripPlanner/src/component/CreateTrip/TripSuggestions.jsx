
import { Star, MapPin, Clock } from 'lucide-react';
import "./tipSuggestions.css"

const suggestions = [
  {
    id: '1',
    title: 'Paris Explorer',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000',
    location: 'Paris, France',
    duration: '7 days',
    rating: 4.8,
    price: '$2,499'
  },
  {
    id: '2',
    title: 'Italian Adventure',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=1000',
    location: 'Rome, Italy',
    duration: '10 days',
    rating: 4.9,
    price: '$3,299'
  },
  {
    id: '3',
    title: 'Tokyo Discovery',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1000',
    location: 'Tokyo, Japan',
    duration: '8 days',
    rating: 4.7,
    price: '$2,899'
  }
];

export default function TripSuggestions() {
  return (
    <div className="max-w-4xl mx-auto mt-12">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Popular Trip Templates</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={suggestion.image}
                alt={suggestion.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                {suggestion.price}
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-lg font-semibold mb-2">{suggestion.title}</h4>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{suggestion.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{suggestion.duration}</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(suggestion.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {suggestion.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
