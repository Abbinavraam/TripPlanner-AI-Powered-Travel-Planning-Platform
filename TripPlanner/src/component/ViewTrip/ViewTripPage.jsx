import { useState } from 'react';
import { useLocation } from 'react-router-dom';  // Import useLocation
import { Calendar, MapPin, Users, Clock, Share2, Download, Printer, Heart } from 'lucide-react';
import TravelBuddyChat from '../TravelBuddy/TravelBuddyChat';
import TripMap from '../TripMap/TripMap';
import BudgetOptimizer from '../BudgetOptimizer/BudgetOptimizer';
import "./viewTripPage.css";

const ViewTripPage = () => {
    const location = useLocation();  // Get location data
    const [activeDay, setActiveDay] = useState(0); // Move useState to top

    // Debugging to check if location.state is available
    console.log('Location data:', location);
    console.log('Trip data received:', location.state?.tripData);

    const { tripData } = location.state || {};  // Get tripData from location state

    // Enhanced validation for tripData structure
    if (!tripData) {
        console.error('No tripData found in location.state!');
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Trip Data Found</h2>
                    <p className="text-gray-600 mb-6">It looks like you navigated here directly. Please create a trip first.</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Go Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Check if tripData.trip exists, if not, assume tripData is the trip object itself
    const tripInfo = tripData.trip || tripData;

    // Validate that we have the required trip information
    if (!tripInfo || typeof tripInfo !== 'object') {
        console.error('Invalid trip data structure:', tripData);
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Trip Data</h2>
                    <p className="text-gray-600 mb-6">The trip data appears to be corrupted. Please try creating a new trip.</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Create New Trip
                    </button>
                </div>
            </div>
        );
    }

    // Safely destructure with fallback values
    const {
        destination = 'Unknown Destination',
        dates = { start: 'N/A', end: 'N/A' },
        participants = 1,
        budget = 'Not specified',
        itinerary = []
    } = tripInfo;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative hero-image">
                <img
                    //src="your-cover-image-url"  Replace with actual URL
                    src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"
                    alt={destination}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = 'fallback-image-url')} // Handle broken image
                />
                <div className="absolute inset-0 bg-black bg-opacity-40">
                    <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
                        <h1 className="text-4xl font-bold text-white mb-4">Trip to {destination}</h1>
                        <div className="flex flex-wrap gap-4 text-white text-sm sm:text-base">
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                                <span className="truncate">{destination}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2 flex-shrink-0" />
                                <span className="truncate">{dates.start} to {dates.end}</span>
                            </div>
                            <div className="flex items-center">
                                <Users className="w-5 h-5 mr-2 flex-shrink-0" />
                                <span className="truncate">{participants} participants</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-2 flex-shrink-0" />
                                <span className="truncate">{budget}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white shadow">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="text-xl font-semibold">Budget: {budget}</div>
                        <div className="flex space-x-4">
                            <button className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100">
                                <Share2 className="w-5 h-5 mr-2" />
                                <span className="hidden sm:inline">Share</span>
                            </button>
                            <button className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100">
                                <Download className="w-5 h-5 mr-2" />
                                <span className="hidden sm:inline">Download</span>
                            </button>
                            <button className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100">
                                <Printer className="w-5 h-5 mr-2" />
                                <span className="hidden md:inline">Print</span>
                            </button>
                            <button className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100">
                                <Heart className="w-5 h-5 mr-2" />
                                <span className="hidden md:inline">Save</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Trip Map */}
            <div className="container mx-auto px-4 py-8">
                <TripMap tripData={tripInfo} />
            </div>

            {/* Smart Budget Optimizer */}
            <div className="container mx-auto px-4 py-8">
                <BudgetOptimizer tripData={tripInfo} />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Itinerary */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-6">Your Itinerary</h2>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            {itinerary && itinerary.length > 0 ? (
                                <>
                                    {/* Day Selector */}
                                    <div className="flex overflow-x-auto border-b scrollbar-hide">
                                        {itinerary.map((day, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveDay(index)}
                                                className={`flex-shrink-0 px-6 py-3 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap ${activeDay === index
                                                    ? 'border-green-600 text-green-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                <div>{day.date || `Day ${index + 1}`}</div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Activities */}
                                    <div className="p-6">
                                        {itinerary[activeDay] ? (
                                            <>
                                                <h3 className="text-xl font-semibold mb-4">
                                                    Activities on {itinerary[activeDay].date || `Day ${activeDay + 1}`}
                                                </h3>
                                                {itinerary[activeDay].activities && itinerary[activeDay].activities.length > 0 ? (
                                                    itinerary[activeDay].activities.map((activity, index) => (
                                                        <div key={index} className="flex gap-4 mb-6 last:mb-0">
                                                            <div className="w-24 flex-shrink-0 text-gray-600">
                                                                {activity.time || 'TBD'}
                                                            </div>
                                                            <div className="flex-grow">
                                                                <div className="bg-gray-50 rounded-lg p-4">
                                                                    <div className="flex gap-4">
                                                                        <div className="flex-grow">
                                                                            <p className="text-gray-600 mt-2">
                                                                                {activity.description || 'Activity details to be determined'}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <p className="text-gray-500">No activities planned for this day yet.</p>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">Day information not available.</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="p-6 text-center">
                                    <div className="py-8">
                                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-600 mb-2">No Itinerary Available</h3>
                                        <p className="text-gray-500">Your trip itinerary will appear here once generated.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Trip Details */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Trip Details</h2>
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                                    <div>
                                        <div className="font-medium">Destination</div>
                                        <div className="text-gray-600">{destination}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                                    <div>
                                        <div className="font-medium">Dates</div>
                                        <div className="text-gray-600">{dates.start} to {dates.end}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                                    <div>
                                        <div className="font-medium">Participants</div>
                                        <div className="text-gray-600">{participants} people</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Travel Buddy Chat with trip context */}
            <TravelBuddyChat tripData={tripInfo} />
        </div>
    );
}

export default ViewTripPage;
