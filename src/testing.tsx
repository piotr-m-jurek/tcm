import { Context } from 'hono';
import { routes } from '.';
import { ToggleInput } from './components/ToggleInput';
import { SingleSelectInput } from './components/SingleSelectInput';
import { Button } from './components/Button';
import { html } from 'hono/html';

// function TestingViewContent() {
//   const name = 'routes';
//   const multi = 'multi';
//
//   return (
//     <div class="size-full flex bg-amber-300">
//       <div>
//         <h1 class="font-mono font-bold text-4xl">active search</h1>
//         <form
//           class="flex flex-col gap-1"
//           hx-trigger="changed"
//           hx-push-url="true"
//           hx-swap="none"
//         >
//           <input
//             type="text"
//             placeholder="enter part of the name"
//             class="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             hx-trigger="changed"
//             hx-push-url="true"
//           />
//           <ToggleInput
//             name="checkbox1"
//             value={1}
//             label="First value"
//             checked={false}
//           />
//           <ToggleInput
//             name="checkbox1"
//             value={2}
//             label="Second value"
//             checked={false}
//           />
//           <ToggleInput
//             name="checkbox1"
//             value={3}
//             label="Third value"
//             checked={false}
//           />
//           <button
//             type="submit"
//             class="border rounded-md bg-white hover:bg-blue-300"
//           >
//             submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

function TestingViewContent() {
  const name = 'routes';
  const multi = 'multi';
  return (
    <div class="flex flex-col p-3 border">
      <h1 class="font-mono font-bold text-4xl">Selectors</h1>
      <form hx-swap="none" class="flex flex-col gap-5">
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
        <Button
          hx-trigger="submit"
          hx-post={routes.testingViewData}
          type="submit"
        >
          Submit!
        </Button>
      </form>
    </div>
  );
}

export function renderTestingView(c: Context) {
  return c.render(<TestingViewContent />);
}
