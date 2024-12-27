import { html } from 'hono/html';

export function SingleSelectInput({
  name,
  value,
  label,
}: {
  name: string;
  label: string;
  value: number;
}) {
  return html`
    <label
      class="cursor-pointer select-none border rounded-md p-2 flex items-center justify-center"
      x-bind:class="${name} === '${value}' ? 'bg-green-100' : 'bg-transparent'"
    >
      <input type="radio" x-model="${name}" value="${value}" hidden />
      ${label}
    </label>
  `;
}
