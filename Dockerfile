FROM arm32v7/node

RUN apt-get update 
RUN apt-get install -y cron

ENV TZ="America/New_York"

RUN mkdir -p src 
ADD ./*.js /src/
ADD ./*.json /src/
WORKDIR /src
 
RUN npm install

ADD crontab /etc/cron.d/temp-cron
RUN chmod 0644 /etc/cron.d/temp-cron

RUN crontab /etc/cron.d/temp-cron

CMD cron -f