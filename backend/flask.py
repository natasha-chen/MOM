import os
from google import genai

# Load the API key from the environment variable
api_key = os.getenv("GEMINI_API_KEY")

# Configure the Gemini client
client = genai.Client(api_key=api_key)

# Test the API
response = client.models.generate_content(
    model="gemini-1.5-flash",
    contents="Explain AI in a few words"
)
print(response.text)
