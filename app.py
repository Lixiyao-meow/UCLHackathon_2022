from data import get_availability
from dotenv import load_dotenv
import os
from flask import Flask, redirect, render_template
from apscheduler.schedulers.background import BackgroundScheduler

load_dotenv()

app = Flask(__name__)

client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')
token =os.getenv('API_TOKEN')
server_url = "http://localhost:5000"

# The refreshing data part
# def fresh_map_data():
#     get_availability()
#
# sched = BackgroundScheduler({'apscheduler.job_defaults.max_instances': 3},daemon=True)
#
# sched.add_job(fresh_map_data,'interval',seconds=10)
# sched.start()


@app.route('/')
def main():
    return redirect(f"{server_url}/data")


@app.route('/map')
def map():
    return render_template('map.html')

if __name__ == '__main__':
    app.run()