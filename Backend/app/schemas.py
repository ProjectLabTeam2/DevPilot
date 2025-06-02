from app import ma
from marshmallow import fields, validate, post_load
from app.models import User, Project, Task

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ("password_hash",)

    password = fields.String(load_only=True, required=True, validate=validate.Length(min=6))

class ProjectSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Project
        load_instance = True

    manager = fields.Nested(UserSchema(only=("id", "username")), dump_only=True)
    members = fields.List(fields.Nested(UserSchema(only=("id", "username"))))
    all_users = fields.List(fields.Nested(UserSchema(only=("id", "username"))), dump_only=True)



class TaskSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Task
        load_instance = True

    project_id = fields.Int(required=True)
    owner_id = fields.Int()
    project = fields.Nested(ProjectSchema, only=("id", "title"))
    owner = fields.Nested(UserSchema, only=("id", "username"))
    status = fields.String(validate=validate.OneOf(["pending", "in_progress", "done"]))
    priority = fields.String(validate=validate.OneOf(["low", "medium", "high"]))
    due_date = fields.Date(allow_none=True)

    @post_load
    def set_default_owner(self, data, **kwargs):
        return data
