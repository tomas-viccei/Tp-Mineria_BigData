import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { RecordsProvider } from './context/RecordsContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './views/Dashboard';
import { Tactos } from './views/Tactos';
import { Pariciones } from './views/Pariciones';
import { Registros } from './views/Registros';

function App() {
  return (
    <RecordsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tactos" element={<Tactos />} />
            <Route path="pariciones" element={<Pariciones />} />
            <Route path="registros" element={<Registros />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #10b981',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #ef4444',
            },
          },
        }}
      />
    </RecordsProvider>
  );
}

export default App;
