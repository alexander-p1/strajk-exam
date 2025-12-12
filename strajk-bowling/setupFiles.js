import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./src/mocks/servers.js"

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
