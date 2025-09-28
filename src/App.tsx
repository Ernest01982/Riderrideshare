import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ServiceSelection from './components/ServiceSelection';
import RideHistory from './components/RideHistory';
import Rider from './pages/Rider';
import Payment from './pages/Payment';
import TripTracking from './pages/TripTracking';
import QuoteProvider from './features/rider/QuoteContext';

export type BookingType = 'ride' | 'package';
export type AppView = 'service-selection' | 'rider' | 'history' | 'payment';

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
    </Router>
  );
}

export default App;