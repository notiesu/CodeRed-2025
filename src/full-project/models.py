from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy import Integer, String, Text, ForeignKey, DateTime
from flask_login import UserMixin
import datetime

# SQLAlchemy base and db instance will be created in app.py

class User(UserMixin):
	id = None
	username = None
	email = None
	password = None
	documents = relationship('Document', backref='user', lazy=True)

class Document:
	id = None
	user_id = None
	filename = None
	upload_time = None
	content = None

# Example SQLAlchemy model definitions for reference (actual binding in app.py):
# class User(UserMixin, db.Model):
#     id = db.Column(Integer, primary_key=True)
#     username = db.Column(String, unique=True, nullable=False)
#     email = db.Column(String, unique=True, nullable=False)
#     password = db.Column(String, nullable=False)
#     documents = db.relationship('Document', backref='user', lazy=True)
#
# class Document(db.Model):
#     id = db.Column(Integer, primary_key=True)
#     user_id = db.Column(Integer, db.ForeignKey('user.id'), nullable=False)
#     filename = db.Column(String, nullable=False)
#     upload_time = db.Column(DateTime, default=datetime.datetime.utcnow)
#     content = db.Column(Text)
