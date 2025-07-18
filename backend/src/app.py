from flask_api import FlaskAPI
from flask import Flask

app = FlaskAPI(__name__)

@app.route('/')
def example():
    return {"message": "hello"}
