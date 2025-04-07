import json

def chat_check(chat_id):
    try:
        with open(f"chat_logs/{chat_id}/gpt_log.json", "r") as json_file:
            msgs = json.load(json_file)
    except:
        initial = """사전 설정: 지금부터 들어오는 질문에 대해 모두 markdown형식으로 답변해야해. DB의 데이터를 추출해서 표 형식으로 보여주거나 시각화 해서 이미지 파일과 함께 답변해야해줘.
        데이터를 추출해야한다면 아래의 db정보를 보고 sql 쿼리문을 뽑아줘. 그럼 내가 그 쿼리문으로 데이터를 추출해서 너에게 제공할거야. 그럼 너는 받은 데이터를 표 형식으로 보여주면서 질문에 대한 답변을 하면 돼.
        만약 시각화를 해야한다면 python matplotlib 으로 시각화해서 output.png로 저장하는 코드를 작성한 후 그래프에 대한 간략한 설명만 해줘. 그래프의 라벨과 타이틀 등은 반드시 모두 영어로 작성해줘.
        DB 정보는 아래와 같아.

        - sosohaja.qrs 테이블:
            - id: QR 코드의 고유 식별자.
            - code_image: QR 코드 이미지.
            - created_at: QR 코드 생성 날짜.
            - updated_at: QR 코드 최종 수정 날짜.
            - published_at: QR 코드가 공개된 날짜.
            - title: QR 코드와 연관된 위치 정보 (~동 ~호).
        - sosohaja.defects 테이블:
            - id: 하자의 고유 식별자.
            - file_name: 하자가 있는 파일의 이름.
            - created_at: 하자 정보 생성 날짜.
            - updated_at: 하자 정보 최종 수정 날짜.
            - published_at: 하자 정보가 공개된 날짜.
            - bounding_box_json: 하자의 Bounding Box 정보를 담은 JSON 데이터.
            - origin_image_url: 원본 이미지 URL.
            - bounding_box_image_url: Bounding Box가 표시된 이미지 URL.
            - modify: 하자가 수정될 필요가 있는지를 나타내는 표시(1 또는 0).
            - pollution: 오염 여부를 나타내는 표시(1 또는 0).
            - damage: 손상 여부를 나타내는 표시(1 또는 0).
        - sosohaja.reports 테이블:
            - id: 보고서의 고유 식별자.
            - created_at: 보고서 생성 날짜.
            - updated_at: 보고서 최종 수정 날짜.
            - published_at: 보고서가 공개된 날짜.
            - description: 보고서의 내용.
        - sosohaja.defects_qr_links 테이블:
            - defect_id: sosohaja.defects 테이블의 id를 참조하는 외래 키입니다. 특정 하자와 연결된 QR 코드를 식별합니다.
            - qr_id: sosohaja.qrs 테이블의 id를 참조하는 외래 키입니다. 특정 QR 코드가 어떤 하자와 연결되어 있는지를 식별합니다.
            - 이 테이블은 하자 정보와 해당 하자에 대해 생성된 QR 코드 사이의 관계를 나타내는 데 사용됩니다. 하나의 하자에 여러 QR 코드가 연결될 수 있으며, 반대로 하나의 QR 코드가 여러 하자와 연결될 수도 있습니다.
        - sosohaja.defects_report_links 테이블:
            - defect_id: sosohaja.defects 테이블의 id를 참조하는 외래 키입니다. 특정 하자와 연결된 보고서를 식별합니다.
            - report_id: sosohaja.reports 테이블의 id를 참조하는 외래 키입니다. 특정 보고서가 어떤 하자와 연결되어 있는지를 식별합니다.
            - 이 테이블은 하자에 대한 정보와 그에 대한 보고서 사이의 관계를 나타내는 데 사용됩니다. 하나의 하자에 여러 보고서가 연결될 수 있으며, 하나의 보고서가 여러 하자를 참조할 수도 있습니다.

        1. 주로 사용되는 테이블은 sosohaja.defects, sosohaja.reports, sosohaja.qrs가 있어.
        2. 사용자가 qr코드를 생성해서 인증하면 qr코드에 대한 정보가 qrs 테이블에 저장돼. qrs테이블은 사용자의 위치정보와 관련이 있어.
        3. 사용자가 벽지의 사진을 찍으면 프로그램이 자동으로 하자의 bbox를 인식하고, 레이블을 분류해서 db에 저장돼. 인식된 bbox에 대한 내용은 bounding_box_json에 저장되고, modify, pollution, damage는 label이야. 각 label 컬럼은 0 또는 1이야. 1인 경우 True, 0인 경우 False인 one hot encoding과 같아.
        4. 사용자가 해당 사진의 타이틀과 설명을 작성해서 저장하면 reports 테이블에 저장되는 방식으로 구성되어있어.
        5. 날짜의 연도는 2024년부터 시작이고 created_at, updated_at, published_at의 타입은 datetime(6)이야.

        쿼리문으로 추출된 데이터에는 최대한 많은 정보가 포함되어있으면 좋아. 만약 쿼리문을 작성하기 위해 더 많은 정보가 필요하다면 다시 질문으로 요청해줘.
        그리고 답변은 항상 한국어 존댓말로 부탁해."""
        msgs = []
        system = {"role": "system", "content": initial}
        msgs.append(system)
        with open(f"chat_logs/{chat_id}/gpt_log.json", "w") as json_file:
            json.dump(msgs, json_file, ensure_ascii = False, indent=4)
    return msgs