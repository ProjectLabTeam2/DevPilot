from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
from app import db
from app.models import Task, Project
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

    if int(project.manager_id) != user_id:
        return jsonify({'msg': 'No autorizado para agregar tareas en este proyecto'}), 403

    try:
        task = task_schema.load({**data, 'owner_id': user_id})
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
    tasks = Task.query.filter_by(owner_id=user_id).all()
    return jsonify(tasks_schema.dump(tasks)), 200

@tasks_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_task(id):
    user_id = int(get_jwt_identity())
    task = Task.query.get_or_404(id)

    if int(task.owner_id) != user_id:
        return jsonify({'msg': 'No autorizado para ver esta tarea'}), 403

    return jsonify(task_schema.dump(task)), 200

@tasks_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_task(id):
    user_id = int(get_jwt_identity())
    task = Task.query.get_or_404(id)

    if int(task.owner_id) != user_id:
        return jsonify({'msg': 'No autorizado para editar esta tarea'}), 403

    data = request.get_json()

    try:
        for field, val in data.items():
            if hasattr(task, field):
                setattr(task, field, val)
        db.session.commit()
        return jsonify(task_schema.dump(task)), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'msg': 'Error al actualizar la tarea', 'error': str(e)}), 500

@tasks_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_task(id):
    user_id = int(get_jwt_identity())
    task = Task.query.get_or_404(id)

    if int(task.owner_id) != user_id:
        return jsonify({'msg': 'No autorizado para eliminar esta tarea'}), 403

    try:
        db.session.delete(task)
        db.session.commit()
        return '', 204
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'msg': 'Error al eliminar la tarea', 'error': str(e)}), 500
    