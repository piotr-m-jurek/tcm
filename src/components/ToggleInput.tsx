import { html } from 'hono/html';

export function ToggleInput({
  name,
  value,
  label,
}: {
  name: string;
  label: string;
  value: string;
}) {
  return html`
    <label
      class="cursor-pointer select-none border rounded-md p-2 flex items-center justify-center"
      x-bind:class="${name}.includes('${value}') ? 'bg-green-100' : 'bg-transparent'"
    >
      <input
        type="checkbox"
        name="${name}"
        x-model="${name}"
        value="${value}"
        hidden
      />
      ${label}
    </label>
  `;
}
