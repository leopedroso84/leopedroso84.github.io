import json, urllib.request
sid='994ba242ad604eedb136dc89355b9af8'
url='https://www.icloud.com/shortcuts/api/records/'+sid
with urllib.request.urlopen(url, timeout=30) as r:
    data=json.load(r)
print(data['fields']['name']['value'])
