import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'
import { initAnalytics } from '@core/analytics/analytics'


// Set GA4 consent defaults before any tracking fires
window.dataLayer = window.dataLayer || [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).gtag = function (...args: unknown[]) { window.dataLayer.push(args); };
(window as any).gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  wait_for_update: 2000,
});

// Initialize GA4 only if user has already consented (returning visitors)
initAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
