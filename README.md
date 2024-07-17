# Distributed Task Scheduler Design Document

## Overview

The Distributed Task Scheduler allows clients to register tasks to be executed at a specific time. The tasks can be one-time or recurring, defined using Cron syntax. The system ensures high availability, durability, scalability, and cost-effectiveness.

## Requirements

### Core Requirements

- A task is either one-time execution or recurring.
- Clients must be able to register a task with a specific time of execution or cron syntax for recurring tasks.
- A task should be picked up for execution within 10 seconds of its scheduled execution.

### High-Level Requirements

- High availability: The system should be operational at all times.
- Durability: Ensure data integrity and persistence.
- Scalability: The system should handle varying loads efficiently.
- Cost-effectiveness: Optimize resource usage and operational costs.

## Architecture

### Components

1. **Backend Service**:
   - Handles API requests.
   - Manages task creation, updates, and deletions.
   - Stores tasks in Redis.
   
2. **Scheduler Service**:
   - Polls Redis for due tasks and schedules them.
   - Adds due tasks to Redis stream for execution.
   - Manages recurring tasks using Cron syntax.

3. **Task Executor**:
   - Consumes tasks from Redis stream and executes them.
   - Logs executed tasks to a separate hash set in Redis for auditing.

4. **Frontend**:
   - Allows users to create, update, delete, and view tasks.
   - Displays executed tasks with timestamps.

5. **Redis**:
   - Stores task data and manages streams for task scheduling and execution.

### High-Level Architecture

```plaintext
+-------------+      +-------------+      +------------------+      +----------------+
|   Frontend  | <--> |  Backend    | <--> |   Scheduler      | <--> |  Task Executor |
+-------------+      +-------------+      +------------------+      +----------------+
                                           |
                                           |
                                        +------+
                                        | Redis|
                                        +------+
 ```

## Data Flow

1. **Task Registration**: Users register tasks via the frontend, which sends requests to the backend. The backend stores the tasks in Redis.
2. **Task Scheduling**: The scheduler polls Redis for due tasks and adds them to a Redis stream for execution.
3. **Task Execution**: The task executor consumes tasks from the Redis stream, executes them, and logs the execution details.

## Components and Services

### Backend Service

Handles API endpoints for task management:
- **Create Task**: Stores new tasks in Redis.
- **Update Task**: Updates existing tasks in Redis.
- **Delete Task**: Deletes tasks from Redis.
- **List Tasks**: Retrieves tasks from Redis.
- **Get Executed Tasks**: Retrieves logs of executed tasks.

### Scheduler Service

- **Polling**: Periodically checks Redis for due one-time tasks and adds them to the execution stream.
- **Cron Scheduling**: Sets up cron jobs for recurring tasks and adds them to the execution stream at the scheduled times.

### Task Executor

- **Consumer**: Consumes tasks from the Redis stream and executes them.
- **Logging**: Logs executed tasks to a separate Redis hash set.

## Scaling and High Availability

- **Backend and Scheduler**: Can be scaled horizontally by deploying multiple instances.
- **Task Executor**: Can be scaled based on the number of tasks and execution load.
- **Redis**: Use Redis Cluster for high availability and scalability.

## Cost Effectiveness

- **AWS with Karpenter**: If running on AWS, use Karpenter for efficient instance type utilization and cost optimization.

## Conclusion
The Distributed Task Scheduler is designed to be scalable, durable, and cost-effective, leveraging a microservices architecture with clear separation of concerns. This document outlines the architecture, components, and implementation details to guide the development and deployment of the system.

## Future Considerations
- remove hardcoded referenes to redis, API (use environment variables)
- break task.ts and taskStorage.ts into shared folder, use lerna/nx/yarn workspaces
- add a CI/CD pipeline
- add a monitoring system