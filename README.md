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

#### Configuration Format:

Each SONG instance requires following environment variables with a numbered suffix starting from `0`:

- `SONG_X_SAMPLE_TYPE` - defines the sample type
- `SONG_X_PREFIX` - sets the prefix for studies
- `SONG_X_URL` - specifies the service endpoint

#### Setup example:

First SONG instance starts with a sequential number suffix starting from `0`:

```
SONG_0_SAMPLE_TYPE=clinical
SONG_0_PREFIX="STUDY-"
SONG_0_URL="http://localhost:8089"
```

Additional instances use sequential numbering (`SONG_1*`, `SONG_2*`, etc.):

```
SONG_1_SAMPLE_TYPE=environmental
SONG_1_PREFIX="WW-"
SONG_1_URL="http://localhost:8090"

SONG_2_SAMPLE_TYPE=genomic
SONG_2_PREFIX="ABC-"
SONG_2_URL="http://localhost:8091"
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
