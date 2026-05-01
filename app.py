from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder="wdm", static_folder="static")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.json
    criteria = data["criteria"]
    options = data["options"]
    scores = data["scores"]

    total_weight = sum(c["weight"] for c in criteria) or 1

    results = []
    for o in options:
        score = 0
        for c in criteria:
            key = f"{o['id']}_{c['id']}"
            val = scores.get(key, 5)
            score += val * (c["weight"] / total_weight)

        results.append({
            "name": o["name"],
            "score": round(score, 2)
        })

    results.sort(key=lambda x: x["score"], reverse=True)

    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True)
