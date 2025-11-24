import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { validateConfig, CONFIG } from '@/shared/constants/config';
import './App.css';

// Lazy load pages
import { Dashboard } from '@/features/customers/pages/Dashboard';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

function App() {
  useEffect(() => {
    // Validate configuration on mount
    const { valid, errors } = validateConfig();
    if (!valid) {
      console.error('❌ Configuration errors:', errors);
      errors.forEach((error) => console.error(`  - ${error}`));
    } else {
      console.log('✅ Configuration valid');
    }

    // Log app info
    console.log(`🚀 ${CONFIG.APP.NAME} v${CONFIG.APP.VERSION}`);
    console.log(`🌍 Environment: ${CONFIG.APP.ENV}`);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
