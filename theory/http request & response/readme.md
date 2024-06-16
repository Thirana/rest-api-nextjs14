## HTTP Request

_An HTTP request is a message sent by a client to a server to perform an action. The structure of an HTTP request includes:_

**1. HTTP Method** Specifies the action to be performed. Common methods include:

- `GET`: Retrieve data from the server.
- `POST`: Send data to the server to create a new resource.
- `PUT`: Update an existing resource on the server.
- `DELETE`: Remove a resource from the server.
- `PATCH`: Partially update an existing resource.
- `HEAD`: Retrieve metadata about the resource without the response body.
- `OPTIONS`: Describe the communication options for the target resource.

**2. URL** The address of the resource being requested.

**3. Headers** Key-value pairs containing metadata about the request (e.g., `Content-Type`, `Authorization`).

**4. Body** The data sent with the request (typically in `POST`, `PUT`, and `PATCH` methods).

---

## HTTP Responses

_An HTTP response is the server's reply to a client's request. The structure of an HTTP response includes:_

**1. Status Code**: Indicates the result of the request. Common status codes include:

- `200 OK`: The request was successful.
- `201 Created`: The resource was successfully created.
- `400 Bad` Request: The request was malformed.
- `401 Unauthorized`: Authentication is required.
- `403 Forbidden`: The server understood the request but refuses to authorize it.
- `404 Not` Found: The resource was not found.
- `500 Internal` Server Error: The server encountered an error.

**2. Headers**: Key-value pairs containing metadata about the response (e.g., Content-Type, Set-Cookie).

**3. Body**: The data sent with the response (often in JSON format for APIs).

---

## Relation with HTTP Methods

_The HTTP method used in a request influences the type of response expected:_

`GET`:

- `Request`: No body, used to retrieve data.
- `Response`: Contains the requested data.

`POST`:

- `Request`: Contains data to be processed (e.g., form data, JSON).
- `Response`: Contains confirmation of resource creation and often includes the new resource or its ID.

`PUT`:

- `Request`: Contains data to update an existing resource.
- `Response`: Contains confirmation of the update and possibly the updated resource.

`DELETE`:

- `Request`: Typically has no body.
- `Response`: Contains confirmation of the deletion.

`PATCH`:

- `Request`: Contains data to partially update an existing resource.
- `Response`: Contains confirmation of the update and possibly the updated resource.
