# forum-app
Forum application that allows users to create posts about topics.

This app is built using GraphQL, PostgreSQL, and Apollo Server to manage user and post data. Redis is used for session key and token storage to maintain user sessions and implement forgot password functionality.

The front end of the app is built using NextJS to allow server side rendering of certain pages and componenets as well as easy routing capabilities provided by the framework. Formik is used for form handling, and Chakra UI is used for the styling of the applicaiton. URQL is used as a GraphQL client that allows the front end to fetch data from the server either client or server side. GraphQL Codegen is used to easily create hooks and types of the GraphQL queries and mutations in the front end.
