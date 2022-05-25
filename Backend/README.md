# HRMS-Gratia
This code repository is for the Human Resource Management Project for Gratia Technology.

# HRMS-Gratia-Backend
This code repository is for backend of the Human Resource Management Project for Gratia Technology.

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
       
- ### Frontend : this contains all the files related to the frontend.

## API endpoints
-   ### Register or Login (ROL)
1.      api-endpoint : api/rol/login
        method : post
        params : email, password
        
2.      api-endpoint : api/rol/register
        method : post
        params : email, password, name, dob, phone, designation and department
        
3.      api-endpoint : api/rol/passwordchange
        method : post
        params : email, password,new_password
        
-       Demo response : 
        {
          "message": "success",
          "error": false,
          "data": {
                "emp_id": "GT/0007/22",
                "email": "test6@gmail.com",
                "name": "Tutul Deb Roy",
                "phone": "9854851059",
                "dob": "29-09-1998",
                "designation": "Project Assistant",
                "department": "IT",
                "_id": "622ef8abe6afc5aab6e3a832",
                "__v": 0
          }
        }
        
-   ### Attendance
        
1.      api-endpoint : api/attendance/register
        method : post
        params : emp_id, attendanceType (1-> checkin & 2-> checkout)
        
2.      api-endpoint : api/attendance/get
        method : post
        params : emp_id, attendanceType (optional), date (optional), current_page (optional)
        
3.      api-endpoint : api/attendance/get/range
        method : post
        params : emp_id, attendanceType (optional), start_date, end_date , current_page (optional)
            
-        Demo response : 
        {
          "message": "success",
          "error": false,
          "current_page": 1,
          "item_perpage": 10,
          "total_page": 1,
          "data": [
            {
              "_id": "623c4daa818fe295108e9316",
              "emp_id": "GT/0001/22",
              "attendanceType": 2,
              "date": "2022-03-23T18:30:00.000Z",
              "timestamp": "4:23:08 PM",
              "__v": 0
            },
            {
              "_id": "623c4f086b7a82b0a3f9ad9b",
              "emp_id": "GT/0001/22",
              "attendanceType": 2,
              "date": "2022-03-24T00:00:00.000Z",
              "timestamp": "4:29:17 PM",
              "__v": 0
            },
            {
              "_id": "623c575c10662d5c83215f5b",
              "emp_id": "GT/0001/22",
              "attendanceType": 1,
              "date": "2022-03-24T00:00:00.000Z",
              "timestamp": "5:03:41 PM",
              "__v": 0
            }
          ]
        }

-   ### Leave
        
1.      api-endpoint : api/leave/apply
        method : post
        params : emp_id, reason, start_date, end_date
        
2.      api-endpoint : api/leave/get
        method : post
        params : emp_id, status (optional), start_date (optional), end_date (optional) ,current_page (optional)
        
3.      api-endpoint : api/leave/update/status

        method : post
        params : id, status

4.      api-endpoint : api/leave/get/details
        method : post
        params : emp_id (optional)

5.      api-endpoint : api/leave/hr/update
        method : post
        params : emp_id, yearly (number of paid leaves granted yearly)

6.      api-endpoint : api/leave/get/requests
        method : post
        params : status(optional)

7.      api-endpoint : api/leave/get/requests/id
        method : post
        params : status(optional)

8.      api-endpoint : api/holiday/get
        method : post
        params : start_date(optional), end_date(optional), current_page(optional)

9.      api-endpoint : api/holiday/get/add
        method : post
        params : date(holiday date), name(holiday name)

10.     api-endpoint : api/holiday/delete
        method : post
        params : start_date, end_date

-   ### Bank Details
        
1.      api-endpoint : api/bank/add
        method : post
        params : emp_id, bankname, branch, account_no, ifsc, pan_number

2.      api-endpoint : api/bank/get
        method : post
        params : emp_id
        
3.      api-endpoint : api/bank/update
        method : post
        params : emp_id, bankname(optional), branch(optional), account_no(optional), ifsc(optional), pan_number(optional)


-   ### Project
        
1.      api-endpoint : api/project/add
        method : post
        params : title, desc, start_date (optional), end_date (optional), status (optional)
        
2.      api-endpoint : api/project/get
        method : post
        params : project_id

3.      api-endpoint : api/project/get/all
        method : post
        params : status(optional), emp_id (optional), current_page (optional)

4.      api-endpoint : api/project/get/members
        method : post
        params : project_id

5.      api-endpoint : api/project/delete
        method : post
        params : project_id

6.      api-endpoint : api/project/update
        method : post
        params : project_id, title (optional), desc (optional), start_date (optional), end_date (optional), status (optional)

7.      api-endpoint : api/project/update/member
        method : post
        params : json object containing project_id and members array, this end-point will replace all the previous members with the newly passed members
        example : {
                "project_id":1,
                "members":[
                        {
                                "emp_id":GT/0001/22
                        },
                        {
                                "emp_id":GT/0002/22,
                                "role": "Frontend developer"
                        }
                ]
        }

8.      api-endpoint : api/project/update/member/add
        method : post
        params : json object containing project_id and members array, this end-point will add the newly passed members with prevous members
        example : {
                "project_id":1,
                "members":[
                        {
                                "emp_id":GT/0001/22
                        },
                        {
                                "emp_id":GT/0002/22,
                                "role": "Frontend developer"
                        }
                ]
        }

9.      api-endpoint : api/project/update/member/delete
        method : post
        params : json object containing project_id and emp_id array
        example : {
                "project_id":1,
                "members":["GT/0001/22","GT/0002/22"]
        }


## Demo
-       localhost:3000/demo/ : Homepage.
-       localhost:3000/demo/add : employee can be added here and response will be shown in raw json format.
-       localhost:3000/demo/login : login can be performed, upon successful login a demo dashboard will be presented.
-       localhost:3000/demo/list : list of every resigisted employee will be shown in raw json format.

