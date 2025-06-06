import { Navigate } from "react-router-dom";
import NotFound from "@/components/NotFound";

// https://omarelhawary.me/blog/file-based-routing-with-react-router-code-splitting
// For dynamic imports can be used import.meta.glob(...) and React.Lazy and React.Suspense

// for more advance pre-loading https://omarelhawary.me/blog/file-based-routing-with-react-router-pre-loading
const ROUTES = import.meta.glob("/src/pages/**/[a-z[]*.tsx", { eager: true });
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

  return { path, component: (ROUTES[route] as any).default as React.FC };
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
        <Navigate
          to={{
            pathname: baseUrl + "today",
          }}
          replace
        />
      );
    },
  },

  // catch all not matched routes
  {
    path: "*",
    component: NotFound,
  },
);

const createTo = (to: string): string => {
  return baseUrl + to;
};

export { routes, createTo };
