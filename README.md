# Weather App

This is my solution for The Odin Project's [Weather App](https://www.theodinproject.com/lessons/node-path-javascript-weather-app) assignment.

This project is intended as an API refresher, however I decided to go far beyond the scope of the project to also refresh my knowledge on Vite, Vercel, TypeScript, and React.

View the project live at [Vercel](weather-app-sigma-virid-86.vercel.app).

## Development & Build

As this app is hosted on Vercel, we need to use the Vercel dev environment to test it during development. We use Vite, however, to build the `dist` files used in production.

### Development

Run Vercel Dev with `npx vercel dev`.

Type check with `npm run typecheck`.

Test with `npm test`.

### Prodution

Build with `npm run build`.

## Technology

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- I opted to use [Vite](https://vite.dev/) instead of Webpack as this is my preferred bundler.
- [Vercel](https://vercel.com/) dev and production environments. 

## CI/CD

### Tests

This project uses [Vitest](https://vitest.dev/) to ensure utility and api functions work as expected.

### ci.yml

Pushes to the deploy branch trigger tests and Vite build.

### deploy.yml

Pull requests to the main branch trigger tests, pull to Vercel, build with Vercel, and deploy to Vercel. 
