const Account = () => {
  return (
    <form className="w-full">
      <h2 className="text-base font-semibold leading-7 text-gray-900">账户</h2>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>

      {/* <div className="mt-12 pt-6 flex items-center justify-end gap-x-6 border-t border-gray-900/10 ">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          取消
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          保存
        </button>
      </div> */}
    </form>
  );
};

export default Account;
