
# Fly-by-Wire Instructor (web + mobile)


## Development installation
```
git clone https://github.com/wombats-writing-code/fbw-instructor.git
cd web
```

Install required dependencies in `web`:
```
cd web
npm install
```

## Development

### web
To develop for web:
```
cd web
npm start
```

To mock a D2L flow, go to `localhost:3000/d2l-callback...`. The callback component will kick off the D2L chain with the middleman and return a hardcoded D2L user.

## Using the application (web)

If you want to try out the app, web is best:

1. Go to `fbw-instructor.mit.edu`
1. You should be redirected to `fbw-instructor.mit.edu/login`. Here, you have three options:
  * Use a simple visitor login by clicking on visitor, and entering in any username.
  * Use the D2L login by clicking on the Arapahoe button, and authenticating via the D2L redirect using D2L credentials (ask us for one)
  * Change the url to be `fbw-instructor.mit.edu/d2l-callback`. This will log you in with a fake math instructor account.

## Adding new courses

Before the beginning of each semester:

* a list of D2L sections must be obtained from ACC
* look at the console.logs on the app to get details on the D2L enrollment object for each course
* the JSON for each section must be manually created in the DB and associated with the correct domain (College Algebra or Accounting)
