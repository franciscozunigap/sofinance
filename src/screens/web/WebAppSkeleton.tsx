import React from 'react';

const AppSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Skeleton */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="ml-3 w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* User Info Skeleton */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section Skeleton */}
        <div className="mb-8">
          <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="w-96 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Chart Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Balance Chart Skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Recent Transactions Skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-40 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Analysis Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse"></div>
                <div className="w-12 h-6 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Section Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div>
                    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Navigation Skeleton */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2 bg-white rounded-full p-2 shadow-lg">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppSkeleton;