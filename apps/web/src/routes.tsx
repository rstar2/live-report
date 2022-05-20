import { Redirect } from "react-router-dom";
import NotFound from "./components/NotFound";

// https://omarelhawary.me/blog/file-based-routing-with-react-router-code-splitting
// For dynamic imports can be used import.meta.glob(...) and React.Lazy and React.Suspense

// for more advance pre-loading https://omarelhawary.me/blog/file-based-routing-with-react-router-pre-loading
const ROUTES = import.meta.globEager("/src/pages/**/[a-z[]*.tsx");
// ROUTES = {
//     '/src/pages/index.tsx': { default: ƒ Index(), ... },
//     '/src/pages/posts/index.tsx': { default: ƒ PostsIndex(), ... },
//     '/src/pages/posts/[slug].tsx': { default: ƒ PostsSlug(), ... },
//     ...
//   }

const baseUrl = import.meta.env.BASE_URL;

const routes = Object.keys(ROUTES).map((route) => {
  let path = route
    .replace(/\/src\/pages|index|\.tsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1");

  // remove the / and prepend the baseUrl
  if (baseUrl !== "/") path = baseUrl + path.substring(1);

  return { path, component: ROUTES[route].default };
});
// routes = [
//     { path: '/', component: ƒ Index() },
//     { path: '/posts', component: ƒ PostsIndex() },
//     { path: '/posts/:slug', component: ƒ PostsSlug() },
//     ...
//   ]

routes.push(
  // redirect the base(e.g. root) to the "main"
  {
    path: baseUrl,
    component() {
      return (
        <Redirect
          to={{
            pathname: baseUrl + "today",
          }}
        />
      );
    },
  },

  // catch all not matched routes
  {
    path: "*",
    component: NotFound,
  }
);

export { routes };
