export function ToggleInput({
  name,
  value,
  label,
  checked,
}: {
  name: string;
  label: string;
  value: number;
  checked: boolean;
}) {
  return (
    <label>
      <input
        type="checkbox"
        class="peer"
        name={name}
        value={value}
        hidden
        checked={checked}
      />
      <div class="cursor-pointer select-none border rounded-md p-2 flex items-center justify-center peer-checked:bg-green-200">
        {label}
      </div>
    </label>
  );
}
