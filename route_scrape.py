from bs4 import BeautifulSoup
import requests, json

r  = requests.get("http://www.mountainproject.com/scripts/Classics.php?id=105731932")

soup = BeautifulSoup(r.text)

routes = []
for r in soup.find_all("table", { "class" : "objectList" })[1].find_all('tr'):
	target = r.find('td').find('a')
	if(target != None):
		route_name = target.text
		route_link =  target['href']

		routes.append({'name': route_name, 'link': route_link})

#routes = routes[2:3]
for route in routes:
	try:
		pitches = int(raw_input("How many pitches for " + route['name'] + ": "))
	except:
		pitches = 0
	

	pitch_list = []

	for pitch in range(0,pitches):
		try:
			length = int(raw_input("Length for pitch " + str(pitch + 1)  + ": "))
			rating = raw_input("Rating for pitch " + str(pitch + 1)  + ": ")
		except:
			length = 0
			rating = 'ERROR'
		

		pitch_list.append( {'rating': rating, 'length': length})

	route['pitches'] = pitch_list

with open('routes.json', 'w') as outfile:
  json.dump(routes,outfile, indent=4, separators=(',', ': '))

