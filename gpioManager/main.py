from flask import Flask
from flask import request, abort
import threading
import time

from gpio import Gpio

app = Flask(__name__)

availableCommands = ['ON', 'OFF']

MAX_ON_SECONDS = 60


def async_op():
    print("Async start")
    time.sleep(10)
    print("Async end")


def get_gpio(pin):
    gpio = Gpio(pin)
    return gpio


@app.route("/gpio/<int:pin>", methods=['GET'])
def get_status(pin):
    gpio = get_gpio(pin)
    value = gpio.value
    gpio.close()
    return {
        "status": "ON" if value is True else "OFF"
    }


@app.route("/gpio/<int:pin>", methods=['POST'])
def run_for_time(pin):
    data = request.get_json()
    command = data.get('command')

    if command is None:
        abort(400)
    if command not in availableCommands:
        abort(400)

    gpio = get_gpio(pin)
    if command == "ON":
        gpio.on()
    if command == "OFF":
        gpio.off()

    gpio.close()

    app.logger.debug("Before async")
    threading.Thread(target=async_op).start()
    app.logger.debug("After async")

    return {
        "message": "New status: {}".format(command)
    }


if __name__ == '__main__':
    app.run(port=5050)
