export default function Error(){
  return (<div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold text-red-600">Something went wrong</h1>
        <p className="text-gray-600">We ran into an unexpected issue while loading this page. Please try again in a moment.</p>
      </div>
    </div>
)}