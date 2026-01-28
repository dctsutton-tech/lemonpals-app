
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { DataMigrationRunner } from '@/lib/DataMigrationRunner';
import { verifyConnection } from '@/lib/SupabaseConnectionVerifier';
import { AlertCircle, RefreshCw, Settings, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Pages
import PublicLandingPage from '@/pages/PublicLandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import PasswordResetForm from '@/components/PasswordResetForm';
import FAQPage from '@/pages/FAQPage';
import LiabilityDisclaimerPage from '@/pages/LiabilityDisclaimerPage';
import CancellationPolicyPage from '@/pages/CancellationPolicyPage';

// Payment Pages
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
import PaymentCancelPage from '@/pages/PaymentCancelPage';
import BookingDetailsPage from '@/pages/BookingDetailsPage';

// Customer Pages
import CustomerDashboard from '@/pages/CustomerDashboard';
import CustomerJobDetail from '@/pages/CustomerJobDetail';
import CustomerLiveTracking from '@/pages/CustomerLiveTracking';
import ReceiptHistoryPage from '@/pages/ReceiptHistoryPage';

// Technician Pages
import TechnicianDashboard from '@/pages/TechnicianDashboard';
import TechnicianJobDetail from '@/pages/TechnicianJobDetail';
import TechnicianProfile from '@/pages/TechnicianProfile';
import TechnicianLiveTracking from '@/pages/TechnicianLiveTracking';
import JobDiscovery from '@/pages/JobDiscovery';
import TechnicianEarningsPage from '@/pages/TechnicianEarningsPage';
import NotificationHistoryPage from '@/pages/NotificationHistoryPage';
import ReceiptViewer from '@/pages/ReceiptViewer';
import TechnicianPayoutPreferencesPage from '@/pages/TechnicianPayoutPreferencesPage';

// Admin Pages
import AdminDashboard from '@/pages/AdminDashboard';
import AdminJobReview from '@/pages/AdminJobReview';
import AdminJobDetail from '@/pages/AdminJobDetail';
import AdminTechnicianManagement from '@/pages/AdminTechnicianManagement';
import AdminPayoutRequestsPage from '@/pages/AdminPayoutRequestsPage';
import LiveChatDashboard from '@/pages/LiveChatDashboard';
import AdminJobApprovalPage from '@/pages/AdminJobApprovalPage';
import AdminPayoutManagementPage from '@/pages/AdminPayoutManagementPage';
import AdminServiceHistoryPage from '@/pages/AdminServiceHistoryPage';

function App() {
  const [connectionStatus, setConnectionStatus] = useState({ 
    checked: false, 
    success: false, 
    message: '',
    details: []
  });

  const runConnectionCheck = async () => {
    setConnectionStatus(prev => ({ ...prev, checked: false }));
    const result = await verifyConnection();
    setConnectionStatus({
      checked: true,
      success: result.success,
      message: result.message,
      details: result.details
    });

    if (result.success) {
      try {
        DataMigrationRunner.runFullMigration();
      } catch (e) {
        console.warn('[App] Migration runner encountered an error:', e);
      }
    }
  };

  useEffect(() => {
    runConnectionCheck();
  }, []);

  if (!connectionStatus.checked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
           <p className="text-gray-600">Connecting to services...</p>
        </div>
      </div>
    );
  }

  // Critical Error Screen - Connection Failed
  if (!connectionStatus.success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-red-600 p-4 flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-white" />
          </div>
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900 text-center mb-2">Service Connection Failed</h1>
            <p className="text-gray-600 text-center mb-6">{connectionStatus.message}</p>
            
            <div className="bg-gray-100 rounded p-4 mb-6 text-sm font-mono overflow-auto max-h-40">
              <p className="font-bold text-gray-700 mb-1">Details:</p>
              <ul className="list-disc pl-4 space-y-1">
                {connectionStatus.details.map((detail, idx) => (
                  <li key={idx} className="text-gray-600 break-words">{detail}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <div className="flex items-start">
                   <Settings className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                   <div>
                     <h3 className="text-sm font-medium text-blue-900">How to Fix</h3>
                     <p className="text-xs text-blue-700 mt-1">
                       1. Open the file <code>.env</code> in the project root.<br/>
                       2. Ensure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> are set correctly.<br/>
                       3. Restart the development server.
                     </p>
                   </div>
                </div>
              </div>
              
              <Button 
                onClick={runConnectionCheck} 
                className="w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" /> Retry Connection
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
          <Header />
          <div className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/password-reset" element={<PasswordResetForm />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/liability" element={<LiabilityDisclaimerPage />} />
              <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />

              {/* Payment Flow Routes - Publicly Accessible for Redirects */}
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/payment-cancel" element={<PaymentCancelPage />} />
              
              {/* Booking Flow */}
              <Route 
                path="/booking-details" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <BookingDetailsPage />
                  </ProtectedRoute>
                } 
              />

              {/* Customer Routes */}
              <Route 
                path="/customer/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customer/jobs/:id" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerJobDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customer/tracking/:jobId" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerLiveTracking />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/receipt-history" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <ReceiptHistoryPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customer/receipts" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <ReceiptHistoryPage />
                  </ProtectedRoute>
                } 
              />

              {/* Technician Routes */}
              <Route 
                path="/technician/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['technician']}>
                    <TechnicianDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/technician/profile" 
                element={
                  <ProtectedRoute allowedRoles={['technician']}>
                    <TechnicianProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/technician/discovery" 
                element={
                  <ProtectedRoute allowedRoles={['technician']}>
                    <JobDiscovery />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/technician/jobs/:id" 
                element={
                  <ProtectedRoute allowedRoles={['technician']}>
                    <TechnicianJobDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/technician/tracking/:jobId" 
                element={
                  <ProtectedRoute allowedRoles={['technician']}>
                    <TechnicianLiveTracking />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/technician/earnings" 
                element={
                  <ProtectedRoute allowedRoles={['technician']}>
                    <TechnicianEarningsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/technician/scan-receipt" 
                element={
                  <ProtectedRoute allowedRoles={['technician']}>
                    <ReceiptViewer />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notification-history" 
                element={
                  <ProtectedRoute allowedRoles={['technician']}>
                    <NotificationHistoryPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/technician/payout-preferences" 
                element={
                  <ProtectedRoute allowedRoles={['technician']}>
                    <TechnicianPayoutPreferencesPage />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/jobs/:id" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminJobDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/jobs-review" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminJobReview />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/customer-services" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminServiceHistoryPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/technicians" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminTechnicianManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/payout-requests" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPayoutRequestsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/live-chat" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <LiveChatDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/job-approvals" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminJobApprovalPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/payouts" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPayoutManagementPage />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
