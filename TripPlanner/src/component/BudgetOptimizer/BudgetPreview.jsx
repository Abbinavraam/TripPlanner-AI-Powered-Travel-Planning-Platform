
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DollarSign, Calculator } from 'lucide-react';
import './BudgetOptimizer.css';

const BudgetPreview = ({ budget, destination, travelers, duration }) => {
  const [budgetEstimate, setBudgetEstimate] = useState(null);

  // Parse budget string and generate estimates
  useEffect(() => {
    if (budget) {
      const totalBudget = parseBudgetString(budget);
      const estimate = generateBudgetEstimate(totalBudget, destination, travelers, duration);
      setBudgetEstimate(estimate);
    }
  }, [budget, destination, travelers, duration]);

  const parseBudgetString = (budgetStr) => {
    if (typeof budgetStr === 'number') return budgetStr;
    
    const numMatch = budgetStr.match(/\d+/);
    if (numMatch) return parseInt(numMatch[0]);
    
    const budgetMap = {
      'budget': 1000,
      'moderate': 2500,
      'luxury': 5000,
      'ultra-luxury': 10000
    };
    
    return budgetMap[budgetStr.toLowerCase()] || 2000;
  };

  const generateBudgetEstimate = (totalBudget, destination, travelers, duration) => {
    const categories = {
      accommodation: { percentage: 35, color: '#3b82f6' },
      transportation: { percentage: 25, color: '#10b981' },
      food: { percentage: 20, color: '#f59e0b' },
      activities: { percentage: 15, color: '#ef4444' },
      shopping: { percentage: 3, color: '#8b5cf6' },
      miscellaneous: { percentage: 2, color: '#6b7280' }
    };

    const estimate = {
      total: totalBudget,
      perPerson: Math.round(totalBudget / (travelers || 1)),
      perDay: duration ? Math.round(totalBudget / duration) : 0,
      categories: {}
    };

    Object.entries(categories).forEach(([key, config]) => {
      const amount = Math.round(totalBudget * (config.percentage / 100));
      estimate.categories[key] = {
        amount,
        percentage: config.percentage,
        color: config.color
      };
    });

    return estimate;
  };

  if (!budgetEstimate) {
    return (
      <div className="budget-preview-container">
        <div className="budget-preview-placeholder">
          <Calculator size={32} className="text-gray-400" />
          <p>Enter budget details to see estimates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="budget-preview-container">
      <div className="budget-preview-header">
        <h4>
          <DollarSign size={16} />
          Budget Estimate
        </h4>
      </div>
      
      <div className="budget-preview-content">
        {/* Quick Stats */}
        <div className="budget-quick-stats">
          <div className="budget-stat">
            <span className="stat-label">Total Budget</span>
            <span className="stat-value">${budgetEstimate.total.toLocaleString()}</span>
          </div>
          
          {travelers > 1 && (
            <div className="budget-stat">
              <span className="stat-label">Per Person</span>
              <span className="stat-value">${budgetEstimate.perPerson.toLocaleString()}</span>
            </div>
          )}
          
          {budgetEstimate.perDay > 0 && (
            <div className="budget-stat">
              <span className="stat-label">Per Day</span>
              <span className="stat-value">${budgetEstimate.perDay.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="budget-breakdown">
          <h5>Estimated Breakdown</h5>
          <div className="breakdown-items">
            {Object.entries(budgetEstimate.categories).map(([key, data]) => (
              <div key={key} className="breakdown-item">
                <div className="breakdown-info">
                  <div 
                    className="breakdown-color" 
                    style={{ backgroundColor: data.color }}
                  ></div>
                  <span className="breakdown-name">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </div>
                <div className="breakdown-amount">
                  <span>${data.amount.toLocaleString()}</span>
                  <span className="breakdown-percentage">({data.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Chart */}
        <div className="budget-chart">
          <div className="chart-bar">
            {Object.entries(budgetEstimate.categories).map(([key, data]) => (
              <div
                key={key}
                className="chart-segment"
                style={{
                  width: `${data.percentage}%`,
                  backgroundColor: data.color
                }}
                title={`${key}: $${data.amount.toLocaleString()} (${data.percentage}%)`}
              ></div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="budget-tips">
          <div className="budget-tip">
            💡 <strong>Tip:</strong> These are estimates based on typical travel patterns. 
            Actual costs may vary by destination and travel style.
          </div>
        </div>
      </div>
    </div>
  );
};

BudgetPreview.propTypes = {
  budget: PropTypes.string,
  destination: PropTypes.string,
  travelers: PropTypes.number,
  duration: PropTypes.number
};

export default BudgetPreview;
