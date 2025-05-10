import { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
// port jwtDecode from 'jwt-decode'; // Optional: For decoding JWTs if needed

interface BudgetEntry {
  id?: number;
  month: string;
  amount: number;
  category: string;
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetEntry[]>([]);
  const [month, setMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [categories, setCategories] = useState<string[]>([
    'Food', 'Rent', 'Transport', 'Health', 'Entertainment', 'Utilities', 'Savings',
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = 'http://localhost:5000/api/budgets'; // Change if deployed
  const DEV_JWT_TOKEN = 'your_generated_jwt_token'; // Replace with the generated token

  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE, {
        headers: {
          'Authorization': `Bearer ${DEV_JWT_TOKEN}`, // Include the JWT token
        },
      });
      if (!res.ok) throw new Error('Failed to fetch budgets');
      const data = await res.json();
      if (Array.isArray(data)) setBudgets(data);
      else throw new Error('Unexpected response format');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const chosenCategory = customCategory.trim() || category;
    if (!chosenCategory || !month || !amount) return;
    const payload = {
      month,
      amount: Math.floor(parseFloat(amount)),
      category: chosenCategory,
    };

    try {
      if (editId) {
        const res = await fetch(`${API_BASE}/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEV_JWT_TOKEN}`, // Include the JWT token
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update budget');
        const updated = await res.json();
        setBudgets(prev => prev.map(b => b.id === editId ? updated : b));
        setEditId(null);
      } else {
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEV_JWT_TOKEN}`, // Include the JWT token
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to add budget');
        const newEntry = await res.json();
        setBudgets(prev => [...prev, newEntry]);
      }
      if (!categories.includes(chosenCategory)) {
        setCategories(prev => [...prev, chosenCategory]);
      }
      setMonth(''); setAmount(''); setCategory(''); setCustomCategory('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting the budget');
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${DEV_JWT_TOKEN}`, // Include the JWT token
        },
      });
      if (!res.ok) throw new Error('Failed to delete budget');
      setBudgets(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the budget');
    }
  };

  const handleEdit = (entry: BudgetEntry) => {
    setEditId(entry.id!);
    setMonth(entry.month);
    setAmount(entry.amount.toString());
    setCategory(entry.category);
  };

  const groupedBudgets = budgets
    .filter(entry => entry.month && entry.category && typeof entry.amount === 'number')
    .reduce((acc, entry) => {
      if (!acc[entry.month]) acc[entry.month] = [];
      acc[entry.month].push(entry);
      return acc;
    }, {} as Record<string, BudgetEntry[]>);

  return (
    <DashboardLayout>
      <div className="bg-white text-black min-h-screen px-8 py-6">
        <h1 className="text-2xl font-bold mb-4">Monthly Budget</h1>

        {error && <div className="text-red-600 mb-4">{error}</div>}
        {loading ? (
          <div>Loading budgets...</div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block mb-1 font-medium">Month:</label>
                <input type="month" value={month} onChange={e => setMonth(e.target.value)} required className="border p-2 rounded w-full" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Target Amount ($):</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required className="border p-2 rounded w-full" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Select Category:</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="border p-2 rounded w-full">
                  <option value="">-- Choose --</option>
                  {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Or Add New Category:</label>
                <input type="text" value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="border p-2 rounded w-full" />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                {editId ? 'Save Changes' : 'Add Budget'}
              </button>
            </form>

            {Object.entries(groupedBudgets).map(([month, entries]) => {
              const total = entries.reduce((sum, e) => sum + e.amount, 0);
              return (
                <div key={month} className="mb-8 bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 px-6 py-3 text-lg font-semibold border-b">Budgets for {month}</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                        <tr>
                          <th className="px-6 py-3 border-b">Category</th>
                          <th className="px-6 py-3 border-b">Amount ($)</th>
                          <th className="px-6 py-3 border-b">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((entry, index) => (
                          <tr key={entry.id || index} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 border-b">{entry.category}</td>
                            <td className="px-6 py-4 border-b font-medium text-gray-800">${entry.amount}</td>
                            <td className="px-6 py-4 border-b space-x-4">
                              <button onClick={() => handleEdit(entry)} className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition">Edit</button>
                              <button onClick={() => handleDelete(entry.id)} className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 transition">Delete</button>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100 font-bold">
                          <td className="px-6 py-3">Total</td>
                          <td className="px-6 py-3">${total}</td>
                          <td className="px-6 py-3" />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
