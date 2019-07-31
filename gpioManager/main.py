from flask import Flask
from flask import request, abort
import threading
import time
from gpio import Gpio

app = Flask(__name__)

availableCommands = ['ON', 'OFF']

MAX_ON_SECONDS = 60


def run_thread(pin, command):
    if command == "ON":
        send_on(pin)
        time.sleep(MAX_ON_SECONDS)
        send_off(pin)
    if command == "OFF":
        send_off(pin)


def send_on(pin):
    gpio = get_gpio(pin)
    app.logger.debug("Sending ON to {}".format(pin))
    gpio.on()
    gpio.close()


def send_off(pin):
    gpio = get_gpio(pin)
    app.logger.debug("Sending OFF to {}".format(pin))
    gpio.off()
    gpio.close()


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

    threading.Thread(target=run_thread, args=[pin, command]).start()

    return {
        "message": "New status: {}".format(command)
    }


if __name__ == '__main__':
    app.run(port=5050, host="0.0.0.0")
