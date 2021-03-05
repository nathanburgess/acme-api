# Running
1) Run `yarn` or `npm i`
1) Run `yarn docker` or `npm run docker` in the project root

# API Specification

## Profiles
**GET** `/{personaId}`
> Get a profile by persona ID. Returns a `Profile` object.

&nbsp;

**POST** `/{personaId}`
> Create a profile by persona ID. Returns a `Profile` object.
> NOTE: Returns a 422 if a profile with the given persona ID already exists.

&nbsp;

**PATCH** `/{personaId}`
> Update a profile by persona ID. Returns a `Profile` object.

#### JSON Params
| Field        | Type     | Description                                            |
| ------------ | -------- | ------------------------------------------------------ |
| firstName    | string   | The persona's first name                               |
| lastName     | string   | The persona's last name                                |
| latitude     | float    | A coordinate representing the persona's latitude       |
| longitude    | float    | A coordinate representing the persona's longitude      |
| interests    | string[] | An array of strings containing the persona's interests |

#### Example Profile Object
```json
{
  "personaId": "697489244649816084",
  "firstName": "Jane",
  "lastName": "Doe",
  "latitude": 47.72270188976685,
  "longitude": -122.1676010639055,
  "temperature": null,
  "city": "Kirkland",
  "state": "WA",
  "forecastUrl": "https://api.weather.gov/gridpoints/SEW/130,71/forecast",
  "interests": [
    {
      "name": "cooking",
      "profileId": "697489244649816084"
    },
    {
      "name": "gardening",
      "profileId": "697489244649816084"
    }
  ]
}
```