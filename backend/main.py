from fastapi import FastAPI, Path
from typing import Optional
from pydantic import BaseModel
from uuid import UUID, uuid4
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()

origins = [
    "http://localhost:5173",
    "localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TodoItem(BaseModel):
    id: UUID
    task: str
    completed: bool = False

class UpdateTodo(BaseModel):
    id: Optional[UUID] = None
    task: Optional[int] = None
    completed: Optional[bool] = None
    
todos = {}

# get todo items 
@app.get('/todos/all')
def get_all_todos():
    print(todos)
    return list(todos.values())

# get todo items using their IDs
@app.get('/todos/get/{id}')
def get_todo(id: UUID):
    if id not in todos:
        return {"Error":"Task does not exist!"}
    return todos[id]

# add a new todo item
@app.post('/todos')
def post_todo(todo: TodoItem):
    global new_todo
    todo.id = new_todo 
    todos[new_todo] = todo
    new_todo += 1 
    return {
        "data": { "Todo added successfully!" }
    }

# update todo
@app.put("/todos/edit/{id}")
async def update_todo(id: UUID, todo: UpdateTodo):
    if id not in todos:
        return {"Error":"ID does not exist!"}

    if todo.task != None:
        todos[id].task = todo.task
    if todo.completed != None:
        todos[id].completed = todo.completed
    
    return todos[id]

# delete todo
@app.delete("/todos/delete_by_task")
def delete_todo_by_task(task: str):
    for todo_id, todo in list(todos.items()):  
        if todo.task == task:
            del todos[todo_id]
            return {"Msg": "Todo item with task '{task}' has been deleted successfully!"}
    return {"Error": "Todo item with task '{task}' does not exist!"}

# delete todo using its ID
@app.delete("/todos/delete/{id}")
async def delete_todo(id: UUID):
    if id not in todos:
        return {"Error":"ID does not exist!"}
    del todos[id]
    return {"Msg": "Todo item has been deleted successfully!"}

# delete ALL todos
@app.delete("/todos/delete_all")
def delete_all_todos():
    todos.clear()
    return {"Msg": "Todo list cleared successfully!"}