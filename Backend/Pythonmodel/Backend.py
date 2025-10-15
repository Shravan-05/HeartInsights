from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
from fpdf import FPDF
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64
import tempfile
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

try:
    model = joblib.load("heart_disease_model.pkl")
except Exception as e:
    model = None
    print("Model load failed:", e)

features_order = [
    "Age", "Sex", "ChestPainType", "RestingBP", "Cholesterol",
    "FastingBS", "RestingECG", "MaxHR", "ExerciseAngina", "Oldpeak", "ST_Slope"
]

feature_maps = {
    "Sex": {"M": 1, "F": 0},
    "ChestPainType": {"TA": 0, "ATA": 1, "NAP": 2, "ASY": 3},
    "RestingECG": {"Normal": 0, "ST": 1, "LVH": 2},
    "ExerciseAngina": {"N": 0, "Y": 1},
    "ST_Slope": {"Up": 0, "Flat": 1, "Down": 2}
}

def process_data(data):
    if isinstance(data, dict):
        df = pd.DataFrame([data])
    elif isinstance(data, pd.DataFrame):
        df = data.copy()
    else:
        raise TypeError("Input must be a dict or DataFrame.")

    if "PatientID" in df.columns:
        df = df.drop(columns=["PatientID"])

    feature_maps_full = {
        "Sex": {"M": 1, "F": 0, "Male": 1, "Female": 0},
        "ChestPainType": {
            "TA": 0, "Typical Angina": 0, 
            "ATA": 1, "Atypical Angina": 1,
            "NAP": 2, "Non-anginal Pain": 2, 
            "ASY": 3, "Asymptomatic": 3
        },
        "RestingECG": {
            "Normal": 0, "ST-T Abnormality": 1, "Minor problem in ECG": 1, 
            "LVH": 2, "Thick heart walls (ECG change)": 2
        },
        "ExerciseAngina": {"N": 0, "Y": 1, "No": 0, "Yes": 1},
        "ST_Slope": {"Up": 0, "Flat": 1, "Down": 2}
    }

    for col, mapping in feature_maps_full.items():
        if col in df.columns:
            df[col] = df[col].map(mapping)
            df[col] = df[col].fillna(0)

    if "FastingBS" in df.columns:
        df["FastingBS"] = df["FastingBS"].replace({
            "Yes": 1, "No": 0,
            "Y": 1, "N": 0,
            True: 1, False: 0,
            "True": 1, "False": 0
        }).fillna(0)

    numeric_fields = ["Age", "RestingBP", "Cholesterol", "FastingBS", "MaxHR", "Oldpeak"]
    for field in numeric_fields:
        if field in df.columns:
            df[field] = pd.to_numeric(df[field], errors="coerce").fillna(0)

    return df[features_order]


def generate_impact_graph(input_row, means, patient_id="Patient"):
    if hasattr(input_row, "values"):  
        values = input_row.values.astype(float)
    else:
        values = np.array(input_row, dtype=float)

    feature_importances = model.feature_importances_
    impacts = values * feature_importances

    feature_impacts = list(zip(features_order, impacts))

    top_features = sorted(feature_impacts, key=lambda x: abs(x[1]), reverse=True)[:5]

    labels, top_impacts = zip(*top_features)

    plt.figure(figsize=(6, 3))
    y_pos = np.arange(len(labels))
    plt.barh(y_pos, top_impacts, align="center",
             color=["red" if v > 0 else "green" for v in top_impacts])
    plt.yticks(y_pos, labels)
    plt.xlabel("Estimated Impact")
    plt.title(f"Top 5 Impacted Features - {patient_id}")
    plt.gca().invert_yaxis()  
    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)
    return buf




