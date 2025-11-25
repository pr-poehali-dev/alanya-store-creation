import json
import os
import urllib.request
import urllib.parse
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send order notifications to Telegram group
    Args: event with httpMethod, body containing order details
          context with request_id
    Returns: HTTP response confirming message sent
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Telegram credentials not configured'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    customer_name = body_data.get('name', 'Не указано')
    customer_phone = body_data.get('phone', 'Не указано')
    customer_email = body_data.get('email', 'Не указано')
    items = body_data.get('items', [])
    total = body_data.get('total', '0 ₽')
    comment = body_data.get('comment', '')
    
    message_text = f"""🛍 <b>Новый заказ Alanya Store</b>

👤 <b>Клиент:</b> {customer_name}
📱 <b>Телефон:</b> {customer_phone}
📧 <b>Email:</b> {customer_email}

📦 <b>Товары:</b>
"""
    
    for item in items:
        message_text += f"• {item.get('name', 'Товар')} - {item.get('price', '0 ₽')}\n"
    
    message_text += f"\n💰 <b>Итого:</b> {total}"
    
    if comment:
        message_text += f"\n\n💬 <b>Комментарий:</b> {comment}"
    
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    data = {
        'chat_id': chat_id,
        'text': message_text,
        'parse_mode': 'HTML'
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    urllib.request.urlopen(req)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'success': True, 'message': 'Order sent to Telegram'})
    }
