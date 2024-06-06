import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dotenv from "dotenv";

// Load .env file
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    host: true,
    strictPort: true,
  },
  define: {
    'process.env': {
      FUNDRAISER_CONTRACT_ADDRESS: process.env.FUNDRAISER_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      LOCALHOST_URL: process.env.LOCALHOST_URL
    }
  }
})
