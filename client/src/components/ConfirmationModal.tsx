interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4 border-2 border-blue-500">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <p className="text-gray-600 mt-2 mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        No
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
