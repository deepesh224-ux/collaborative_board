import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Zap, Users, Loader2, CheckCircle2 } from 'lucide-react';

const steps = [
    { id: 'join', label: 'Joining Board...', icon: <Zap size={20} /> },
    { id: 'peers', label: 'Connecting to Peers...', icon: <Users size={20} /> },
    { id: 'crdt', label: 'Synchronizing CRDT State...', icon: <Loader2 size={20} /> },
    { id: 'ready', label: 'Canvas Ready!', icon: <CheckCircle2 size={20} /> },
];

export function LoadingPage({ onComplete }: { onComplete: () => void }) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (currentStep < steps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 800 + Math.random() * 600);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(onComplete, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentStep, onComplete]);

    return (
        <div className="loading-overlay">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="loading-card glass"
            >
                <div className="loading-header">
                    <Loader2 className="spinner" />
                    <h2>Setting up your workspace</h2>
                </div>

                <div className="loading-steps">
                    {steps.map((step, idx) => {
                        const isCompleted = idx < currentStep;
                        const isActive = idx === currentStep;

                        return (
                            <div key={step.id} className={`loading-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                                <div className="step-icon">
                                    {isCompleted ? <CheckCircle2 size={18} /> : step.icon}
                                </div>
                                <span>{step.label}</span>
                                {isActive && <motion.div layoutId="active-indicator" className="active-dot" />}
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
