import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  variant?: 'success' | 'error';
}

export function Toast({ message, isVisible, onClose, variant = 'success' }: ToastProps) {
  const border = variant === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`${border} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
            <span>{message}</span>
            <button
              onClick={onClose}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
