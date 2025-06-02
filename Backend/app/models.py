from datetime import datetime
from app import db
from werkzeug.security import generate_password_hash, check_password_hash

project_members = db.Table('project_members',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('project_id', db.Integer, db.ForeignKey('projects.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    managed_projects = db.relationship('Project', back_populates='manager', lazy=True)
    invited_projects = db.relationship(
        'Project',
        secondary=project_members,
        back_populates='members',
        lazy='dynamic'
    )
    tasks = db.relationship('Task', back_populates='owner', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(140), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    manager_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    manager = db.relationship('User', back_populates='managed_projects', foreign_keys=[manager_id])
    members = db.relationship(
        'User',
        secondary=project_members,
        back_populates='invited_projects',
        lazy='dynamic'
    )

    tasks = db.relationship(
        'Task',
        back_populates='project',
        lazy=True,
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    @property
    def all_users(self):
        # Retorna lista sin duplicados de manager + miembros
        return list({user.id: user for user in [self.manager] + list(self.members)}.values())

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='pending')
    priority = db.Column(db.String(20), default='medium')
    due_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    project_id = db.Column(
        db.Integer,
        db.ForeignKey('projects.id', ondelete='CASCADE'),
        nullable=False
    )
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    owner = db.relationship('User', back_populates='tasks', lazy=True)
    project = db.relationship('Project', back_populates='tasks', lazy=True)
