from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from database import Base
import json


class TreeHierarchy(Base):
    __tablename__ = "tree_hierarchies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, default="root")
    tree_data = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    def get_tree_json(self):
        return json.loads(self.tree_data)

    def set_tree_json(self, tree_dict):
        self.tree_data = json.dumps(tree_dict)
