/**
 * Demo Banner Component
 * Displays demo credentials and information
 */

import { Info } from 'lucide-react';

export function DemoBanner() {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  
  if (!isDemoMode) return null;

  const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL || 'demo@example.com';
  const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD || 'DemoPassword123';

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Demo Environment
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            This is a demonstration environment with sample data. Feel free to explore all features!
          </p>
          <div className="bg-white rounded border border-blue-200 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Email:</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">
                {demoEmail}
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Password:</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">
                {demoPassword}
              </code>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-3">
            ⚠️ All data is reset periodically. Do not store sensitive information.
          </p>
        </div>
      </div>
    </div>
  );
}
