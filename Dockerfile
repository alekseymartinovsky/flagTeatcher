# Используем официальный Node.js образ
FROM node:22.19

# 2. Создаем рабочую директорию
WORKDIR /app

# 3. Копируем package.json и package-lock.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install --production

# 4. Копируем всю исходную папку проекта
COPY . .

# 5. Если у тебя есть сборка, делаем билд (например, TypeScript)
RUN npm run build

COPY assets/flags ./dist/flags

# 6. Запускаем бота из папки dist
CMD ["node", "dist/index.js"]
