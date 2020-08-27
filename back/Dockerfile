FROM python:3.8.3-slim-buster

RUN apt-get -y update && apt-get -y upgrade && apt-get install net-tools libgl1-mesa-glx libglib2.0-0 -y 
RUN pip3 install flask flask-cors pillow requests opencv-python
ADD app.py /back/

WORKDIR /back/

COPY . /back/