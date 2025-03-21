# MajstorHUB: UpWork inspired freelance app for construction workers built with .Net, React with TypeScript and MongoDB

## Production ready freelance app inspired by UpWork for construction workers designed to connect contractors and clients. Built for university project, graded 95 out of 100.

This app was made to solve the problem of finding contactors, and for contractors to find appropriete clients in Serbia.

The main idea is that clients create job posts explaining the job and also selecting many options provided in order to find the perfect contractor, like selecting contractor experience. Contractors can search for job posts and apply for them, clients can then see them as well as contractor contact information (not previously visible on their profile), contact them and then choose contractor they like.
When contract starts client needs to pay it immediatily, and if the job finishes succesfully the money gets transfered into contractors account, if contractor doesn't finish the job on time, or does a poor job the money gets sent back to the client.

MajstorHUB was built using
* .Net version 8 for backend,
* MongoDB was used for databse and
* React with TypeScript for frontend with many additional packages

The reason for it being graded 95 out of 100 is that platform lacked some other functionalities, like having real paymant, chat system, not merging companies search with constructor workes, and some other minor functionalities. The platform was built by a team of two people, and we didn't have enough time to implement those things.

## Demo: Posting a job as a client
https://github.com/user-attachments/assets/68ce4d6b-2fb7-4f82-8e2f-fc9bdbe8ce82

## Demo: accepting and finishing a job
https://github.com/user-attachments/assets/bac7ff89-c227-4783-9d78-8ecb44eeabfc

## Key Features MajstorHUB Have

Before using the platform user needs to register. During registration user chooses which user type it wants to be (client, contractor or construction company) and depending on user type he can do different things on the platform. Note that one person can have multiple account types, one person can have client as well as constructions account as well.

### User Types

* Client (klijent),
* Construction Worker (Majstor),
* Construction Company (Firma),
* Admin and
* Sudo-Admin

### Features all users have

* Logging in and out of their account,
* Registering another account type,
* Viewing their dashboard, it shows jobs that are in progress,
* Creating and editing their profile,
* Deposit and withdraw of their platform balance,
* Searching for contractors, companies and clients,
* Searching for job posts (if they are public),
* Viewing other user profiles (if they are public),
* Reporting other people on the platform,
* Request for finishing the job,
* Leaving a review only after the job is finished and
* Request for admin privileges


### Client Features

* Creating, updating and deleting job posts,
* Viewing job applications (only for their job posts),
* Starting a job out of job application and
* When the job is finished its price is added to his total spent, which is shown in the profile and in search

Viewing job applications on a job post has some sorting logic, thhe more the contractor matches the job post (with their experience, skills and other) the better the score, and the better positions he has in the list of job posts.
If the contractor has good matching with the job post it will get a badge showing that.
Also the bit placed on the job post also has impact on the position of that job post, but not as much as matching score.
Contractor also gets a badgde if he/she boosted the job application enough.

### Contractor Features

The only difference between worker and company is that worker can select only one skill that he/she offers and the company can select maximum of 15.

* Changing skill/skills on their profile,
* Changing experience on their profile,
* Applying for job post,
* Deleting their job application and
* When the job is finished its price is added to his total earned, which is shown in the profile and in search

### Admin and Sudo-Admin Features

They are regular users (contractor or client) but they have admin/sudo-admin previlages.
They get another dashboard, where they can see list of reported users and who reported them, and they can either ban first or the second user.

When user gets banned, all of their job posts are put to private, and job posts related to it get deleted, also their profile is no longer visible and they can no longer log in with their credentials.

Admins can also ban any user by going on their profile and clicking ban button.

They also see list of all blocked users.

Sudo admins have one additional functionality, they can see list of users that have requested admin privileges and accept or reject their request.

Also admins have access to all endpoints in the backend, but we didn't have enough time to implement it on frontend.

### Authorization and Authentification

Authentifications is done using email adress user provies.

Authorization is implemented using JWT and refresh tokens.
JWT session lasts only 15 minutes, but refresh one lasts 7 days.

## How to run this project

### Prerequisites

1. Install Node.js: https://nodejs.org/en/download/package-manager,
2. Install .Net version 8: https://dotnet.microsoft.com/en-us/download

### Running the project

1. Open backend in any code editor and run it,
2. Open frontend in code editor and run *npm install*,
3. Then run it with *npm run dev*

If for some reason frontend runs on different port from 5173 you need to change it in backend by opening *program.cs* file and changing CORS setting on line 20.

## Known issues

* Deposit or withdraw of money doesn't get updated on frontend until you refresh the page,
* Search broke once on frontend, but we couldn't get it to break again during testing
