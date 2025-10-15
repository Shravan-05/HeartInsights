import { useContext, useEffect, useRef, useState } from "react";
import "../STYLE/Home.css";
import * as Homeassests from '../assets/Images';
import Aos from "aos";
import "aos/dist/aos.css";
import CardiologistsFinder from './Cardiologistfinder.jsx'
import { useNavigate } from "react-router-dom";
import Heartpredictcontext from "../Context/hearpredictcontext.jsx";

const Home = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef();
      let history=useNavigate();
      const context=useContext(Heartpredictcontext);
 const steps = [
    {
      id: "01",
      title: "Input Health Data",
      desc: "Enter your medical information through our secure, user-friendly interface",
      icon: Homeassests.step1,
    },
    {
      id: "02",
      title: "AI Processing",
      desc: "Our neural networks analyze your data using advanced machine learning algorithms",
      icon: Homeassests.step2,
    },
    {
      id: "03",
      title: "Risk Assessment",
      desc: "Get your personalized cardiovascular risk score with detailed explanations",
      icon: Homeassests.step3,
    },
    {
      id: "04",
      title: "Action Plan",
      desc: "Receive customized recommendations and downloadable health reports",
      icon: Homeassests.step4,
    },
  ];


  const phrasesMobile = [
    "Check your heart health now",
    "Quick mobile heart check",
    "Stay heart-healthy on the go",
  ];
  const phrasesTablet = [
    "Predict heart disease risk easily",
    "Your heart health matters",
    "Tablet-friendly heart analysis",
  ];
  const phrasesDesktop = [
    "Advanced heart disease prediction system",
    "Get detailed heart health reports",
    "Predict and prevent heart risks",
  ];

