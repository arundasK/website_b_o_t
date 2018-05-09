import os.path
import sys
import yaml
import pprint
from config import *
import pymysql
import pandas as pd
from django.contrib.admin.templatetags.admin_list import results
import requests
import json
import random
import numpy as np
import requests
import itertools
from bs4 import BeautifulSoup
import re
import urllib
import time
import os
from views import *
from api.views import *




try:
    import apiai
except ImportError:
    sys.path.append(os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir))
    import apiai


global context

def connect_to_db():
    db = pymysql.Connection(host = host_inventory,
                            user = user_inventory,
                            passwd = passwd,
                            db = database)
    return db


    


def call_api(dict_input):
    global out_dict
    out_dict = {}
    out_dict['messageText'] = []
    out_dict['messageSource'] = 'messageFromBot'
    ai = apiai.ApiAI(CLIENT_ACCESS_TOKEN)
    request = ai.text_request()
    request.lang = 'de'
    request.resetContexts = False
    request.session_id = dict_input['user_id']
    request.query = dict_input['messageText']
    #print(request.query)
            
    response = yaml.load(request.getresponse())
    
    	
    speech_=response['result']['fulfillment']['messages'][0]['speech']
    speech=speech_.split("%")
    print speech 
    if response['result']['metadata']['intentName'] == 'Default Welcome Intent':
        out_dict['messageText'].append(response['result']['fulfillment']['messages'][0]['speech'])
        out_dict["plugin"] = {'name': 'autofill', 'type': 'items', 'data': top_level_buttons}
    	return out_dict
    
    elif speech[0]=="Services":
        out_dict['messageText'].append("We provides following services:")
        out_dict["plugin"] = {'name': 'autofill', 'type': 'items', 'data': services}
    	return out_dict

    elif "blog and portfolio" in speech[0]:
        out_dict['messageText'].append(["To read our recent blogs, please visit \"http://sysgsoft.com/SysgBlog.html\""])
	out_dict['messageText'].append(["Portfolios are available at \"http://sysgsoft.com/index.html#Portfolio\""])
        out_dict['messageText'].append([speech[1]])
    	return out_dict

    elif "contact details1" in speech[0]:
        out_dict['messageText'].append(["You can contact us at \"+35 3877.835.397\" or \"info@sysgsoft.com\""])
        out_dict['messageText'].append([speech[1]])
    	return out_dict

    else:
	
	if len(speech)>1:
		out_dict['messageText'].append([speech[0]])
		out_dict['messageText'].append([speech[1]])
	else:
		out_dict['messageText'].append([speech])
	return out_dict

