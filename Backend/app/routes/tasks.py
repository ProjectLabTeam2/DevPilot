from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
from app import db
from app.models import Task, Project, User
from app.schemas import TaskSchema

tasks_bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)

@tasks_bp.route('', methods=['POST'])
@jwt_required()
def create_task():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data or 'project_id' not in data:
        return jsonify({'msg': 'project_id es requerido'}), 400

    project = Project.query.get(data['project_id'])
    if not project:
        return jsonify({'msg': 'Proyecto no encontrado'}), 404

    if user_id != project.manager_id:
        return jsonify({'msg': 'Solo el manager puede crear tareas en este proyecto'}), 403

    owner_id = data.get('owner_id')
    if owner_id:
        if owner_id not in [u.id for u in project.members]:
            return jsonify({'msg': 'El usuario asignado a la tarea no es miembro del proyecto'}), 400
    else:
        owner_id = project.manager_id

    try:
        task_data = {**data, 'owner_id': owner_id}
        task = task_schema.load(task_data)
        db.session.add(task)
        db.session.commit()
        return jsonify(task_schema.dump(task)), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'msg': 'Error al crear la tarea', 'error': str(e)}), 500

@tasks_bp.route('', methods=['GET'])
@jwt_required()
def list_tasks():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    managed_projects_ids = [p.id for p in Project.query.filter_by(manager_id=user_id).all()]
    invited_projects_ids = [p.id for p in user.invited_projects]

    if managed_projects_ids:
        tasks = Task.query.filter(Task.project_id.in_(managed_projects_ids)).all()
    else:
        tasks = Task.query.filter(Task.owner_id == user_id, Task.project_id.in_(invited_projects_ids)).all()

    return jsonify(tasks_schema.dump(tasks)), 200

@tasks_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_task(id):
    user_id = int(get_jwt_identity())
    task = Task.query.get_or_404(id)

    if task.owner_id != user_id and user_id not in [u.id for u in task.project.members]:
        return jsonify({'msg': 'No autorizado para ver esta tarea'}), 403

    return jsonify(task_schema.dump(task)), 200

@tasks_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_task(id):
    user_id = int(get_jwt_identity())
    task = Task.query.get_or_404(id)

    project = task.project
    is_manager = (user_id == project.manager_id)
    is_owner = (user_id == task.owner_id)

    data = request.get_json()

    if is_manager:
        try:
            for field, val in data.items():
                if hasattr(task, field):
                    if field == 'owner_id':
                        if val not in [u.id for u in project.members]:
                            return jsonify({'msg': 'El nuevo usuario asignado no es miembro del proyecto'}), 400
                    setattr(task, field, val)
            db.session.commit()
            return jsonify(task_schema.dump(task)), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al actualizar la tarea', 'error': str(e)}), 500

    elif is_owner:
        if 'status' in data:
            if data['status'] not in ["pending", "in_progress", "done"]:
                return jsonify({'msg': 'Estado inválido'}), 400
            task.status = data['status']
            db.session.commit()
            return jsonify(task_schema.dump(task)), 200
        else:
            return jsonify({'msg': 'Solo puede actualizar el estado de la tarea'}), 403

    else:
        return jsonify({'msg': 'No autorizado para actualizar esta tarea'}), 403

@tasks_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_task(id):
    user_id = int(get_jwt_identity())
    task = Task.query.get_or_404(id)

    if user_id != task.project.manager_id:
        return jsonify({'msg': 'No autorizado para eliminar esta tarea'}), 403

    try:
        db.session.delete(task)
        db.session.commit()
        return '', 204
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'msg': 'Error al eliminar la tarea', 'error': str(e)}), 500
