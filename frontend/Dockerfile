# ### frontend

# FROM nginx:alpine       

# COPY /nginx.conf /etc/nginx/conf.d/default.conf

# WORKDIR /usr/src/app/frontend

# COPY /dist/frontend /usr/src/app/frontend

# EXPOSE 4200

# CMD [ "nginx", "-g", "daemon off;" ]

FROM nginx:latest AS ngi
# Copying compiled code and nginx config to different folder
# NOTE: This path may change according to your project's output folder 
COPY dist/frontend/browser /usr/src/app/frontend
COPY nginx.conf  /etc/nginx/conf.d/default.conf
# Exposing a port, here it means that inside the container 
# the app will be using Port 80 while running
EXPOSE 80
