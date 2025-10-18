import Elysia from "elysia";
import { AuthenticationError } from "../errors/AuthenticationError";
import { GenerateIdError } from "../errors/GenerateIdError";

export const errorPlugin = () => new Elysia({ name: 'error-plugin' })
  .error({
    AuthenticationError,
    GenerateIdError
  })