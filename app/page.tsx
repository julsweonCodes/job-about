import React from "react";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-clip-text md:text-2xl">job:about</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 pt-20 pb-32 px-5 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-5 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-8">
              One-Click Apply Service
            </div>
            <h1 className="text-3xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Personal
              <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Job Find Helper
              </span>
            </h1>
            <p className="text-lg  md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Get personalized job recommendations.
            </p>
            <div className="mt-4">
              <button className="w-full flex items-center justify-center border-2 border-gray-300 text-gray-700 px-6 py-3 md:px-8 md:py-4 rounded-full text-lg font-semibold md:text-xl hover:shadow-xl transform transition-all duration-300">
                <img src="/icons/icon-google.svg" alt="Google" className="w-6 h-6 md:w-8 md:h-8" />
                <span className="ml-2">Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-5 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <div className="flex md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-8 md:mb-0">
              <span className="text-xl font-bold md:text-2xl">job:about</span>
            </div>
          </div>
          <div className="border-t border-gray-800 md:mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Grit200.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
