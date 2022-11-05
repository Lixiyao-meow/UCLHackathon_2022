import requests
import json

client_id = '1123971576237433.9217843484076964'
client_secret = 'e70be4f4d030498d25cd9213c0674bf99527159f4c069cb02a7b71c1917e6157'
token ='uclapi-user-437e15c80c1f21c-0f4ca853f6a4fea-310a3d71f35d9ff-f5296842eb78eb4'


params = {
    "token": token,
    "client_secret": client_secret,
}
r = requests.get("https://uclapi.com/workspaces/surveys", params=params)
loc_list = r.json()['surveys']
print(loc_list)
data = []
for loc in loc_list:
    params = {
        "token": token,
        "client_secret": client_secret,
        "survey_id": id,
    }
    r = requests.get("https://uclapi.com/workspaces/sensors", params=params).json()
    ids = loc['id']
    name = loc['name']
    print()
    for id in ids:

        print(r)
        break
    data.append([name,])