import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ServiceSelection from './components/ServiceSelection';
import RideHistory from './components/RideHistory';
import Rider from './pages/Rider';
import Payment from './pages/Payment';
import TripTracking from './pages/TripTracking';
import QuoteProvider from './features/rider/QuoteContext';

export type BookingType = 'ride' | 'package';
export type AppView = 'service-selection' | 'rider' | 'history' | 'payment';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
        <p className="text-gray-600">We're sorry, but something unexpected happened.</p>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>('service-selection');
  const [selectedService, setSelectedService] = useState<BookingType>('ride');

  const handleServiceSelect = (service: BookingType) => {
    setSelectedService(service);
    setCurrentView('rider');
  };

  const handleViewHistory = () => setCurrentView('history');

  const handleBackFromRider = () => setCurrentView('service-selection');

  const handleGoToPayment = () => setCurrentView('payment');

  const handleBackFromPayment = () => setCurrentView('rider');

  const handlePaymentComplete = () => {
    // Navigate to trip tracking - in a real app, you'd get the quote ID from payment context
    const mockQuoteId = 'mock-quote-' + Date.now();
    window.location.href = `/trip?quoteId=${mockQuoteId}`;
  };

  return (
    <Router>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <QuoteProvider>
          <Routes>
            <Route path="/trip" element={<TripTracking />} />
            <Route path="/*" element={
              <>
                {currentView === 'service-selection' && (
                  <ServiceSelection
                    onServiceSelect={handleServiceSelect}
                    onViewHistory={handleViewHistory}
                  />
                )}

                {currentView === 'rider' && (
                  <Rider
                    serviceType={selectedService}
                    onBack={handleBackFromRider}
                    onGoToPayment={handleGoToPayment}
                  />
                )}

                {currentView === 'history' && <RideHistory onBack={handleBackFromRider} />}

                {currentView === 'payment' && (
                  <Payment
                    onBack={handleBackFromPayment}
                    onPaymentComplete={handlePaymentComplete}
                  />
                )}
              </>
            } />
          </Routes>
        </QuoteProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;