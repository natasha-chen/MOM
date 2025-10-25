from google import genai
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get API key from .env
api_key = os.getenv("GEMINI_API_KEY")

# Initialize the Gemini client with your API key
client = genai.Client(api_key=api_key)

# Generate a response
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Explain how to tie your shoelaces"
)

print(response.text)
