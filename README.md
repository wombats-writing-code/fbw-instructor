
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

The code in `platform-common` has dependencies. These need to be resolved when you are developing for web:
```
cd platform-common
npm link

cd web
npm link ../platform-common
```

## Development

Each platform runs separately in its folder, but symlinks to the `platform-common` folder

### iOS
Work in progress. There's no folder for iOS yet.

### web
To develop for web:
```
cd web
npm start
```

## Testing
Unit tests are kept close to the code, within each discrete module.

`platform-common` are all unit tests, since these are all modular pure functions. To start testing:
```
cd platform-common
npm test
```
This runs the mocha test suite *once*. It globs through every file in the `platform-common` directory and finds ones with name `*.spec.js`.
