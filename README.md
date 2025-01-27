# Digital Realty Website

This repository contains the code for the backend api/bridge, the frontend and the terraform for the cloud environment for the digital realty website. Additionally it contains some github workflows related to the deployment of the application. Please see the individual folders and their README files for more information on those specific parts.


- [Front End README](/frontend/README.md)
- [Backend End README](/backend/README.md)
- [Terraform README](/terraform/README.md)


# Example to run as docker
docker run -p 80:3000 -d -e NODE_CONFIG='{"database":{"host": "dbHost","user":"dbUser","password":"dbPass", "dbname": "dbName"}}' --name=dgdev imageRepo/pdx-modeler:tag


## Deployment Information
Github actions runs on every commit to the main branch. The actions will run unit tests for the backend and the frontend. If those succeed it will build the docker images. Once that succeeds it will deploy dev. The actions also run when a release is created, when a release is created a docker image is made with the same tag and staging is also deployed (to the new tag).

The application deployment information detailed above only runs when the backend or frontend folders are modified.

If the terraform folder is modified then it will run the infrastructure action which will keep the dev and staging environments in sync with the code base. As with the application portion staging is only updated when a release is created.

The deployment is powered by secrets which are managed in github.