function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
            <p className="text-gray-600 mt-4">The page you are looking for does not exist.</p>
        </div>
    );
}
export default ErrorPage