FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY index.html .

COPY assets/ ./assets/
COPY style.css .
COPY game.js .

COPY phaser.min.js .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]