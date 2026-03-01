# Campus Facility Booking API

Base URL: `https://campus-facility-booking-latest.onrender.com/api`

---

## **Availability**

### Check Facility Availability

* **Endpoint:** `/availability`

* **Method:** `GET`

* **Query Parameters:**

  | Parameter     | Type   | Required | Description                                |
  | ------------- | ------ | -------- | ------------------------------------------ |
  | `facility_id` | int    | Yes      | ID of the facility to check                |
  | `date`        | string | Yes      | Date to check (YYYY-MM-DD)                 |
  | `start_time`  | string | Yes      | Start time (HH:MM)                         |
  | `end_time`    | string | Yes      | End time (HH:MM), must be after start_time |

* **Success Response (200 OK):**

```json
{
  "available": true
}
```

---

## **Bookings**

### List All Bookings

* **Endpoint:** `/bookings`
* **Method:** `GET`
* **Success Response (200 OK):**

```json
[
  {
    "id": 1,
    "facility": {
      "id": 1,
      "name": "Conference Hall"
    },
    "user": {
      "id": 1,
      "name": "John Doe"
    },
    "date": "2026-03-01",
    "start_time": "09:00",
    "end_time": "10:00"
  }
]
```

### Get Booking by ID

* **Endpoint:** `/bookings/{booking}`

* **Method:** `GET`

* **URL Parameters:**

  | Parameter | Type | Required | Description |
  | --------- | ---- | -------- | ----------- |
  | `booking` | int  | Yes      | Booking ID  |

* **Success Response (200 OK):**

```json
{
  "id": 1,
  "facility": { "id": 1, "name": "Conference Hall" },
  "user": { "id": 1, "name": "John Doe" },
  "date": "2026-03-01",
  "start_time": "09:00",
  "end_time": "10:00"
}
```

* **Error Response (404 Not Found):**

```json
{
  "message": "Booking not found"
}
```

### Create a Booking

* **Endpoint:** `/bookings`
* **Method:** `POST`
* **Body Parameters:**

```json
{
  "facility_id": 1,
  "user_id": 1,
  "date": "2026-03-01",
  "start_time": "09:00",
  "end_time": "10:00"
}
```

* **Success Response (201 Created):** Returns the created booking object.
* **Error Response (409 Conflict):**

```json
{
  "message": "Booking conflict detected"
}
```

### Update a Booking

* **Endpoint:** `/bookings/{booking}`
* **Method:** `PUT` / `PATCH`
* **Body Parameters:** Same as Create
* **Success Response (200 OK):** Returns updated booking
* **Error Responses:**

  * `404 Not Found` if booking does not exist
  * `409 Conflict` if updated booking conflicts with existing

### Delete a Booking

* **Endpoint:** `/bookings/{booking}`
* **Method:** `DELETE`
* **Success Response (200 OK):**

```json
{
  "message": "Booking cancelled"
}
```

* **Error Response (404 Not Found):**

```json
{
  "message": "Booking not found"
}
```

---

## **Facilities**

### List All Facilities

* **Endpoint:** `/facilities`
* **Method:** `GET`
* **Success Response (200 OK):**

```json
[
  {
    "id": 1,
    "name": "Conference Hall",
    "location": "5.6037, -0.1870",
    "capacity": 50
  }
]
```

### Get Facility by ID

* **Endpoint:** `/facilities/{facility}`
* **Method:** `GET`
* **Success Response (200 OK):** Returns facility object
* **Error Response (404 Not Found):**

```json
{
  "message": "Facility not found"
}
```

### Create a Facility

* **Endpoint:** `/facilities`
* **Method:** `POST`
* **Body Parameters:**

```json
{
  "name": "Conference Hall",
  "location": "5.6037, -0.1870",
  "capacity": 50
}
```

* **Success Response (201 Created):** Returns created facility

### Update a Facility

* **Endpoint:** `/facilities/{facility}`
* **Method:** `PUT` / `PATCH`
* **Body Parameters:** Any of `name`, `location`, `capacity`
* **Success Response (200 OK):** Returns updated facility
* **Error Response (404 Not Found):**

```json
{
  "message": "Facility not found"
}
```

### Delete a Facility

* **Endpoint:** `/facilities/{facility}`
* **Method:** `DELETE`
* **Success Response (200 OK):**

```json
{
  "message": "Facility deleted successfully"
}
```

* **Error Response (404 Not Found):**

```json
{
  "message": "Facility not found"
}
```


