
import React, { useState } from 'react';
import '../STYLE/About.css';
import { FaReact, FaDatabase, FaRobot, FaHeartbeat, FaBrain, FaChartLine, FaBullseye, FaEye, FaUsers } from 'react-icons/fa';
import { SiPython, SiTensorflow, SiScikitlearn, SiMongodb,SiExpress, SiNodedotjs, SiApifox, SiAppian } from 'react-icons/si';
import { GiCycle } from 'react-icons/gi';
import { VscServerProcess } from 'react-icons/vsc';

const FlipCard = ({ frontContent, backContent }) => (
  <div className="flip-card">
    <div className="flip-card-inner">
      <div className="flip-card-front">{frontContent}</div>
      <div className="flip-card-back">{backContent}</div>
    </div>
  </div>
);

const teamMembers = [
  { name: 'Pranav Dabade', role: 'Frontend & UI/UX', image: "https://media.licdn.com/dms/image/v2/D4D03AQFEq65J7dV0YA/profile-displayphoto-shrink_200_200/B4DZeLbx3aGkAc-/0/1750391007117?e=1763596800&v=beta&t=e8E5vdQPUG2RljyB8gpM70fFWhLUnSyhlCT6_QX7u3A", bio: 'Passionate about crafting intuitive and beautiful user interfaces that provide a seamless user experience. Specializes in React and modern CSS.' },
  { name: 'Shravan Ghorpade', role: 'Backend Architect', image: "https://media.licdn.com/dms/image/v2/D4D03AQH8tnpN_ucXVg/profile-displayphoto-scale_200_200/B4DZiPR9Z7GQAY-/0/1754750508415?e=1763596800&v=beta&t=GMkvEPvu-1TUeraWjJkVK7_GUUMKzZqG56qIKkJPszY", bio: 'Expert in building robust, scalable server-side applications and APIs. Ensures our system is fast, secure, and reliable.' },
  { name: 'Rohit patil', role: 'AI & ML Specialist', image:"https://media.licdn.com/dms/image/v2/D5603AQHfi1Nf5wNggQ/profile-displayphoto-scale_200_200/B56ZjUqaobHUAc-/0/1755914546955?e=1763596800&v=beta&t=5cvrWlK3I4pyo4414MCgzZVxriwoLRSGHx15c5JWfeY", bio: 'Dedicated to developing cutting-edge machine learning models that deliver accurate and actionable health predictions.' },
  { name: ' Atul Bhagwat', role: 'Database Administrator', image:"https://media.licdn.com/dms/image/v2/D5603AQH1kMyMc0Q5-w/profile-displayphoto-scale_200_200/B56ZeIPnwhGQAY-/0/1750337488801?e=1763596800&v=beta&t=_C9NLNzGGpvHtED76UtPJTW-8QstIlOKXnUpONZtHkc", bio: 'Dedicated to developing cutting-edge machine learning models that deliver accurate and actionable health predictions.' },

];

const technologies = [
  { name: 'React', icon: <FaReact />, description: 'We use React to build a fast, responsive, and dynamic single-page application, ensuring an excellent user experience.' },
  { name: 'Python', icon: <SiPython />, description: 'Python is the backbone of our project, powering everything from our backend API with FastAPI to our machine learning models.' },
  { name: 'MongoDB', icon: <SiMongodb />, description: 'Our choice for a flexible, scalable NoSQL database. It allows us to store complex user health data securely and efficiently.' },
  { name: 'Express', icon: <SiExpress />, description: 'Express.js helps  website or app communicate with databases and frontend (like React) by handling HTTP requests such as GET, POST, PUT, DELETE..' },
  { name: 'Scikit-learn', icon: <SiScikitlearn />, description: 'Essential for data preprocessing, feature engineering, and implementing classical machine learning algorithms alongside TensorFlow.' },
    { name: 'Nodejs', icon: <SiNodedotjs />, description: 'Node.js is a runtime environment that allows you to run JavaScript outside the browser, mainly used to build server-side (backend) application.' },
    { name: 'API', icon: "API", description: 'Google Maps API → Lets your app show maps, locations, and routes, e.g., nearby hospitals, danger zones, or safe paths.Google Gemini API → Lets your app understand and generate intelligent responses using AI, e.g., explain predictions, analyze data, or act as a smart chatbot.' },

];

