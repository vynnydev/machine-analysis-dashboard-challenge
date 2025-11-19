/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Configuração para Mapbox GL funcionar corretamente
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    })
    
    return config
  },
  // Transpilar o mapbox-gl para evitar erro de MIME type
  transpilePackages: ['mapbox-gl'],
}

module.exports = nextConfig