useEffect(() => {
    AOS.init({
      duration: 1200, // Animation duration in ms
      once: true, // Whether animation should happen only once
    });
    if(!context.authToken)
    {
      history("/Login");
    }
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;
    let angle = 0;
    let scale = 1;
    let pulseDirection = 1;

    const drawHeart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      scale += pulseDirection * 0.01;
      if (scale > 1.2) pulseDirection = -1;
      if (scale < 0.9) pulseDirection = 1;
      angle += 0.02;

      const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
      gradient.addColorStop(0, "#ff6b6b");
      gradient.addColorStop(0.5, "#ee5a52");
      gradient.addColorStop(1, "#c44569");
      ctx.fillStyle = gradient;

      ctx.save();
      ctx.translate(200, 200);
      ctx.scale(scale, scale);
      ctx.rotate(Math.sin(angle) * 0.1);

      ctx.beginPath();
      for (let t = 0; t < 2 * Math.PI; t += 0.01) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        );
        const z = Math.sin(t * 2) * 2;
        const adjustedX = x * (1 + z * 0.1);
        const adjustedY = y * (1 + z * 0.1);
        if (t === 0) {
          ctx.moveTo(adjustedX * 4, adjustedY * 4);
        } else {
          ctx.lineTo(adjustedX * 4, adjustedY * 4);
        }
      }
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.arc(-20, -30, 15, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.fill();

      ctx.restore();

      for (let i = 0; i < 20; i++) {
        const particleAngle = (angle * 2 + i * 0.3) % (Math.PI * 2);
        const particleX =
          200 + Math.cos(particleAngle) * (100 + Math.sin(angle * 3 + i) * 30);
        const particleY =
          200 + Math.sin(particleAngle) * (80 + Math.cos(angle * 3 + i) * 20);
        const particleSize = 2 + Math.sin(angle * 4 + i) * 1;
        ctx.beginPath();
        ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 107, 107, ${
          0.3 + Math.sin(angle * 2 + i) * 0.2
        })`;
        ctx.fill();
      }
    };

    const animate = () => {
      drawHeart();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  useEffect(() => {
    const getPhrases = () => {
      const w = window.innerWidth;
      if (w < 600) return phrasesMobile;
      if (w < 1024) return phrasesTablet;
      return phrasesDesktop;
    };

    let phrases = getPhrases();
    let i = 0,
      j = 0,
      deleting = false;
    const el = document.getElementById("type");

    const type = () => {
      const text = phrases[i];
      if (!deleting) {
        el.textContent = text.slice(0, ++j);
        if (j === text.length) {
          deleting = true;
          setTimeout(type, 2000);
          return;
        }
      } else {
        el.textContent = text.slice(0, --j);
        if (j === 0) {
          deleting = false;
          i = (i + 1) % phrases.length;
        }
      }
      setTimeout(type, deleting ? 50 : 100);
    };

    window.addEventListener("resize", () => {
      phrases = getPhrases();
      i = 0;
      j = 0;
      deleting = false;
    });

    type();
  }, []);

  return (
    <div id="home">
      <div id="main" data-aos="fade-right">
        <div id="main1">
          <div id="type"></div>
          <p>
            Advanced AI-powered analysis to assess your cardiovascular health
            risk in seconds. Get personalized insights and recommendations from
            our intelligent prediction system.
          </p>
        </div>
        <div id="main2" data-aos="fade-left">
          <canvas
            ref={canvasRef}
            style={{
              display: "block",
              filter: "drop-shadow(0 10px 30px rgba(255, 107, 107, 0.3))",
              borderRadius: "20px",
            }}
            width={400}
            height={400}
          />
        </div>
      </div>
      {/*
    whychooseus=wcu
    */}
      <div id="wcu">
        <div id="wcu1">
          <h1 id="wcuheader"> Why Choose HeartPredict?</h1>
          <p id="wcup">
            Experience the future of cardiovascular health assessment with our
            cutting-edge Al technolongy.
          </p>
        </div>
        <div id="wcu2">
          <div className="wcucards1" data-aos="zoom-in">
          <div className="img"> <img src={Homeassests.instant} className="imgtag"/></div> 
            <p className="wcucardsheader">Instant Prediction</p>
            <p className="wcucardsinfo">
              Get your heart disease risk assessment in seconds with our
              advanced Al algorithms
            </p>
          </div>
           <div className="wcucards2" data-aos="zoom-in">
          <div className="img img2"> <img src={Homeassests.sheild} className="imgtag"/></div> 
            <p className="wcucardsheader">Secure & Private</p>
            <p className="wcucardsinfo">
          Your health data is encrypted and never stored on our
servers for maximum privacy
            </p>
          </div>
           <div className="wcucards3" data-aos="zoom-in">
          <div className="img img3"> <img src={Homeassests.ai} className="imgtag imgtag3"/></div> 
            <p className="wcucardsheader">Al-Powered</p>
            <p className="wcucardsinfo">
        Machine learning model trained on thousands of
medical records for accurate predictions
            </p>
          </div>
           <div className="wcucards4" data-aos="zoom-in">
          <div className="img img4"> <img src={Homeassests.location} className="imgtag imgtag4" /></div> 
            <p className="wcucardsheader">Nearby Access to Cardiologists</p>
            <p className="wcucardsinfo">
         This feature allows users to quickly find and access cardiologists located near their current location. 
            </p>
          </div>
        </div>
      </div>
   {/*How It Works */}
<div className="how-it-works" >
  {/* Background bubbles */}
  <div className="bubbles">
    <div className="bubble bubble1" data-aos="zoom-in"></div>
    <div className="bubble bubble2" data-aos="zoom-in"></div>
    <div className="bubble bubble3" data-aos="zoom-in"></div>
  </div>

  <h2>
    How It <span>Works</span>
  </h2>
  <p className="subtitle">
    Four simple steps to get your comprehensive heart health assessment
  </p>

  <div className="steps">
    {steps.map((step) => (
      <div key={step.id} className="step-card" data-aos="zoom-in">
        <div className="circlesteps">{step.id}</div>
        <h3>{step.title}</h3>
        <p>{step.desc}</p>
      </div>
    ))}
  </div>
</div>


    {/* NAER BY CARDIOLOGIST SECTION =LCS*/}
{context.role=='Patient'&&<CardiologistsFinder/>}
    </div>
  );
};

export default Home;
