import React from 'react';

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="modal-content bg-white p-6 rounded-lg w-96">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">X</button>
        {children}
      </div>
    </div>
  );
};

export { Modal };
