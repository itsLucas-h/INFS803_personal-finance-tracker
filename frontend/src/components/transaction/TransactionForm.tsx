import React, { useState } from 'react';

interface TransactionFormProps {
  onSubmit: (transaction: TransactionData) => void;
}

export interface TransactionData {
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<TransactionData>({
    amount: 0,
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      amount: 0,
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400";

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-4">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Transaction Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
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
            className={`${inputClasses} pl-7`}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={inputClasses}
          required
          placeholder="Enter transaction description"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={inputClasses}
          required
          placeholder="Enter category"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={inputClasses}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Add Transaction
      </button>
    </form>
  );
};
