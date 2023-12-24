import random
from datetime import datetime


def generate_order_id():
    now = datetime.now().strftime("%Y%m%d%H%M%S")
    random_number = random.randint(0, 999999)
    return now + f'{random_number:06d}'
