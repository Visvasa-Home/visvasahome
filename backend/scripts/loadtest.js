import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('error_rate');
const bookingLatency = new Trend('booking_latency');
const bookingSuccess = new Counter('booking_success');

// Load profile reflecting "high scale" VisvasaHome-style usage
export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp-up to 50 users
    { duration: '1m', target: 50 },   // Sustain 50 users (Steady load)
    { duration: '30s', target: 200 }, // Spike/Surge (Simulate massive traffic)
    { duration: '1m', target: 200 },  // Sustain Spike
    { duration: '30s', target: 0 },   // Scale down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests should be < 500ms
    'error_rate': ['rate<0.05'],        // Error rate must be less than 5%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:4000/api/v1';
const TOKEN = __ENV.AUTH_TOKEN || 'test-token';

export default function () {
  const headers = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
    'X-Tenant-ID': 'loadtest-tenant'
  };

  // 1. Health Check
  const healthRes = http.get(`http://localhost:4000/health`);
  check(healthRes, {
    'health is 200': (r) => r.status === 200,
  });

  // 2. Simulate Customer creating a Booking
  const bookingPayload = JSON.stringify({
    serviceId: "5f8a0a99-b14e-4f7d-bb91-c8b2d18476de", // Placeholder UUID
    addressId: "3e5a7b88-c21d-4a2a-aa12-d9c3e45587ef",
    bookingType: "instant",
  });

  const bookingRes = http.post(`${BASE_URL}/customer/bookings`, bookingPayload, { headers });
  
  const success = check(bookingRes, {
    'booking created (201)': (r) => r.status === 201,
  });

  if (success) {
    bookingSuccess.add(1);
    bookingLatency.add(bookingRes.timings.duration);
  } else {
    errorRate.add(1);
  }

  // Sleep between requests to simulate realistic user pacing
  sleep(Math.random() * 2 + 1); // 1-3 seconds
}
