import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import homeImg from '../photos/home.png';

export function LandingPage() {
    return (
        <div className="landing-container">
            <nav className="landing-nav">
                <div className="logo" style={{ fontSize: '24px', fontWeight: 800 }}>
                    MyBoard
                </div>
                <div className="nav-links">
                    <a>Product</a>
                    <select><option>Features</option></select>
                    <a>Company</a>
                    <a>Solutions</a>
                </div>
                <div className="nav-actions">
                    <Link to="/login" className="login-link">Login</Link>
                </div>
            </nav>


            <main className="hero-main">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="whiteboard-mockup-container"
                >
                    <img src={homeImg} alt="Whiteboard Mockup" />
                </motion.div>

                <div className="hero-split">
                    <div className="hero-split-left">
                        <motion.h1
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Whiteboard<br />Design & Ideas<br />Collaboration
                        </motion.h1>
                    </div>

                    <div className="hero-split-right">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Forget about sharing ideas in many different places. We integrated all
                            the features you need in one place to speed up the workflow process.
                            Focus on the ideas & creative part only.
                        </motion.p>


                        <div className="abstract-graphic">
                            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                                <circle cx="50" cy="50" r="40" />
                                <ellipse cx="50" cy="50" rx="40" ry="15" />
                                <ellipse cx="50" cy="50" rx="15" ry="40" />
                            </svg>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
