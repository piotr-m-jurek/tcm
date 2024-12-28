type Props = {
  label: string;
  description?: string | null;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Checkbox({
  label,
  description = null,
  checked,
  onChange,
}: Props) {
  return (
    <label class="flex justify-center items-start gap-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          // TODO: these types are wrong
          onChange((event.target as unknown as { checked: boolean }).checked)
        }
      />
      {label}
      {description}
    </label>
  );
}
