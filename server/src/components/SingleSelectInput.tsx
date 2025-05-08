export function SingleSelectInput({
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
        class="peer"
        type="radio"
        checked={checked}
        name={name}
        value={value}
        hidden
      />
      <div class="cursor-pointer select-none border rounded-md p-2 flex items-center justify-center bg-transparent peer-checked:bg-green-200">
        {label}
      </div>
    </label>
  );
}
