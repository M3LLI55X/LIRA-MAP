# Peter Frederiksen - s204484 and Mathias Jensen - s204480
# This script is used for determining the municipality of coordinates
# Fetches rows from our database with no municipaly and puts them back with a municipality. Be aware that it does not delete the old rows without the municipality
# The script can be terminated with a keyboard interrupt, and still commit the determined municipalities and print how far it got for later continuation
# This script is only used once for each coordinate and should be used for determining the municipality of new rows lacking this information

# Two-dimensional list where each row contains information about one municipality
# Each row consists of municipality_name, minimum_latitude, maximum-latitude, minimum_longitude, maximum_longitude
# The two-dimensional list has been created using create_municipality_borders_list.py
# The list is used to save time by not querying Overpass if not strictly necessary
municipality_information = [
    ["Aabenraa Kommune", 54.8002468, 55.1679738, 9.0049193, 9.6316724],
    ["Aalborg Kommune", 56.8110129, 57.2305988, 9.3907005, 10.3893918],
    ["Aarhus Kommune", 55.9957118, 56.3304486, 9.9485883, 10.389087],
    ["Albertslund Kommune", 55.6419513, 55.71108, 12.3110037, 12.3962861],
    ["Allerød Kommune", 55.8123577, 55.8991698, 12.2071583, 12.426749],
    ["Assens Kommune", 55.1205329, 55.4327016, 9.7658027, 10.293877],
    ["Ballerup Kommune", 55.6973362, 55.7634491, 12.2635028, 12.426209],
    ["Billund Kommune", 55.5935144, 55.8957785, 8.7474139, 9.199273],
    ["Bornholms Regionskommune", 54.9872394, 55.2991212, 14.6807609, 15.1573525],
    ["Brøndby Kommune", 55.6069114, 55.6715339, 12.3634106, 12.4599658],
    ["Brønderslev Kommune", 57.0706104, 57.3427406, 9.738806, 10.4423279],
    ["Dragør Kommune", 55.536309, 55.6086224, 12.5553533, 12.7117214],
    ["Egedal Kommune", 55.6936922, 55.8282713, 12.1087064, 12.3422827],
    ["Esbjerg Kommune", 55.2206861, 55.596911, 8.2931781, 8.9389087],
    ["Faaborg-Midtfyn Kommune", 55.0038604, 55.3426929, 10.0598328, 10.6615153],
    ["Fanø Kommune", 55.3393294, 55.4727242, 8.3275079, 8.4796107],
    ["Favrskov Kommune", 56.1886787, 56.4501867, 9.660847, 10.2426213],
    ["Faxe Kommune", 55.133556, 55.4049156, 11.8319507, 12.2852591],
    ["Fredensborg Kommune", 55.8870226, 56.0143014, 12.3460569, 12.5485898],
    ["Fredericia Kommune", 55.5090714, 55.6283285, 9.5577329, 9.8596783],
    ["Frederiksberg Kommune", 55.6665018, 55.6976811, 12.4913153, 12.5573424],
    ["Frederikshavn Kommune", 57.1701365, 57.7522386, 10.18283, 10.6578897],
    ["Frederikssund Kommune", 55.714263, 55.9379759, 11.8460382, 12.2312987],
    ["Furesø Kommune", 55.7523934, 55.8515036, 12.2933683, 12.4389413],
    ["Gentofte Kommune", 55.7218356, 55.7794413, 12.4986451, 12.6033386],
    ["Gladsaxe Kommune", 55.7168193, 55.7767204, 12.4161928, 12.5214823],
    ["Glostrup Kommune", 55.6579353, 55.7095173, 12.3678094, 12.432371],
    ["Greve Kommune", 55.5534352, 55.6220659, 12.1379675, 12.3640611],
    ["Gribskov Kommune", 55.9684906, 56.1292187, 12.0088291, 12.4174248],
    ["Guldborgsund Kommune", 54.5590644, 54.9717311, 11.5300405, 12.1655774],
    ["Haderslev Kommune", 55.1255745, 55.3823512, 8.8845671, 9.7787923],
    ["Halsnæs Kommune", 55.8785913, 56.2031171, 11.6820446, 12.127907],
    ["Hedensted Kommune", 55.6688686, 55.9248847, 9.3862847, 10.1018708],
    ["Helsingør Kommune", 55.9757769, 56.096377, 12.3885328, 12.6247287],
    ["Herlev Kommune", 55.7075878, 55.7598639, 12.3933606, 12.4587281],
    ["Herning Kommune", 55.8795714, 56.4140311, 8.4337797, 9.1878985],
    ["Hillerød Kommune", 55.8450876, 56.0033716, 12.0796875, 12.394691],
    ["Hjørring Kommune", 57.3070482, 57.6185429, 9.6899199, 10.411832],
    ["Holbæk Kommune", 55.5089307, 55.8091708, 11.3509681, 11.8583657],
    ["Holstebro Kommune", 56.2271391, 56.5661639, 8.1137399, 9.0026663],
    ["Horsens Kommune", 55.7414626, 56.070071, 9.4623445, 10.3664179],
    ["Hvidovre Kommune", 55.597758, 55.6661659, 12.4259902, 12.5073921],
    ["Høje-Taastrup Kommune", 55.6045495, 55.7086101, 12.1504592, 12.3466636],
    ["Hørsholm Kommune", 55.852427, 55.9133592, 12.397542, 12.562084],
    ["Ikast-Brande Kommune", 55.8306566, 56.2760403, 8.9577932, 9.5592342],
    ["Ishøj Kommune", 55.5942707, 55.6375669, 12.2093855, 12.4000983],
    ["Jammerbugt Kommune", 57.0074495, 57.355759, 9.0306759, 9.9190924],
    ["Kalundborg Kommune", 55.4581961, 55.9198592, 10.8683846, 11.4600096],
    ["Kerteminde Kommune", 55.3228035, 55.6206529, 10.4800196, 10.8004729],
    ["Kolding Kommune", 55.3085852, 55.6298155, 9.2151762, 9.6932931],
    ["Københavns Kommune", 55.6128612, 55.7327029, 12.4530002, 12.7342464],
    ["Køge Kommune", 55.3682861, 55.5352389, 11.9110121, 12.2310819],
    ["Langeland Kommune", 54.721897, 55.1645831, 10.5330343, 10.955726],
    ["Lejre Kommune", 55.5266575, 55.745502, 11.7787499, 12.0744501],
    ["Lemvig Kommune", 56.3473059, 56.7105006, 8.1146816, 8.524678],
    ["Lolland Kommune", 54.593786, 55.0400626, 10.9547639, 11.5816914],
    ["Lyngby-Taarbæk Kommune", 55.7595403, 55.8097032, 12.4132913, 12.5969256],
    ["Læsø Kommune", 57.178712, 57.3646676, 10.8593094, 11.2001753],
    ["Mariagerfjord Kommune", 56.5504355, 56.8608372, 9.5276958, 10.3507582],
    ["Middelfart Kommune", 55.3391695, 55.5547911, 9.6586411, 10.0905836],
    ["Morsø Kommune", 56.6690655, 56.9846631, 8.5027876, 9.0137198],
    ["Norddjurs Kommune", 56.2949384, 56.7376849, 10.2180631, 11.6629623],
    ["Nordfyns Kommune", 55.4054452, 55.6468502, 9.9799364, 10.5616486],
    ["Nyborg Kommune", 55.172776, 55.4245572, 10.5317268, 10.8561184],
    ["Næstved Kommune", 55.1149448, 55.4090996, 11.4352978, 12.0475025],
    ["Odder Kommune", 55.8362399, 56.0239341, 10.0136292, 10.4629031],
    ["Odense Kommune", 55.2881107, 55.481989, 10.1758237, 10.5768293],
    ["Odsherred Kommune", 55.7330276, 56.0105988, 11.2768714, 11.7918884],
    ["Randers Kommune", 56.3698869, 56.7121272, 9.7762102, 10.3631313],
    ["Rebild Kommune", 56.6511268, 56.9713004, 9.518457, 10.2281242],
    ["Ringkøbing-Skjern Kommune", 55.7730609, 56.2622547, 8.0982042, 8.8644438],
    ["Ringsted Kommune", 55.3516643, 55.5636368, 11.6368368, 11.9797552],
    ["Roskilde Kommune", 55.5161143, 55.7812703, 11.9698176, 12.2509534],
    ["Rudersdal Kommune", 55.7951175, 55.8781219, 12.3927939, 12.5823095],
    ["Rødovre Kommune", 55.6647502, 55.7149837, 12.4230281, 12.4785965],
    ["Samsø Kommune", 55.7643867, 56.0027845, 10.5201924, 10.7935604],
    ["Silkeborg Kommune", 55.9939845, 56.369558, 9.2219633, 9.8610822],
    ["Skanderborg Kommune", 55.9539819, 56.2169418, 9.6331353, 10.0929753],
    ["Skive Kommune", 56.4892261, 56.8465928, 8.6748249, 9.2955294],
    ["Slagelse Kommune", 55.140043, 55.5097653, 10.9450712, 11.5215282],
    ["Solrød Kommune", 55.5077782, 55.5666916, 12.093752, 12.2548498],
    ["Sorø Kommune", 55.3634953, 55.5913301, 11.3185665, 11.7108354],
    ["Stevns Kommune", 55.2357407, 55.4268256, 12.1074136, 12.4549127],
    ["Struer Kommune", 56.3871855, 56.693525, 8.392524, 8.712314],
    ["Svendborg Kommune", 54.9429508, 55.2215971, 10.3606264, 10.8899751],
    ["Syddjurs Kommune", 56.0946564, 56.44831, 10.160472, 10.8472662],
    ["Sønderborg Kommune", 54.8348939, 55.0837904, 9.4624476, 10.0715755],
    ["Thisted Kommune", 56.6704435, 57.1589524, 8.2208505, 9.0959233],
    ["Tårnby Kommune", 55.5724857, 55.672682, 12.5087921, 12.822573],
    ["Tønder Kommune", 54.8815023, 55.2447155, 8.4634208, 9.2496601],
    ["Vallensbæk Kommune", 55.6089144, 55.6562171, 12.3413381, 12.4049644],
    ["Varde Kommune", 55.4761123, 55.8498933, 8.0744579, 8.9144487],
    ["Vejen Kommune", 55.2893572, 55.627934, 8.7622214, 9.3033632],
    ["Vejle Kommune", 55.5669726, 55.9566078, 9.0548381, 9.7495935],
    ["Vesthimmerlands Kommune", 56.6368956, 57.0306136, 9.0683518, 9.6599069],
    ["Viborg Kommune", 56.2184116, 56.6832368, 8.9717468, 9.7962978],
    ["Vordingborg Kommune", 54.8785356, 55.1548461, 11.6165172, 12.5526336],
    ["Ærø Kommune", 54.8162741, 54.9718008, 10.2043214, 10.5742864]
]

