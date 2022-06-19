# fullstackopen-2022-backend

This is a repo for backends for the Open University Course "Full Stack Open" https://fullstackopen.com/en. It is an addition to my other repo for this course: https://github.com/AndiSwiss/fullstackopen-2022.

## Organized in branches & releases
- Branch & Release `part3a-exercises-backend`: Exercises 3.1-3.8 (all exercises of **part3a**)
- Branch & Release `part3b-exercises-backend`: Exercises 3.9-3.11 (all exercises of **part3b**) => deployed to Heroku:
  - Dashboard: https://dashboard.heroku.com/apps/fullstackopen-part3b-exercises
  - Available at: https://fullstackopen-part3b-exercises.herokuapp.com
  - For changes:
      - Do your changes in this backend and/or in the frontend in repo https://github.com/AndiSwiss/fullstackopen-2022 in `part3/..??`
      - then use the run-config `deploy:full` => this script does a lot:
          - Fetch and build frontend, copy the build, make an automated commit, set the correct heroku git-link, and deploy the app to heroku!
          - => see scripts-section in package.json for exact commands
  - Start the web-app: `heroku open`
  - Start the app locally: `heroku local`

