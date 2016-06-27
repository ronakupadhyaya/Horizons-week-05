# Homazon: Your one-stop home shop

Over the past couple of weeks you've already built Facebook and Yelp. Let's
notch another win today by building Amazon. Okay, we won't be building
_everything_ at Amazon.com--maybe we'll leave Amazon Web Services for next
week--but you will be building a kickass e-commerce site that allows users to
browse products and shop from their mobile phone. You'll process payment
information and manage inventory.

## Contents

## Introduction

There are two related but distinct parts to this project: the user view and the
shopkeeper view. The user view, which will be a _mobile_ web application, is
the shopping interface that the user sees when they login. The shopkeeper view
allows the shopkeeper to view and manage orders and inventory. The views are
completely distinct, but they share and operate upon the same data model.

EXPLANATION OF HOW WE EXPECT THEM TO DIVIDE LABOR: DO WE TELL THEM OR DO WE
LEAVE IT UP TO THEM?

## Part A: User view

Core features:
- Login
- Register: name, shipping address, payment info
- Product list (catalog)
- View product: title, photo (one or more), description, variations (color,
  quantity, price)
- Shopping cart
- Checkout
- View past orders

### Step 1. Express scaffolding

Use the `express --hbs` command (from express-generator) to create a
scaffolding.

### Step 2. Authentication, signup flow

You know the drill by now. Use passport to create authentication routes. Allow
your user to login via Facebook.

### Step 3. Product list

### Step 4. View product

### Step 5. Product variations

### Step 6. Shopping cart

### Step 7. Checkout

### Step 8. View past orders

### Bonus

- Allow multiple shipping addresses/payment info per user.
- Add a "guest" checkout option, i.e., don't require login. Don't ask a user to
  login until they try to checkout.
- Allow linking/unlinking of Facebook accounts.
- Discount codes.

## Part B: Admin view

Core features:
- Login (only needs a single account for now, i.e., no register option)
- View and manage product list, including product categories, products,
  subproducts (variations)
- Manage inventory per product
- View orders, update order status
- View user list

### Step 1. Authentication

Decide how you want to do this: create a User "role" or a class of users that
has admin access, or else use a different Collection, or just hardcode an admin
account for now.

### Step 2. Product list

### Step 3. Manage product inventory

### Step 4. Manage product variations

### Step 4. View and manage orders

### Step 5. View user list (?)
