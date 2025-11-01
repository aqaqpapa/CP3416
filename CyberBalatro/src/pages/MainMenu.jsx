import React from 'react';
import { useNavigate } from 'react-router-dom';

// --- 【关键修复】: 使用你提供的正确文件名进行导入 ---
import icon1Url from '../assets/decorations/cctv-camera.svg';
import icon2Url from '../assets/decorations/cyborg-face.svg';
import icon3Url from '../assets/decorations/circuitry.svg';

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    color: '#f0f0f0',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    fontSize: '8vw',
    fontWeight: 'bold',
    color: '#ffde59',
    textShadow: '0 0 10px #ffde59, 0 0 20px #ffde59',
    margin: '0 0 20px 0',
    letterSpacing: '5px',
    zIndex: 2,
  },
  subtitle: {
    fontSize: '2vw',
    color: '#aaa',
    margin: '0 0 50px 0',
    zIndex: 2,
  },
  startButton: {
    padding: '20px 50px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    backgroundColor: '#ffde59',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(255, 222, 89, 0.5)',
    transition: 'all 0.3s ease',
    zIndex: 2,
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  iconWrapper: {
    position: 'absolute',
    opacity: 0.08,
  }
};

const getIconStyle = (index) => {
  const positions = [
    { top: '10%', left: '15%', size: '15vw' },
    { top: '60%', left: '80%', size: '20vw' },
    { top: '25%', left: '70%', size: '10vw' },
  ];
  return positions[index % positions.length];
};


export default function MainMenu() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/game');
  };

  const icons = [icon1Url, icon2Url, icon3Url];

  return (
    <div style={styles.container}>
      <div style={styles.iconContainer}>
        {icons.map((url, index) => {
          const pos = getIconStyle(index);
          return (
            <img 
              key={index}
              src={url} 
              alt="decorative icon"
              style={{
                ...styles.iconWrapper,
                top: pos.top,
                left: pos.left,
                width: pos.size,
                height: pos.size,
              }}
            />
          );
        })}
      </div>

      <h1 style={styles.title}>CyberBalatro</h1>
      <p style={styles.subtitle}>A Gamified Cybersecurity Training Experience</p>
      <button 
        style={styles.startButton}
        onClick={handleStartGame}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
         Enter 
      </button>
    </div>
  );
}
