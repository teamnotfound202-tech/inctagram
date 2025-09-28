import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  // Добавить конфигурацию для turbopack
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Конфигурация для компонента Image
  images: {
    // Разрешить загрузку изображений с любого домена
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Альтернативный вариант (устаревший, но все еще работает)
    // domains: ['*'], // не рекомендуется для продакшена
  },
}

export default nextConfig
