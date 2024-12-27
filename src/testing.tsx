import { Context } from 'hono';
import { Layout } from './components/layout';
import { routes } from '.';
import { ToggleInput } from './components/ToggleInput';
import { SingleSelectInput } from './components/SingleSelectInput';

function TestingViewContent() {
  const name = 'routes';
  const multi = 'multi';

  return (
    <form hx-swap="none" hx-post={routes.testingViewData} class="flex gap-5">
      <div class="flex flex-col gap-4" x-data={`{${name}: '1'}`}>
        <SingleSelectInput name={name} label="Foo" value={1} />
        <SingleSelectInput name={name} label="Bar" value={2} />
        <SingleSelectInput name={name} label="Baz" value={3} />
      </div>
      <div class="flex flex-col gap-4" x-data={`{${multi}: []}`}>
        <ToggleInput label="multi1" value={1} name={multi} />
        <ToggleInput label="multi2" value={2} name={multi} />
        <ToggleInput label="multi3" value={3} name={multi} />
      </div>
      <button type="submit">Submit!</button>
    </form>
  );
}

export function renderTestingView(c: Context) {
  return c.html(
    <Layout>
      <TestingViewContent />
    </Layout>
  );
}
