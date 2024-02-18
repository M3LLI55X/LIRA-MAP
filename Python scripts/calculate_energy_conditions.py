#László Barak - s222899
from datetime import datetime
from functools import reduce
from math import sqrt
from numpy import sign
from queue import Empty
import psycopg2
import pandas as pd
pd.options.mode.chained_assignment = None  # default='warn'
import time
import json

start = time.perf_counter()

SPEED_TAG = 'obd.spd_veh'
ACCELERATION_TAG = 'obd.acc_long'
TOURQUE_TAG = 'obd.whl_trq_est'

wheel_radius = 0.3
WattConv = 1.0/3600.0
window_length = 10.0
g = 9.80665
vehicle_mass = 1584
JtoW = 1/3600
cd = 0.29
rho = 1.225
A = 2.3316

#uncomment for big database
conn = psycopg2.connect(
    database='postgres', user='guest', password='AvpF7r8b', host='liradbdev.compute.dtu.dk', port= '5432'
)
#uncomment for smaller database
# conn = psycopg2.connect(   
#     database="postgres", user='se2-2021', password='h5vaVt', host='liradb.compute.dtu.dk', port= '5435'
# )

cursor = conn.cursor()

owndb = psycopg2.connect(
    database='postgres', user='postgres', password='Password1', host='se2-d.compute.dtu.dk', port='5432'
)

writecursor = owndb.cursor()

columns = ['energyConsumption', 'lat', 'lon', 'TS', 'FK_Trip']
#csv_results = pd.DataFrame(columns=columns)

def write_row_to_database(row):
    #""
    query = '''insert into "Energy_Consumption"("energyConsumption", lat, lon, "TS", "FK_Trip")
    values (%s, %s, %s, %s, %s)
    '''
    writecursor.execute(query, row)

def add_to_csv(df: pd.DataFrame, row):
    df.loc[len(df)] = list(row)


def extract_data_from_message(jsonstr, tag):
    m_dict = json.loads(jsonstr)
    if tag in m_dict.keys():
        return m_dict[tag]
    return ''

#László Barak - s222899 and Gustav F. H. Siegfried - s204490
def process_row(row, speed : pd.DataFrame, tourque : pd.DataFrame, df):
    curr_date = row['timestamp']
    if speed.empty or tourque.empty:
        return None

    filteredspeed = speed[speed['timestamp'] < curr_date]
    filteredtourqe = tourque[tourque['timestamp'] < curr_date]
    if filteredspeed.empty or filteredtourqe.empty:
        return None
    
    speedbefore = filteredspeed[filteredspeed['timestamp'] == filteredspeed['timestamp'].max()]
    speedbefore_speed = speedbefore['speed'].values[0]
    speedbefore_time = speedbefore['timestamp'].values[0].astype(datetime)
    
    filteredspeed = speed[speed['timestamp'] > curr_date]
    if filteredspeed.empty:
        return None
    
    speedafter = filteredspeed[filteredspeed['timestamp'] == filteredspeed['timestamp'].min()]
    speedafter_speed = speedafter['speed'].values[0]
    speedafter_time = speedafter['timestamp'].values[0].astype(datetime)

    row_time = row['timestamp'].value

    curr_speed = ((speedafter_speed - speedbefore_speed) / (speedafter_time - speedbefore_time) * (row_time - speedbefore_time)) + speedbefore_speed

    tourquebefore = filteredtourqe[filteredtourqe['timestamp'] == filteredtourqe['timestamp'].max()]
    tourquebefore_value = tourquebefore['tourque'].values[0]
    tourquebefore_time = tourquebefore['timestamp'].values[0].astype(datetime)
    
    filteredtourqe_after = tourque[tourque['timestamp'] > curr_date]
    if filteredtourqe_after.empty:
        return None
    
    tourqueafter = filteredtourqe_after[filteredtourqe_after['timestamp'] == filteredtourqe_after['timestamp'].min()]
    tourqueafter_value = tourqueafter['tourque'].values[0]
    tourqueafter_time = tourqueafter['timestamp'].values[0].astype(datetime)

    curr_tourque = ((tourqueafter_value - tourquebefore_value) / (tourqueafter_time - tourquebefore_time) * (row_time - tourquebefore_time)) + tourquebefore_value

    curr_acceleration = row['acceleration']

    Fslope = vehicle_mass*g*curr_acceleration
    Eslope = JtoW*Fslope*window_length

    Facc = vehicle_mass*curr_acceleration
    Eacc = JtoW*Facc*window_length

    Faero = 0.5*rho*A*cd*curr_speed**2
    Eaero = JtoW*Faero*window_length

    energy_consumption = curr_tourque - Eslope - Eacc - Eaero

    row = (energy_consumption, row['lat'], row['lon'], curr_date, row['FK_Trip'])
    write_row_to_database(row)
    add_to_csv(df, row)
    return row


def process_trip(trip):
    cursor.execute(f'''select "lat", "lon", "message", "T", "FK_Trip"
    from "Measurements" 
    where "FK_Trip" = \'{trip}\' and ("T" = \'{ACCELERATION_TAG}\' or "T" = \'{SPEED_TAG}\' or "T" = \'{TOURQUE_TAG}\')
        and "lat" is not null
        and "lon" is not null
    ''')

    df = pd.DataFrame(cursor.fetchall(), columns=['lat', 'lon', 'message', 'T', 'FK_Trip'])

    acceleration = df[df['T'] == ACCELERATION_TAG]
    acceleration['acceleration'] = acceleration['message'].map(lambda m : extract_data_from_message(m, ACCELERATION_TAG + '.value'))
    acceleration['timestamp'] = pd.to_datetime(acceleration['message'].map(lambda m : extract_data_from_message(m, '@ts')))

    acceleration.drop(columns=['message'], inplace=True)

    every_nth = max(int(len(acceleration.index) / 1000), 1)
    acceleration = acceleration.iloc[::every_nth, :]

    speed = df[df['T'] == SPEED_TAG]
    speed['speed'] = speed['message'].map(lambda m : extract_data_from_message(m, SPEED_TAG + '.value'))

    speed = speed[speed['speed'] != '']
        
    speed['timestamp'] = pd.to_datetime(speed['message'].map(lambda m : extract_data_from_message(m, '@ts')))
    speed.drop(columns=['message'], inplace=True)
    tourque = df[df['T'] == TOURQUE_TAG]
    tourque['tourque'] = tourque['message'].map(lambda m : extract_data_from_message(m, TOURQUE_TAG + '.value'))
    tourque['timestamp'] = pd.to_datetime(tourque['message'].map(lambda m : extract_data_from_message(m, '@ts')))

    tourque = tourque[tourque['tourque'] != '']
    
    tourque.drop(columns=['message'], inplace=True)
    acceleration.apply(lambda acc : process_row(acc, speed, tourque, df), axis=1)
    owndb.commit()
    print('trip', trip, 'is finished')
    

cursor.execute('SELECT "TripId" FROM public."Trips" --limit 1')
trips = list(cursor.fetchall())

print('Starting looping')
for trip in trips:
    process_trip(trip[0])

conn.close()

#owndb.commit()
owndb.close()

end = time.perf_counter()
print(f"Completed in {end - start:0.2f} seconds")
#csv_results.to_csv('data.csv')
