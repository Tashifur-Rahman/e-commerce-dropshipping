FROM nginx:latest

# Copy the CONTENTS of the frontend folder into the Nginx html directory
COPY frontend/ /usr/share/nginx/html/

# Optional: If you need your backend folder available for the app to reference
# COPY backend/ /usr/share/nginx/backend/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
