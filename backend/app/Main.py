from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.param_functions import Depends
from pydantic.schema import encode_default
from starlette.responses import RedirectResponse
from .import Models, Schemas
from .Conexion import SessionLocal, engine
from sqlalchemy.orm import Session

Models.Base.metadata.create_all(bind=engine)

app = FastAPI()

#cors
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

@app.get("/")
def main():
    return RedirectResponse(url="/docs")

@app.get('/personas/', response_model=List[Schemas.Persona])
def get_personas(db:Session=Depends(get_db)):
    personas = db.query(Models.Persona).all()
    return personas

@app.post('/personas/', response_model=Schemas.Persona)
def create_personas(entrada:Schemas.Persona, db:Session=Depends(get_db)):
    persona = Models.Persona(nombre = entrada.nombre, apellidos = entrada.apellidos, edad = entrada.edad, fecha_nacimiento = entrada.fecha_nacimiento)
    db.add(persona)
    db.commit()
    db.refresh(persona)
    return persona

@app.put('/personas/', response_model=Schemas.Persona)
def update_personas(entrada:Schemas.Persona, db:Session=Depends(get_db)):
    persona = db.query(Models.Persona).filter_by(id=entrada.id).first()
    persona.nombre, persona.apellidos, persona.edad, persona.fecha_nacimiento = entrada.nombre, entrada.apellidos, entrada.edad, entrada.fecha_nacimiento
    db.commit()
    db.refresh(persona)
    return persona

@app.delete('/personas/', response_model=str)
def delete_personas(persona_id:int, db:Session=Depends(get_db)):
    persona = db.query(Models.Persona).filter_by(id=persona_id).first()
    db.delete(persona)
    db.commit()
    respuesta = "Eliminado exitosamente."
    return respuesta