def test_create_content(client, auth_headers):
    response = client.post(
        "/api/content",
        json={
            "title": "Stranger Things",
            "content_type": "SERIES",
            "genre": "Sci-Fi",
            "duration_minutes": 50,
            "description": "Test description"
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Stranger Things"

def test_list_content(client, auth_headers):
    response = client.get(
        "/api/content",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_content_not_found(client, auth_headers):
    response = client.get(
        "/api/content/99999",
        headers=auth_headers
    )
    assert response.status_code == 404

def test_create_content_unauthorized(client):
    response = client.post(
        "/api/content",
        json={
            "title": "Test",
            "content_type": "MOVIE"
        }
    )
    assert response.status_code == 403