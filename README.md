### To-Do

- Don Norman design of everyday things

# Easy
- [x] reminders not registering on first day of the month -01/02
- [x] first day of the month always showing past -01/02
- [x] inquire about using the utils.js -01/03
- [x] move footer fetch to api file -01/03
- [x] remove validation on login form -01/04
- [x] clean backend app.js -01/03
- [x] token check on help page -01/03
- [x] further testing creating account form validation -01/04
- [x] fix hover on legend -01/04
- [x] create validation boundary for the year -01/06
- [x] change close button on screenshot modal -01/06
- [x] add css fade animation when editing a reminder and set timeout for smoother transition -01/06
- [ ] clear login form after error is found and fixed
- [ ] add check for logged in

# Moderate
- [x] create custom tooltips -01/04
- [x] add help page with admin contact and useful info -01/03
- [x] figure out how to replace default bootstrap arrows, to better control index of slides -01/04
- [x] change color palette -01/06
- [x] create validation for reminder creating forms -01/06
- [x] token over 256
- [x] add ability to copy a reminder -01/06
- [x] replace bootstrap buttons with custom buttons -01/06
- [x] fix all html2canvas bugs -01/07
- [ ] actually check if token exists

# Hard
- [x] figure out logic to prevent individuals from posting a reminder within the same time frame as another reminder. -01/08
- [x] review edge cases when fetch's fail(prevent api from crashing, instead show not found or something)-01/08
- [x] create about us page
- [x] create privacy, terms, and security page and define all links
- [ ] create tests for all functions
- [x] check to make sure there isnt already a reminder during that time -01/08
- [x] refactor arrays and selectedmonth logic to account for scrolling into next/previous months -01/06

# Stretch
- [x] nest months so that when side scrolling it rolls over to next month -01/06
- [ ] ability to create groups / add other users to group / switch to group 
- [ ] Docker containerize
- [ ] Deploy application


### Create DB

docker pull postgres:latest
mkdir -p $HOME/docker/volumes/postgres
docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 \
-v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres
docker ps -a
docker exec -it <Container-ID> bash
psql -U postgres
CREATE DATABASE reminders;



