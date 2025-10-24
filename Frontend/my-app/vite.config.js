// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'




// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react({
//       babel: {
//         plugins: [['babel-plugin-react-compiler'],tailwindcss()],
//       },
//     }),
//   ],
// })


import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
