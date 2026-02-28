import { useNavigate } from 'react-router-dom';
import { Plus, Layout, History, Settings, LogOut } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();

    const createNewBoard = () => {
        const id = Math.random().toString(36).substring(2, 9);
        navigate(`/room/${id}`);
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Placeholder for boards */}
                    <div
                        onClick={createNewBoard}
                        className="group relative bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center hover:border-blue-400 transition-all cursor-pointer"
                    >
                        <Plus className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500" />
                        <span className="mt-2 block text-sm font-semibold text-gray-900">Create a new board</span>
                    </div>

                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                            <div className="h-40 bg-gray-100 flex items-center justify-center border-bottom border-gray-100">
                                <Layout className="h-12 w-12 text-gray-300" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900">Project Strategy {i}</h3>
                                <p className="text-sm text-gray-500">Edited 2 hours ago</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
