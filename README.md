# Weather App

This is my solution for The Odin Project's [Weather App](https://www.theodinproject.com/lessons/node-path-javascript-weather-app) assignment.

This project is intended as an API refresher, however I decided to go far beyond the scope of the project to also refresh my knowledge on Vite, Vercel, TypeScript, and React.

View the project live at [Vercel](https://weather-app-sigma-virid-86.vercel.app).

## LLM driven Weather Advisor

Ask the weather advisor any question about the next few days, or a specific day in the forecast. The Weather Advisor is powered by `openai/gpt-5-nano` and can answer questions about the forecast data. 

## Setup

Learn how to setup the project for development or production by reading [GETTING_STARTED.md](GETTING_STARTED.md)

## CI/CD

This project ensures code quality with Continuous Integration, and Continuous Delivery & Deployment:

- Pull requests to the `develop` and `main` branches trigger checks (ESLint, Prettier, Type Check, and Test Suite), and build the app if checks are successful.
- Merging the Pull Request rebuilds via `vercel build` and deploys to Vercel.

## Technology

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- I opted to use [Vite](https://vite.dev/) instead of Webpack as this is my preferred bundler.
- This project uses [Vitest](https://vitest.dev/) to run test files.
- [Vercel](https://vercel.com/) dev and production environments.
- [Visual Crossing](https://www.visualcrossing.com/) API for weather data.
- [Nominatim](https://nominatim.org/) API for location search.

## License

This project is published under the [MIT License](LICENSE.md).
