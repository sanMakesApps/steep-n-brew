const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-neutral-300 rounded-full" />
        <div className="w-20 h-20 border-4 border-t-accent animate-spin rounded-full absolute left-0 top-0" />
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
