from flask import Blueprint, request, jsonify
from app import db
from app.models import Project, User
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

    project = Project(
        title=data.get('title'),
        description=data.get('description'),
        manager_id=user_id
    )

    db.session.add(project)
    db.session.commit()

    project.members.append(User.query.get(user_id))
    db.session.commit()

    return jsonify(project_schema.dump(project)), 201

from app.models import Project


@projects_bp.route('', methods=['GET'])
@jwt_required()
def list_projects():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    managed_projects = Project.query.filter_by(manager_id=user_id).all()
    invited_projects = user.invited_projects.filter(Project.manager_id != user_id).all()

    all_projects = managed_projects + invited_projects
    return jsonify(projects_schema.dump(all_projects)), 200

@projects_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_project(id):
    user_id = get_jwt_identity()
    project = Project.query.get_or_404(id)

    if project.manager_id != int(user_id) and not project.members.filter_by(id=user_id).first():
        return jsonify({'msg': 'No autorizado para ver este proyecto'}), 403

    project_data = project_schema.dump(project)
    project_data['is_manager'] = (project.manager_id == int(user_id))
    return jsonify(project_data), 200



@projects_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_project(id):
    user_id = get_jwt_identity()
    project = Project.query.get_or_404(id)
    print(f"🧪 PUT llamado por user_id: {user_id}")

    if project.manager_id != int(user_id):
        return jsonify({'msg': 'No autorizado para actualizar este proyecto'}), 403

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
    user_id = get_jwt_identity()
    project = Project.query.get_or_404(id)
    print(f"🧪 PUT llamado por user_id: {user_id}")

    if project.manager_id != int(user_id):
        return jsonify({'msg': 'No autorizado para eliminar este proyecto'}), 403

    db.session.delete(project)
    db.session.commit()
    return jsonify({'message': 'Proyecto y tareas eliminados correctamente'}), 200

@projects_bp.route('/<int:id>/invite', methods=['POST'])
@jwt_required()
def invite_users(id):
    current_user_id = get_jwt_identity()
    project = Project.query.get_or_404(id)

    if project.manager_id != int(current_user_id):
        return jsonify({'msg': 'Solo el manager puede invitar usuarios'}), 403

    data = request.get_json()
    if not data:
        return jsonify({'msg': 'Datos requeridos'}), 400


    user_ids = data.get('user_ids')
    if user_ids is None:

        user_id = data.get('user_id')
        if user_id is None:
            return jsonify({'msg': 'user_ids o user_id es requerido'}), 400
        user_ids = [user_id]
    invited_users = []
    already_members = []
    not_found = []

    for uid in user_ids:
        user = User.query.get(uid)
        if not user:
            not_found.append(uid)
            continue
        if user in project.members or user.id == project.manager_id:
            already_members.append(user.username)
            continue
        project.members.append(user)
        invited_users.append(user.username)

    if invited_users:
        db.session.commit()

    msg = {}
    if invited_users:
        msg['invitados'] = f"Usuarios invitados: {', '.join(invited_users)}"
    if already_members:
        msg['ya_miembros'] = f"Ya miembros: {', '.join(already_members)}"
    if not_found:
        msg['no_encontrados'] = f"No encontrados: {', '.join(map(str, not_found))}"

    return jsonify(msg), 200