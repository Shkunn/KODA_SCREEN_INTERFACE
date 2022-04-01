from flask import Flask, Blueprint, render_template, redirect, url_for, request, flash, jsonify, abort
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room
import redis
import time


socketio = SocketIO(cors_allowed_origins='*')
red = redis.StrictRedis('localhost', 6379, charset="utf-8", decode_responses=True)


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.debug = True

socketio.init_app(app)


interface_id = {}
status_casier = 'CLOSE'
status_robot = ''




@socketio.on('connect')
def test_connect():
    print('Client Connected')


@socketio.on('interface')
def interface(auth):
    global interface_id

    print(auth, ' : Interface Connected')
    username = request.sid
    room = request.sid
    join_room(room)

    interface_id[auth] = username


@socketio.on('raspberry')
def raspberry(data):
    global status_casier, status_robot

    if(data['State_error'] == 'NO_ERROR' and data['State_connection_base'] == 'CONNECTED'):
        # Afficher pendant 10secondes CASIER OUVERT puis afficher WAITING_FOR_CODE pour que le client entre son code et dévérouille le casier
        # Comparer avec une valeur qui s'update à chaque fois qu'un message est reçu pour ne pas envoyer à chaque fois CASIER OPEN

        if (data['State_door'] == 'OPEN'):
            if status_casier == 'CLOSE':
                status_casier = 'OPEN'

                if(interface_id) :
                    sid = interface_id['123']
                    socketio.emit('data_to_interface', data['State_door'], to=sid)

                    socketio.sleep(5)

                    socketio.emit('data_to_interface', data['State_robot'], to=sid)


        if (data['State_door'] == 'CLOSE'):
            if status_casier == 'OPEN':
                status_casier = 'CLOSE'

                if(interface_id) :
                    sid = interface_id['123']
                    socketio.emit('data_to_interface', data['State_door'], to=sid)

                    socketio.sleep(5)

                    socketio.emit('data_to_interface', data['State_robot'], to=sid)
                    

        if (data['State_robot'] != status_robot):
            status_robot = data['State_robot']

            if(interface_id) :
                sid = interface_id['123']
                socketio.emit('data_to_interface', data['State_robot'], to=sid)


    if(data['State_error'] == 'ERROR'):
        if(interface_id) :
            sid = interface_id['123']
            socketio.emit('data_to_interface', data['State_error'], to=sid)

    if(data['State_connection_base'] == 'DISCONNECTED'):
            if(interface_id) :
                sid = interface_id['123']
                socketio.emit('data_to_interface', data['State_connection_base'], to=sid)



@socketio.on('disconnect')
def disconnect():
    room = request.sid
    leave_room(room)
    print("Client leave room:" + request.sid)

    close_room(room)
    print("Room: ", room, " is closed.")
    
    print('Client disconnected')



if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0")