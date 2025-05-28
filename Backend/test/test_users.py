import pytest
from app import create_app, db
from app.models import User

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client

def test_register_and_login(client):
    # Registro
    resp = client.post('/api/users/register', json={'username':'test','email':'test@test.com','password':'123456'})
    assert resp.status_code == 201
    # Login
    resp = client.post('/api/users/login', json={'username':'test','password':'123456'})
    assert 'access_token' in resp.get_json()