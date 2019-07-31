FROM python:3-alpine

RUN pip install flask

WORKDIR /usr/src/app

COPY gpio.py gpio.py
COPY main.py main.py

ENV FLASK_ENV=development

CMD ["python", "./main.py"]