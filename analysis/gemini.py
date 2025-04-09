from google import genai
from datetime import datetime
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Initialize Gemini API based on evnironment variable
API_KEY = os.getenv('GENAI_API_KEY')


@app.route('/generateTopics', methods=['POST'])
def generate_topics():
    client = genai.Client(api_key=API_KEY)


    """
    Generates key topics from chat messages using Gemini API.
    """
    # Get chat messages from request
    data = request.get_json()
        
    if not data:
        return jsonify({"error": "Invalid JSON body"}), 400

    chat_messages = data.get("chat_messages",[])
    video_title = data.get("chat_title", "No title provided")
    video_description = data.get("chat_description", "No description provided")

    print("\n✅ Extracted Messages:")
    messages = "" 

    for msg in chat_messages:
        messages += f"{msg.get('author')}: {msg.get('text')}\n"  # Append each message properly

    # Validate chat_messages
    if not messages.strip():  # Check if messages are empty after formatting
        return jsonify({"error": "No valid chat messages received"}), 400

    
    prompt = f"""
    Extract three key topics that describe the overall conversation. This is to be displayed at the top of chat to give a quick overview of the conversation.
    
    Title:
    {video_title}
    
    Description:
    {video_description}
    
    Messages:
    {messages}
    
    Output format:
    Each item must be wrapped in double quotes, followed by one emoji, with a single space between the quoted text and the emoji.

    Separate multiple items using commas, all on one line per category.

    No explanations, just return the output in the format above.
    """
    
    # Generate response using Gemini
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
    )
    
    
    return jsonify(response.text)


@app.route('/generateSummary', methods=['POST'])
def generate_summary():
    
    client = genai.Client(api_key=API_KEY)

    """
    Generate summary from chat messages using Gemini API.
    """
    
    try:
        # Get JSON request data
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Invalid JSON body"}), 400

        chat_messages = data.get("chat_messages",[])
        video_title = data.get("chat_title", "No title provided")
        video_description = data.get("chat_description", "No description provided")

        messages = ""

        for msg in chat_messages:
            messages += f"{msg.get('author')}: {msg.get('text')}\n"  # Append each message properly

        # Validate chat_messages
        if not messages.strip():  # Check if messages are empty after formatting
            return jsonify({"error": "No valid chat messages received"}), 400
        

        # Construct prompt
        prompt = f"""
        Given the following chat messages, provide an abstract summary capturing the main ideas.
        This is to be displayed at the top of chat to give a quick overview of the conversation. Make it brief by excluding things that should be known by a viewer ie the video name
        
        Youtube Live Title: 
        {video_title}
        
        Live Description:
        {video_description}
        
        Messages:
        {messages}
        
        Output should be 2 sentences
        """
        # print(prompt)
        # # Generate response using Gemini
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,  # ✅ Corrected payload
        )
        print(response)
        print("response: "+ response.text)
        
        # model = genai.GenerativeModel('gemini-1.5-flash-latest')
        # response = model.generate_content(prompt)
        return jsonify(response.text)
    
    except Exception as e:
        print("Error in generate_summary:", e)
        return jsonify({"error": "Failed to generate summary"}), 500
    
@app.route('/generateLanguages', methods=['POST'])
def generate_languages():
    client = genai.Client(api_key=API_KEY)



    """
    Generates detected languages from chat messages using Gemini API.
    """
    # Get chat messages from request
    data = request.get_json()
        
    if not data:
        return jsonify({"error": "Invalid JSON body"}), 400

    chat_messages = data.get("chat_messages",[])
    video_title = data.get("chat_title", "No title provided")
    video_description = data.get("chat_description", "No description provided")

    print("\n✅ Extracted Messages:")
    messages = ""  

    for msg in chat_messages:
        messages += f"{msg.get('author')}: {msg.get('text')}\n"  # Append each message properly

    # Validate chat_messages
    if not messages.strip():  # Check if messages are empty after formatting
        return jsonify({"error": "No valid chat messages received"}), 400

    
    prompt = f"""
    Find the different languages present in the chat messages. 

    Messages:
    {messages}
    
    Output format:
    Each item must be wrapped in double quotes, followed by one emoji, with a single space between the quoted text and the emoji.

    Separate multiple items using commas, all on one line per category.

    No explanations, just return the output in the format above.
    """
    
    # Generate response using Gemini
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
    )
    
    
    return jsonify(response.text)
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
