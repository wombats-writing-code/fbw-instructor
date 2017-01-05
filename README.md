
# Fly-by-Wire Instructor (web + mobile)


## Development installation
```
git clone https://github.com/wombats-writing-code/fbw-instructor.git
```

Install required packages in `ios`:
```
cd ios
npm install
```

Install required dependencies in `web`:
```
cd web
npm install
```

## Development

### iOS
Work in progress. There's no folder for iOS yet.

### web
To develop for web:
```
cd web
npm start
```

To mock a D2L flow, go to `localhost:3000/d2l-callback...`. The callback component will kick off the D2L chain with the middleman and return a hardcoded D2L user. 

## Testing
