# Route Express - E-commerce Frontend

Customer-facing frontend application for the Route Express e-commerce platform, built with Angular and integrated with a Spring Boot REST API.


## Project Background

This project is the frontend counterpart of the Route Express Back Office system.

The application consumes data from a Spring Boot backend through RESTful APIs, allowing customers to browse products, view detailed information, and interact with the online store.

The project was developed as a practical study of Angular and modern frontend architecture while integrating with a real backend application.


## Technologies

    - Angular CLI version 21.0.5
    - TypeScript
    - HTML5
    - CSS3
    - Bootstrap
    - REST API Integration
    - JSON Data Exchange


## Current Features

Product Catalog

    - Beer listing page.
    - Product images loaded from the backend.
    - Product information display:
        Name
        Brewery
        Price

Product Details

    - Dedicated product detail page.
    - Route-based navigation.
    - Product information loaded dynamically from the  backend API.
    - Product image gallery support.

Backend Integration

    - Communication with Spring Boot REST API.
    - JSON-based data exchange.
    - Dynamic product loading from MySQL database through the backend layer.


## Architecture


```text
┌──────────────────┐
│ Angular Frontend │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  REST API (JSON) │
└──────┬───────────┘
       │
       ▼
┌────────────────────┐
│Spring Boot Backend │
└──────┬─────────────┘
       │
       ▼
┌─────────────┐
│    MySQL    │
└─────────────┘
```


## Project Status

This project is currently under active development.

- Implemented:
    Product catalog
    Product detail page
    Backend integration
    Dynamic image loading
    Angular routing

- Planned Features:
    Home page redesign
    Product search
    Customer registration
    Shopping cart
    Checkout flow
    Order management
    Responsive interface improvements


## Screenshots


## Demo Video


## Author

Developed by Daniel Arantes Telles


## License

This project is licensed under the MIT License - see the LICENSE file for details.