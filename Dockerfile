FROM node:23
COPY . /app
WORKDIR /app
RUN npm config set loglevel verbose ;\
    npm install ;\
    npm run build
ENTRYPOINT ["/bin/sh"]
CMD ["npm","run","start"]