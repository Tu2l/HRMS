# HRMS-Gratia
This code repository is for the Human Resource Management Project for Gratia Technology.

## Project setup
- **Clone the repository**.
- Install node_modules by using **_npm install_** command in the project directory where **index.js** is present.
- run the project using **_npm start_** command.
- visit url **_localhost:3000_** to access the project via browser.

## Directories ## 

- ### Backend : this contains all the files related to the backend.
   
    - **controller** : contains files which are responosible for performing logical or database operations. Routers uses controllers to handale all the logical operations.
    - **router** : contains files which are responosible for performing routing, routes imports controllers.
    - **model** : contains database models, controller imports model to perform CRUD operation.
       
- ### Frontend: this contains all the files related to the frontend.

## API endpoints
-   ### Register or Login (ROL)
    - **login** - **_api/rol/login/_** : method: post and required params are email and password and response will be employee info object.
    - **register** - **_api/rol/register/_** : method: post and required params are email, password, name, dob, phone, desgination and department and response will be employee info object.

Demo response
```json
    {
      "message": "success",
      "error": false,
      "data": {
            "emp_id": "GT/0007/22",
            "email": "test6@gmail.com",
            "password": "d705377cdcd1c92de9e32ab79514b5805879e6dd2a2fb3ba63687ca329e76750",
            "name": "Tutul Deb Roy",
            "phone": "9854851059",
            "dob": "29-09-1998",
            "designation": "Project Assistant",
            "department": "IT",
            "_id": "622ef8abe6afc5aab6e3a832",
            "__v": 0
      }
    }
```

## Testing
- ##### _localhost:3000/demo/_ : Homepage.
- ##### _localhost:3000/demo/add_ : employee can be added here and response will be shown in raw json format.
- ##### _localhost:3000/demo/login_ : login can be performed and response will be shown in raw json format.
- ##### _localhost:3000/demo/list_ : list of every resigisted employee will be shown in raw json format.
