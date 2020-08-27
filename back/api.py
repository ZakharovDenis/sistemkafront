login = 'systemka'
passw = 'ilovesystemka'
url=f'http://{login}:{passw}@135.181.80.79'
seg_port = ':8004'
find_port = ':8003'
get_segments = url+seg_port+'/segments'
get_suggs = url+find_port+'/image/search'
def get_img(n):
    return url+find_port+'/image/'+str(n)
def get_data(n):
    return url+find_port+'/data/'+str(n)
