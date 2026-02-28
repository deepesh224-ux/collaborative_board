import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Layout, History, Settings, LogOut, Users, Activity } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';
const MOCK_USER_ID = 'user_123'; // Temporary until real auth is added

export default function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState<{ myBoards: any[], sharedWithMe: any[], activeNow: any[] }>({
        myBoards: [],
        sharedWithMe: [],
        activeNow: []
    });

    useEffect(() => {
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
        fetchDashboard();
    }, []);

    const createNewBoard = async () => {
        try {
            const res = await fetch(`${API_BASE}/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Untitled Board', ownerId: MOCK_USER_ID })
            });
            const { board } = await res.json();
            navigate(`/room/${board.id}`);
        } catch (err) {
            console.error('Failed to create board:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900">MyBoard</h1>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                        <Layout className="mr-3 h-5 w-5" />
                        Dashboard
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                        <History className="mr-3 h-5 w-5" />
                        Recent Boards
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                        <Settings className="mr-3 h-5 w-5" />
                        Settings
                    </a>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Your Boards</h2>
                        <p className="text-gray-500 mt-1">Manage and create your collaborative whiteboards</p>
                    </div>

                    <button
                        onClick={createNewBoard}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        New Board
                    </button>
                </header>

                <div className="space-y-12">
                    {/* Active Sessions */}
                    {data.activeNow.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Activity className="text-green-500" size={20} />
                                <h3 className="text-xl font-semibold text-gray-900">Active Now</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.activeNow.map((board) => (
                                    <div
                                        key={board.id}
                                        onClick={() => navigate(`/room/${board.id}`)}
                                        className="bg-white rounded-xl border-2 border-green-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer relative"
                                    >
                                        <div className="absolute top-3 right-3 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </div>
                                        <div className="h-40 bg-green-50/50 flex items-center justify-center">
                                            <Users className="h-12 w-12 text-green-200" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900">{board.name}</h3>
                                            <p className="text-sm text-green-600 font-medium">Session in progress</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* My Boards */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Layout className="text-blue-500" size={20} />
                            <h3 className="text-xl font-semibold text-gray-900">My Boards</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div
                                onClick={createNewBoard}
                                className="group relative bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center hover:border-blue-400 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px]"
                            >
                                <div className="p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                                    <Plus className="h-8 w-8 text-blue-500" />
                                </div>
                                <span className="mt-4 block text-sm font-semibold text-gray-900">Create a new board</span>
                            </div>

                            {data.myBoards.map((board) => (
                                <div
                                    key={board.id}
                                    onClick={() => navigate(`/room/${board.id}`)}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="h-40 bg-gray-50 flex items-center justify-center">
                                        <Layout className="h-12 w-12 text-gray-200" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900">{board.name}</h3>
                                        <p className="text-sm text-gray-500">Updated {new Date(board.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Shared With Me */}
                    {data.sharedWithMe.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Users className="text-purple-500" size={20} />
                                <h3 className="text-xl font-semibold text-gray-900">Shared With Me</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.sharedWithMe.map((board) => (
                                    <div
                                        key={board.id}
                                        onClick={() => navigate(`/room/${board.id}`)}
                                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <div className="h-40 bg-purple-50/30 flex items-center justify-center">
                                            <Users className="h-12 w-12 text-purple-200" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900">{board.name}</h3>
                                            <p className="text-sm text-gray-500">Shared by Owner</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}
