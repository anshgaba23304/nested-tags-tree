from pydantic import BaseModel
from typing import Optional, List, Union
from datetime import datetime


class TagNode(BaseModel):
    name: str
    children: Optional[List['TagNode']] = None
    data: Optional[str] = None

    class Config:
        from_attributes = True


class TreeCreate(BaseModel):
    tree: TagNode


class TreeUpdate(BaseModel):
    tree: TagNode


class TreeResponse(BaseModel):
    id: int
    name: str
    tree: TagNode
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TreeListResponse(BaseModel):
    trees: List[TreeResponse]
