# Distributed Task Scheduler

## Overview

The Distributed Task Scheduler allows clients to register tasks to be executed at a specific time. The tasks can be one-time or recurring, defined using cron syntax.  

For more information, see the [design document](docs/design.md) and if you are inclined, a short list of [future thoughts](docs/future.md).

## Prerequisites
- Install Docker & Docker Compose on your system.  
  - The easiest way to do this is to install [Docker Desktop](https://docs.docker.com/compose/install/#scenario-one-install-docker-desktop). 

## Installation
- Clone this repo, e.g. `git clone https://github.com/peteclark3/distributed-task-scheduler.git`

## Running
- In the root directory (cd `distributed-task-scheduler` if you haven't already), run `docker-compose up --build -d`
- Wait a bit, then visit http://localhost:3001 to access the frontend.  The frontend takes a bit to start (see the frontend Dockerfile for more info). If you want to be sure the frontend has started, you can run `docker-compose logs frontend -f` in the repo root directory.  Once you see `You can now view scheduler-frontend in the browser`, it's ready.
- Hopefully, registering tasks in the UI is self-explanatory.  If not, please see the [design document](docs/design.md) for more information.

## Stopping
- In the root directory, run `docker-compose down`

## Video Demo
https://github.com/user-attachments/assets/1c7d84d2-59ec-46e2-ade5-46fe1d0c32a2

## Contributing
Fork it, patch it, and send a pull request. It’ll get reviewed and merged faster than you can say “Distributed Task Scheduler!”

## License
"THE COFFEEWARE LICENSE" (Revision 42):
For better or worse, Pete Clark is responsible for this repo. Do whatever you want with this stuff. If we meet someday, and you think this stuff was worth it, you can buy me a coffee in return. 
