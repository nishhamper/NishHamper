// /components/ui/Dialog.js
import React from "react";
import Modal from "react-modal";

const Dialog = ({ isOpen, onRequestClose, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-50"
    >
      {children}
    </Modal>
  );
};

export default Dialog;
