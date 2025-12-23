export default function SimpleError(){
  return (<div className="h-64 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold text-red-600">Something went wrong</h1>
        <p className="text-gray-600">Please try again in a moment.</p>
      </div>
    </div>
)}