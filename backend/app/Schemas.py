from pydantic import BaseModel
import datetime

class Persona(BaseModel):
    id:int
    nombre:str
    apellidos:str
    edad:int
    fecha_nacimiento:datetime.date

    class Config:
        orm_mode = True