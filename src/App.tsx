import { useState } from 'react'
import {defaultTheme, Provider, Flex, Form, TextField, Heading, Button, Content, Footer} from '@adobe/react-spectrum';
import { trace } from '@opentelemetry/api';

// track user actions.
const tracer = trace.getTracer('react-app');

import './App.css'

const API_URI = import.meta.env.VITE_API_URI || 'http://localhost:8080';

function App() {
  const [numberString, setNumberString] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [result, setResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const clearResponse = () => {
    setResult(null);
    setErrorMessage(null);
  }

  return (
    <Flex direction="column" width="width-100vw" height="height-100vh" alignItems="center">
      <Flex direction="column" width="size-5000" gap="size-325" margin="size-325">
        <Flex direction="column" width="size-5000" gap="size-100">
          <Heading>Roman Numeral Converter</Heading>

          <Form
            validationErrors={errorMessage != null ? { number: errorMessage } : {}}
            maxWidth="size-5000"
            onSubmit={async (e) => {
              e.preventDefault(); // no default behavior, use custom submission handler.

              const span = tracer.startSpan('submit-form');
              // set the loading spinner to prevent sending multiple requests
              setIsSaving(true);

              // send request.
              const response = await fetch(`${API_URI}/romannumeral?query=${numberString}`);
              const data = await response.json();

              // update either the result/error based on the response.
              if (response.ok) {
                setResult(`Roman Numeral of ${data.input} is: ${data.output}`);
              } else {
                setErrorMessage(data.error);
              }
              // clear saving states.
              setIsSaving(false);
              span.end();
            }}
          >
            <TextField
              label="Number"
              name="number"
              value={numberString}
              isDisabled={isSaving}
              onChange={(value) => {
                const span = tracer.startSpan('update-number-input-field');
                setNumberString(value);
                // When the user updates the input, it means they no longer care the legacy results displayed.
                // It's then reasonable to clear the result to reduce reading burden.
                clearResponse();
                span.end();
              }}
            />

            <Button
              type="submit"
              variant="primary"
              isDisabled={isSaving}
              isPending={isSaving}
            >
              Save
            </Button>

            <>
              {result != null && (
                <Content>
                  Result: {result}
                </Content>
              )}
            </>
          </Form>
        </Flex>

        <div style={{ fontSize: '12px' }}>
          <Footer >
            For Minchen Wang's interviews at Adobe only. All rights reserved.
          </Footer>
        </div>
      </Flex>
    </Flex>
  )
}

function Wrapper() {
  return (
    <Provider theme={defaultTheme} width="100%" height="100%">
      <App />
    </Provider>
  )
}

export default Wrapper
