# Gamilms
>
> Use MEAN (MongoDB, Express, Angular and Node) stack for build a “Meaningful Gamification Learning Management System”
>


## Prerequisite Technologies
### Linux
* *Node.js* - <a href="http://nodejs.org/download/">Download</a> and Install Node.js
* *MongoDB* - <a href="https://www.mongodb.org/downloads">Download</a> and Install mongodb - <a href="https://docs.mongodb.org/manual/">Checkout their manual</a> if you're just starting.

If you're using ubuntu, this is the preferred repository to use...

```bash
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get update
$ sudo apt-get install nodejs
```

* *Git* - Get git using a package manager or <a href="http://git-scm.com/downloads">download</a> it.

### Windows
There are some bugs in windows, so Windows can`t be supported.

### OSX
* *Node.js* -  <a href="http://nodejs.org/download/">Download</a> and Install Node.js or use the packages within brew or macports.
* *MongoDB* - Follow the tutorial here - <a href="https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/">Install mongodb on OSX</a>
* *git* - Get git <a href="http://git-scm.com/download/mac">from here</a>.


<hr>
Getting Started
------
The easiest way to get started is to clone the repository:

```bash
# Get the latest snapshot
git clone --depth=1 https://github.com/cyan92128505/gamilms.git myproject

# Change directory
cd myproject

# Install NPM dependencies
npm install

node server.js
//or
npm run test
```


## Auth Setting

<img src="https://raw.githubusercontent.com/cyan92128505/gamilms/main/mean-stack/doc/auth-facebook.svg" width="100%">

- Visit [Facebook Developers](https://developers.facebook.com/)
- Click **My Apps**, then select **Add a New App* from the dropdown menu
- Select **Website** platform and enter a new name for your app
- Click on the **Create New Facebook App ID** button
- Choose a **Category** that best describes your app
- Click on **Create App ID** button
- In the upper right corner click on **Skip Quick Star**
- Copy and paste *App ID* and *App Secret* keys into `/config/system_config.json`
- **Note:** *App ID* is **clientID**, *App Secret* is **clientSecret**
- Enter `http://localhost::port/gamilms/` under *Site URL*

**Note:** After a successful sign in with Facebook, a user will be redirected back to home page with appended hash `#_=_` in the URL. It is *not* a bug. See this [Stack Overflow](https://stackoverflow.com/questions/7131909/facebook-callback-appends-to-return-url) discussion for ways to handle it.

<hr>
## Demo

<img src="https://raw.githubusercontent.com/cyan92128505/gamilms/main/mean-stack/doc/index.png" width="100%">

<img src="https://raw.githubusercontent.com/cyan92128505/gamilms/main/mean-stack/doc/profile.png" width="100%">
