from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.sql.functions import user
from sqlalchemy.sql.sqltypes import INTEGER
from .Conexion import Base

class Persona(Base):
    __tablename__ ="tabla_personas"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100))
    apellidos = Column(String(100))
    edad = Column(Integer)
    fecha_nacimiento = Column(Date)