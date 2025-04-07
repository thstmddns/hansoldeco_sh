import os
import pandas as pd
import pymysql
import openai

import matplotlib.pyplot as plt
from decimal import Decimal
import datetime

import requests

def send_to_gpt(msgs):
    openai.api_key = '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'
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-0125",
        messages=msgs
    )
    answer = response.choices[0].message['content']
    msgs.append({"role": "assistant", "content": answer})
    return answer

def make_query(answer, chat_id):
    sql_query = answer.split('```sql')[1].split('```')[0]
    conn = pymysql.connect(host='host.docker.internal', port=3306, user='root', password='sosohaja', cursorclass=pymysql.cursors.DictCursor)

    try:
        with conn.cursor() as cursor:
            cursor.execute(sql_query)
            sql_result = cursor.fetchall()
    except pymysql.Error as e:
        sql_result = f"{e}"
    finally:
        conn.close() 
    return sql_result

def make_vis(msgs, answer):
    vis_code = answer.split('```python')[1].split('```')[0]
    try:
        exec(vis_code)
        vis_result = True
    except Exception as e:
        vis_result = str(e)
        msgs.append({"role": "user", "content": vis_result})
        answer = send_to_gpt(msgs)
    return answer, vis_result

def upload_s3():
    try:
        s3_url = "https://0q7pd90v95.execute-api.ap-northeast-2.amazonaws.com/prod/upload"
        with open("output.png", "rb") as result_image:
            files = {"file": ('output.png', result_image, "image/png")}
            response = requests.post(s3_url, files=files)
        image_url = response.text
        os.remove("output.png")
    except:
        image_url = "그래프 시각화에 실패했습니다."
    return image_url