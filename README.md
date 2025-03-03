# Roman Numeral Converter

## Using

### Run with Docker

Run in Docker container with the Docker Compose cmd in the project directory:

```
docker-compose up
```

And then visit http://localhost:8080.

### Dev Run

- Install Node.js >= v20.14.0
- Run in cmd `npm intstall`
- Run in cmd `npm run dev`
- The dev front-end will be accessable from http://localhost:5173, and back-end API through http://localhost:8080.

## Documentation & Structure

- The front-end uses create-vite, React, TypeScript, and Adobe Spectrum.
- The back-end uses Express.js and TypeScript, and Jest for unit testing.
- Observability is implemented through OpenTelemetry and pino.
- The project could be deployed through Docker Composer.

### Front End

**Setup**: The front-end is set up by create-vite (comparing to create-react-app, it's faster and simpler) to create a new React/TypeScript project. 

**Components**: The main UI components, including the input field that could accept a string/integer, a button for submission, and a display text field of the response, is in the `App.tsx` file. The UI is implemented through components of Adobe Spectrum.

**Request and Validation**: The front-end will send a request when the form is submitted to the backend API. If it responses with a valid result, it will be displayed below. If there are 400 errors (an invalid input string), the error information will be displayed in the error validation of the form (displayed as an error message below the input field). 

**Loading State**: It's usually ideal to handle the loading state, since it provides visual feedback to the users to reduce anxiety, and prevents sending the same requests for multiple times. When the submit action has been performed, lock the edit state of the form, and enables the loading spinner of the button. 

**Dark Mode**: The light and dark mode is supported by the default theme of Adobe Spectrum UI library, and the css settings, which could switch the UI accordingly by browser settings.

Note on **Font**: Since the font used for Adobe Spectrum, Adobe Clean, is a restricted font for the exclusive use of Adobe products and software, I'm not allowed to use it here, which will make it looks strange with the default fallback font.

### Back End

**Back-end and API**: The back-end API is provided by Express.js in file `server.ts`. 

**Error Handling**: The API romannumeral could accept a query with string of integer, and will responed with either the corresponding result of Roman numeral, or the error message in 400 status if the query string is not a valid input.

**CORS**: CORS is added for dev environment, as front-end of vite will run on port 5173, and back-end runs on port 8080. It's not needed in the production (as front-end files are built) for the query, however it's needed for the Observability APIs.

**Unit Test**: The function convertToRomanNumeral in `server-utils.ts` is the core function we care. Added a unit test through Jest. Running cmd `jest` would trigger a test run.

### Observability

**Frameworks**: To be transparent - I'm not very familiar with Observability frameworks for Express.js before. Checking on online materials, most of those suggest using OpenTelemetry Collector (tracing and metrics) Jaeger UI (viewing traces), Prometheus UI (viewing metrics), and pino (logging), so I'm using those. So there's not too much personal consideration here, and some of the code and configs is just following the guidance and sample code from web.

**Metrics and Traces**: Metrics and traces are implemented through through OpenTelemetry. The `otel-*.ts` files will route the front-end user actions to the API http://localhost:4318/v1/traces, and also track all the http request. Those will be tracked by OpenTelemetry Collector, and a simple console span exporter is also provided to print those to the console as well. Jaeger UI (viewing traces), Prometheus UI (viewing metrics) could provide a UI to view those, from the port http://localhost:16686 and http://localhost:9090.

**Logging**: Logging through pino will track the web requests and the calls through the roman numeral function. The logging will output the logs to a file `server.log`. The benefit here is it's simple - this is a rather small project, and could expect the user amount would be small for now. Logging into a file could be easier (just need to manually or using a script to delete the file if it gets too large as needed).

### Deploy

**Docker Composer**: The project could be deployed with Docker Composer. It contains the core web Dockerfile, and the Observability services - otel collector (port 4317/4318), jaeger (port 16686), prometheus (port 9090), etc. The web Dockerfile will build the vite project (front-end part) into `dist` folder, and then run through Express backend service, which runs the APIs and deploys the `dist` folder as staic files. 

---

For Minchen Wang's Adobe interviews only. All rights reserved.