const aiProcess = [
    { icon: <FaDatabase />, title: '1. Data Collection', description: 'We aggregate anonymized data from diverse medical sources to build a robust and comprehensive dataset.' },
    { icon: <VscServerProcess />, title: '2. Model Training', description: 'Our AI is trained to recognize complex patterns and correlations between various health parameters and heart disease outcomes.' },
    { icon: <FaChartLine />, title: '3. Risk Prediction', description: 'The model analyzes user input against its learned patterns to generate a personalized heart disease risk score with high accuracy.' },
    { icon: <FaBrain />, title: '4. Actionable Insights', description: 'Beyond prediction, our system provides personalized recommendations to help users mitigate risks and improve their health.' },
]

const About = (props) => {
  const [credentials,setcredentials]=useState({name:'',email:'',msg:''});
const onchangehandler=(e)=>{
setcredentials({...credentials,[e.target.name]:e.target.value});
}
const clickhandler=async(e)=>{
  e.preventDefault();
  const response = await fetch("http://localhost:5000/api/auth/feedback", {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name":credentials.name,
          "email":credentials.email,
          "msg":credentials.msg,
        })

    });
    const res = await response.json();

    if(res.success)
    {
              props.setpopupfun({ msg: 'Feedback sent Successfully',type: "success" });

    }
    else
    {
                    props.setpopupfun({ msg: 'ERROR in sending feedback',type: "danger" });

    }

  
  setcredentials({name:'',email:'',msg:''});
}

  return (
    <div className="about-page">
      <section className="about-section hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Pioneering a New Era of Cardiac Health</h1>
          <p className="hero-subtitle">Our AI-powered Heart Disease Prediction System empowers you to take control of your cardiovascular well-being through intelligent, data-driven insights.</p>
          <a href="/prediction" className="cta-button">Get Your Prediction</a>
        </div>
        <div className="hero-iframe">
          <iframe
            title="Human Heart Anatomy"
            src="https://sketchfab.com/models/2e6726aca3e64c56b8f8d7cceae17a28/embed?camera=0&autoplay=1&ui_infos=0&ui_controls=0"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          ></iframe>
        </div>
      </section>
      
      <section className="about-section mission-vision-section">
        <div className="mission-card">
          <FaBullseye className="mission-icon" />
          <h2>Our Mission</h2>
          <p>To make early detection of heart disease accessible and affordable for everyone. We strive to bridge the gap between technology and healthcare, providing a tool that saves lives through proactive prevention.</p>
        </div>
        <div className="mission-card">
          <FaEye className="mission-icon" />
          <h2>Our Vision</h2>
          <p>We envision a future where cardiovascular diseases are no longer a leading cause of mortality. A world where individuals are empowered with personalized knowledge to lead longer, healthier lives.</p>
        </div>
      </section>

      <section className="about-section ai-model-section">
        <h2 className="section-title">How Our AI Delivers Insights</h2>
        <div className="ai-process-container">
            {aiProcess.map((step, idx) => (
                <div className="ai-process-step" key={idx}>
                    <div className="ai-process-icon">{step.icon}</div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                </div>
            ))}
        </div>
      </section>

      <section className="about-section tech-section">
        <h2 className="section-title">The Technology Behind the Prediction</h2>
        <div className="card-container tech-container">
          {technologies.map((tech, idx) => (
            <FlipCard
              key={idx}
              frontContent={
                <>
                  <div className="tech-icon">{tech.icon}</div>
                  <h3>{tech.name}</h3>
                </>
              }
              backContent={
                <>
                  <h3>Why {tech.name}?</h3>
                  <p>{tech.description}</p>
                </>
              }
            />
          ))}
        </div>
      </section>

      <section className="about-section team-section">
        <h2 className="section-title">Meet Our Dedicated Team</h2>
        <div className="card-container">
          {teamMembers.map((member, idx) => (
            <FlipCard
              key={idx}
              frontContent={
                <>
                  <img src={member.image} alt={member.name} className="team-image"/>
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </>
              }
              backContent={
                <div className="team-bio-content">
                    <h3>{member.name}</h3>
                    <p>{member.bio}</p>
                </div>
              }
            />
          ))}
        </div>
      </section>

      <section className="about-section contact-section">
          <h2 className="section-title">Get In Touch</h2>
          <p className="contact-subtitle">
            Have a question, feedback, or a partnership inquiry? We'd love to hear from you!
          </p>
          <form className="contact-form" onSubmit={clickhandler}>
            <div className="form-group">
                <input type="text" placeholder="Your Name" required  name="name" value={credentials.name} onChange={onchangehandler}/>
                <input type="email" placeholder="Your Email" required name="email" value={credentials.email} onChange={onchangehandler}/>
            </div>
            <textarea placeholder="Your Message" rows="6" required name="msg" value={credentials.msg} onChange={onchangehandler}></textarea>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
      </section>
    </div>
  );
};

export default About;