from flask import Flask, Blueprint, render_template, redirect, url_for, request, flash, jsonify, abort
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room
import redis
import threading


socketio = SocketIO(cors_allowed_origins='*')
red = redis.StrictRedis('localhost', 6379, charset="utf-8", decode_responses=True)


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.debug = True

socketio.init_app(app)


interface_id = {}




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
    sid = interface_id['123']
    socketio.emit('data_to_interface', data, to=sid)



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