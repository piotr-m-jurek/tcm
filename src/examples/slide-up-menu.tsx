export function SlideUpMenu() {
  return (
    <div class="flex h-full w-full">
      <div class="flex w-full flex-col bg-sky-900">content</div>
      <div class="fixed top-[100%] flex w-full h-full flex-col gap-2 bg-amber-200 transition-all delay-100 has-[:checked]:top-[4rem]">
        <label class="absolute -mt-[4rem] flex w-full justify-center shadow-md">
          <div class="bg-slate-200 p-5">
            <input class="peer hidden" type="checkbox" checked />
            <div class="content transition-transform delay-500 peer-checked:rotate-180">
              ↑
            </div>
          </div>
        </label>

        <div class="flex h-full flex-col border border-amber-500 p-5">
          Content
        </div>
      </div>
    </div>
  );
}
