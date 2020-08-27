from flask import Flask, request, make_response, Response, send_file
import os
import random
import base64
import uuid
from flask_cors import CORS
from time import sleep
import json
from api import *
from PIL import Image
import ast
import requests
import io
import base64
import cv2
import numpy as np

app = Flask(__name__)
cors = CORS(app)


@app.route('/get_random_photos')
def get_random_photos():
    files = os.listdir('demo')
    ret_list = []
    chosen = []
    demo_size = len(os.listdir('demo'))
    chosen_file = random.choice(files)
    while len(ret_list) < 6 and len(ret_list) < demo_size:
        while chosen_file in chosen:
            chosen_file = random.choice(files)
        with open(os.path.join('demo', chosen_file), 'rb') as file:
            ret_list.append({
                'image': "data:image/png;base64," + base64.b64encode(file.read()).decode(),
                'link': 'd_' + chosen_file.split('.')[0]})
            chosen.append(chosen_file)
            chosen_file = random.choice(files)
    return make_response(Response(json.dumps(ret_list)), 200)


@app.route('/upload', methods=["POST"])
def upload_picture():
    image = request.form.get('imgBase64')
    image = image[image.find('base64,')+7:]
    image = base64.b64decode(image)
    image_name = str(uuid.uuid4())
    try:
        os.mkdir('uploaded_data')
    except:
        pass
    image_path = os.path.join('uploaded_data', image_name)
    file = open('%s.jpg' % image_path, 'wb')
    file.write(image)
    file.close()
    coords = request.form.get('coords')
    if (coords):
        with open('%s.txt' % image_path, 'w') as file:
            file.write(request.form.get('coords'))
    return make_response(Response(f'/result/{image_name}'), 200)


@app.route('/send_partner_info',  methods=["POST"])
def send_info():
    with open('info.txt', 'a') as file:
        file.write(str(request.data))


@app.route('/get_partners')
def partners():
    fin = []
    pics = ['partners/' + i for i in os.listdir('partners')]
    for i in range(6):
        with open(random.choice(pics), 'rb') as file:
            image = "data:image/png;base64," + \
                base64.b64encode(file.read()).decode()
            fin.append(image)
    return make_response(Response(json.dumps(fin)), 200)


@app.route('/get_picture_info',  methods=["POST"])
def get_picture_info():
    with open("lady.jpg", "rb") as image_file:
        image = base64.b64encode(image_file.read()).decode()
        with open('coords.txt', 'r') as coord_file:
            jsn = json.dumps({'image': "data:image/png;base64,"+image, 'coords': [
                             float(i) for i in coord_file.readline()[1:-1].split(',')]})
        return make_response(Response(jsn), 200)

def crop_mask(img, mask, box):
    background = np.ones(img.shape, dtype=np.uint8)
    background.fill(255)
    for i, poly in enumerate(mask):
        cv2.fillPoly(background, np.array(poly), 0)
    masked_image = cv2.bitwise_or(img, background)
    x1, y1, x2, y2 = [round(cord) for cord in box]
    crop_img = masked_image[y1:y2, x1:x2]
    return crop_img

def PIL2CV2(img):
    return cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)

def CV22PIL(img):
    return Image.fromarray(cv2.cvtColor(img,cv2.COLOR_BGR2RGB))

    
@app.route('/get_suggestions', methods=['POST'])
def get_suggestions():
    img_name = request.form.get('link')
    folder_name = None
    if img_name[0]=='d' and img_name[1]=='_':
        folder_name = 'demo'
        img_name = img_name[2:]
    else:
        folder_name = 'uploaded_data'
    image_file = os.path.join(folder_name, img_name + '.jpg')
    coords = None
    coords_file = os.path.join(folder_name, img_name + '.txt')
    if os.path.isfile(coords_file):
        with open(coords_file, 'r') as file:
            coords = ast.literal_eval(file.readline())
    img = Image.open(image_file)
    if coords:
        x, y, w, h, cx, cy = coords
        img = img.crop((
            x*cx, 
            y*cy, 
            x*cx + w*cx,# if (x*cx + w*cx) < img.width else x*cx + w*cx - abs((x*cx + w*cx) - img.width), 
            y*cy + h*cy,# if (y*cy + h*cy) < img.height else y*cy + h*cy - abs((y*cy + h*cy) - img.height),
            ))
    else:
        coords = [0,0, img.width, img.height, 1, 1]
    imgByteArr = io.BytesIO()
    img.save(imgByteArr, format='PNG')
    imgByteArr = imgByteArr.getvalue()
    segments = requests.Session().post(
        url=get_segments,
        headers={'X-SERVICE-NAME': 'Segmentator'},
        files={'image': imgByteArr},
        params={
            'mode': 'box'
        }
    )
    segments_json = json.loads(segments.text)['result']
    cropped_imgs = []
    jsn = []
    brand = set()
    color = set()
    seller = set()
    if len(segments_json) == 0:
        suggestions = requests.Session().post(
            url=get_suggs+'?k=2',  ## specify k number 
            headers={'X-SERVICE-NAME': 'search'},
            files={'image': imgByteArr},
        )
        suggestions_json = json.loads(suggestions.text)['result']
        for sugg in suggestions_json:
            info_json = sugg['data']
            picture = requests.Session().get(
                url=get_img(sugg['id']),
                headers={'X-SERVICE-NAME': 'search'},
            ).content
            brand.add(info_json.get('brand'))
            color.add(info_json.get('color'))
            seller.add(info_json.get('seller'))
            info_json['image'] = "data:image/png;base64," + \
                base64.b64encode(picture).decode()
            jsn.append(info_json)
    for cloth in segments_json:
        imgByteArrCrop = io.BytesIO()
        crp_img = img.crop(cloth['box'])
        crp_img.save(imgByteArrCrop, format='PNG')
        cropped_imgs.append({'type': cloth['label'], 'image': "data:image/png;base64," +
                             base64.b64encode(imgByteArrCrop.getvalue()).decode()})
        cropped_cloth_img = crop_mask(PIL2CV2(img), cloth['mask'], cloth['box'])
        CV22PIL(cropped_cloth_img).save(imgByteArrCrop, format="PNG")
        suggestions = requests.Session().post(
            url=get_suggs+'?k=2',  ## specify k number 
            headers={'X-SERVICE-NAME': 'search'},
            files={'image': imgByteArrCrop.getvalue()},
        )
        suggestions_json = json.loads(suggestions.text)['result']
        for sugg in suggestions_json:
            info_json = sugg['data']
            picture = requests.Session().get(
                url=get_img(sugg['id']),
                headers={'X-SERVICE-NAME': 'search'},
            ).content
            brand.add(info_json.get('brand'))
            color.add(info_json.get('color'))
            seller.add(info_json.get('seller'))
            info_json['image'] = "data:image/png;base64," + \
                base64.b64encode(picture).decode()
            info_json['type'] = cloth['label']
            jsn.append(info_json)
    return make_response(
        Response(
            json.dumps(
                {
                    'image_info': {'image': "data:image/png;base64,"+base64.b64encode(imgByteArr).decode(), 'coords': coords},
                    'found_clothes': cropped_imgs,
                    'items': jsn,
                    'filters': {
                        'brand': list(brand),
                        'color': list(color),
                        'seller': list(seller),
                        'gender': ['male', 'female'],
                    },
                    'sort': ['price']
                }
            )
        ), 200
    )


if __name__ == "__main__":
    app.run()
