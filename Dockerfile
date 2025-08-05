ARG NGINX_IMAGE

FROM $NGINX_IMAGE AS nginx

# Build args
ARG CI_COMMIT_SHORT_SHA=latest
ARG APP_NAME=cisea
ARG PATH_BUILD
ARG NODE_ENV

RUN echo $NGINX_IMAGE
RUN echo $NODE_ENV
RUN mkdir -p /var/www

COPY nginx.conf.$NODE_ENV /etc/nginx/conf.d/default.conf

COPY ./dist/$PATH_BUILD/ /var/www/html/

RUN chown -R nginx:nginx /var/www

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
