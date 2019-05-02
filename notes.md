The very approach to solve this problem:
will have 3 tables:

TABLE 1 Users Table

userid(auto generate)| username|Password(shouldn't be given here|email          |phone
12                   |Tony     |Pass                            |Tonya@gmail.com|1234
13                   |Mony     |Pass                            |Monya@gmail.com|1235
14                   |Pony     |Pass                            |Ponya@gmail.com|1236
15                   |Sony     |Pass                            |Sonya@gmail.com|1237


TABLE 2 EVENTS Table

eventid(auto generat)| event_name|event_description|date       |Total Expenditure|Paid_by
1                    |Lunch      |with friends      |28April2019|  90            |12
2                    |Dinner     |with friends      |20April2019|  100           |13
3                    |groceries  |with friends |    |27April2019|  40            |12



TABLE 3 Maps Table(many -many relationship between users and )

eventid(from event table)|user_id(from users table)|to_pay(individual)|
1                        |12                       |30
1                        |13                       |30
1                        |14                       |30
2                        |12                       |50
2                        |13                       |50
3                        |12                       |20
3                        |14                       |20



yarn init -y
yarn 
yarn add express cors helmet 
yarn add knex sqlite3
yarn add bcryptjs
yarn add nodemon --dev
yarn add jsonwebtoken
yarn add dotenv
touch .env
knex init 
knex migrate:make createusersTable
knex migrate:make createeventsTable
knex migrate:make event-usermapTable
knex migrate:latest

knex seed:make 01-users
knex seed:make 02-events
knex seed:make 03-map

three tables :users, and events , since many to many mapping is there between users and events 
I am sending you both the api for register and login . I am also sending req.body and response . http://localhost:9090/api/auth/register,body for register
{
    "username" : "alok5",
    "password" : "alok5",
    "phone" : 1234,
    "email" : "sdjeldfjelfj"
    
}
response of register
{
   "saved": [
       {
           "id": 4,
           "username": "alok5",
           "password": "$2a$06$41byDY6t6RjL9C2jfQ/svu5Jak0fmZkdHuqbaHucv2v40LcoqivrO",
           "phone": 1234,
           "email": "sdjeldfjelfj"
       }
   ],
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsb2s1IiwicGhvbmUiOjEyMzQsImVtYWlsIjoic2RqZWxkZmplbGZqIiwiaWF0IjoxNTU2MTc1ODc1LCJleHAiOjE1NTYyNjIyNzV9.zS-BeBCEPL5bGUPc64EKXfLa8ANLZb_RYlvwNH9FJ30"
}
login api is:http://localhost:9090/api/auth/login
login body:{
    "username" : "alok5",
    "password" : "alok5"
    
}
response from login
{
   "message": "Welcomealok5!, Here is your token:",
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0Ijo0LCJ1c2VybmFtZSI6ImFsb2s1IiwicGhvbmUiOjEyMzQsImVtYWlsIjoic2RqZWxkZmplbGZqIiwiaWF0IjoxNTU2MTc1OTIwLCJleHAiOjE1NTYyNjIzMjB9.RnMD-8Wz53aRhqyVoFkvrpDLifMwzbud-i6qc4aMHPM"
}
