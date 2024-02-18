# Peter Frederiksen - s204484 and Mathias Jensen - s204480
# This script is used for creating a two-dimensional list where each row contains information about one municipality
# The list is written to a file called 'municipalities.py'
# The list is used in find_municipality.py
# This script only needs to run once to create the list, and is not used until municipality borders change

import requests, json, re
n = ["minlat", "maxlat", "minlon", "maxlon"]
municipalities = ["Albertslund Kommune", "Allerød Kommune", "Ballerup Kommune", "Bornholms Regionskommune", "Brøndby Kommune", "Københavns Kommune", "Dragør Kommune", "Egedal Kommune", "Fredensborg Kommune", "Frederiksberg Kommune", "Frederikssund Kommune", "Furesø Kommune", "Gentofte Kommune", "Gladsaxe Kommune", "Glostrup Kommune", "Gribskov Kommune", "Halsnæs Kommune", "Helsingør Kommune", "Herlev Kommune", "Hillerød Kommune", "Hvidovre Kommune", "Høje-Taastrup Kommune", "Hørsholm Kommune", "Ishøj Kommune", "Lyngby-Taarbæk Kommune", "Rudersdal Kommune", "Rødovre Kommune", "Tårnby Kommune", "Vallensbæk Kommune", "Favrskov Kommune", "Hedensted Kommune", "Herning Kommune", "Holstebro Kommune", "Horsens Kommune", "Ikast-Brande Kommune", "Lemvig Kommune", "Norddjurs Kommune", "Odder Kommune", "Randers Kommune", "Ringkøbing-Skjern Kommune", "Samsø Kommune", "Silkeborg Kommune", "Skanderborg Kommune", "Skive Kommune", "Struer Kommune", "Syddjurs Kommune", "Viborg Kommune", "Aarhus Kommune", "Brønderslev Kommune", "Frederikshavn Kommune", "Hjørring Kommune", "Jammerbugt Kommune", "Læsø Kommune", "Mariagerfjord Kommune", "Morsø Kommune", "Rebild Kommune", "Thisted Kommune", "Vesthimmerlands Kommune", "Aalborg Kommune", "Faxe Kommune", "Greve Kommune", "Guldborgsund Kommune", "Holbæk Kommune", "Kalundborg Kommune", "Køge Kommune", "Lejre Kommune", "Lolland Kommune", "Næstved Kommune", "Odsherred Kommune", "Ringsted Kommune", "Roskilde Kommune", "Slagelse Kommune", "Solrød Kommune", "Sorø Kommune", "Stevns Kommune", "Vordingborg Kommune", "Assens Kommune", "Billund Kommune", "Esbjerg Kommune", "Fanø Kommune", "Fredericia Kommune", "Faaborg-Midtfyn Kommune", "Haderslev Kommune", "Kerteminde Kommune", "Kolding Kommune", "Langeland Kommune", "Middelfart Kommune", "Nordfyns Kommune", "Nyborg Kommune", "Odense Kommune", "Svendborg Kommune", "Sønderborg Kommune", "Tønder Kommune", "Varde Kommune", "Vejen Kommune", "Vejle Kommune", "Ærø Kommune", "Aabenraa Kommune"]
# Sort list with municipalities since they are not already sorted
municipalities.sort()
# Overwrite file called municipalities.py and create if doesn't already exist
f = open("./municipalities.py", "w")
# Add the beginning of the two-dimensional list
f.write("municipality_information = [\n")
overpass_url = "http://overpass-api.de/api/interpreter"
# Go through each municipality
municipality_index = 0
while municipality_index < len(municipalities):
    # Make string to write to file. Does not write to file immediately, since a later part might fail in which case it will start over
    to_write = ""
    # Add the municipality name
    to_write += '\t["' + municipalities[municipality_index] + '", '
    # Query Overpass for the municipality. If process is unsuccessful, simply try again
    overpass_query = '[out:json];\narea["name:da"="' + municipalities[municipality_index] + '"][boundary="administrative"];\nrel(pivot);\nout bb;'
    response = requests.get(overpass_url, params={'data': overpass_query})
    try:
        result = response.json()
    except requests.exceptions.JSONDecodeError:
        print("requests.exceptions.JSONDecodeError. Retrying.")
        continue
    # First find the number for the minimum_latitude, then the maximum_latitude, then the minimum_longitude and finally the maximum_longitude
    for c in n:
        # In the first iteration: Find the minimum_latitude and its number
        a = re.findall("'" + c + "': \d+\.\d+", str(result))[0]
        # Add only the number
        to_write += re.findall("\d+\.\d+", a)[0]
        # Separate numbers with comma and space
        to_write += ", "
    # Remove extra comma and space added in the line above
    to_write = to_write[0:len(to_write) - 2]
    # Close the list
    to_write += ']'
    # Add a comma to separate one municipality list from the next
    if municipality_index < len(municipalities) - 1:
        to_write += ','
    # Write the string to the file
    f.write(to_write + "\n")
    # Let the user know how far the script is in the process
    print(str(municipality_index) + ": " + municipalities[municipality_index])
    municipality_index += 1
# Close the outer list
f.write("]")
# Close the file now containing the municipality borders
f.close()
