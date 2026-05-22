import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        gutter={8}
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--surface-3)',
            color: 'var(--text)',
            border: '1px solid var(--border-2)',
            borderRadius: '12px',
            fontSize: '13px',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: 'var(--surface-3)' },
            style: {
              borderColor: 'rgba(16,185,129,.25)',
            },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: 'var(--surface-3)' },
            style: {
              borderColor: 'rgba(239,68,68,.25)',
            },
          },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
