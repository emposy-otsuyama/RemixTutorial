import { NavLink, useLoaderData } from "@remix-run/react";
import { loader } from "~/root";

export default function Nav() {
  let { contacts, q } = useLoaderData<typeof loader>();

  return (
    <nav>
      {contacts.length ? (
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              <NavLink
                className={({ isActive, isPending }) =>
                  isActive ? "active" : isPending ? "pending" : ""
                }
                to={`contacts/${contact.id}`}
              >
                {contact.first || contact.last ? (
                  <>
                    {contact.first} {contact.last}
                  </>
                ) : (
                  <i>No Name</i>
                )}{" "}
                {contact.favorite ? <span>★</span> : null}
              </NavLink>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <i>No contacts</i>
        </p>
      )}
    </nav>
  );
}
