import json
from service.check import chat_check
from service.utils import make_query, make_vis, send_to_gpt, upload_s3

def save_chat_log(messages, chat_id):
    with open(f"chat_logs/{chat_id}/gpt_log.json", "w") as json_file:
        json.dump(messages, json_file, ensure_ascii = False, indent=4)

def create_answer(text, chat_id):
    msgs = chat_check(chat_id)
    msgs.append({"role": "user", "content": text})
    answer = send_to_gpt(msgs)
    print(answer)
    if "```sql" in answer:
        answer_cnt = 0
        while "```sql" in answer:
            if answer_cnt == 3:
                answer = "표 생성에 실패했습니다. 다시 질문해주세요."
                break
            sql_result = make_query(answer, chat_id)
            msgs.append({"role": "user", "content": str(sql_result)})
            answer = send_to_gpt(msgs)
            print(answer)
            answer_cnt += 1
        save_chat_log(msgs, chat_id)
        return answer, ''

    elif "```python" in answer:
        answer_cnt = 0
        while "```python" in answer:
            if answer_cnt == 3:
                answer = "그래프 시각화에 실패했습니다. 다시 질문해주세요."
                break
            answer, vis_result = make_vis(msgs, answer)
            print(answer)
            if vis_result:
                break
            answer_cnt += 1
        save_chat_log(msgs, chat_id)
        result_url = upload_s3()
        return answer, result_url
    
    else:
        save_chat_log(msgs, chat_id)
        return answer, ''