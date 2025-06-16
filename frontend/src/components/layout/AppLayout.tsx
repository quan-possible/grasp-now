import React from 'react';

interface AppLayoutProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  main: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  sidebar,
  header,
  main,
  rightPanel
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - 240px fixed width */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-60">
          <div className="flex-1 flex flex-col min-h-0 bg-gray-50 border-r border-gray-200">
            {sidebar}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header - 56px height */}
        <div className="relative z-10 flex-shrink-0 flex h-14 bg-white shadow-sm border-b border-gray-200">
          {header}
        </div>

        {/* Main content with optional right panel */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 flex">
            {/* Main content */}
            <div className={`flex-1 overflow-auto ${rightPanel ? 'mr-80' : ''}`}>
              <div className="relative">
                {main}
              </div>
            </div>

            {/* Right Panel - 320px width when present */}
            {rightPanel && (
              <div className="flex-shrink-0 w-80 bg-white border-l border-gray-200 overflow-y-auto">
                {rightPanel}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};