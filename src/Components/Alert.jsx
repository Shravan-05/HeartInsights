import React, { useEffect } from 'react';
import '../STYLE/Alert.css';

const Alert = (props) => {
  const closepopup = () => {
    props.setpopup({ msg: '', type: '' });
  };

  useEffect(() => {
    if (props.popup.msg) {
      const timer = setTimeout(() => {
        props.setpopup({ msg: '', type: '' });
      }, 9000);

      return () => clearTimeout(timer); 
    }
  }, [props.popup, props.setpopup]);

  return (
    props.popup.msg && (
      <div className={`${props.popup.type === 'success' ? 'success' : 'danger'} alertmain`}>
        <img
          src="https://cdn-icons-png.flaticon.com/128/2732/2732657.png"
          id="closepopup"
          alt="Close"
          onClick={closepopup}
        />
        <p id="popupinfo">
          <strong>{props.popup.type === 'danger' ? 'Alert' : props.popup.type}!</strong>{' '}
          {props.popup.msg}
        </p>
      </div>
    )
  );
};

export default Alert;