import overpy, time
no_municipality_found_msg = 'NO MUNICIPALITY FOUND'
# Function takes two arguments: a latitude and a longitude
# Returns a string, which is the name of the municipality the coordinates are within or a string explaining what when wrong
def getMunicipality(lat, lon):
    api = overpy.Overpass()

    # Go through all municipality borders and check which the coordinates are within
    matching_municipalities = []
    for element in municipality_information:
        if element[1] <= lat and element[2] >= lat and element[3] <= lon and element[4] >= lon:
            matching_municipalities.append(element[0])

    # If in no municipality, return a string explaining this
    if len(matching_municipalities) == 0:
        return no_municipality_found_msg
    # If in exactly one municipality, return this municipality name
    elif len(matching_municipalities) == 1:
        return matching_municipalities[0]
    # If in more than one municipality, query Overpass to find the correct one
    for _ in range(5):
        # Query Overpass and return the correct municipality
        try:
            result = api.query('is_in(' + str(lat) + ', ' + str(lon) + ');\narea._["name:da"~"Kommune$", i];\nout;')
            return result.areas[0].tags.get("name:da", "n/a")
        # If not in any municipality, return a string explaining this
        except IndexError:
            return no_municipality_found_msg
        # If the user wants to stop the script, raise another KeyboardInterrupt to also break the loop in the function 'getData'
        except KeyboardInterrupt:
            print("[getMunicipality] Got keyboardInterrupt.")
            raise KeyboardInterrupt()
        # If query timed out or something else, try again up to 5 times and then simply return a string saying it timed out
        except:
            print("Got exception. Retrying.")
            time.sleep(1)
    return "TIMED OUT"

