FROM nginx:alpine
COPY /dist/sakai-ng /usr/share/nginx/html

EXPOSE 80