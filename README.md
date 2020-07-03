# Bug Tracker App

This app uses React ,Redux and Firebase to create a system for teams to keep track of 
bugs in their projects.Each project in this app is a collection of 
users and tickets.The app keeps track of any chamges made to the ticket
and users can also add comments to the ticket.

```
There are 4 major roles each user can have:
1) Admin:Can add/remove projects and tickets
2) Project Manager:Can add/remove users from projects
3) Submitter: Can add/remove tickets to the projects and assign them to a user
4) Developer:Can change the status of a ticket(Open/Resolved)
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
```
1) Install npm (Node Package Manager)
2) Clone the git repository
3) Run 'npm install' and 'npm run start' in a terminal
4) A live updating (if code changes) version of the app will now be running in your browser
```


## User Interface 

This section will show you some of the features of the app

#### Home Page
![Home Page](/docs/dash.png)

The dashboard displays information regarding the tickets in the form of charts.Users can then view/edit the projects and tickets assigned to him based on their role.

![Ticket](/docs/tick.png)
Each ticket consists of details,history and comments





## Built With

* React- The library used to build the front end
* Redux - Used to manage the state of the application
* Firebase - Used the real time database to store application data
* npm - Used to handle packaging and dependencies

## Authors

* **Abdullah Mohammed** - [LinkedIn](https://www.linkedin.com/in/abdullah-mohammed-456290195/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