import psycopg2
import pandas as pd

# Connect to our database
owndb = psycopg2.connect(
    database='postgres', user='postgres', password='Password1', host='se2-d.compute.dtu.dk', port='5432'
)
writecursor = owndb.cursor()

# Function takes one argument: a row to insert into the database
def write_row_to_database(row):
    query = '''insert into "Energy_Consumption"("energyConsumption", lat, lon, "TS", "FK_Trip", "Municipality")
    values (%s, %s, %s, %s, %s, %s)
    '''
    writecursor.execute(query, row)

# Function takes no arguments
# Used for getting rows from database then put them back into database with the determined municipality
def getData():
    # Query all rows without a municipality and save in a dataframe
    writecursor.execute(f'''select * from "Energy_Consumption"
    where "Municipality" is null
    order by "FK_Trip" asc''')
    df = pd.DataFrame(writecursor.fetchall(), columns=['EnergyConsumptionId', 'energyConsumption', 'lat', 'lon', 'TS', 'FK_Trip', 'Municipality'])
    # Go through each row
    i = 0
    while True:
        try:
            # Determine the municipality of the current row
            municipality = getMunicipality(df['lat'][i], df['lon'][i])
            # Write the row back to the database with the newly determined municipality
            write_row_to_database((df['energyConsumption'][i], df['lat'][i], df['lon'][i], df['TS'][i], df['FK_Trip'][i], municipality))
            # Let the user know the progress by printing the result of every 25th row
            if i % 25 == 0:
                print(str(i) + ": lat = " + str(df['lat'][i]) + ', lon = ' + str(df['lon'][i]) + ': mun = ' + municipality)
            i += 1
        # Break when there are no more rows
        except KeyError:
            break
        # Break if the user wants to stop the script
        except KeyboardInterrupt:
            print("[getData] got keyboardInterrupt.")
            break
    # Commit the rows to the database
    print("Committing to database.")
    owndb.commit()
    print("Done comitting to database. Terminating script. i was " + str(i))
getData()
