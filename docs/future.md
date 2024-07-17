# Future thoughts...
## Production-facing Features (not implemented)
### Kubernetes!
- I started stubbing the kube spec files for the various services, but due to time constraints and not wanting to get "carried away" (due to it not being requested in the assignment), I didn't finish them.  
### Logging
- Add DataDog kube services to capture all container logs and forward them to their centralized logging system. (Or Splunk.. or ELK.. or..)
### Monitoring
- Implement monitoring for all services using prometheus & grafana cloud.  
- Augment services with nodejs prom-client to expose both basic nodejs metrics & custom metrics
    - Can utilize out-of-the-box nodejs dashboards for grafana as a starting point.
### Alerting
- Use alertmanager and OpsGenie (or PagerDuty) for alerting. 

## Future features
### Code sharing
- Use Lerna, yarn, or another code-sharing tool to share code between services. In this case, `task.ts` and `taskStorage.ts`.
### Add Automated Tests
- Add unit & integration tests for all services to ensure code quality and prevent regressions
### Task timeout & failure handling
- Re-queue tasks for execution if they fail or time out.
### CI/CD Pipeline
- Use Github Actions or Jenkins CI/CD to automate the build, test, and deployment of services.
### Hardcoding
- Un-hardcode all remote endpoint values in the services (API url, Redis connection string, etc) and move them to environment variables.
### Debugging/Hot reload Support
- Update launch args & Dockerfiles to expose ports for all services in *local* environments to allow for debugging & hot reloading.
### Websockets
- For real-time executed task updates (instead of polling the API as is done now)