FROM node:carbon
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
#Copy package.json
COPY package.json /usr/src/app
#install dependencies
RUN npm install
RUN npm install -g forever
RUN apt-get update -y

# Bundle app source

COPY . /usr/src/app


#Expose Port
EXPOSE 80

#Start npm
CMD ["npm", "start"]