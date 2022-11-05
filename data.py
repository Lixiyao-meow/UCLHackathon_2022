import requests
import os
from dotenv import load_dotenv
from datetime import datetime
import json

load_dotenv()

now = datetime.now()

client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')
token = os.getenv('API_TOKEN')


def get_coordinates():
    f = open('data/coords.json') #Placeholder. Insert actual coordinates name.
    coordinates = json.load(f)
    f.close()
    return coordinates


def get_availability() -> dict:
    coordinates = get_coordinates()
    print(coordinates)
    params = {
        "token": token,
        "client_secret": client_secret,
    }
    r = requests.get("https://uclapi.com/workspaces/surveys", params=params)
    loc_list = r.json()['surveys']
    availability = {}
    for loc in loc_list:
        name = loc['name']
        loc_id = loc['id']
        
        if name == 'Bidborough House - Social Distance': # Erroneously placed by UCL API.
            continue

        params = {
            "token": token,
            "client_secret": client_secret,
            "survey_id": loc_id,
        }

        r = requests.get("https://uclapi.com/workspaces/sensors", params=params).json()
        counter = 0
        length = 0
        for floor in r['maps']:
            for sensor in floor['sensors'].values():
                if sensor.get('occupied', None) is None:
                    continue
                length += 1
                if sensor.get('occupied', None) == True:
                    counter += 1

        availability[loc_id] = { 
            'x': coordinates[f"{loc_id}"]['x'], 
            'y': coordinates[f"{loc_id}"]['y'], 
            'availability':counter/length}
    return availability
