from flask import Flask, request, jsonify
import asyncio
import os
import logging
import traceback
from component.instance_setup import (
    timekeepingDbInstance,
    calculateMonthlySalaryInstance,
    fileHandlingInstance,
)

logging.basicConfig(level=logging.INFO)
app = Flask(__name__)


def main(file):
    try:
        jsonData = fileHandlingInstance.init_file(file)
        timekeepingDbInstance.write_db(jsonData)
        calculateMonthlySalaryInstance.merging_data()
    except:
        logging.error(traceback.format_exc())
        raise


@app.route("/upload", methods=["POST"])
def upload_timekeeping():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        main(file)
        # run timekeeping and calculate monthly salary to push into "salary" collection
        return jsonify({"message": "File has been processed and inputted to DB"}), 200
    except Exception as e:
        logging.error("Error processing file:")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


# running timekeeping data
if __name__ == "__main__":
    app.run(debug=True)
