import TripForm from './TripForm';
import TripSuggestions from './TripSuggestions';
import TravelBuddyChat from '../TravelBuddy/TravelBuddyChat';
import './createTripPage.css';

export default function CreateTripPage() {
  return (
    <div className="create-trip-page-wrapper">
      <div className="create-trip-inner-wrapper">
        <h1 className="create-trip-heading">Plan Your Dream Trip</h1>
        <p className="create-trip-paragraph">
          Tell us your preferences and we&apos;ll help you create the perfect itinerary
        </p>
      </div>

      <TripForm />
      <TripSuggestions />

      {/* AI Travel Buddy Chat */}
      <TravelBuddyChat />
    </div>
  );
}
