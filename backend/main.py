from fastapi import Depends, FastAPI, HTTPException
from pydantic import Field, BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import DeclarativeBase, Session
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import sessionmaker

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "sqlite:///./todos.db"
engine = create_engine(DATABASE_URL)
class Base(DeclarativeBase):
    pass

SessionLocal = sessionmaker(bind=engine)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    date = Column(String, nullable=False)

class TodoCreate(BaseModel):
    text: str = Field(min_length=1, max_length=200)
    date: str

class TodoUpdate(BaseModel):
    text: str | None = Field(default=None, max_length=200)
    completed: bool | None = Field(default=None)
    date: str | None = Field(default=None)
    
class TodoResponse(BaseModel):
    id: int
    text: str
    completed: bool
    date: str
    model_config = {"from_attributes": True}

Base.metadata.create_all(bind=engine)

@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # TodoUpdate에서 None 아닌 필드만 반영
    if todo.text is not None:
        db_todo.text = todo.text
    if todo.completed is not None:
        db_todo.completed = todo.completed
    if todo.date is not None:
        db_todo.date = todo.date

    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.delete("/todos/{todo_id}", response_model=TodoResponse)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    db.delete(db_todo)
    db.commit()
    return db_todo

@app.get("/todos", response_model=list[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    return db.query(Todo).all()

@app.post("/todos", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = Todo(text=todo.text, completed=False, date=todo.date)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.get("/")
def root():
    return {"message": "hello"}