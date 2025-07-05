import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Plus, Minus, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MapPreview from '../TripMap/MapPreview';
import BudgetPreview from '../BudgetOptimizer/BudgetPreview';
import "./tipForm.css"

const availableInterests = [
  'Adventure',
  'Culture',
  'Food',
  'Nature',
  'Shopping',
  'Relaxation',
  'History',
  'Photography',
  'Nightlife',
  'Sports',
];

const TripForm = () => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: '',
    interests: [],
  });




  const [, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState('');
  const [, setRetryCount] = useState(0);

  useEffect(() => {
    const savedData = localStorage.getItem('tripFormData');
    console.log("M<<M<M<MsavedData", savedData)
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tripFormData', JSON.stringify(formData));
  }, [formData]);

  const isValidForm = () => {
    return (
      formData.destination &&
      formData.startDate &&
      formData.endDate &&
      formData.travelers &&
      formData.budget &&
      formData.interests.length > 0
    );
  };

  const generatePrompt = () => {
    return `I want you to act as a travel planner. Create an itinerary for a trip based on the following details:  
    - Place: ${formData.destination}
    - Date: From ${formData.startDate} to ${formData.endDate}  
    - Number of People: ${formData.travelers}  
    - Budget: ${formData.budget} 
    - Interests: ${formData.interests.join(', ')}
    Please provide the response in JSON format only without any extra string.`;
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const callChatGPT = async () => {
    if (!isValidForm()) {
      alert('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setResponse('');
    setError('');
    setLoadingProgress(0);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      setLoadingProgress(20);

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer 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`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: generatePrompt() }],
          temperature: 0.7,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      setLoadingProgress(80);

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();
      setLoadingProgress(100);

      clearInterval(progressInterval);
      goToNextPage(data.choices[0].message.content);
      setResponse(data.choices[0].message.content);

    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error calling ChatGPT:', error);

      if (error.name === 'AbortError') {
        setError('Request timed out. The AI service is taking too long to respond.');
      } else if (error.message.includes('429')) {
        setError('Too many requests. Please wait a moment and try again.');
      } else if (error.message.includes('401')) {
        setError('Authentication error. Please check API configuration.');
      } else {
        setError(`Failed to generate trip: ${error.message}`);
      }

      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
      setLoadingProgress(0);
      clearInterval(progressInterval);
    }
  };

  // Retry function
  const retryGeneration = () => {
    callChatGPT();
  };

  // Generate a more comprehensive basic trip
  const generateBasicTrip = () => {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    const itinerary = [];

    for (let i = 0; i < Math.min(days, 7); i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];

      const dayActivities = [];

      if (i === 0) {
        // First day - arrival
        dayActivities.push(
          { time: "10:00 AM", description: `Arrive in ${formData.destination}` },
          { time: "2:00 PM", description: "Check into accommodation and settle in" },
          { time: "6:00 PM", description: "Welcome dinner at a local restaurant" }
        );
      } else if (i === days - 1 && days > 1) {
        // Last day - departure
        dayActivities.push(
          { time: "9:00 AM", description: "Pack and check out" },
          { time: "11:00 AM", description: "Last-minute souvenir shopping" },
          { time: "2:00 PM", description: "Departure" }
        );
      } else {
        // Regular days
        const interests = formData.interests || [];

        if (interests.includes('Culture')) {
          dayActivities.push({ time: "9:00 AM", description: `Visit cultural sites and museums in ${formData.destination}` });
        } else if (interests.includes('Adventure')) {
          dayActivities.push({ time: "9:00 AM", description: `Adventure activities and outdoor exploration` });
        } else {
          dayActivities.push({ time: "9:00 AM", description: `Explore popular attractions in ${formData.destination}` });
        }

        dayActivities.push({ time: "1:00 PM", description: "Lunch at a recommended local restaurant" });

        if (interests.includes('Shopping')) {
          dayActivities.push({ time: "3:00 PM", description: "Shopping at local markets and stores" });
        } else if (interests.includes('Nature')) {
          dayActivities.push({ time: "3:00 PM", description: "Visit parks, gardens, or natural attractions" });
        } else {
          dayActivities.push({ time: "3:00 PM", description: "Free time for personal exploration" });
        }

        dayActivities.push({ time: "7:00 PM", description: "Dinner and evening entertainment" });
      }

      itinerary.push({
        date: dateString,
        activities: dayActivities
      });
    }

    return {
      trip: {
        destination: formData.destination,
        dates: {
          start: formData.startDate,
          end: formData.endDate
        },
        participants: formData.travelers,
        budget: formData.budget,
        interests: formData.interests,
        itinerary: itinerary
      }
    };
  };

  // Skip AI generation and go directly to trip view with basic data
  const skipAIGeneration = () => {
    const basicTripData = generateBasicTrip();
    goToNextPage(JSON.stringify(basicTripData));
  };

  const navigate = useNavigate();

  const goToNextPage = (res) => {
    try {
      let parsedData;

      // If res is already an object (from skipAIGeneration), use it directly
      if (typeof res === 'object') {
        parsedData = res;
      } else {
        // Clean the string and parse JSON
        const cleanString = res.replace(/^```json\n|\n```$/g, '').trim();
        console.log("Clean string:", cleanString);

        if (!cleanString) {
          throw new Error('Empty response from AI');
        }

        parsedData = JSON.parse(cleanString);
      }

      console.log("Parsed data:", parsedData);

      // Validate the parsed data structure
      if (!parsedData || typeof parsedData !== 'object') {
        throw new Error('Invalid data structure received');
      }

      // Ensure we have the expected structure
      if (!parsedData.trip && !parsedData.destination) {
        // If the data doesn't have the expected structure, wrap it
        parsedData = { trip: parsedData };
      }

      navigate('/view-trip-page', { state: { tripData: parsedData } });

    } catch (error) {
      console.error('Error parsing trip data:', error);
      setError(`Failed to process trip data: ${error.message}`);
      setLoading(false);

      // Offer to create a basic trip instead
      const shouldCreateBasic = window.confirm(
        'There was an error processing the AI response. Would you like to create a basic trip instead?'
      );

      if (shouldCreateBasic) {
        skipAIGeneration();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Create Your Perfect Trip</h2>

      <form className="space-y-8">
        {/* Destination */}
        <div className="space-y-2">
          <label className="flex items-center text-lg font-medium text-gray-700">
            <MapPin className="w-5 h-5 mr-2 text-green-600" />
            Where do you want to go?
          </label>
          <input
            type="text"
            value={formData.destination}
            onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
            placeholder="Enter destination"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />

          {/* Map Preview */}
          <MapPreview destination={formData.destination} />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-lg font-medium text-gray-700">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-lg font-medium text-gray-700">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Travelers */}
        <div className="space-y-2">
          <label className="flex items-center text-lg font-medium text-gray-700">
            <Users className="w-5 h-5 mr-2 text-green-600" />
            Number of Travelers
          </label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, travelers: Math.max(1, prev.travelers - 1) }))
              }
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Minus className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-xl font-medium w-12 text-center">{formData.travelers}</span>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, travelers: prev.travelers + 1 }))
              }
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="flex items-center text-lg font-medium text-gray-700">
            <Clock className="w-5 h-5 mr-2 text-green-600" />
            Budget Range
          </label>
          <select
            value={formData.budget}
            onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select budget range</option>
            <option value="budget">Budget ($0-$1000)</option>
            <option value="moderate">Moderate ($1000-$3000)</option>
            <option value="luxury">Luxury ($3000+)</option>
          </select>

          {/* Budget Preview */}
          {formData.budget && (
            <BudgetPreview
              budget={formData.budget}
              destination={formData.destination}
              travelers={formData.travelers}
              duration={formData.startDate && formData.endDate ?
                Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) : 0
              }
            />
          )}
        </div>

        {/* Interests */}
        <div className="space-y-4">
          <label className="text-lg font-medium text-gray-700">What interests you?</label>
          <div className="flex flex-wrap gap-3">
            {availableInterests.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                className={`px-4 py-2 rounded-full transition-colors ${formData.interests.includes(interest)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Section */}
        <div className="space-y-4">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">Generation Failed</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                  <div className="mt-3 flex space-x-3">
                    <button
                      onClick={retryGeneration}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={skipAIGeneration}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Skip AI & Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading Progress */}
          {loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-800">Creating Your Perfect Trip</h3>
                  <p className="mt-1 text-sm text-blue-700">Our AI is analyzing your preferences and crafting a personalized itinerary...</p>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${loadingProgress}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs text-blue-600">{Math.round(loadingProgress)}% complete</p>
                  </div>

                  <div className="mt-3">
                    <button
                      onClick={skipAIGeneration}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      Skip AI & Continue with Basic Trip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={async (e) => {
              e.preventDefault();
              await callChatGPT();
            }}
            type="submit"
            className={`w-full flex items-center justify-center space-x-2 py-4 rounded-lg transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Trip...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Create AI-Powered Trip</span>
              </>
            )}
          </button>

          {/* Alternative Options */}
          {!loading && (
            <div className="text-center space-y-2">
              <button
                onClick={skipAIGeneration}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Or create a basic trip without AI
              </button>

              {/* Performance Tip */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">💡 Quick Tip</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      AI generation typically takes 10-30 seconds. If it&apos;s taking longer, you can skip and create a basic trip that you can customize later!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Response Display */}
      {/* <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-bold text-gray-800">Response:</h3>
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">{response || 'No response yet.'}</pre>
      </div> */}
    </div>
  );
};

export default TripForm;
