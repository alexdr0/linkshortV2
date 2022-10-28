# Linkshort Server

Please use ``yarn install`` to install dependencies.

To use the application you must have a mongodb database, and setup the port/host inside the config.json folder in the /server directory.
*Example config.json*
```json
{
    "port": 3004, //this is the reccomended port that the VUE app uses.
    "host": "<host>",
    "database": {
        "uri": "<MongoDB-URI>"
    }
}
```

To run the server please use these  commands:

To install dependencies if you have not done it already:
```js
yarn install // if you have not done it already
```

To compile the application
```js
yarn makeJS
```

To run the application

```js
yarn runserver
```