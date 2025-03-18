/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from "./routes/__root";
import { Route as IndexImport } from "./routes/index";
import { Route as SigninImport } from "./routes/signin";
import { Route as SignupImport } from "./routes/signup";

// Create/Update Routes

const SignupRoute = SignupImport.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => rootRoute,
} as any);

const SigninRoute = SigninImport.update({
  id: "/signin",
  path: "/signin",
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    "/signin": {
      id: "/signin";
      path: "/signin";
      fullPath: "/signin";
      preLoaderRoute: typeof SigninImport;
      parentRoute: typeof rootRoute;
    };
    "/signup": {
      id: "/signup";
      path: "/signup";
      fullPath: "/signup";
      preLoaderRoute: typeof SignupImport;
      parentRoute: typeof rootRoute;
    };
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  "/": typeof IndexRoute;
  "/signin": typeof SigninRoute;
  "/signup": typeof SignupRoute;
}

export interface FileRoutesByTo {
  "/": typeof IndexRoute;
  "/signin": typeof SigninRoute;
  "/signup": typeof SignupRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  "/": typeof IndexRoute;
  "/signin": typeof SigninRoute;
  "/signup": typeof SignupRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: "/" | "/signin" | "/signup";
  fileRoutesByTo: FileRoutesByTo;
  to: "/" | "/signin" | "/signup";
  id: "__root__" | "/" | "/signin" | "/signup";
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  SigninRoute: typeof SigninRoute;
  SignupRoute: typeof SignupRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  SigninRoute: SigninRoute,
  SignupRoute: SignupRoute,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/signin",
        "/signup"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/signin": {
      "filePath": "signin.tsx"
    },
    "/signup": {
      "filePath": "signup.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
