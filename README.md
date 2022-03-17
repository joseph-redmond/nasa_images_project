# What this app is?

This is a demo application demonstrating the abilitiy to utilize react and nodejs to call a api and present the images to the user

## Installation

Use the package manager npm to install
from the client folder

```bash
npm install
npm run start
runs on localhost port 3000
```

from the server folder

```bash
npm install
npm run start
runs on localhst port 2900
```

Currently the app cannot run with cors. That must be disabled in the browser for this to work. I need to combine the projects to make this a non issue.

I also understand there are few bugs i have noted.

1. if the buttons are spammed it messes with the caching and ends up caching on the server more than once when not needed.
2. The buttons have an issue with offset. I believe this is a limitation in my understanding of useState. offset starts as an empty array instead of a number. When the next 5 button is pressed it must be pressed twice to change the offset.
3. When the previous 5 button is pressed it goes forward once then on the next click starts going back.

## Usage

```
At localhost:3000 you are given the react app with a field to input a date and 2 buttons. Go forward 5 pics. Go back 5 pics.

You can query the server like so localhost:2900/?date=2020-03-03&offset=
offset is optional, but without it the api will only return the first 5 images.

```
