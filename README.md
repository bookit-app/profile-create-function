# profile-services functions
Cloud Function to handle profiles BookIt user profiles

## Supported Operations
- POST: For the moment there is no payload validations so if you don't provide the below (minus the exact values) it will not work. Validations and schemas are next on the list

```json
{
	"uid": "TEST",
	"firstName": "test-first-name",
	"lastName": "test-last-name",
	"gender": 0,
	"isSocial": true,
	"birthday": "05/02/1982",
	"isProvider": false,
	"phoneNumber": "1231231234"
}
```

## Deploy

Deployment occurs via Cloud Build. There are 2 phases associated with this:

- When PR's are open a build verification occurs and is required to pass prior to allowing merge - Refer [cloudbuild-dev.yaml](/cloudbuild-dev.yaml)
- When merge into master a build and deployment will occur - Refer [cloudbuild.yaml](/cloudbuild.yaml)

