# Multi-stage docker build.
split up actions, only manage 1 dockerfile, smaller final docker image.
## Steps
1. build backend & test
-> install everything
-> build (for production)
-> test
-> export build as artifact

1. build frontend
-> install everything
-> build
-> test
-> export only build as artifact

1. combine both & test full stack
-> install everything
-> test

1. deploy
-> export
-> smallest image to dockerhub

## 







TODO

1. Write 1-2 tests
    -> run using "npm run test"

2. Create "Test" Action 
    -> use mongo in GHA -> https://github.com/marketplace/actions/mongodb-in-github-actions

    -> uses npm cache from "Build" action
    -> uses artifact(s) from "Build" action
        -> copy ./dist
        -> copy package.json, 
                eslintrc.json (neccesary?)
                tsconfig.json
                .gitignore
                
    -> npm ci
    -> npm run test

3. Create "Deploy" Action
    -> from test artifacts (if tests pass!!!) generate a docker image.