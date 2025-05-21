import React, { useState, useEffect } from 'react';

interface TransactionFormProps {
  onSubmit: (transaction: TransactionData) => void;
  isLoading?: boolean;
  initialData?: TransactionData;
  isEditing?: boolean;
}

export interface TransactionData {
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'],
  expense: ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other']
} as const;

const STYLES = {
  input: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400",
  error: "mt-1 text-sm text-red-600",
  label: "block text-sm font-medium text-gray-700 mb-1",
  button: "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
} as const;

export const TransactionForm: React.FC<TransactionFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  initialData,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState<TransactionData>({
    amount: 0,
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const [errors, setErrors] = useState<Partial<Record<keyof TransactionData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TransactionData, string>> = {};
    
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 100) {
      newErrors.description = 'Description must be 100 characters or less';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    const selectedDate = new Date(formData.date);
    const today = new Date();
    if (selectedDate > today) {
      newErrors.date = 'Date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      if (!isEditing) {
        setFormData({
          amount: 0,
          description: '',
          category: '',
          date: new Date().toISOString().split('T')[0],
          type: 'expense'
        });
      }
      setErrors({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: name === 'amount' ? parseFloat(value) || 0 : value
      };
      
      // Reset category when type changes
      if (name === 'type') {
        newData.category = '';
      }
      
      return newData;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-4">
        <label htmlFor="type" className={STYLES.label}>
          Transaction Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={STYLES.input}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="amount" className={STYLES.label}>
          Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`${STYLES.input} pl-7 ${errors.amount ? 'border-red-500' : ''}`}
            required
            min="0.01"
            step="0.01"
            placeholder="0.00"
          />
        </div>
        {errors.amount && <p className={STYLES.error}>{errors.amount}</p>}
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="description" className={STYLES.label}>
            Description
          </label>
          <span className="text-sm text-gray-500">
            {formData.description.length}/100
          </span>
        </div>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`${STYLES.input} ${errors.description ? 'border-red-500' : ''}`}
          required
          placeholder="Enter transaction description"
          maxLength={100}
        />
        {errors.description && <p className={STYLES.error}>{errors.description}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="category" className={STYLES.label}>
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`${STYLES.input} ${errors.category ? 'border-red-500' : ''}`}
          required
        >
          <option value="">Select a category</option>
          {CATEGORIES[formData.type].map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <p className={STYLES.error}>{errors.category}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="date" className={STYLES.label}>
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={`${STYLES.input} ${errors.date ? 'border-red-500' : ''}`}
          required
          max={new Date().toISOString().split('T')[0]}
        />
        {errors.date && <p className={STYLES.error}>{errors.date}</p>}
      </div>

      <button
        type="submit"
        className={STYLES.button}
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : isEditing ? 'Update Transaction' : 'Add Transaction'}
      </button>
    </form>
  );
};
