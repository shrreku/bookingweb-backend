from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import List
import jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database
users_db = {}
appointments_db = []

# JWT settings
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class User(BaseModel):
    username: str
    password: str

class Appointment(BaseModel):
    id: int
    user_id: str
    service: str
    date: str
    time: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Helper functions
def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# Routes
@app.post("/register", response_model=Token)
async def register(user: User):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    users_db[user.username] = user.password
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or user != form_data.password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/appointments", response_model=Appointment)
async def create_appointment(appointment: Appointment, current_user: str = Depends(get_current_user)):
    appointment.user_id = current_user
    appointment.id = len(appointments_db) + 1
    appointments_db.append(appointment)
    return appointment

@app.get("/appointments", response_model=List[Appointment])
async def get_appointments(current_user: str = Depends(get_current_user)):
    return [apt for apt in appointments_db if apt.user_id == current_user]

@app.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: int, current_user: str = Depends(get_current_user)):
    for i, apt in enumerate(appointments_db):
        if apt.id == appointment_id and apt.user_id == current_user:
            del appointments_db[i]
            return {"message": "Appointment deleted successfully"}
    raise HTTPException(status_code=404, detail="Appointment not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)