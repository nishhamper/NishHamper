  // src/App.js
  import React from 'react';
  import { BrowserRouter as Router } from 'react-router-dom';
  import AppRoutes from './routes/AppRoutes';
  import Navbar from './components/Navbar';
  import { useLocation } from 'react-router-dom';
  import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles!
  import Footer from './components/Footer'; // Import Footer component

  const AppContent = () => {
    const location = useLocation();
  
    // ✅ Check if route starts with "/admin"
    const isAdminRoute = location.pathname.startsWith('/admin');
  
    return (
      <>
        {/* Only show Navbar/Footer if not in admin route */}
        {!isAdminRoute && <Navbar />}
        
        <AppRoutes />
  
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
  
        {!isAdminRoute && <Footer />}
      </>
    );
  };
  

  function App() {
    return (
      <Router>
        <AppContent />
      </Router>
    );
  }

  export default App;
