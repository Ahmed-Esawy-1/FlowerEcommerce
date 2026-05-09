export default function DeletedModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="m-5.5 md:m-0 w-full max-w-md rounded-2xl bg-white  p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Confirm Delete</h2>

        <p className="mt-2 text-sm text-text dark:text-text-dark">
          Are you sure you want to delete{" "}
          <span className="font-medium text-[var(--foreground)]">
            {productName}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm font-medium transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 border border-slate-200 rounded-lg text-white text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
