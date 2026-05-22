import React from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;
  return (
    <div className={`toast ${type}`}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      <span>{message}</span>
      <button onClick={onClose} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',marginLeft:'auto',fontSize:16}}>×</button>
    </div>
  );
}
