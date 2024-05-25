import { Form } from "@remix-run/react";

export default function NewButton() {
  return (
    <Form method="post">
      <button type="submit">New</button>
    </Form>
  );
}
