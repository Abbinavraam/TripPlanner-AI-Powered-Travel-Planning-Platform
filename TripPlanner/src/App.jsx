
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ViewTripPage from './component/ViewTrip/ViewTripPage';
import CreateTripPage from './component/CreateTrip/CreateTripPage';
import Home from './Home';
import Hotels from './pages/Hotels';
import ThingsToDo from './pages/ThingsToDo';
import Restaurants from './pages/Restaurants';
import TravelStories from './pages/TravelStories';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-trip" element={<CreateTripPage />} />
        <Route path="/view-trip-page" element={<ViewTripPage />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/things-to-do" element={<ThingsToDo />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/travel-stories" element={<TravelStories />} />
      </Routes>
    </Router>
  );
}

export default App;
