import { Hono } from 'hono';
import {Ai} from '@cloudflare/ai';

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
	MY_VARIABLE: string;
	AI: any;
}

// @ts-ignore
const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
	const ai = new Ai(c.env.AI);
	const content = c.req.query('query') || 'What is the origin of the phrase Hello, World';
	console.log(content);
	const messages = [
		{ role: 'system', content: 'You are a friendly assistant' },
		{ role: 'user', content },
	];
	const inputs = { messages };
	const res = await ai.run('@hf/thebloke/mistral-7b-instruct-v0.1-awq', inputs);
	return c.json(res);
});

export default app;
