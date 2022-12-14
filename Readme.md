# GitTix

GitTix is a platform where you can buy and sell tickets for events. This application is built using MICROSERVICES architecture. Still in development phase. Feel free to contribute.

## Services and Features

- Auth Service (only consists the user model)
  - Sign up
  - Sign in
  - Sign out
  - Fetches current user
- Ticket Service (only consists the ticket model)
  - Create a ticket
  - Fetch all tickets
  - Fetch a ticket
  - Update a ticket
  - Delete a ticket
- Orders Service (consists the order and ticket model)
  - Create an order
  - Fetch all orders for a certain user
  - Fetch an order for a certain user
  - Update an order
- Expiration Service
  - Listens to order created events
  - Sets a timer for the order to expire
  - Publishes an order expired event
- Payments Service (consists of the payment and order model)
  - Uses Stripe API to process payments
  - Creates a charge
  - Stores the payment details in the database
- Common Package (consists of the common models and events and is a npm package used by all services as a dependency)
  - Contains the common models
  - Contains the common events
  - Contains the common errors
  - Contains the common middlewares
  - Contains the common streaming base listener and publisher class which are extended by other services
- Client
  - NextJS application
  - Uses SWR to fetch data
  - ChakraUI for styling

## How the services communicate and run

- All the services are dockerized and those docker images are pushed to Docker Hub
- Each service has a couple of deployment files in the `infra` folder which fires up a pod in the Kubernetes cluster
- Ingress-nginx is used to route the traffic to the correct service based on the domain name
- All the services are loosely coupled and communicate with each other asynchronously using NATS streaming server
  
## Technologies

- Typescript
- Docker
- Kubernetes
- Skaffold
- MongoDB
- Express
- Nats Streaming Server
- NextJS
- ChakraUI
- SWR
- Stripe API
- Bull JS
- Redis
- SuperTest
- Jest
