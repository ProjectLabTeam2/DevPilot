import os
import json
import gzip
import base64
import urllib3

http = urllib3.PoolManager(cert_reqs='CERT_NONE') 

def lambda_handler(event, context):
    print("🟡 Evento recibido:", json.dumps(event))
    data = gzip.decompress(base64.b64decode(event['awslogs']['data']))
    payload = json.loads(data)

    for log_event in payload['logEvents']:
        message = log_event['message']
        timestamp = log_event['timestamp']

        body = json.dumps({
            "event": message,
            "time": timestamp,
            "sourcetype": "_json"
        })

        response = http.request(
            "POST",
            os.environ['HEC_URL'] + "/services/collector",
            body=body,
            headers={
                "Authorization": "Splunk " + os.environ['HEC_TOKEN'],
                "Content-Type": "application/json"
            }
        )

    return {"statusCode": 200}