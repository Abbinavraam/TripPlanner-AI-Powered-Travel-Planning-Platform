import { useState } from 'react';
import PropTypes from 'prop-types';
import { Plus, Receipt, Calendar, DollarSign, Tag, Trash2 } from 'lucide-react';
import './BudgetOptimizer.css';

const ExpenseTracker = ({ budgetData, onExpenseUpdate }) => {
  const [expenses, setExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categoryConfig = {
    accommodation: { name: 'Accommodation', color: '#3b82f6' },
    transportation: { name: 'Transportation', color: '#10b981' },
    food: { name: 'Food & Dining', color: '#f59e0b' },
    activities: { name: 'Activities', color: '#ef4444' },
    shopping: { name: 'Shopping', color: '#8b5cf6' },
    miscellaneous: { name: 'Miscellaneous', color: '#6b7280' }
  };

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.description) return;

    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    };

    const updatedExpenses = [...expenses, expense];
    setExpenses(updatedExpenses);
    
    // Update budget data
    if (onExpenseUpdate) {
      onExpenseUpdate(updatedExpenses);
    }

    // Reset form
    setNewExpense({
      amount: '',
      category: 'food',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const deleteExpense = (id) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== id);
    setExpenses(updatedExpenses);
    
    if (onExpenseUpdate) {
      onExpenseUpdate(updatedExpenses);
    }
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getExpensesByCategory = () => {
    const byCategory = {};
    Object.keys(categoryConfig).forEach(cat => {
      byCategory[cat] = expenses
        .filter(exp => exp.category === cat)
        .reduce((sum, exp) => sum + exp.amount, 0);
    });
    return byCategory;
  };

  const expensesByCategory = getExpensesByCategory();

  return (
    <div className="expense-tracker">
      <div className="expense-header">
        <div className="expense-title">
          <Receipt className="expense-title-icon" />
          <h3>Expense Tracker</h3>
        </div>
        
        <div className="expense-summary">
          <div className="expense-total">
            <DollarSign size={16} />
            <span>Total Spent: ${getTotalExpenses().toLocaleString()}</span>
          </div>
          <button 
            className="add-expense-btn"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={16} />
            Add Expense
          </button>
        </div>
      </div>

      {/* Add Expense Form */}
      {showAddForm && (
        <div className="add-expense-form">
          <div className="form-row">
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                className="expense-input"
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                className="expense-select"
              >
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                className="expense-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What did you spend on?"
              className="expense-input"
            />
          </div>
          
          <div className="form-actions">
            <button onClick={addExpense} className="save-expense-btn">
              Save Expense
            </button>
            <button 
              onClick={() => setShowAddForm(false)} 
              className="cancel-expense-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Category Spending Overview */}
      <div className="category-spending">
        <h4>Spending by Category</h4>
        <div className="spending-grid">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const spent = expensesByCategory[key];
            const budgeted = budgetData?.categories?.[key]?.allocated || 0;
            const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;
            
            return (
              <div key={key} className="spending-item">
                <div className="spending-header">
                  <div 
                    className="spending-color"
                    style={{ backgroundColor: config.color }}
                  ></div>
                  <span className="spending-name">{config.name}</span>
                </div>
                
                <div className="spending-amounts">
                  <span className="spent-amount">${spent.toLocaleString()}</span>
                  <span className="budget-amount">/ ${budgeted.toLocaleString()}</span>
                </div>
                
                <div className="spending-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min(100, percentage)}%`,
                        backgroundColor: percentage > 100 ? '#ef4444' : config.color
                      }}
                    />
                  </div>
                  <span className={`percentage ${percentage > 100 ? 'over-budget' : ''}`}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Expenses */}
      {expenses.length > 0 && (
        <div className="recent-expenses">
          <h4>Recent Expenses</h4>
          <div className="expense-list">
            {expenses.slice(-5).reverse().map((expense) => (
              <div key={expense.id} className="expense-item">
                <div className="expense-info">
                  <div 
                    className="expense-category-color"
                    style={{ backgroundColor: categoryConfig[expense.category].color }}
                  ></div>
                  <div className="expense-details">
                    <span className="expense-description">{expense.description}</span>
                    <div className="expense-meta">
                      <span className="expense-category">
                        <Tag size={12} />
                        {categoryConfig[expense.category].name}
                      </span>
                      <span className="expense-date">
                        <Calendar size={12} />
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="expense-amount-actions">
                  <span className="expense-amount">${expense.amount.toLocaleString()}</span>
                  <button 
                    onClick={() => deleteExpense(expense.id)}
                    className="delete-expense-btn"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {expenses.length > 5 && (
            <div className="expense-summary-note">
              Showing 5 most recent expenses. Total: {expenses.length} expenses
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ExpenseTracker.propTypes = {
  budgetData: PropTypes.shape({
    categories: PropTypes.objectOf(PropTypes.shape({
      allocated: PropTypes.number
    }))
  }),
  onExpenseUpdate: PropTypes.func
};

export default ExpenseTracker;
