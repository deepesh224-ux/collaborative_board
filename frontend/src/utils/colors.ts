export const colors = [
    '#FF7675', // Light red
    '#74B9FF', // Light blue
    '#55E6C1', // Light green
    '#FDCB6E', // Light yellow
    '#A29BFE', // Light purple
    '#E84393', // Pink
    '#00CEC9', // Teal
];

export const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export const emojis = ['✨', '🚀', '🔥', '🎉', '💡', '🌟', '💥', '🎈'];
export const getRandomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
