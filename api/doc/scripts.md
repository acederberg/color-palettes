# Available commands

Common scripts :
- **npm run help** -- Print this help method.
- **npx run start** -- Start the api in development mode.
- **npx run build** -- Build everything.
- **npx run build-images** -- Build images for CI.


Test scripts :
- **npx run start-test** -- Run the 'test' script in watch mode
- **npx run start-test-fetchers** -- Run the tests for fetchers only. This also starts another process in a docker container and requires docker.
- **npx run test** -- Run all tests besides the tests for fetchers.
- **npx run test-fetchers** -- Run tests for the fetchers only.
- **npx run test-fetchers-no-service** -- Test fetchers without starting docker containers and app. Only works if app is running somewhere. 
- **npx run test-publish** -- Make an unpack the tar to be published.

Note that the 'start-test' prefixed script use tsc-watch and then initiate 'jest' as opposed to just looping jest.

# Naming convention

- 'start' prefixed methods should be running tests in development.
- 'test' prefixed method are to run in pipelines.
- 'build' steps should only involve the tsc compiler or docker containers.

It is important to run an api container while running the fetcher tests since the purpose of the 'fetchers' is to retrieve data from the api in a universal way.
