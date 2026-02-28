import { useAwareness } from '../hooks/useAwareness';

export function UserList() {
    const { states } = useAwareness();

    // Get all users including local user
    const users = Array.from(states.entries()).map(([id, state]) => ({
        id,
        name: state.cursor?.name || `Guest ${id.toString().slice(-4)}`,
        color: state.cursor?.color || '#ccc'
    }));

    return (
        <div className="user-list">
            {users.map((user) => (
                <div
                    key={user.id}
                    className="user-avatar"
                    style={{ backgroundColor: user.color }}
                    title={user.name}
                >
                    {user.name.charAt(0).toUpperCase()}
                </div>
            ))}
            <div
                className="user-avatar"
                style={{ backgroundColor: '#6366f1', zIndex: 5 }}
                title="You"
            >
                U
            </div>
        </div>
    );
}
