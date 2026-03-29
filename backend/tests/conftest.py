import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def auth_token(client):
    client.post("/api/auth/register", json={
        "email": "testuser@test.com",
        "username": "testuser",
        "password": "password123"
    })
    response = client.post("/api/auth/login", json={
        "email": "testuser@test.com",
        "password": "password123"
    })
    return response.json()["access_token"]

@pytest.fixture
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}