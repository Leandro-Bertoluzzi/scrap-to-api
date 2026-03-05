<h1 align="center">Scrap to API</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/Leandro-Bertoluzzi/scrap-to-api?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/Leandro-Bertoluzzi/scrap-to-api?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/Leandro-Bertoluzzi/scrap-to-api?color=56BEB8">

  <img alt="License" src="https://img.shields.io/github/license/Leandro-Bertoluzzi/scrap-to-api?color=56BEB8">
</p>

<!-- Status -->

<h4 align="center">
	🚧 Scrap to API 🚀 Under construction...  🚧
</h4>

<hr>

<p align="center">
  <a href="#dart-about">About</a> &#xa0; | &#xa0;
  <a href="#sparkles-features">Features</a> &#xa0; | &#xa0;
  <a href="#rocket-technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-starting">Starting</a> &#xa0; | &#xa0;
  <a href="#development">Development</a> &#xa0; | &#xa0;
  <a href="#memo-license">License</a> &#xa0; | &#xa0;
  <a href="https://github.com/Leandro-Bertoluzzi" target="_blank">Author</a>
</p>

<br>

## :dart: About

Proxy API to get info from MAL (My Anime List) website via web scraping.

## :sparkles: Features

:heavy_check_mark: REST API\
:heavy_check_mark: Scraping of websites via Puppeteer

## :rocket: Technologies

The following tools were used in this project:

-   [Node.js](https://nodejs.org/en/)
-   [Docker](https://www.docker.com/)
-   [Puppeteer](https://github.com/puppeteer/puppeteer)

## :white_check_mark: Requirements

Before starting :checkered_flag:, you need to have [Node](https://nodejs.org/en/) installed. You would also need [Docker](https://www.docker.com/) if you want to run the containers.

## :checkered_flag: Starting

```bash
# Clone this project
$ git clone https://github.com/Leandro-Bertoluzzi/scrap-to-api

# Access
$ cd scrap-to-api

# Set up environment variables
$ cp .env.example .env
# Edit .env and adjust values as needed

# Install dependencies
$ npm install

# Run the project (option 1: With Docker compose)
$ docker-compose up

# Run the project (option 2: Locally with Node.js)
$ npm run start:dev

# In any case, the API will initialize in <http://localhost:8000>
```

### Environment configuration

The project uses environment variables for configuration. You can set these in a `.env` file at the root of the project. An example `.env.example` file is provided for reference.

The environment variables include:

| Variable        | Description                                             | Default Value             |
| --------------- | ------------------------------------------------------- | ------------------------- |
| `NODE_ENV`      | The environment mode (development, production, etc.)    | `development`             |
| `HOST`          | The host address for the API server                     | `0.0.0`                   |
| `PORT`          | The port number for the API server                      | `8000`                    |
| `MAL_BASE_URL`  | The base URL for MyAnimeList                            | `https://myanimelist.net` |

## Development

### Testing

The project includes unit and integration tests. To run the tests, use the following commands:

```bash
# Run unit tests
$ npm run test:unit

# Run integration tests
$ npm run test:integration

# Run all tests
$ npm test

# Run tests with coverage report
$ npm run test:coverage
```

## :memo: License

This project is under license from MIT. For more details, see the [LICENSE](LICENSE.md) file.

Made with :heart: by <a href="https://github.com/Leandro-Bertoluzzi" target="_blank">Leandro Bertoluzzi</a>

<a href="#top">Back to top</a>
