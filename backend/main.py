from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json

from database import engine, get_db, Base
from models import TreeHierarchy
from schemas import TreeCreate, TreeUpdate, TreeResponse, TreeListResponse, TagNode

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Nested Tags Tree API",
    description="API for managing nested tag tree hierarchies",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def tree_to_response(db_tree: TreeHierarchy) -> TreeResponse:
    tree_data = json.loads(db_tree.tree_data)
    return TreeResponse(
        id=db_tree.id,
        name=db_tree.name,
        tree=TagNode(**tree_data),
        created_at=db_tree.created_at,
        updated_at=db_tree.updated_at
    )


@app.get("/")
def root():
    return {"message": "Nested Tags Tree API", "version": "1.0.0"}


@app.get("/api/trees", response_model=TreeListResponse)
def get_all_trees(db: Session = Depends(get_db)):
    """Fetch all saved tree hierarchies"""
    trees = db.query(TreeHierarchy).order_by(TreeHierarchy.created_at.desc()).all()
    return TreeListResponse(trees=[tree_to_response(t) for t in trees])


@app.get("/api/trees/{tree_id}", response_model=TreeResponse)
def get_tree(tree_id: int, db: Session = Depends(get_db)):
    """Fetch a specific tree hierarchy by ID"""
    tree = db.query(TreeHierarchy).filter(TreeHierarchy.id == tree_id).first()
    if not tree:
        raise HTTPException(status_code=404, detail="Tree not found")
    return tree_to_response(tree)


@app.post("/api/trees", response_model=TreeResponse, status_code=201)
def create_tree(tree_data: TreeCreate, db: Session = Depends(get_db)):
    """Create a new tree hierarchy"""
    db_tree = TreeHierarchy(
        name=tree_data.tree.name,
        tree_data=json.dumps(tree_data.tree.model_dump(exclude_none=True))
    )
    db.add(db_tree)
    db.commit()
    db.refresh(db_tree)
    return tree_to_response(db_tree)


@app.put("/api/trees/{tree_id}", response_model=TreeResponse)
def update_tree(tree_id: int, tree_data: TreeUpdate, db: Session = Depends(get_db)):
    """Update an existing tree hierarchy"""
    db_tree = db.query(TreeHierarchy).filter(TreeHierarchy.id == tree_id).first()
    if not db_tree:
        raise HTTPException(status_code=404, detail="Tree not found")
    
    db_tree.name = tree_data.tree.name
    db_tree.tree_data = json.dumps(tree_data.tree.model_dump(exclude_none=True))
    db.commit()
    db.refresh(db_tree)
    return tree_to_response(db_tree)


@app.delete("/api/trees/{tree_id}")
def delete_tree(tree_id: int, db: Session = Depends(get_db)):
    """Delete a tree hierarchy"""
    db_tree = db.query(TreeHierarchy).filter(TreeHierarchy.id == tree_id).first()
    if not db_tree:
        raise HTTPException(status_code=404, detail="Tree not found")
    
    db.delete(db_tree)
    db.commit()
    return {"message": "Tree deleted successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
