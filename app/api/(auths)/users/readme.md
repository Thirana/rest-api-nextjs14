# API Documentation

`GET`
**api endpoint:** http://localhost:3000/api/users

_get all the users from DB_

---

`POST`
**api endpoint:** http://localhost:3000/api/users

_add new user to the DB_

Body

```
{
"email": "exampleUser2@gmail.com",
"username": "exampleUser2",
"password": "exampleUser2"
}
```

---

`PATCH`
**api endpoint:** http://localhost:3000/api/users

_update exsisting user based on userID_
_userID pass via request body_

Body

```
{
    "userId":"666ec620ad967fec1133a294",
    "newUsername":"exampleUser2Patch"
}
```

---

`DELETE`
**api endpoint:** http://localhost:3000/api/users?userId=666ec620ad967fec1133a294

_Delete exsisting user based on userID_
_userID pass via request URI_
