#!/usr/bin/python
from pymongo import MongoClient
from datetime import datetime

client = MongoClient()
db = client.msgfri
db.msg.insert_one(
    {
    "msg": {
    "header": {
    "user" : "test",
    "type" : "text",
    "time" : datetime.now()
    },
    "content": {
    "text" : "How are you?",
    "image" : "http://xx.png",
    "video" : "http://xx.mp4"
    }
    }
    }
)
