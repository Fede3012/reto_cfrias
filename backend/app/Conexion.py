from sqlalchemy import create_engine, engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql://u7qaemfmtcb7eamb:Ha81vMMyDuiEVCfsGuZo@b9gil1ftjsymwwykt1ex-mysql.services.clever-cloud.com:3306/b9gil1ftjsymwwykt1ex"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base = declarative_base()