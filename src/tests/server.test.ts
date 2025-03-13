import request from "supertest";
import app from "../server";
import { INPUT_ERROR_KEY, INPUT_ERROR_MESSAGES } from "../error-utils";

const TEST_CASES: [object, number, object][] = [
  [{ query: "1" }, 200, { input: "1", output: "I" }],
  [{ query: "3999" }, 200, { input: "3999", output: "MMMCMXCIX" }],
  [{}, 400, { error: INPUT_ERROR_MESSAGES[INPUT_ERROR_KEY.EMPTY_INPUT] }],
  [{ query: "      "}, 400, { error: INPUT_ERROR_MESSAGES[INPUT_ERROR_KEY.EMPTY_INPUT] }],
  [{ query: " abcd  "}, 400, { error: INPUT_ERROR_MESSAGES[INPUT_ERROR_KEY.NOT_A_NUMBER] }],
  [{ query: "999.00001"}, 422, { error: INPUT_ERROR_MESSAGES[INPUT_ERROR_KEY.NOT_AN_INTEGER] }],
  [{ query: "0"}, 422, { error: INPUT_ERROR_MESSAGES[INPUT_ERROR_KEY.NEGATIVE_OR_ZERO] }],
  [{ query: "4000"}, 422, { error: INPUT_ERROR_MESSAGES[INPUT_ERROR_KEY.EXCEEDS_SUPPORTED_RANGE] }],
]

async function assertStatusCodeAndResponseBody(
  query: object,
  statusCode: number,
  responseBody: object,
) {
  const response = await request(app)
    .get("/romannumeral")
    .query(query)

  expect(response.status).toBe(statusCode);
  expect(response.body).toEqual(responseBody);
}

describe("Test status code & responses of GET /romannumeral", () => {
  test.each(TEST_CASES)(
    "Query with %s",
    assertStatusCodeAndResponseBody,
  );
});
