# CRUD CON FASTAPI, SQLALCHEMY Y MYSQL

## PASOS PARA INSTALAR
0. Si no tienes el pip instalado, instalarlo
```
 python -m pip install --upgrade pip

```

1. Crear un ambiente virtual con Python donde "env" es el nombre del virtual enviroment
```
python -m venv env 

```
2. Activar el ambiente virtual. Si usas vscode, puede hacer que se ejecute en la terminal con clic derecho > ejecutar en la terminal.
```
& env/Scripts/activate

```
3. Instalar las librerías necesarias que se encuentran en el archivo requirements.txt
```
pip install -r requirements.txt

```

## DESPLEGANDO EL AMBIENTE
```
uvicorn app.Main:app --reload

```
* main es el nombre del archivo main.py
* app es el nombre de la variable de FASTAPI inicializada en el archivo main

