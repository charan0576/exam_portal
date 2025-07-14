import React from 'react';
import { Code, Brain, BookOpen } from 'lucide-react';

interface TestCategoriesProps {
  onCategorySelect: (category: string, subcategory: string) => void;
}

const TestCategories: React.FC<TestCategoriesProps> = ({ onCategorySelect }) => {
  const categories = [
    {
      title: 'Coding',
      icon: Code,
      color: 'bg-blue-500',
      subcategories: [
        { key: 'c', label: 'C Programming' },
        { key: 'python', label: 'Python' },
        { key: 'java', label: 'Java' },
        { key: 'web-development', label: 'Web Development' },
      ],
    },
    {
      title: 'Aptitude & Reasoning',
      icon: Brain,
      color: 'bg-green-500',
      subcategories: [
        { key: 'numbers', label: 'Numbers' },
        { key: 'series', label: 'Series' },
        { key: 'sequence', label: 'Sequence' },
      ],
    },
    {
      title: 'English',
      icon: BookOpen,
      color: 'bg-purple-500',
      subcategories: [
        { key: 'parts-of-speech', label: 'Parts of Speech' },
        { key: 'article', label: 'Article' },
        { key: 'preposition', label: 'Preposition' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Choose Your Test</h2>
        <p className="text-sm sm:text-base text-gray-600 px-4">Select a category and subcategory to begin your assessment</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {categories.map((category) => (
          <div key={category.title} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className={`${category.color} text-white p-3 sm:p-4 rounded-lg mb-4 flex items-center justify-center`}>
              <category.icon className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center sm:text-left">{category.title}</h3>
            
            <div className="space-y-2">
              {category.subcategories.map((subcategory) => (
                <button
                  key={subcategory.key}
                  onClick={() => onCategorySelect(category.title.toLowerCase().replace(' & ', '-'), subcategory.key)}
                  className="w-full text-left p-2 sm:p-3 rounded-md border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm sm:text-base"
                >
                  {subcategory.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCategories;