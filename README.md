# Weather App

This is my solution for The Odin Project's [Weather App](https://www.theodinproject.com/lessons/node-path-javascript-weather-app) assignment. 

View the project live at [Vercel](weather-app-sigma-virid-86.vercel.app).

## Development & Build

Run Vite Dev with `npm run dev`.

Type check with `npm run typecheck`.

Test with `npm test`.

Build with `npm run build`.

## Technology

I opted to use [Vite](https://vite.dev/) instead of Webpack as this is my preferred bundler.

## CI/CD

### Tests

This project uses [Vitest](https://vitest.dev/) to ensure utility and api functions work as expected.

### ci.yml

Pushes to the deploy branch trigger tests and Vite build.

### deploy.yml

Pull requests to the main branch trigger tests, pull to Vercel, build with Vercel, and deploy to Vercel. 