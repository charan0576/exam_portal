import React, { useState } from 'react';
import { FileText, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService } from '../../services/api';

const AddQuestions: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    {
      value: 'coding',
      label: 'Coding',
      subcategories: [
        { value: 'c', label: 'C Programming' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'web-development', label: 'Web Development' },
      ],
    },
    {
      value: 'aptitude-reasoning',
      label: 'Aptitude & Reasoning',
      subcategories: [
        { value: 'numbers', label: 'Numbers' },
        { value: 'series', label: 'Series' },
        { value: 'sequence', label: 'Sequence' },
      ],
    },
    {
      value: 'english',
      label: 'English',
      subcategories: [
        { value: 'parts-of-speech', label: 'Parts of Speech' },
        { value: 'article', label: 'Article' },
        { value: 'preposition', label: 'Preposition' },
      ],
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !category || !subcategory) {
      setError('Please select a file, category, and subcategory');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('category', category);
      formData.append('subcategory', subcategory);

      await apiService.uploadQuestions(formData);
      setSuccess('Questions uploaded successfully!');
      setSelectedFile(null);
      setCategory('');
      setSubcategory('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload questions');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategoryData = categories.find(cat => cat.value === category);

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Add Questions
        </h3>

        {error && (
          <div className="mb-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory('');
              }}
              required
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subcategory" className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Subcategory
            </label>
            <select
              id="subcategory"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              required
              disabled={!selectedCategoryData}
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm sm:text-base"
            >
              <option value="">Select subcategory</option>
              {selectedCategoryData?.subcategories.map((subcat) => (
                <option key={subcat.value} value={subcat.value}>
                  {subcat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="file" className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Excel File (.xlsx)
            </label>
            <div className="mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                <div className="flex text-xs sm:text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-1"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">Excel files up to 10MB</p>
                {selectedFile && (
                  <p className="text-xs sm:text-sm text-green-600 mt-2 break-all">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Excel Format Requirements:</h4>
            <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
              <li>• Column A: question</li>
              <li>• Column B: option1</li>
              <li>• Column C: option2</li>
              <li>• Column D: option3</li>
              <li>• Column E: option4</li>
              <li>• Column F: correctAnswer</li>
             <li>• First row should contain column headers</li>
             <li>• correctAnswer must match one of the options exactly</li>
             <li>• All fields are required for each question</li>
            </ul>
           <div className="mt-3 p-2 bg-blue-100 rounded text-xs sm:text-sm">
             <strong>Sample Excel Structure:</strong><br/>
             <div className="mt-1 font-mono text-xs break-all">
               Row 1: question | option1 | option2 | option3 | option4 | correctAnswer<br/>
               Row 2: What is 2+2? | 3 | 4 | 5 | 6 | 4
             </div>
           </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              {loading ? 'Uploading...' : 'Upload Questions'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestions;