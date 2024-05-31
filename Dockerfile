FROM node:20.12.0

RUN useradd -u 1001 appuser
RUN mkdir -p /home/appuser/app && chown -R appuser:appuser /home/appuser

WORKDIR /home/appuser/app

COPY package*.json ./
RUN npm install -g npm@latest && npm cache clean --force

RUN apt-get update && apt-get install -y chromium

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY . .

COPY docker-bootstrap.sh .

RUN chown -R appuser:appuser /home/appuser/app && chmod +x ./docker-bootstrap.sh

EXPOSE 3001

USER appuser

ENTRYPOINT ["sh", "./docker-bootstrap.sh"]