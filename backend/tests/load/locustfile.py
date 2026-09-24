from locust import HttpUser, task, between
import uuid
import json

class CustomerUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        # We assume JWT token based auth if gateway is used,
        # but since we hit microservices directly in local testing, we pass x-user-id header.
        self.user_id = str(uuid.uuid4())
        self.headers = {
            "x-user-id": self.user_id,
            "x-user-role": "CUSTOMER",
            "Content-Type": "application/json"
        }
        
    @task(3)
    def browse_catalog(self):
        # Hits catalog-service
        with self.client.get("http://localhost:8001/catalog/categories", headers=self.headers, catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed to fetch categories: {response.status_code}")
                
    @task(1)
    def create_instant_booking(self):
        # Hits booking-service
        payload = {
            "service_package_id": "42a4fbd3-115b-4364-bb85-2f03e793e455", # Hardcoded from seed
            "address_id": "00000000-0000-0000-0000-000000000000",
            "scheduled_time": None,
            "is_instant": True
        }
        with self.client.post("http://localhost:8002/bookings", headers=self.headers, data=json.dumps(payload), catch_response=True) as response:
            # We expect a 404 Address Not Found since address_id is dummy, but we just want to load test the endpoint
            # In a real load test, we'd create an address first.
            if response.status_code in [200, 201, 404]:
                response.success()
            else:
                response.failure(f"Failed to create booking: {response.status_code}")
