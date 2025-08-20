# studies-management

Simple app that batches requests to song+ego to fetch and create studies along with related autho entities (ego groups and policies). This app also batches requests to ego add users to a study group.

## Dev local env setup

There is a docker compose setup with ego, song, and their respective DBs with some initial values provided in `./compose`.

### Start containers:

```
docker-compose -f compose/docker-compose.yaml up -d
```

### Application configuration

Create a `.env` file at the root of the project with the following variables:

```
# Server configuration
SERVER_PORT=3030

# OAuth2 credentials
EGO_URL="http://localhost:8081"
OAUTH_CLIENT_ID="adminId"
OAUTH_CLIENT_SECRET="adminSecret"

# Permission scope required to access the Studies service
SCOPES_WRITE="DOMAIN.WRITE"
```

### Multiple SONGS services:

The Studies Management service supports connecting to multiple SONG instances.

To configure the first SONG instance, add this to the `.env` file:

```
SONG_1_ID=song1
SONG_1_PREFIX="STUDY-"
SONG_1_URL="http://localhost:8089"
```

To add more SONG instances, increment the number suffix for each variable (`SONG_2*`, `SONG_3*`, etc.). Example:

```
SONG_2_ID=song2
SONG_2_PREFIX="WW-"
SONG_2_URL="http://localhost:8090"

SONG_3_ID=song3
SONG_3_PREFIX="ABC-"
SONG_3_URL="http://localhost:8091"
```

### Start app:

```
npm run dev
```

<br>

### Default that song and ego DBs are init with:

Default Studies:

```
DASH-CA
COVID-PR
TEST-CA
```

Default users:

```
submitter1@example.com
submitter2@example.com
submitter3@example.com
submitter4@example.com
submitter5@example.com
submitter6@example.com
```

### How to authenticate

To request a **Bearer token** for authentication, run the following command:

```
curl -s -X POST \
  "http://localhost:8081/oauth/token" \
  -G \
  -d "client_id=adminId" \
  -d "client_secret=adminSecret" \
  -d "grant_type=client_credentials" \
| jq -r '.access_token'
```

This command will return the access token, which you can then use for authentication.
