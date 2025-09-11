#Устанавливаем зависимости
FROM node:20.11-alpine as dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

#Билдим приложение
#Кэширование зависимостей — если файлы в проекте изменились,
#но package.json остался неизменным, то стейдж с установкой зависимостей повторно не выполняется, что экономит время.
FROM node:20.11-alpine as builder
WORKDIR /app
COPY . .

# Превращаем их в переменные окружения
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=272583913867-t74i019ufdvmarh05jlv8bcu1ak0a6o6.apps.googleusercontent.com
ENV NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://connectpix.site/google/callback
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build:production

#Стейдж запуска
FROM node:20.11-alpine as runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/ ./
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=272583913867-t74i019ufdvmarh05jlv8bcu1ak0a6o6.apps.googleusercontent.com
ENV NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://connectpix.site/google/callback
EXPOSE 3000
CMD ["npm", "start"]
