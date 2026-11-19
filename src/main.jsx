import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// No StrictMode: the hero streams a 1.5 MB model and builds 66k dots once.
createRoot(document.getElementById('root')).render(<App />);
