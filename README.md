[![Coverage Status](https://coveralls.io/repos/github/bookit-app/profile-services/badge.svg?branch=master)](https://coveralls.io/github/bookit-app/profile-services?branch=master)

# profile-services

The services defined within this repo generate REST endpoints as follows:

- **POST /profile**: To enable a profile to be created. Refer to the [schema](./src/services/create-profile/src/payload-validations.js) for details on the expected payload
- **GET /profile**: To enable a specific profile to be retrieved
- **PATCH /profile**: To enable a specific profile to be updated. Refer to the [schema](./src/services/update-profile/src/payload-validations.js) for details on the expected payload
- **DELETE /profile**: To enable a specific profile to be delete

For additional details on the API's refer to the [API Gateway Repo](https://github.com/bookit-app/api-gateway) as this is how the API's are in the end exposed for the consumers.

## Design

This repo contains a set of deployable services to handle BookIt User Profile Operations. The repo is designed as a mono-repo to house all services necessary to support a profile as it has been defined for the BookIt app. Each service is intended to be individually deployed as a standalone microservice to the cloud to be consumed by the client applications.

[![design](./docs/images/design.png)](./docs/images/design.png)

The design is based around how [expressjs](https://expressjs.com) works and hence everything is essentially decomposed down into a setup of middleware. The following describes each component of the diagram in more detail.

### Dependencies

As these services are all implemented in nodejs npm is used to manage the dependencies. However, as this is a mono-repo and contains several applications that will be deployed as docker containers it has been designed in a away to allow each service to be built into a contain containing only the necessary dependencies that it specifically requires. This is done to try and keep the image size to a minimum. Dependencies are managed as follows:

- Global Dependencies: There are dependencies that every service leverages. These have been defined in the package.json at the root of the project and each service leverages them from this location as this ensures consistency across the deployments as well as ensures that share libraries leverage the same versions across all.
- Local Dependencies: These are dependencies specific to an individual service and would only be contained within the deployment. These are managed within the package.json file within the services directory under src/service/<service-name>

### Shared lib

The items within the section make up a set of components (functions, classes, data) which are intended to be shared/reused across all services pertaining to the profile-services.

- **express mw**: Common middleware used essentially on every route exposed via the services

  - **error-handling-mw**: This is the mw which is hooked into express to take of errors when they are raised. The MW takes the error generated and populates a default JSON object to be returned to the call and also sets the HTTP status code appropriately
  - **user-mw**: This is a mw which is hooked into express and handles processing the HTTP header injected by Google Cloud Endpoints which contains the Base64 encoded user metadata. The MW will take the Base64 data, decode it and place it into a req object attribute to allow the information to be passed along to other MW steps which required it. This ensures that we only need to decode the data one time. If the MW doesn't find this header it raises a ServiceError to ensure that the processing of teh request is stopped
  - **payload-validation-mw**: This middleware is a re-usable MW which can allow the services to hook in JSON payload validations. The MW makes use of a library called [ajv](https://ajv.js.org) and will automatically validation the body of the HTTP request based on the provided schema.
  - **trace-id-mw**: This middleware is responsible to make the Trace ID information which is injected by Google Cloud automatically into the HTTP headers and make it available for use in other locations of the express chain when logs are being generated.

- **repository**: Contains components acting as the data access layer for the services

  - **firestore**: Provides access to the `@google-cloud/firestore` module within the node js applications
  - **profile-repository**: Provides functions to interact with the profiles firestore collections and documents.

- **util**: Provides a setup of utility type components for the services to rely on

  - **ServiceError**: this is an extension to the default JS Error object to allow specific information like errorCodes and http status codes to be propagated to the error-handling-mw when an error occurs.
  - **validator**: Provides the AJV object reference to the node application and is primarily used by the payload-validation-mw

- **constants**: Exposes a set of attributes as constants for use across the services.
  - **errors**: Constants represented general error situations and are intended to be used as the basis for errors created into the ServiceError reference
  - **statusCodes**: This is a reference to an npm modules calls `http-status-codes` which provides contsants for the HTTP Status Codes like 200, 201, 500, etc

### create-profile-service

The create profile service exposes a route to **POST** profiles. When a request is received it will trigger a set of express MW and determine what to do. The service exposes the route at `/profile`. This route is configured with the middleware as described within the [create-profile-service index.js](./src/services/create-profile/src/index.js) file.

- **service specific express MW**: Contains express MW which is dedicated to the create profile service

  - **create-profile-mw**: Assumes that all data validations and requirements to allow for creating a profile have been achieved, which is ensured via the configuration of the express route. It is essentially a wrapper around the profile-repository create function to trigger the commit of the profile data into cloud firestore.
  - **success-mw**: Triggered as the last MW in the chain and if triggered means that everything was fine and the profile was successfully created. This MW just sends an HTTP 201 status code back to the consumer.

- **payload-validations**: This contains the Payload JSON Schema definition which is provided to the **payload-validation-mw** to verify that the body of the HTTP request is correct.

### update-profile-service

The update profile service exposes a route to **PATCH** profiles. When a request is received it will trigger a set of express MW and determine what to do. The service exposes the route at `/profile`. This route is configured with the middleware as described within the [update-profile-service index.js](./src/services/update-profile/src/index.js) file.

- **service specific express MW**: Contains express MW which is dedicated to the create profile service

  - **update-profile-mw**: Assumes that all data validations and requirements to allow for updating a profile have been achieved, which is ensured via the configuration of the express route. It is essentially a wrapper around the profile-repository update function to trigger the commit of the profile data into cloud firestore. The updates will be merged into the existing profile so ONLY those fields which are provided will be modified
  - **success-mw**: Triggered as the last MW in the chain and if triggered means that everything was fine and the profile was successfully updated. This MW just sends an HTTP 200 status code back to the consumer.

- **payload-validations**: This contains the Payload JSON Schema definition which is provided to the **payload-validation-mw** to verify that the body of the HTTP request is correct.

### query-profile-service

The query profile service exposes a route to **GET** a the profile associated with the current user. When a request is received it will trigger a set of express MW and determine what to do. The service exposes the route at `/profile`. This route is configured with the middleware as described within the [query-profile-service index.js](./src/services/query-profile/src/index.js) file.

- **service specific express MW**: Contains express MW which is dedicated to the create profile service

  - **query-profile-mw**: Assumes that all data validations and requirements to allow for querying a profile have been achieved, which is ensured via the configuration of the express route. It is essentially a wrapper around the profile-repository query function to trigger the request of the profile data from cloud firestore. Additionally, a consumer can request specific subsets of data from the profile by providing the `select` query option.
  - **query-options-mw**: This MW extracts and validates the query parameters provides in the `select` options.

### delete-profile-service

The delete profile service exposes a route to **DELETE** profiles. When a request is received it will trigger a set of express MW and determine what to do. The service exposes the route at `/profile`. This route is configured with the middleware as described within the [delete-profile-service index.js](./src/services/delete-profile/src/index.js) file.

- **service specific express MW**: Contains express MW which is dedicated to the create profile service

  - **delete-profile-mw**: Assumes that all data validations and requirements to allow for deleting a profile have been achieved, which is ensured via the configuration of the express route. It is essentially a wrapper around the profile-repository delete function to trigger the removal of the profile data from cloud firestore.
  - **query-profile-mw**: When deleting a profile we verify that it exists prior to attempting a delete. This MW will verify that the profile for the logged in user exists and if so allow the MW chain to continue. Otherwise it will generate a 404 response.
  - **success-mw**: Triggered as the last MW in the chain and if triggered means that everything was fine and the profile was successfully deleted. This MW just sends and HTTP 204 status code back to the consumer.

## Security

The services themselves are not containing any logic pertaining to security and are not therefore assuming any particular approach to security. Security is delegated to the environment which they are deployed and running. The only expectation is that there be the appropriate user details provided as part of the HTTP Header so that it can identity the user ID and email to inject into the necessary queries. As these services are deployed into an environment with Cloud Endpoints and are running on Cloud Run within Google Cloud Platform they expect that the `X-Endpoint-API-UserInfo` header be provided with the user data as described within the [Google Documentation](https://cloud.google.com/endpoints/docs/openapi/authenticating-users-firebase).

## Deployment

Deployment occurs via Cloud Build. There are 2 phases associated with this:

- When PR's are open a build verification occurs and is required to pass prior to allowing merge - Refer [cloudbuild-dev.yaml](/cloudbuild-dev.yaml)
- When merge into master a build and deployment will occur - Refer [cloudbuild.yaml](/cloudbuild.yaml)
