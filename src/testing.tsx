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
      <div class="flex flex-col gap-4">
        <SingleSelectInput
          name={name}
          label="single1"
          value={1}
          checked={true}
        />
        <SingleSelectInput
          name={name}
          label="single2"
          value={2}
          checked={false}
        />
        <SingleSelectInput
          name={name}
          label="single3"
          value={3}
          checked={false}
        />
      </div>
      <div class="flex flex-col gap-4">
        <ToggleInput label="multi1" value={1} name={multi} checked />
        <ToggleInput label="multi2" value={2} name={multi} checked={false} />
        <ToggleInput label="multi3" value={3} name={multi} checked={false} />
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