@app.route("/predict/single", methods=["POST"])
def predict_single():
    try:
        data = request.json
        patient_id = data.get("PatientID", "Patient")

        numeric_df = process_data(data)
        print(numeric_df)

        numeric_input = numeric_df.to_numpy()
        risk_score = model.predict_proba(numeric_input)[0][1] * 100
        prediction = int(model.predict(numeric_input)[0])

        age = numeric_df['Age'].iloc[0]
        bp = numeric_df['RestingBP'].iloc[0]
        chol = numeric_df['Cholesterol'].iloc[0]

        if age > 85 or bp > 180 or chol > 280:
            risk_score = max(risk_score, 80)  
            prediction = 1  

       
        if risk_score >= 70:
            risk_level = "High"
            suggestion = "Consult a doctor immediately."
        elif risk_score >= 40:
            risk_level = "Medium"
            suggestion = "Monitor health carefully."
        else:
            risk_level = "Low"
            suggestion = "Maintain a healthy lifestyle."

        means = numeric_df.mean().values
        graph_img = generate_impact_graph(numeric_df.iloc[0], means, patient_id=patient_id)
        graph_b64 = base64.b64encode(graph_img.read()).decode("utf-8")

        return jsonify({
            "patientId": patient_id,
            "prediction": prediction,
            "riskScore": round(risk_score, 2),
            "riskLevel": risk_level,
            "suggestion": suggestion,
            "mostImpactedFeaturesGraph": graph_b64
        })

    except (KeyError, ValueError) as e:
        return jsonify({"error": f"Invalid or missing data: {e}"}), 400
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500




@app.route("/predict/batch", methods=["POST"])
def predict_batch():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        if not file.filename.lower().endswith(".csv"):
            return jsonify({"error": "Only CSV files allowed."}), 400

        try:
            df_original = pd.read_csv(file)
        except Exception:
            return jsonify({"error": "Invalid CSV file."}), 400

        required_columns = [
            "Age", "Sex", "ChestPainType", "RestingBP", "Cholesterol",
            "FastingBS", "RestingECG", "MaxHR", "ExerciseAngina", "Oldpeak", "ST_Slope"
        ]
        missing_cols = [col for col in required_columns if col not in df_original.columns]
        if missing_cols:
            return jsonify({"error": f"Missing columns: {', '.join(missing_cols)}"}), 400

        patient_ids = df_original.get(
            "PatientID",
            pd.Series([f"Patient_{i+1}" for i in range(len(df_original))])
        )

        df_numeric = process_data(df_original)  
        predictions = model.predict(df_numeric)
        risk_scores = model.predict_proba(df_numeric)[:, 1] * 100

        patients = []
        for idx, patient_id in enumerate(patient_ids):
            risk_score = round(risk_scores[idx], 2)
            prediction = int(predictions[idx])

            if risk_score >= 70:
                risk_level = "High"
                suggestion = "Consult a doctor immediately."
            elif risk_score >= 40:
                risk_level = "Medium"
                suggestion = "Monitor health carefully."
            else:
                risk_level = "Low"
                suggestion = "Maintain healthy lifestyle."

            patients.append({
                "patientId": str(patient_id),
                "prediction": prediction,
                "riskLevel": risk_level,
                "riskScore": risk_score,
                "suggestion": suggestion
            })

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        pdf.cell(200, 10, "Heart Disease Prediction Report", ln=True, align="C")
        pdf.set_font("Arial", size=12)

        means = df_numeric.mean().values
        for idx, patient in enumerate(patients):
            pdf.multi_cell(
                0, 10,
                txt=(f"Patient: {patient['patientId']}\n"
                     f"Prediction: {patient['prediction']}\n"
                     f"Risk Score: {patient['riskScore']}%\n"
                     f"Risk Level: {patient['riskLevel']}\n"
                     f"Suggestion: {patient['suggestion']}\n"
                     f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            )

            graph_buf = generate_impact_graph(df_numeric.iloc[idx], means, patient['patientId'])
            img_path = os.path.join(tempfile.gettempdir(), f"graph_{idx}.png")
            with open(img_path, "wb") as f:
                f.write(graph_buf.read())
            pdf.image(img_path, w=150)
            pdf.ln(5)
            pdf.cell(0, 10, "-------------------------------------------", ln=True)

        pdf_bytes = pdf.output(dest="S").encode("latin-1")
        pdf_base64 = base64.b64encode(pdf_bytes).decode("utf-8")

        return jsonify({
            "pdfBase64": pdf_base64,
            "summary": {
                "high_risk": sum(1 for p in patients if p['riskLevel'] == "High"),
                "medium_risk": sum(1 for p in patients if p['riskLevel'] == "Medium"),
                "low_risk": sum(1 for p in patients if p['riskLevel'] == "Low")
            },
            "patients": patients
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):
    return send_file(os.path.join(tempfile.gettempdir(), filename), as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)
