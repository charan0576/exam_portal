import React, { useState } from 'react';
import Header from '../Layout/Header';
import TestCategories from './TestCategories';
import TestInstructions from './TestInstructions';
import TestInterface from './TestInterface';
import Results from './Results';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState<'categories' | 'instructions' | 'test'>('categories');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  const tabs = [
    { key: 'home', label: 'Home' },
    { key: 'assessment', label: 'Assessment' },
  ];

  const handleCategorySelect = (category: string, subcategory: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setCurrentView('instructions');
  };

  const handleStartTest = () => {
    setCurrentView('test');
  };

  const handleTestComplete = (result: any) => {
    setTestResult(result);
    setCurrentView('categories');
    setActiveTab('assessment');
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory('');
    setSelectedSubcategory('');
  };

  const renderContent = () => {
    if (activeTab === 'assessment') {
      return <Results />;
    }

    if (currentView === 'test') {
      return (
        <TestInterface
          category={selectedCategory}
          subcategory={selectedSubcategory}
          onTestComplete={handleTestComplete}
          onBack={handleBackToCategories}
        />
      );
    }

    if (currentView === 'instructions') {
      return (
        <TestInstructions
          category={selectedCategory}
          subcategory={selectedSubcategory}
          onStartTest={handleStartTest}
          onBack={handleBackToCategories}
        />
      );
    }

    return <TestCategories onCategorySelect={handleCategorySelect} />;
  };

  if (currentView === 'test') {
    return (
      <TestInterface
        category={selectedCategory}
        subcategory={selectedSubcategory}
        onTestComplete={handleTestComplete}
        onBack={handleBackToCategories}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {testResult && (
          <div className="mb-4 sm:mb-8 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <div className="text-green-600 font-semibold text-sm sm:text-base">Test Completed!</div>
              <div className="text-green-600 text-sm sm:text-base">
                Score: {testResult.score}/{30} ({testResult.percentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default StudentDashboard;