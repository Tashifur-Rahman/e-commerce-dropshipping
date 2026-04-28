FROM nginx:latest
# This line copies your frontend files into the Nginx folder
COPY ./frontend /usr/share/nginx/html
EXPOSE 80
