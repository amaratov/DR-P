# Digital Reality Website

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Mapbox Access Token(if needed)

create `.env.[environment]` file and and `REACT_APP_MAPBOX_ACCESS_TOKEN=youMapBoxToken`

## Available Scripts

To install modules run:

### `npm install`

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm test [filename]`

Launch test by file name

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### `npm run lint`

For checking code syntax and get suggestions

### `npm run lint:fix`

Some errors could be fixed by running this command

## Minio and S3 config

Setup a local bucket for upload and downloading by install minio:
run `brew install minio/stable/minio` for installing
windows: download executable `https://dl.min.io/server/minio/release/windows-amd64/minio.exe`

Make directory for file storage:
run `mkdir ~/minio`
windows: create new folder in c directory

Start the server:
run minio server ~/minio --console-address :9090
windows: run `.\minio.exe server C:\minio --console-address :9090`

Access the server with `localhost:9090`, login with minio default creds then create the bucket
once bucket is created, generate a set of accessKey and secretKey, put that in the backend config file
under `/backend/config/development.json` along with url and bucket name

Sample config for minio:

```
"minio":
{
    "url": "localhost", // for s3 it will be the actual endpoint url
    "ssl": false, // true for s3
    "port": 9000, // see default.json
    "accessKey": "yourKey",
    "secretKey": "yourSecret",
    "bucket": "yourBucketName",
    "bucketRegion": "bucketRegion" // this is needed for s3 only
}
```

For Dev and Staging that uses S3, you don't need to put the actual value in the config json file
just update the backend `.github/workflows/application.yaml` file, to make sure it has the correct github secret
once setup proper the value in the config file should be auto replace with the actual value from github secret

sample(under deploy_dev -> script, in the NODE_CONFIG):

```
NODE_CONFIG='{"minio":{"url":"${{gitSecrets.BUCKET_DEV_ENDPOINT}}", "accessKey":"${{gitSecrets.BUCKET_DEV_ACCESS_KEY}}"}...}
```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

