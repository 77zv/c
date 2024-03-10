import fastifyCors from '@fastify/cors';
import fastify from 'fastify';
import { getUserRoute } from './routes/getUser.route';
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

export const server = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

await server.register(fastifyCors, {});

export type Server = typeof server;
export {getUserRoute};