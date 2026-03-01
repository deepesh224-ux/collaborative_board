import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import cartoonStudying from '../photos/cartoon_studying.png';
import cartoonWriting from '../photos/cartoon_writing.png';
import cartoonDrawing from '../photos/cartoon_drawing.png';
import cartoonIdea from '../photos/cartoon_idea.png';

export function LandingPage() {
    return (
        <div className="landing-container">
            <nav className="landing-nav">
                <div className="logo" style={{ fontSize: '24px', fontWeight: 800 }}>
                    MyBoard
                </div>
                <div className="nav-links">
                </div>
            </nav>


            <main className="hero-main">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-5xl mx-auto mb-16 relative bg-[#fdfdfd] border-[6px] border-slate-800 rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.12)] h-[440px]"
                >
                    {/* Grid Pattern */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-50"
                        style={{
                            backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />
                    {/* Art assets and drawing lines on the canvas */}
                    {/* Wavy drawing line */}
                    <motion.svg
                        className="absolute top-[35%] left-[15%] w-full h-[200px] pointer-events-none scale-150"
                        viewBox="0 0 800 200"
                    >
                        <motion.path
                            d="M 100,100 C 200,150 250,50 350,100 S 450,150 550,100 S 650,50 750,100"
                            fill="transparent"
                            stroke="#10B981"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray="1000"
                            initial={{ strokeDashoffset: 1000 }}
                            animate={{ strokeDashoffset: [1000, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.svg>

                    {/* Paint splash */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[30%] right-[35%] text-[5rem] rotate-12 opacity-80"
                        style={{ filter: "drop-shadow(0 5px 15px rgba(236,72,153,0.4))" }}
                    >
                        🎨
                    </motion.div>

                    {/* Animated Characters Grid */}
                    {/* Character Idea */}
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [-15, 15, -15] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[5%] left-[18%] w-48 select-none"
                    >
                        <img src={cartoonIdea} alt="Cartoon Idea" className="w-full h-auto" style={{ mixBlendMode: 'multiply', filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.15))" }} />
                        <motion.span
                            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-2 -right-6 text-4xl"
                            style={{ filter: "drop-shadow(0 0 10px rgba(250,204,21,0.6))" }}
                        >
                            ⭐
                        </motion.span>
                    </motion.div>

                    {/* Character Writing */}
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-[2%] left-[5%] w-56 select-none"
                    >
                        <img src={cartoonWriting} alt="Cartoon Writing" className="w-full h-auto mx-auto" style={{ mixBlendMode: 'multiply', filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.15))" }} />
                        {/* Magic Wand line being drawn */}
                        <motion.svg
                            className="absolute top-8 -right-32 w-32 h-16 pointer-events-none"
                            viewBox="0 0 100 50"
                        >
                            <motion.path
                                d="M0,25 Q20,5 50,25 T100,25"
                                fill="transparent"
                                stroke="#A855F7"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray="100"
                                animate={{ strokeDashoffset: [100, 0, 100] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </motion.svg>
                    </motion.div>

                    {/* Character Studying */}
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [-20, 20, -20] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute bottom-[2%] left-[40%] w-56 select-none z-10"
                    >
                        <img src={cartoonStudying} alt="Cartoon Studying" className="w-full h-auto mx-auto" style={{ mixBlendMode: 'multiply', filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.15))" }} />
                    </motion.div>

                    {/* Character Drawing */}
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [-12, 12, -12] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                        className="absolute top-[5%] right-[15%] w-48 select-none"
                    >
                        <img src={cartoonDrawing} alt="Cartoon Drawing" className="w-full h-auto mx-auto" style={{ mixBlendMode: 'multiply', filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.15))" }} />
                        {/* Blue Blueprint circles being drawn */}
                        <motion.svg
                            className="absolute -top-10 -left-20 w-24 h-24 pointer-events-none"
                            viewBox="0 0 100 100"
                        >
                            <motion.circle
                                cx="50" cy="50" r="30"
                                fill="transparent"
                                stroke="#3B82F6"
                                strokeWidth="3"
                                strokeDasharray="200"
                                animate={{ strokeDashoffset: [200, 0, 200], rotate: [0, 90, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.circle
                                cx="50" cy="50" r="15"
                                fill="transparent"
                                stroke="#60A5FA"
                                strokeWidth="2"
                                strokeDasharray="100"
                                animate={{ strokeDashoffset: [100, 0, 100], rotate: [0, -180, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.svg>
                    </motion.div>


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
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mb-8"
                        >
                            <Link to="/login" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:95 text-[17px]">
                                Get Started
                            </Link>
                        </motion.div>

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
