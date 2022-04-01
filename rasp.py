import socketio
import time
import numpy as np
import base64
import cv2 
import threading

sio = socketio.Client()


data_rasp = {
    # OPEN, CLOSE
    "State_door": 'CLOSE', 

    # WAITING, IN_DELIVERY, WAITING_FOR_CODE(client doit ouvir le module en rentrant son mdp)
    "State_robot": 'WAITING',

    # ERROR (si le robot a un problème)
    "State_error": 'NO_ERROR', # ERROR

    # DISCONNECTED (savoir si la base echange bien de la data avec le module)
    "State_connection_base": 'CONNECTED'  
}


@sio.event
def connect():
    print('connection established')

@sio.event
def disconnect():
    print('disconnected from server')



if __name__ == '__main__':
    connected = False
    map_check = False
    while not connected:
        try:
            sio.connect('http://0.0.0.0:5000')    
        except socketio.exceptions.ConnectionError as err:
            print("ConnectionError: ", err)
        else:
            print("Connected!")
            connected = True
            sio.emit('raspberry', data_rasp)

            while True:
                sio.emit('raspberry', data_rasp)
                time.sleep(1) 