import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          title: 'Weather Yatri - Yatri Cloud',
          description: 'Weather Yatri provides accurate weather forecasts for cities worldwide.',
          keywords: 'weather, forecast, city, temperature, humidity, wind',
          author: 'Yatri Cloud',
          ogTitle: 'Weather Yatri - Yatri Cloud',
          ogType: 'website',
          ogImage: 'https://raw.githubusercontent.com/yatricloud/yatri-images/refs/heads/main/Logo/yatricloud-round-transparent.png',
          ogUrl: 'https://yatricloud.com',
          structuredData: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Yatri Cloud",
            "url": "https://yatricloud.com",
            "logo": "https://raw.githubusercontent.com/yatricloud/yatri-images/refs/heads/main/Logo/yatricloud-round-transparent.png"
          })
        }
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
