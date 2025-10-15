import React from 'react'
import '../STYLE/Inputinfo.css';
const Inputinfo = () => {
  return (
   <>
  <div className="info-section">
  <h2>💡 Understand Your Health Inputs</h2>
  <div className="info-grid">
    <div className="info-card">
      <h3>Age</h3>
      <p>Your risk of heart disease increases as you get older.</p>
      <ul>
        <li><span className="low">🟢 Young (&lt;40):</span> Low risk, healthy lifestyle matters.</li>
        <li><span className="medium">🟡 Middle-aged (40–60):</span> Moderate risk, checkups important.</li>
        <li><span className="high">🔴 Older (60+):</span> Higher risk, regular monitoring needed.</li>
      </ul>
    </div>

    <div className="info-card">
      <h3>Blood Pressure</h3>
      <p>Pressure of blood in your arteries while resting.</p>
      <ul>
        <li><span className="low">🟢 Normal (90–120):</span> Healthy.</li>
        <li><span className="medium">🟡 Medium (121–139):</span> Watch diet/exercise.</li>
        <li><span className="high">🔴 High (140+):</span> Risk of heart disease/stroke.</li>
      </ul>
    </div>

    <div className="info-card">
      <h3>Cholesterol</h3>
      <p>Fat in your blood; too much can block blood flow.</p>
      <ul>
        <li><span className="low">🟢 Normal (&lt;200):</span> Healthy.</li>
        <li><span className="medium">🟡 Medium (200–239):</span> Borderline; adjust diet.</li>
        <li><span className="high">🔴 High (240+):</span> Risk of heart attack.</li>
      </ul>
    </div>

    <div className="info-card">
      <h3>Blood Sugar</h3>
      <p>Amount of sugar in blood after fasting.</p>
      <ul>
        <li><span className="low">🟢 Normal (&lt;100):</span> Healthy.</li>
        <li><span className="medium">🟡 Medium (100–125):</span> Prediabetes stage.</li>
        <li><span className="high">🔴 High (126+):</span> Diabetes, higher heart risk.</li>
      </ul>
    </div>

    <div className="info-card">
      <h3>ECG Result</h3>
      <p>Heart's electrical activity at rest.</p>
      <ul>
        <li><span className="low">🟢 Normal:</span> Healthy heart.</li>
        <li><span className="medium">🟡 Minor problem:</span> Slight stress in heart.</li>
        <li><span className="high">🔴 Major changes:</span> Possible heart muscle issues.</li>
      </ul>
    </div>

    <div className="info-card">
      <h3>Max Heart Rate</h3>
      <p>Highest heartbeat during exercise.</p>
      <ul>
        <li><span className="low">🟢 Normal (120–170):</span> Healthy.</li>
        <li><span className="medium">🟡 Too Low (&lt;100):</span> Weak heart fitness.</li>
        <li><span className="high">🔴 Too High (&gt;190):</span> Heart stress risk.</li>
      </ul>
    </div>

    <div className="info-card">
      <h3>Exercise Chest Pain</h3>
      <p>Do you feel chest pain during exercise?</p>
      <ul>
        <li><span className="low">🟢 No:</span> Normal.</li>
        <li><span className="high">🔴 Yes:</span> Could indicate blocked arteries.</li>
      </ul>
    </div>

    <div className="info-card">
      <h3>ST Depression</h3>
      <p>ECG change showing heart stress during exercise.</p>
      <ul>
        <li><span className="low">🟢 Low (0–1):</span> Usually normal.</li>
        <li><span className="medium">🟡 Medium (1–2):</span> Possible warning.</li>
        <li><span className="high">🔴 High (2+):</span> Strong risk of heart problems.</li>
      </ul>
    </div>
  </div>
</div>

   </>
  )
}

export default Inputinfo
