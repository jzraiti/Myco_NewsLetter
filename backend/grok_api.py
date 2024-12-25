import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

GROK_KEY = os.getenv("GROK_KEY")
client = OpenAI(api_key=GROK_KEY, base_url="https://api.x.ai/v1")

completion = client.chat.completions.create(
    model="grok-2-1212",
    messages=[
        {"role": "system", "content": "You are a Grok, helpful assistant."},
        {"role": "user", "content": "What is the weather like today?"},
    ],
)

print(completion.choices[0].message)
