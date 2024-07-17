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
- Wait a bit, then visit http://localhost:3001 to access the frontend.  The frontend takes a bit to start (see the frontend Dockerfile for more info)  Hopefully, registering tasks is self-explanatory.  If not, please see the [design document](docs/design.md) for more information.

## Stopping
- In the root directory, run `docker-compose down`

## Contributing

Want to make this project even better? Fork it, patch it, and send a pull request. If your code is awesome enough to make me do a happy dance, it’ll get merged faster than you can say “Distributed Task Scheduler!”


## License

"THE COFFEEWARE LICENSE" (Revision 42):

For better or worse, Pete Clark is responsible for this repo. Do whatever you want with this stuff. If we meet someday, and you think this stuff was worth it, you can buy me a coffee in return. 
