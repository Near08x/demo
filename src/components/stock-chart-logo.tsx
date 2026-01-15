// Stock Chart Logo Component - Used across the app
export const StockChartLogo = ({ width = 100, height = 100 }: { width?: number; height?: number }) => (
  <svg width={width} height={height} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="12" fill="#3b82f6" fillOpacity="0.1"/>
    <path d="M20 75 L30 65 L40 55 L50 45 L60 35 L70 40 L80 25" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M20 75 L30 65 L40 55 L50 45 L60 35 L70 40 L80 25 L80 75 L20 75 Z" fill="url(#gradient)" fillOpacity="0.3"/>
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
      </linearGradient>
    </defs>
    <circle cx="30" cy="65" r="3" fill="#3b82f6"/>
    <circle cx="50" cy="45" r="3" fill="#3b82f6"/>
    <circle cx="70" cy="40" r="3" fill="#3b82f6"/>
    <circle cx="80" cy="25" r="3" fill="#10b981"/>
  </svg>
);
