def test_create_rights(client, auth_headers):
    content = client.post(
        "/api/content",
        json={
            "title": "Test Show",
            "content_type": "SERIES",
            "genre": "Drama"
        },
        headers=auth_headers
    )
    content_id = content.json()["id"]

    response = client.post(
        "/api/rights",
        json={
            "content_id": content_id,
            "licensee": "JioSTAR",
            "territory": "India",
            "platform": "OTT",
            "start_date": "2024-01-01",
            "end_date": "2024-12-31",
            "is_exclusive": True
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["licensee"] == "JioSTAR"

def test_check_availability(client, auth_headers):
    content = client.post(
        "/api/content",
        json={
            "title": "Another Show",
            "content_type": "MOVIE",
            "genre": "Action"
        },
        headers=auth_headers
    )
    content_id = content.json()["id"]

    response = client.post(
        "/api/rights/check-availability",
        json={
            "content_id": content_id,
            "territory": "India",
            "platform": "OTT",
            "check_date": "2025-06-15"
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    assert "available" in response.json()