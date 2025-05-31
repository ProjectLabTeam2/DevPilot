from flask import Blueprint, request, jsonify
from app import db
from app.models import Project, Task
from app.schemas import ProjectSchema
from flask_jwt_extended import jwt_required, get_jwt_identity

projects_bp = Blueprint('projects', __name__, url_prefix='/api/projects')

project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)

@projects_bp.route('', methods=['POST'])
@jwt_required()
def create_project():
    user_id = get_jwt_identity()
    data = request.get_json()
    data['manager_id'] = user_id
    try:
        project = project_schema.load(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    db.session.add(project)
    db.session.commit()
    return jsonify(project_schema.dump(project)), 201

@projects_bp.route('', methods=['GET'])
@jwt_required()
def list_projects():
    user_id = get_jwt_identity()
    projects = Project.query.filter_by(manager_id=user_id).all()
    return jsonify(projects_schema.dump(projects)), 200

@projects_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_project(id):
    project = Project.query.get_or_404(id)
    return jsonify(project_schema.dump(project)), 200

@projects_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_project(id):
    project = Project.query.get_or_404(id)
    data = request.get_json()

    allowed_fields = ['title', 'description']
    for field in allowed_fields:
        if field in data:
            setattr(project, field, data[field])

    db.session.commit()
    return jsonify(project_schema.dump(project)), 200


@projects_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_project(id):
    project = Project.query.get_or_404(id)

    Task.query.filter_by(project_id=project.id).delete(synchronize_session=False)

    db.session.delete(project)
    db.session.commit()
    return '', 204
