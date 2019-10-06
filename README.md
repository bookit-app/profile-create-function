# profile-services functions

Services to handle Profile API Operations. Setup to be deployed to Cloud Run, GKE, or Cloud Functions

## Supported Operations

- Update with reference to the Endpoints documentation

## Deploy

Deployment occurs via Cloud Build. There are 2 phases associated with this:

- When PR's are open a build verification occurs and is required to pass prior to allowing merge - Refer [cloudbuild-dev.yaml](/cloudbuild-dev.yaml)
- When merge into master a build and deployment will occur - Refer [cloudbuild.yaml](/cloudbuild.yaml)
