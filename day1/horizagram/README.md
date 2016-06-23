# Horizagram
## Pair programming exercise

## Contents

## Goal

Your goal is to build a clone of Instagram called Horizagram. The app should
have the following features:

- It's a secure, multi-user application. Users can view everyone's data, but
  they can only update/edit their own data.
- Users can upload photos with brief descriptions.
- Users can follow other users. On their home page (or photo feed), they see
  posts published by people they follow.
- Users can see the list of people who follow them.
- Users can like posts, and can see how many likes each post has.
- Your home page (photo feed) loads in batches using the infinite scroll effect.


## Phase 1. Data model

Lay out your basic data model. Create Mongoose schemas and models, define
foreign key relationships/populates, etc. How do you handle permissions, i.e.,
making sure that everyone has read access to all data but only write access to
their own data?


## Phase 2. Routes

Now tie your data model into your express app routes. What are your
GET/PUT/POST/DELETE endpoints? Which ones require authentication? How do you
handle registration and authentication? Etc.

### Authentication

Start with the basic passport-related auth routes

### Read, delete content

Do these next since they're pretty easy

### Create, edit content

Do these last since they require uploading files, which makes them harder


## Phase 3. Views

Create your basic views:
- Login
- Register
- Home page/photo feed
- Add/edit post
- Your followers

Wire these up to your routes and begin testing them. Just get the basics in
place for now.


### Authentication

Start with these

### Home page, view post

Do these next

### Add/edit post

This is the hardest because you need to upload photos. Do this one last.


## Phase 4. Infinite scroll

Add support for the "infinite scroll" effect on the home page. This will require
clever use of frontend JS, AJAX, and batching from the backend.


## Phase 5. Add Likes and Follow

With basic functionality in place, add the ability to like posts, track likes in
the database, and display the number of likes next to each post. Also add the
ability to follow another user. These two features are alike in two key ways:
they don't require their own views (although they definitely require routes),
and they should work via AJAX.


## BONUS

- Add login via Facebook/Instagram.
- Allow photos to be uploaded via drag and drop.
- Add notifications: get notified when someone follows you, when someone likes
  your photo, etc.
- Allow user accounts to be private, meaning only their followers can see their
  posts.
- Allow users to require approval of new followers.
- Add support for hashtags.
- Photo filters.
- Add Facebook/Instagram integration! Publish your Horizagram photos to
  Facebook.
