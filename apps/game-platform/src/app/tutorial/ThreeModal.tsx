
import React from 'react';
import { Html } from '@react-three/drei';
import './ThreeModal.css';

type ThreeModalProps = {
  onContinue: () => void;
  onExit: () => void;
};

const ThreeModal: React.FC<ThreeModalProps> = ({ onContinue, onExit }) => {
  return (
    <Html center>
      <div className="three-modal">
        <div className="modal-content">
          <p>Do you want to continue in tutorial mode..?</p>
          <button onClick={onContinue} className="modal-button">Yes</button>
          <button onClick={onExit} className="modal-button">No</button>
        </div>
      </div>
    </Html>
  );
};

export default ThreeModal;
