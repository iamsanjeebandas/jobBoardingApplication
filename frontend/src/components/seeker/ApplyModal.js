import React from "react";
import ApplyForm from "./ApplyForm";

const ApplyModal = ({ job, closeModal, onJobApplied }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl relative">
                {/* Larger Close Button */}
                <button
                    className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 text-2xl bg-gray-200 hover:bg-gray-300 rounded-full shadow-lg transition duration-300"
                    onClick={closeModal}
                >
                    &times;
                </button>
                <ApplyForm job={job} closeModal={closeModal} onJobApplied={onJobApplied} />
            </div>
        </div>
    );
};

export default ApplyModal;
