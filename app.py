from data import get_availability
from dotenv import load_dotenv
import os
from flask import Flask, redirect 


load_dotenv()

app = Flask(__name__)

client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')
token =os.getenv('API_TOKEN')
server_url = "http://localhost:5000"

@app.route('/')
def main():
    return redirect(f"{server_url}/data")

@app.route('/data')
def uclapi_login():
    availability = get_availability()
    return availability


if __name__ == '__main__':
    app.run()