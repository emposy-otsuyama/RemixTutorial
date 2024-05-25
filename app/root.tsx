import {
  Form,
  json,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import appStylesHref from "./style/app.css?url";
import { createEmptyContact, getContacts } from "./data";
import Nav from "./components/nav";
import NewButton from "./components/new-button";
import { useEffect } from "react";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: appStylesHref }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  let contacts = await getContacts(q);
  return json({ contacts, q });
}

export async function action() {
  let contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function App() {
  let { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form
              id="search-form"
              role="search"
              onChange={(e) => {
                const isFirstSearch = q === null;
                submit(e.currentTarget, { replace: isFirstSearch });
              }}
            >
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={q || ""}
                className={searching ? "loading" : ""}
              />
              <div id="search-spinner" aria-hidden hidden={!searching} />
            </Form>
            <NewButton />
          </div>
          <Nav />
        </div>
        <div
          id="detail"
          className={
            navigation.state === "loading" && !searching ? "loading" : ""
          }
        >
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
