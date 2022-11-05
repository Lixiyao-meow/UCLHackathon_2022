import random

import requests
import os
from dotenv import load_dotenv
from datetime import datetime
import json

load_dotenv()

now = datetime.now()

client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')
token =os.getenv('API_TOKEN')


def get_coordinates():
    with open('static/data/coords.json') as file:
        coordinates = json.load(file)
    return coordinates


def create_availability_dict(loc_list: list) -> dict:
    coordinates = get_coordinates()
    availability = {}
    for loc in loc_list:
        name = loc['name']
        loc_id = loc['id']

        if name == 'Bidborough House - Social Distance':  # Remove erroneously placed by UCL API.
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
            'availability': counter / length
        }
    return availability


def get_availability() -> dict:
    params = {
        "token": token,
        "client_secret": client_secret,
    }
    r = requests.get("https://uclapi.com/workspaces/surveys", params=params)
    loc_list = r.json()['surveys']
    output = map_availability(create_availability_dict(loc_list))
    save_to_json(output, "./static/traffic.json")
    return output


def map_availability(availability: dict) -> list:
    locations = list(availability.keys())
    availability_list = []
    for location in locations:
        x = availability[location]['x']
        y = availability[location]['y']
        percentage = availability[location]['availability']
        # test case
        # percentage = random.uniform(0, 1)
        availability_list.append([x, y, percentage])
    return availability_list


def save_to_json(input, dir):
    with open(dir, "w") as write_file:
        jsonStr = json.dump(input, write_file)
        print(jsonStr)


