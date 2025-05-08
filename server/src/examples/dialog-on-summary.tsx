export function DialogOnSummary() {
  return (
    <div class="flex h-screen w-full items-center justify-center bg-slate-900 text-white">
      <details class="open">
        <summary class="block cursor-pointer rounded-2xl bg-blue-300 px-6 py-4 text-xl hover:bg-blue-500 hover:text-white hover:duration-300">
          Click me
        </summary>

        <div class="absolute inset-0 mx-auto my-auto h-[40%] w-[50%] rounded-2xl bg-white p-4 py-8 text-gray-600">
          <span
            // AHA!
            onclick="document.querySelector('details').removeAttribute('open')"
            class="absolute -right-4 -top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-400 text-3xl font-bold uppercase text-white hover:bg-blue-200 hover:duration-200"
          >
            X
          </span>

          <h1 class="text-center text-2xl font-bold text-blue-300">
            This is a popup.
          </h1>

          <p class="my-3 text-center text-base text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum enim
            sint accusamus dolor, architecto omnis laborum tempora vitae,
            eveniet corporis qui officiis accusantium eius, esse corrupti
            possimus repudiandae! Quod esse, sed laudantium nobis tenetur
            dolores impedit quaerat, ipsa molestias eaque.
          </p>
        </div>
      </details>
    </div>
  );
}
