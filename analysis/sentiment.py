from flask import Flask, request, jsonify
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from huggingface_hub import hf_hub_url


app = Flask(__name__)
analyzer = SentimentIntensityAnalyzer()

@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    data = request.get_json()
    messages = data.get("messages", [])
    results = []

    for msg in messages:
        sentiment = analyzer.polarity_scores(msg["text"])
        normal_sentiment = analyzer.polarity_scores(msg["normalText"])
        if sentiment['compound'] >= 0.05:
            msg["sentiment"] = "Positive"
        elif sentiment['compound'] <= -0.05:
            msg["sentiment"] = "Negative"
        else:
            msg["sentiment"] = "Neutral"
        results.append(msg)
        if normal_sentiment['compound'] >= 0.05:
            msg["normalSentiment"] = "Positive"
        elif normal_sentiment['compound'] <= -0.05:
            msg["normalSentiment"] = "Negative"
        else:
            msg["normalSentiment"] = "Neutral"
        results.append(msg)
            

    return jsonify(results)

@app.route('/summarize', methods=['POST'])
def generateSummary(text) {
  try {
    const response = await hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: text,
      parameters: {
        max_length: 130,
        min_length: 30,
      },
    });
    return response.summary_text;
  } catch (error) {
    console.error('Error:', error);
    return 'Failed to generate summary.';
  }
}



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
    
    
