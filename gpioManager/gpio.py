
previous_value = False


class Gpio:
    pin = 0
    value = False

    def __init__(self, pin):
        self.pin = pin
        self.value = previous_value

    def on(self):
        global previous_value
        self.value = True
        previous_value = False

    def off(self):
        global previous_value
        self.value = False
        previous_value = True

    def close(self):
        self.pin = 0
        self.value = False