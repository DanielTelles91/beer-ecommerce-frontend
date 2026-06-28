# Route Express - E-commerce Frontend

Customer facing frontend application for the Route Express e-commerce platform, built with Angular and integrated with a Spring Boot REST API.


## Project Background

This project is the frontend counterpart of the Route Express Back Office system.

The application consumes data from a Spring Boot backend through RESTful APIs, allowing customers to browse products, view detailed information, and interact with the online store.

The project was developed as a practical study of Angular and modern frontend architecture while integrating with a real backend application.


## Technologies

- Angular CLI version 22.0.2
- TypeScript
- HTML5
- CSS3
- Bootstrap
- REST API Integration
- JSON Data Exchange
- RxJS (reactive search, debounce, error handling)
- Angular Signals (zoneless change detection)
- Angular SSR (Server-Side Rendering)
- Reactive Forms


## Current Features

Product Catalog

- Beer listing page.
- Product images loaded from the backend.
- Product information display: Name, Brewery, Country, Price.
- Sidebar filter by country (dynamically populated from available products).
- Price sorting (lowest first / highest first).


Search

- Global search field located in the navbar (common e-commerce UX pattern). 
- Debounced, reactive search (300ms) using RxJS debounceTime and distinctUntilChanged.
- Search term, country filter and price sort are all propagated via route query parameters (e.g. /cervejas?busca=ipa&pais=Brasil&ordenarPreco=asc), making the catalog state shareable, bookmarkable and persistent across navigation/refresh.   


Product Details

- Dedicated product detail page.
- Route-based navigation.
- Product information loaded dynamically from the  backend API.
- Product image gallery support.


Shopping Cart

- Persistent cart for guest users (no login required), identified by a UUID generated on first visit and stored in localStorage.
- Mini cart dropdown in the navbar: shows items, quantities, subtotal and total; opens on hover and on click (mobile-friendly), and closes when clicking outside.
- Dedicated cart page (/carrinho):
    - Increase / decrease item quantity (decreasing to zero automatically removes the item, matching the backend rule). 
    - Remove item directly.
    - Empty-cart state with a call-to-action back to the catalog.
    - "Continue shopping" and "Checkout" actions (checkout flow itself is not implemented yet — see Planned Features).   

Customer Registration & Email Confirmation

- Self-registration page (/cadastro) where the customer creates an account and sets their own password.
- Confirmation e-mail sent on registration, with a one time token link.
- Confirmation page (/confirmar-email) that validates the token against the backend and activates the account.
- Support for the admin created customer flow as well: when a customer is registered directly through the Back Office, they receive an e-mail with a link to set their password for the first time (/definir-senha), which also confirms their e-mail in the same step.


Backend Integration

- Communication with Spring Boot REST API.
- JSON-based data exchange.
- Dynamic product loading from MySQL database through the backend layer.
- Centralized API base URL via Angular environments (environment.ts / environment.prod.ts).
- HTTP error handling (catchError) on catalog and cart requests, showing a user-facing message instead of a blank screen when the backend is unreachable.


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


## Technical Notes

1. Zoneless change detection: this project was generated without zone.js, as recent Angular CLI versions default to a zoneless setup. After moving from the async pipe to manual .subscribe() calls (to support search and filtering), the view stopped updating automatically a typical zoneless change detection issue. Rather than masking it with ChangeDetectorRef.detectChanges(), the affected components were refactored to use Angular Signals (signal()), which integrate natively with zoneless change detection and trigger automatic, granular UI updates.

2. Cross-component state via query params: the search input lives in the NavbarComponent, while the country filter and price sort live in a sidebar component (FiltroLateralComponent) none of them share a parent/child relationship with the catalog list. Their state is synchronized through route query parameters rather than a shared service, following the same pattern used by real-world e-commerce platforms (filters reflected in the URL, shareable and bookmarkable).

3. Sorting across a collection relationship (backend): beer price lives on the related Estoque (stock) entity, not directly on Cerveja. Spring Data's automatic Sort/Pageable resolution can't navigate through a @OneToMany collection to order by a field on it (PathException: Plural path ... refers to a collection). This was solved with explicit JPQL queries ordering by the joined entity's field (ORDER BY e.preco) instead of relying on automatic sort resolution.

4. SSR and browser only APIs: Angular SSR (Server-Side Rendering) runs part of the application on Node.js before it reaches the browser, where APIs like localStorage and window don't exist. The cart's session identifier logic checks typeof window !== 'undefined' before touching localStorage, preventing a ReferenceError during server-side rendering.

5. Guest cart persistence: since customer login/registration is not implemented yet, the cart is tied to a randomly generated session UUID (crypto.randomUUID()) stored in localStorage, and persisted server side in a carrinho table keyed by that session id. This mirrors how real e-commerce platforms handle guest carts, and is designed to be merged into a user account once authentication is added.

6. SSR double execution on side effectful requests: components that trigger a one time, non idempotent backend call (such as /confirmar-email, which consumes a single-use token) can hit a subtle SSR pitfall: the component runs once on the server (to render initial HTML) and once again in the browser during hydration. Calling the API directly in the constructor caused it to fire twice the server side call succeeded and consumed the token, while the browser side call immediately after failed because the token no longer existed, overwriting the success message with an error. The fix mirrors the localStorage guard above: side effectful calls are skipped entirely when typeof window === 'undefined', ensuring they only run once, in the browser.


## Project Status

This project is currently under active development.

Implemented:
- Product catalog with pagination.
- Product search (debounced, via navbar + query params).
- Country filter and price sorting (sidebar).
- Product detail page.
- Shopping cart (guest session, add/update/remove items, mini-cart + dedicated page).
- Customer self-registration with e-mail confirmation First-password setup flow for admin-created customers.
- Backend integration with centralized environment configuration.
- HTTP error handling on catalog and cart requests.
- Angular routing.
    

Planned Features:
- Home page redesign.
- Customer registration and login (JWT-based authentication).
- Merging guest cart into customer account on login.
- Checkout flow.
- Order management.
- Responsive interface improvements.


## Screenshots


## Demo Video


## Author

Developed by Daniel Arantes Telles


## License

This project is licensed under the MIT License - see the LICENSE file for details.