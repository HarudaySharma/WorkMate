
const Loader = ({ className, height, width }: { className: string, width: string, height: string }) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`animate-spin rounded-full h-8 w-8 h-${height} w-${width} border-t-2 border-b-2 border-blue-700`}></div>
        </div>
    );
}

export default Loader

