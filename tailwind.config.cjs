const config = {
    content: [
        "./src/**/*.{html,js,svelte,ts}",
        "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
    ],
  
    theme: {
        extend: {},
        colors: {
            'blue': '#1fb6ff',
            'purple': '#7e5bef',
            'pink': '#E5007F',
            'orange': '#FF695A',
            'green': '#00A399',
            'yellow': '#FEF4E5',
            'gray-dark': '#333333',
            'gray': '#555555',
            'gray-light': '#D1CEC7',
        },
    },
  
    plugins: [
        require('flowbite/plugin')
    ],
    darkMode: 'class',
};
  
module.exports = config;