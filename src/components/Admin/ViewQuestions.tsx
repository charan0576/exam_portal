import React, { useState, useEffect } from 'react';
import { FileText, Trash2, Filter, AlertCircle } from 'lucide-react';
import { Question } from '../../types';
import { apiService } from '../../services/api';

const ViewQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, categoryFilter, subcategoryFilter]);

  const loadQuestions = async () => {
    try {
      const data = await apiService.getQuestions();
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;
    
    if (categoryFilter) {
      filtered = filtered.filter(q => q.category === categoryFilter);
    }
    
    if (subcategoryFilter) {
      filtered = filtered.filter(q => q.subcategory === subcategoryFilter);
    }
    
    setFilteredQuestions(filtered);
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    setDeleteLoading(questionId);
    try {
      await apiService.deleteQuestion(questionId);
      setQuestions(questions.filter(q => q._id !== questionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getUniqueValues = (key: keyof Question) => {
    return [...new Set(questions.map(q => q[key]))];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Question Bank ({filteredQuestions.length})
        </h3>

        {error && (
          <div className="mb-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {getUniqueValues('category').map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={subcategoryFilter}
              onChange={(e) => setSubcategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Subcategories</option>
              {getUniqueValues('subcategory').map(subcategory => (
                <option key={subcategory} value={subcategory}>
                  {subcategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredQuestions.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm sm:text-base px-4">No questions found. Upload some questions to see them here.</p>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div key={question._id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-3 space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {question.category}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        {question.subcategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base leading-relaxed">{question.question}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      {question.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className={`${question.correctAnswer === option ? 'text-green-600 font-medium' : 'text-gray-600'} leading-relaxed`}>
                            {option}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(question._id)}
                    disabled={deleteLoading === question._id}
                    className="sm:ml-4 flex items-center space-x-1 text-red-600 hover:text-red-800 disabled:opacity-50 text-xs sm:text-sm"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{deleteLoading === question._id ? 'Deleting...' : 'Delete'}</span>
                    <span className="sm:hidden">Del</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewQuestions;