import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Sector
          </h1>
          <p className="text-xl text-gray-300">
            Universal Intelligent Learning & Coding Assistant
          </p>
        </header>
        
        <main className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">🚀 Welcome to the Future of Learning</h2>
            <p className="text-gray-300 mb-6">
              Sector is an advanced platform that combines AI-powered assistance, interactive visualizations, 
              and contextual learning to revolutionize how you learn programming, compilers, ML, and AI.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">🤖 AI-Powered Learning</h3>
                <p className="text-gray-300">
                  Get instant help with your code, explanations of complex concepts, and personalized learning paths.
                </p>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">🎨 Interactive Visualizations</h3>
                <p className="text-gray-300">
                  See code execution in real-time, visualize data structures, and understand compiler internals.
                </p>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">📚 Context-Aware AI</h3>
                <p className="text-gray-300">
                  Upload documents and get AI responses that understand your specific context and materials.
                </p>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">💻 Multi-Platform</h3>
                <p className="text-gray-300">
                  Work seamlessly across web, VS Code, and desktop applications.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              🚧 This is a development preview. Full features coming soon!
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                Get Started
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
