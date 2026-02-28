import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Layout,
    History,
    Settings,
    LogOut,
    Users,
    Search,
    Grid,
    List as ListIcon,
    Trash2,
    Radio,
    Sun,
    Moon
} from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';
const MOCK_USER_ID = 'user_123';

export default function Dashboard() {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        console.log('Theme toggled:', isDarkMode ? 'dark' : 'light');
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);
    const [activeTab, setActiveTab] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [data, setData] = useState<{ myBoards: any[], sharedWithMe: any[], activeNow: any[] }>({
        myBoards: [],
        sharedWithMe: [],
        activeNow: []
    });
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [boardToDelete, setBoardToDelete] = useState<{ id: string, name: string } | null>(null);

    const fetchDashboard = async () => {
        try {
            const res = await fetch(`${API_BASE}/user/dashboard`, {
                headers: { 'user-id': MOCK_USER_ID }
            });
            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error('Failed to fetch dashboard:', err);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await fetchDashboard();
            setLoading(false);
        };
        init();
    }, []);

    const allBoards = useMemo(() => {
        const boards = [...data.myBoards, ...data.sharedWithMe];
        return boards.filter(board =>
            board.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data.myBoards, data.sharedWithMe, searchQuery]);

    const filteredBoards = useMemo(() => {
        if (activeTab === 'all') return allBoards;
        if (activeTab === 'mine') return data.myBoards.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
        if (activeTab === 'shared') return data.sharedWithMe.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return allBoards;
    }, [allBoards, activeTab, data.myBoards, data.sharedWithMe, searchQuery]);

    const handleCreateBoard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBoardName.trim()) return;

        try {
            const res = await fetch(`${API_BASE}/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newBoardName, ownerId: MOCK_USER_ID })
            });
            const { board } = await res.json();
            setIsCreateModalOpen(false);
            setNewBoardName('');
            navigate(`/room/${board.id}`);
        } catch (err) {
            console.error('Failed to create board:', err);
        }
    };

    const handleDeleteBoard = async () => {
        if (!boardToDelete) return;
        try {
            const res = await fetch(`${API_BASE}/sessions/${boardToDelete.id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setIsDeleteModalOpen(false);
                setBoardToDelete(null);
                fetchDashboard();
            }
        } catch (err) {
            console.error('Failed to delete board:', err);
        }
    };

    return (
        <div className="flex h-screen w-full bg-slate-50 dark:bg-[#050505] overflow-hidden font-sans transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-60 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 flex flex-col flex-shrink-0 h-full z-20 shadow-sm transition-colors duration-300">
                <div className="p-5 flex items-center gap-3 border-b border-slate-50 dark:border-zinc-800/50">
                    <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-100 dark:shadow-none">
                        <Layout className="text-white w-4 h-4" />
                    </div>
                    <span className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight">MyBoard</span>
                </div>

                <nav className="flex-1 px-3.5 py-6 space-y-1.5 overflow-y-auto">
                    <div className="mb-8">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3 px-2">Dashboard</p>
                        <div className="space-y-0.5">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[13px] font-bold rounded-xl transition-all ${activeTab === 'all' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50'}`}
                            >
                                <Layout className="w-4 h-4" />
                                <span>Overview</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('mine')}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[13px] font-bold rounded-xl transition-all ${activeTab === 'mine' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50'}`}
                            >
                                <History className="w-4 h-4" />
                                <span>My Projects</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('shared')}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[13px] font-bold rounded-xl transition-all ${activeTab === 'shared' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50'}`}
                            >
                                <Users className="w-4 h-4" />
                                <span>Shared</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3 px-2">Account</p>
                        <button className="w-full flex items-center gap-3 px-3.5 py-2.5 text-[13px] font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 rounded-xl transition-all">
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </button>
                    </div>
                </nav>

                <div className="p-3 border-t border-slate-100 dark:border-zinc-800 flex-shrink-0 bg-slate-50/50 dark:bg-zinc-900/20">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="flex items-center gap-3 w-full px-3.5 py-2.5 text-[13px] font-bold text-slate-600 dark:text-zinc-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all mb-2"
                    >
                        {isDarkMode ? (
                            <>
                                <Sun className="w-4 h-4" />
                                <span>Light Mode</span>
                            </>
                        ) : (
                            <>
                                <Moon className="w-4 h-4" />
                                <span>Dark Mode</span>
                            </>
                        )}
                    </button>
                    <div className="flex items-center gap-3 px-2 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-xs shadow-sm flex-shrink-0 transition-colors duration-300">
                            DU
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-900 dark:text-zinc-100 truncate transition-colors duration-300">Demo User</p>
                            <p className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold tracking-tight">Active Team Plan</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-[11px] font-black text-slate-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-screen overflow-y-auto min-w-0 bg-white dark:bg-[#050505] transition-colors duration-300">
                <div className="w-full max-w-7xl mx-auto px-8 py-10 md:px-12 md:py-16">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div className="min-w-0">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                Welcome, <span className="text-indigo-600 dark:text-indigo-400">Demo</span>
                            </h2>
                            <p className="text-slate-400 dark:text-zinc-500 mt-1 text-sm font-medium max-w-xl leading-relaxed">Design, build, and share your creative ideas on a global scale.</p>
                        </div>

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap flex-shrink-0"
                        >
                            <Plus className="w-4 h-4 stroke-[3px]" />
                            <span className="text-xs uppercase tracking-wider font-extrabold">Create New</span>
                        </button>
                    </header>

                    {/* Search & Layout Controls */}
                    <div className="flex flex-col md:flex-row gap-6 mb-12 w-full">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-zinc-600 group-focus-within:text-indigo-500 transition-colors w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search through your projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-zinc-900/30 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 dark:focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-zinc-900 transition-all font-bold text-sm text-slate-800 dark:text-zinc-200 shadow-inner"
                            />
                        </div>
                        <div className="flex bg-slate-50 dark:bg-zinc-900/30 p-1.5 rounded-2xl self-end md:self-auto h-12 shadow-inner">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-md border border-slate-100 dark:border-zinc-700/50' : 'text-slate-300 dark:text-zinc-600 hover:text-slate-500 dark:hover:text-zinc-400'}`}
                                title="Grid View"
                            >
                                <Grid size={18} strokeWidth={2.5} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-md border border-slate-100 dark:border-zinc-700/50' : 'text-slate-300 dark:text-zinc-600 hover:text-slate-500 dark:hover:text-zinc-400'}`}
                                title="List View"
                            >
                                <ListIcon size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-20 pb-32">
                        {/* Live Sessions Section */}
                        {data.activeNow.length > 0 && (
                            <section className="w-full">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-green-100 dark:bg-green-950/30 rounded-xl flex items-center justify-center shadow-inner">
                                            <Radio className="text-green-600 dark:text-green-500" size={16} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-xs font-black text-slate-900 dark:text-zinc-100 tracking-widest uppercase">Live Now</h3>
                                    </div>
                                    <span className="px-3 py-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-500 text-[9px] font-black rounded-full border border-green-100 dark:border-green-900/50 flex items-center gap-2 shadow-sm">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]"></span>
                                        {data.activeNow.length} ACTIVE
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full auto-rows-fr">
                                    {data.activeNow.map((board) => (
                                        <div
                                            key={board.id}
                                            onClick={() => navigate(`/room/${board.id}`)}
                                            className="w-full bg-white dark:bg-zinc-800 rounded-[1.8rem] border border-slate-100 dark:border-zinc-700 p-6 hover:border-green-300 dark:hover:border-green-500 hover:shadow-[0_15px_45px_-10px_rgba(34,197,94,0.12)] dark:hover:shadow-[0_20px_50px_-12px_rgba(34,197,94,0.2)] transition-all cursor-pointer flex flex-col min-h-[160px] group relative shadow-sm dark:shadow-2xl dark:shadow-black/50"
                                        >
                                            <div className="w-10 h-10 bg-green-50 dark:bg-green-950/40 rounded-xl flex items-center justify-center mb-6 flex-shrink-0">
                                                <Radio className="text-green-600 dark:text-green-500 w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-black text-slate-900 dark:text-zinc-100 mb-1.5 tracking-tight leading-none uppercase">{board.name}</h3>
                                                <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-500">
                                                    <Users size={12} className="text-slate-200 dark:text-zinc-800" />
                                                    <span className="text-[9px] font-black tracking-widest uppercase opacity-60">Real-time Session</span>
                                                </div>
                                            </div>

                                            {/* Delete Button for Live Cards */}
                                            {board.ownerId === MOCK_USER_ID && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setBoardToDelete({ id: board.id, name: board.name });
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all bg-white/80 dark:bg-zinc-800/80 backdrop-blur rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Recent Projects Section */}
                        <section className="w-full">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center shadow-inner">
                                    <Layout className="text-indigo-600 dark:text-indigo-400" size={18} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-sm font-black text-slate-900 dark:text-zinc-100 tracking-widest uppercase">
                                    {activeTab === 'all' ? 'Your Projects' : activeTab === 'mine' ? 'My Boards' : 'Shared With Me'}
                                </h3>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full auto-rows-fr">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-60 bg-slate-50 dark:bg-zinc-900/20 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 animate-pulse"></div>
                                    ))}
                                </div>
                            ) : filteredBoards.length === 0 ? (
                                <div className="bg-slate-50 dark:bg-zinc-900/10 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-zinc-800/50 p-24 text-center w-full">
                                    <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <Search className="w-8 h-8 text-slate-100 dark:text-zinc-700" />
                                    </div>
                                    <p className="text-slate-400 dark:text-zinc-500 font-extrabold text-xl tracking-tight" id="no-boards-text">No boards found.</p>
                                    <button onClick={() => setIsCreateModalOpen(true)} className="mt-6 text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-sm">Create your first board</button>
                                </div>
                            ) : (
                                <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full auto-rows-fr" : "flex flex-col gap-5 w-full"}>
                                    {/* Create Action Card */}
                                    {viewMode === 'grid' && activeTab !== 'shared' && !searchQuery && (
                                        <button
                                            onClick={() => setIsCreateModalOpen(true)}
                                            className="group w-full bg-slate-50 dark:bg-zinc-800/40 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-zinc-600 p-6 flex flex-col items-center justify-center min-h-[220px] hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/10 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 dark:hover:shadow-none"
                                        >
                                            <div className="w-14 h-14 bg-white dark:bg-zinc-700 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all shadow-sm flex-shrink-0 border border-slate-100 dark:border-zinc-600">
                                                <Plus className="h-6 w-6 text-slate-300 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 stroke-[3px]" />
                                            </div>
                                            <div className="text-center">
                                                <span className="text-sm font-black text-slate-900 dark:text-zinc-100 block tracking-tighter uppercase leading-none">New Project</span>
                                                <span className="text-[10px] text-slate-400 dark:text-zinc-400 font-bold mt-1.5 block opacity-60">Start a blank canvas</span>
                                            </div>
                                        </button>
                                    )}

                                    {filteredBoards.map((board) => (
                                        <div
                                            key={board.id}
                                            onClick={() => navigate(`/room/${board.id}`)}
                                            className={`w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-[0_20px_50px_-12px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_20px_50px_-12px_rgba(99,102,241,0.2)] transition-all cursor-pointer group relative shadow-sm dark:shadow-2xl dark:shadow-black/50 ${viewMode === 'grid'
                                                ? "rounded-[2rem] p-6 flex flex-col min-h-[220px]"
                                                : "rounded-xl p-4 flex items-center gap-4 shadow-sm"
                                                }`}
                                        >
                                            <div className={`${viewMode === 'grid' ? "w-full flex-1 bg-slate-50 dark:bg-zinc-900 rounded-xl mb-6" : "w-12 h-12 bg-slate-50 dark:bg-zinc-900 rounded-lg"} flex-shrink-0 flex items-center justify-center transition-all group-hover:scale-[1.01] border dark:border-zinc-700/50`}>
                                                <Layout className="text-slate-100 dark:text-zinc-700 h-8 w-8 transition-all group-hover:text-indigo-100 dark:group-hover:text-indigo-400 group-hover:scale-110" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-black text-slate-900 dark:text-zinc-100 tracking-tighter leading-tight mb-1.5 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase">{board.name}</h3>
                                                <div className="flex items-center gap-2.5 text-[9px] font-black uppercase tracking-widest opacity-80">
                                                    <span className="text-slate-400 dark:text-zinc-500">{new Date(board.updatedAt).toLocaleDateString()}</span>
                                                    {board.ownerId === MOCK_USER_ID ? (
                                                        <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/50">Project Leader</span>
                                                    ) : (
                                                        <span className="text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-neutral-900 px-2 py-0.5 rounded border border-slate-100 dark:border-neutral-800">Collaborator</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            {board.ownerId === MOCK_USER_ID && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setBoardToDelete({ id: board.id, name: board.name });
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className={`absolute p-2 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all bg-white/80 dark:bg-zinc-800/80 backdrop-blur rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 ${viewMode === 'grid' ? "top-4 right-4" : "right-5"
                                                        }`}
                                                >
                                                    <Trash2 size={viewMode === 'grid' ? 18 : 16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>

            {/* Create Board Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" id="create-modal">
                    <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-zinc-800/80 transition-colors duration-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none">
                                <Plus className="text-white w-6 h-6 stroke-[3px]" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none transition-colors duration-300">New Project</h3>
                                <p className="text-slate-400 dark:text-zinc-500 text-sm font-bold mt-1 transition-colors duration-300">Give your masterpiece a name</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreateBoard}>
                            <div className="mb-8">
                                <label className="block text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3 ml-2">Project Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Enter name (e.g. Brainstorming)"
                                    value={newBoardName}
                                    onChange={(e) => setNewBoardName(e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-black border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-zinc-900 transition-all font-bold text-lg text-slate-800 dark:text-zinc-200 shadow-inner"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        setNewBoardName('');
                                    }}
                                    className="flex-1 px-8 py-4 bg-slate-50 dark:bg-zinc-900 text-slate-400 dark:text-zinc-500 font-black rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all uppercase tracking-wider text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newBoardName.trim()}
                                    className="flex-1 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs"
                                >
                                    Create Board
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && boardToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" id="delete-modal">
                    <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-zinc-800/80 transition-colors duration-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 rounded-2xl flex items-center justify-center transition-colors duration-300">
                                <Trash2 className="text-red-600 dark:text-red-500 w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none transition-colors duration-300">Delete Project</h3>
                                <p className="text-slate-400 dark:text-zinc-500 text-sm font-bold mt-1 transition-colors duration-300">This action cannot be undone</p>
                            </div>
                        </div>

                        <div className="mb-8 p-6 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30 transition-colors duration-300">
                            <p className="text-slate-600 dark:text-zinc-400 font-bold text-sm leading-relaxed transition-colors duration-300">
                                Are you sure you want to delete <span className="text-red-700 dark:text-red-500 font-black">"{boardToDelete?.name}"</span>?
                                All associated data and active sessions will be permanently removed.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setBoardToDelete(null);
                                }}
                                className="flex-1 px-8 py-4 bg-slate-50 dark:bg-zinc-900 text-slate-400 dark:text-zinc-500 font-black rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all uppercase tracking-wider text-xs"
                            >
                                Nevermind
                            </button>
                            <button
                                onClick={handleDeleteBoard}
                                className="flex-1 px-8 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 shadow-xl shadow-red-100 dark:shadow-none transition-all uppercase tracking-wider text-xs"
                            >
                                Delete Forever
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
