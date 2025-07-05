import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  DollarSign,
  PieChart,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Plane,
  Bed,
  Utensils,
  MapPin,
  ShoppingBag,
  Plus,
  Minus,
  Calculator
} from 'lucide-react';
import ExpenseTracker from './ExpenseTracker';
import './BudgetOptimizer.css';

const BudgetOptimizer = ({ tripData, onBudgetUpdate }) => {
  const [budgetData, setBudgetData] = useState({
    totalBudget: 0,
    categories: {
      accommodation: { allocated: 0, spent: 0, planned: 0 },
      transportation: { allocated: 0, spent: 0, planned: 0 },
      food: { allocated: 0, spent: 0, planned: 0 },
      activities: { allocated: 0, spent: 0, planned: 0 },
      shopping: { allocated: 0, spent: 0, planned: 0 },
      miscellaneous: { allocated: 0, spent: 0, planned: 0 }
    }
  });

  const [suggestions, setSuggestions] = useState([]);
  const [activeCategory, setActiveCategory] = useState('accommodation');

  // Category configurations
  const categoryConfig = {
    accommodation: {
      icon: Bed,
      color: '#3b82f6',
      name: 'Accommodation',
      description: 'Hotels, Airbnb, hostels',
      tipPercentage: 35
    },
    transportation: {
      icon: Plane,
      color: '#10b981',
      name: 'Transportation',
      description: 'Flights, trains, local transport',
      tipPercentage: 25
    },
    food: {
      icon: Utensils,
      color: '#f59e0b',
      name: 'Food & Dining',
      description: 'Restaurants, groceries, drinks',
      tipPercentage: 20
    },
    activities: {
      icon: MapPin,
      color: '#ef4444',
      name: 'Activities',
      description: 'Tours, attractions, entertainment',
      tipPercentage: 15
    },
    shopping: {
      icon: ShoppingBag,
      color: '#8b5cf6',
      name: 'Shopping',
      description: 'Souvenirs, clothes, gifts',
      tipPercentage: 3
    },
    miscellaneous: {
      icon: DollarSign,
      color: '#6b7280',
      name: 'Miscellaneous',
      description: 'Tips, emergencies, other',
      tipPercentage: 2
    }
  };

  // Initialize budget based on trip data
  useEffect(() => {
    if (tripData && tripData.budget) {
      const totalBudget = parseBudgetString(tripData.budget);
      const smartAllocation = generateSmartAllocation(totalBudget);
      
      setBudgetData({
        totalBudget,
        categories: smartAllocation
      });

      generateOptimizationSuggestions(totalBudget, smartAllocation, tripData);
    }
  }, [tripData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Parse budget string (e.g., "$2000", "moderate", "luxury")
  const parseBudgetString = (budgetStr) => {
    if (typeof budgetStr === 'number') return budgetStr;
    
    const numMatch = budgetStr.match(/\d+/);
    if (numMatch) return parseInt(numMatch[0]);
    
    // Handle budget categories
    const budgetMap = {
      'budget': 1000,
      'moderate': 2500,
      'luxury': 5000,
      'ultra-luxury': 10000
    };
    
    return budgetMap[budgetStr.toLowerCase()] || 2000;
  };

  // Generate smart budget allocation based on destination and trip type
  const generateSmartAllocation = useCallback((totalBudget) => {
    const allocation = {};
    
    Object.keys(categoryConfig).forEach(category => {
      const percentage = categoryConfig[category].tipPercentage / 100;
      const allocated = Math.round(totalBudget * percentage);
      
      allocation[category] = {
        allocated,
        spent: 0,
        planned: Math.round(allocated * 0.8) // 80% of allocated as initial planned
      };
    });

    return allocation;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate optimization suggestions
  const generateOptimizationSuggestions = useCallback((totalBudget, allocation, tripData) => {
    const newSuggestions = [];

    // Check for over-allocation
    const totalAllocated = Object.values(allocation).reduce((sum, cat) => sum + cat.allocated, 0);
    if (totalAllocated > totalBudget) {
      newSuggestions.push({
        type: 'warning',
        title: 'Budget Over-Allocated',
        message: `You've allocated $${totalAllocated - totalBudget} more than your total budget.`,
        action: 'Auto-balance budget',
        actionHandler: () => autoBalanceBudget()
      });
    }

    // Smart cost-saving suggestions
    if (allocation.accommodation.allocated > totalBudget * 0.4) {
      newSuggestions.push({
        type: 'tip',
        title: 'Accommodation Savings',
        message: 'Your accommodation budget is high. Consider Airbnb, hostels, or booking in advance for better rates.',
        action: 'Find cheaper options',
        savings: Math.round(allocation.accommodation.allocated * 0.2)
      });
    }

    // Destination-specific suggestions
    if (tripData.destination) {
      const destination = tripData.destination.toLowerCase();

      if (destination.includes('paris') || destination.includes('london') || destination.includes('new york')) {
        newSuggestions.push({
          type: 'tip',
          title: 'Expensive City Alert',
          message: 'This is an expensive destination. Consider increasing your food budget by 25% and look for free activities.',
          action: 'Adjust for city costs',
          actionHandler: () => adjustForExpensiveCity()
        });
      }

      if (destination.includes('tokyo') || destination.includes('japan')) {
        newSuggestions.push({
          type: 'tip',
          title: 'Japan Travel Tip',
          message: 'Transportation costs can add up quickly. A JR Pass might save you money for longer stays.',
          action: 'Calculate JR Pass savings'
        });
      }

      if (destination.includes('thailand') || destination.includes('vietnam') || destination.includes('india')) {
        newSuggestions.push({
          type: 'success',
          title: 'Budget-Friendly Destination',
          message: 'Great choice! This destination offers excellent value. You might be able to reduce your daily budget.',
          action: 'Optimize for local costs',
          actionHandler: () => optimizeForBudgetDestination()
        });
      }
    }

    // Duration-based suggestions
    if (tripData.dates) {
      const startDate = new Date(tripData.dates.start);
      const endDate = new Date(tripData.dates.end);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      if (days > 14) {
        newSuggestions.push({
          type: 'success',
          title: 'Long Trip Advantage',
          message: 'For longer trips, consider weekly accommodation rates and cooking some meals to save 30-40%.',
          action: 'Apply long-stay discounts',
          actionHandler: () => applyLongStayOptimization(days)
        });
      }

      if (days < 4) {
        newSuggestions.push({
          type: 'tip',
          title: 'Short Trip Focus',
          message: 'For short trips, prioritize experiences over shopping. Consider increasing activities budget.',
          action: 'Optimize for short stay'
        });
      }
    }

    // Group travel suggestions
    if (tripData.participants > 4 || tripData.travelers > 4) {
      newSuggestions.push({
        type: 'success',
        title: 'Group Travel Savings',
        message: 'Large groups can get discounts on accommodation and activities. Look for group rates!',
        action: 'Find group discounts',
        savings: Math.round(totalBudget * 0.15)
      });
    }

    // Budget health suggestions
    if (totalBudget < 1000) {
      newSuggestions.push({
        type: 'tip',
        title: 'Budget Travel Tips',
        message: 'Consider hostels, street food, free walking tours, and public transport to maximize your budget.',
        action: 'Get budget travel guide'
      });
    }

    setSuggestions(newSuggestions);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-balance budget when over-allocated
  const autoBalanceBudget = () => {
    const totalAllocated = getTotalAllocated();
    if (totalAllocated <= budgetData.totalBudget) return;

    const reductionFactor = budgetData.totalBudget / totalAllocated;
    const newCategories = {};

    Object.entries(budgetData.categories).forEach(([key, data]) => {
      newCategories[key] = {
        ...data,
        allocated: Math.round(data.allocated * reductionFactor)
      };
    });

    setBudgetData(prev => ({
      ...prev,
      categories: newCategories
    }));
  };

  // Adjust budget for expensive cities
  const adjustForExpensiveCity = () => {
    const newCategories = { ...budgetData.categories };

    // Increase food budget by 25%
    newCategories.food.allocated = Math.round(newCategories.food.allocated * 1.25);

    // Decrease shopping budget to compensate
    newCategories.shopping.allocated = Math.round(newCategories.shopping.allocated * 0.7);

    setBudgetData(prev => ({
      ...prev,
      categories: newCategories
    }));
  };

  // Optimize for budget-friendly destinations
  const optimizeForBudgetDestination = () => {
    const newCategories = { ...budgetData.categories };

    // Reduce accommodation and food budgets
    newCategories.accommodation.allocated = Math.round(newCategories.accommodation.allocated * 0.8);
    newCategories.food.allocated = Math.round(newCategories.food.allocated * 0.7);

    // Increase activities budget
    newCategories.activities.allocated = Math.round(newCategories.activities.allocated * 1.3);

    setBudgetData(prev => ({
      ...prev,
      categories: newCategories
    }));
  };

  // Apply long-stay optimizations
  const applyLongStayOptimization = () => {
    const newCategories = { ...budgetData.categories };

    // Reduce accommodation cost per day for long stays
    const accommodationSavings = Math.round(newCategories.accommodation.allocated * 0.2);
    newCategories.accommodation.allocated -= accommodationSavings;

    // Reduce food cost assuming some home cooking
    const foodSavings = Math.round(newCategories.food.allocated * 0.15);
    newCategories.food.allocated -= foodSavings;

    // Add savings to activities or miscellaneous
    newCategories.activities.allocated += Math.round((accommodationSavings + foodSavings) * 0.7);
    newCategories.miscellaneous.allocated += Math.round((accommodationSavings + foodSavings) * 0.3);

    setBudgetData(prev => ({
      ...prev,
      categories: newCategories
    }));
  };

  // Update category allocation
  const updateCategoryAllocation = (category, field, value) => {
    setBudgetData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          [field]: Math.max(0, value)
        }
      }
    }));

    if (onBudgetUpdate) {
      onBudgetUpdate(budgetData);
    }
  };

  // Calculate totals
  const getTotalAllocated = () => {
    return Object.values(budgetData.categories).reduce((sum, cat) => sum + cat.allocated, 0);
  };

  const getTotalSpent = () => {
    return Object.values(budgetData.categories).reduce((sum, cat) => sum + cat.spent, 0);
  };

  const getRemainingBudget = () => {
    return budgetData.totalBudget - getTotalSpent();
  };

  const getBudgetHealth = () => {
    const totalAllocated = getTotalAllocated();
    const totalSpent = getTotalSpent();
    
    if (totalSpent > budgetData.totalBudget) return 'over';
    if (totalAllocated > budgetData.totalBudget) return 'warning';
    if (totalSpent < budgetData.totalBudget * 0.8) return 'good';
    return 'normal';
  };

  return (
    <div className="budget-optimizer">
      <div className="budget-header">
        <div className="budget-title">
          <Calculator className="budget-title-icon" />
          <h2>Smart Budget Optimizer</h2>
        </div>
        
        <div className="budget-overview">
          <div className="budget-card total-budget">
            <div className="budget-card-header">
              <DollarSign className="budget-card-icon" />
              <span>Total Budget</span>
            </div>
            <div className="budget-amount">${budgetData.totalBudget.toLocaleString()}</div>
          </div>
          
          <div className="budget-card allocated-budget">
            <div className="budget-card-header">
              <PieChart className="budget-card-icon" />
              <span>Allocated</span>
            </div>
            <div className="budget-amount">${getTotalAllocated().toLocaleString()}</div>
          </div>
          
          <div className="budget-card spent-budget">
            <div className="budget-card-header">
              <TrendingUp className="budget-card-icon" />
              <span>Spent</span>
            </div>
            <div className="budget-amount">${getTotalSpent().toLocaleString()}</div>
          </div>
          
          <div className={`budget-card remaining-budget ${getBudgetHealth()}`}>
            <div className="budget-card-header">
              {getRemainingBudget() >= 0 ? 
                <TrendingDown className="budget-card-icon" /> : 
                <AlertCircle className="budget-card-icon" />
              }
              <span>Remaining</span>
            </div>
            <div className="budget-amount">
              ${Math.abs(getRemainingBudget()).toLocaleString()}
              {getRemainingBudget() < 0 && <span className="over-budget">over</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="budget-content">
        {/* Category Breakdown */}
        <div className="budget-categories">
          <h3>Budget Breakdown by Category</h3>
          <div className="category-grid">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const categoryData = budgetData.categories[key];
              const Icon = config.icon;
              const percentage = budgetData.totalBudget > 0 ?
                (categoryData.allocated / budgetData.totalBudget * 100) : 0;

              return (
                <div
                  key={key}
                  className={`category-car ${activeCategory === key ? '' : ''}`}
                  onClick={() => setActiveCategory(key)}
                >
                  <div className="category-header">
                    <div className="category-icon" style={{ backgroundColor: config.color }}>
                      <Icon size={20} />
                    </div>
                    <div className="category-info">
                      <h4>{config.name}</h4>
                      <p>{config.description}</p>
                    </div>
                  </div>

                  <div className="category-amounts">
                    <div className="amount-row">
                      <span>Allocated:</span>
                      <div className="amount-input">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCategoryAllocation(key, 'allocated', categoryData.allocated - 50);
                          }}
                          className="amount-btn"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="amount">${categoryData.allocated.toLocaleString()}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCategoryAllocation(key, 'allocated', categoryData.allocated + 50);
                          }}
                          className="amount-btn"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="amount-row">
                      <span>Spent:</span>
                      <div className="amount-input">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCategoryAllocation(key, 'spent', Math.max(0, categoryData.spent - 10));
                          }}
                          className="amount-btn"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="amount spent">${categoryData.spent.toLocaleString()}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCategoryAllocation(key, 'spent', categoryData.spent + 10);
                          }}
                          className="amount-btn"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="category-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(100, (categoryData.spent / categoryData.allocated) * 100)}%`,
                          backgroundColor: config.color
                        }}
                      />
                    </div>
                    <span className="percentage">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
          <div className="budget-suggestions">
            <h3>Smart Optimization Suggestions</h3>
            <div className="suggestions-grid">
              {suggestions.map((suggestion, index) => (
                <div key={index} className={`suggestion-card ${suggestion.type}`}>
                  <div className="suggestion-icon">
                    {suggestion.type === 'warning' && <AlertCircle size={20} />}
                    {suggestion.type === 'tip' && <TrendingUp size={20} />}
                    {suggestion.type === 'success' && <CheckCircle size={20} />}
                  </div>
                  <div className="suggestion-content">
                    <h4>{suggestion.title}</h4>
                    <p>{suggestion.message}</p>
                    {suggestion.savings && (
                      <div className="suggestion-savings">
                        💰 Potential savings: ${suggestion.savings.toLocaleString()}
                      </div>
                    )}
                    <button
                      className="suggestion-action"
                      onClick={suggestion.actionHandler || (() => {})}
                    >
                      {suggestion.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense Tracker */}
        <ExpenseTracker
          budgetData={budgetData}
          onExpenseUpdate={(expenses) => {
            // Update spent amounts based on expenses
            const expensesByCategory = {};
            Object.keys(budgetData.categories).forEach(cat => {
              expensesByCategory[cat] = expenses
                .filter(exp => exp.category === cat)
                .reduce((sum, exp) => sum + exp.amount, 0);
            });

            setBudgetData(prev => ({
              ...prev,
              categories: Object.keys(prev.categories).reduce((acc, cat) => {
                acc[cat] = {
                  ...prev.categories[cat],
                  spent: expensesByCategory[cat] || 0
                };
                return acc;
              }, {})
            }));
          }}
        />
      </div>
    </div>
  );
};

BudgetOptimizer.propTypes = {
  tripData: PropTypes.shape({
    budget: PropTypes.string,
    destination: PropTypes.string,
    dates: PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string
    }),
    participants: PropTypes.number,
    travelers: PropTypes.number
  }),
  onBudgetUpdate: PropTypes.func
};

export default BudgetOptimizer;
