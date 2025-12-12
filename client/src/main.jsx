import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Home from './Components/Home/Home';
import SignIn from './Components/SingIn/SignIN';
import { Provider } from 'react-redux';  
import { PersistGate } from 'redux-persist/integration/react';  
import { store, persistor } from './Redux/Store/Store';  
import SignUp from './Components/SingUP/SignUP';
import Dashboard from './Components/Dashboard/Dashboard';


// Define your routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,  
    children: [
      { path: '', element: <Home /> },
      { path: 'login', element: < SignIn/> },
      { path: 'register', element: < SignUp/> },
      { path: 'dashboard', element: < Dashboard/> },

      
      
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
