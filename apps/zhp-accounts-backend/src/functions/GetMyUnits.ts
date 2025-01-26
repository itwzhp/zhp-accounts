import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

async function GetMyUnits(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || 'world';

    return { body: `Hello, ${name}!` };
};

app.http('getMyUnits', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetMyUnits,
    route: 'units'
});
