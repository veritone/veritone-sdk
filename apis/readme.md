**handler flow**

```
const someResourceRequest = handler('get', '/some-endpoint/:organizationId/:resourceId', {
	headers: ['Content-Type'],
	query: ['timestamp', 'status', 'userId']
})
```

creates the following API:

```
someResourceRequest({
	organizationId: 'orgId1',
	resourceId: 'resourceId1',
	timestamp: 123
	// both camelCase and unmodified apis available automatically
	contentType: 'application/xml'
	'Content-Type': 'application/xml'
	// with sensible defaults provided for common headers
})
```

post/put/patch take body as second argument:
```
someResourcePatchRequest({
	id: 'some-id'
}, { seen: true })
```
or if there are no params to configure, the first:
```
someResourcePostRequest({ seen: true })
```

the call to `someResourceRequest` returns a plain, generic object conforming 
to a request interface:

```
{
	method: 'get',
	path: '/some-endpoint/orgId1/resourceId1',
	query: { timestamp: 123 },
	headers: { 'Content-Type': 'application/xml' }
}
```

* this object can be tested without mocking http or a request library:
```
	expect(someResourceRequest({ id: 'some-id', ...etc }).to.match({
		path: /some-id/,
		headers: { 'Content-Type': /json/ }
		...etc
	}))
```
* it also enables custom handlers if the shorthand form isn't sufficient; 
they must simply return an object conforming to the request interface:
```
const someCustomResourceRequest = ({ 
	organizationId, 
	resourceId, 
	contentType = 'application/json' 
}) => {
	return {
		path: `/some-endpoint/${organizationId}/${resourceId}`,
		... etc
	}
}
``` 

the function we export to consumers is created by wrapping the request function
in `callApi()`:

```
const callResourceApi = callApi(someResourceRequest)

// use in same way as before (now makes an http call):
callResourceApi({
	organizationId: 'orgId1',
	resourceId: 'resourceId1',
	contentType: 'application/xml' // json default if not specified,
	timestamp: 123
})
```

`callApi()` wraps the following behavior:
* add base uri for api to path
* http request/response
* providing callback and promise interfaces
* retries 
* progress (uploads/downloads)
* providing cancellation api (maybe)
* multiple callApi implementations (so we can ie. use fetch on the 
frontend and request on the backend) (maybe)

`callApi()` accepts additional options as a second argument:
```
	transformResponse: object -> object, default identity
	withCredentials? default †rue?
	progress: bool // should a progress callback be provided? default false
	validateStatus: number -> bool 	// true if status code is not an error
																		// default: status >= 200 && status < 300
	maxRetries: number // default per constructor (3?), 0 to disable
```


`handler()` interface:

`string -> string -> object`

`(method, path, config)`

* method:

one of `['get', 'post', 'put', 'patch', 'delete', 'head]`
(case-insensitive)

* path:

string path where `the/:prefixed/:terms` are parameters

* config:

object of:
```
{
	// all keys are optional
	headers: [string | configObject],
	query: [string | configObject],
	// configObject is:
	{
		paramName: REQUIRED (`import { REQUIRED } from handler`)
	}
	or
	{
		paramName: 'someDefaultValue'
	}
}
```

runtime validation of handler definitions will only be enabled when 
process.env.NODE_ENV !== production (but validation of client calls will always run)

generic request object interface
```
{
	method: string: required
	path: string: required
	query: string: optional
	data: object, string: optional, // post/put/patch body
	headers: object: optional,
	
	// plus attach the meta keys in the config object above
}
```
